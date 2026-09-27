"use client";

import { useEffect, useState } from "react";
import { useNav } from "@/lib/nav-store";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Phone,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Loader2,
  Info,
  User,
} from "lucide-react";

type Step = "phone" | "code";

const CODE_LENGTH = 5;
const RESEND_SECONDS = 60;

const PHONE_REGEX = /^09\d{9}$/;

export function AuthPage() {
  const setView = useNav((s) => s.setView);
  const login = useAuth((s) => s.login);
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [sandboxCode, setSandboxCode] = useState<string | null>(null);

  useEffect(() => {
    if (step !== "code" || resendTimer <= 0) return;
    const t = setInterval(() => {
      setResendTimer((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [step, resendTimer]);

  const phoneValid = PHONE_REGEX.test(phone.replace(/[^\d]/g, ""));
  const normalizedPhone = phone.replace(/[^\d]/g, "");

  const handleSendCode = async () => {
    if (!phoneValid) {
      setError("شماره موبایل نامعتبر است. مثال: ۰۹۱۲۳۴۵۶۷۸۹");
      return;
    }
    setError("");
    setSending(true);
    setSandboxCode(null);

    try {
      const res = await fetch("/api/user/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_code", phone: normalizedPhone }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در ارسال کد");
      }
      // در محیط sandbox، کد در response برمی‌گردد
      if (data.sandboxCode) {
        setSandboxCode(data.sandboxCode);
      }
      setStep("code");
      setResendTimer(RESEND_SECONDS);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطای ناشناخته");
    } finally {
      setSending(false);
    }
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setCode(Array(CODE_LENGTH).fill(""));
    setError("");
    handleSendCode();
  };

  const handleVerify = async () => {
    if (verifying) return;
    if (code.some((c) => !c)) {
      setError("کد را کامل وارد کنید");
      return;
    }
    setVerifying(true);
    setError("");

    try {
      const enteredCode = code.map((c) => {
        const faIdx = "۰۱۲۳۴۵۶۷۸۹".indexOf(c);
        return faIdx !== -1 ? String(faIdx) : c;
      }).join("");

      const res = await fetch("/api/user/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_code",
          phone: normalizedPhone,
          name: name || undefined,
          code: enteredCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در تأیید کد");
      }

      // ورود موفق
      login(normalizedPhone, name || undefined);
      setView("profile");
    } catch (e) {
      setVerifying(false);
      setError(e instanceof Error ? e.message : "خطا");
    }
  };

  const handleCodeChange = (idx: number, val: string) => {
    const digit = val.replace(/[^\d۰-۹]/g, "").slice(-1);
    if (!digit && val !== "") return;
    const next = [...code];
    next[idx] = digit;
    setCode(next);
    setError("");
    if (digit && idx < CODE_LENGTH - 1) {
      const nextInput = document.getElementById(`code-${idx + 1}`) as HTMLInputElement | null;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      const prev = document.getElementById(`code-${idx - 1}`) as HTMLInputElement | null;
      prev?.focus();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-gradient-to-b from-primary to-primary/95 text-primary-foreground shadow-lg">
        <div className="px-4 pt-3 pb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => (step === "phone" ? setView("home") : setStep("phone"))}
            aria-label="بازگشت"
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold">
              {step === "phone" ? "ورود / ثبت‌نام" : "تأیید شماره موبایل"}
            </h1>
            <p className="text-[11px] text-white/80">شبکه قدس — سوپر اپ شهروندان</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30">
        {step === "phone" ? (
          <PhoneStep
            phone={phone}
            setPhone={setPhone}
            name={name}
            setName={setName}
            phoneValid={phoneValid}
            error={error}
            sending={sending}
            onSubmit={handleSendCode}
          />
        ) : (
          <CodeStep
            phone={normalizedPhone}
            code={code}
            setCode={setCode}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            error={error}
            verifying={verifying}
            resendTimer={resendTimer}
            sandboxCode={sandboxCode}
            onResend={handleResend}
            onVerify={handleVerify}
            onBack={() => setStep("phone")}
          />
        )}
      </main>
    </>
  );
}

function PhoneStep({
  phone, setPhone, name, setName, phoneValid, error, sending, onSubmit,
}: {
  phone: string;
  setPhone: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  phoneValid: boolean;
  error: string;
  sending: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="px-4 py-6 flex flex-col items-center">
      <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Phone className="size-12 text-primary" strokeWidth={1.5} />
      </div>

      <h2 className="text-lg font-bold text-foreground text-center">
        ورود یا ثبت‌نام در شبکه قدس
      </h2>
      <p className="text-xs text-muted-foreground text-center mt-1 max-w-xs leading-relaxed">
        با وارد کردن شماره موبایل، یک کد ۵ رقمی برای شما ارسال می‌شود
      </p>

      <form className="w-full mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <div>
          <label htmlFor="phone" className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
            <Phone className="size-3.5 text-primary" />
            شماره موبایل <span className="text-rose-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09xxxxxxxxx"
            className={cn(
              "w-full bg-card border rounded-xl px-4 py-3 text-base outline-none transition-all tabular-nums",
              "text-center font-bold tracking-wider",
              error ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                : phoneValid ? "border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
            )}
            autoFocus
          />
          {phoneValid && (
            <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">
              <ShieldCheck className="size-3" />
              شماره معتبر است
            </p>
          )}
        </div>

        <div>
          <label htmlFor="name" className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
            <User className="size-3.5 text-primary" />
            نام (اختیاری)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام شما"
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-[11px] text-rose-700 flex items-center gap-1.5">
            <Info className="size-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!phoneValid || sending}
          className={cn(
            "w-full font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2",
            phoneValid && !sending
              ? "bg-primary text-primary-foreground active:scale-[0.98]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {sending ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              در حال ارسال…
            </>
          ) : (
            <>
              ارسال کد تأیید
              <ArrowLeft className="size-5" />
            </>
          )}
        </button>
      </form>

      <p className="text-[10px] text-muted-foreground text-center mt-4 max-w-xs leading-relaxed">
        با ورود، شما قوانین و مقررات شبکه قدس را می‌پذیرید.
      </p>
    </div>
  );
}

function CodeStep({
  phone, code, onChange, onKeyDown, error, verifying, resendTimer, sandboxCode, onResend, onVerify, onBack,
}: {
  phone: string;
  code: string[];
  setCode: (v: string[]) => void;
  onChange: (idx: number, val: string) => void;
  onKeyDown: (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  error: string;
  verifying: boolean;
  resendTimer: number;
  sandboxCode: string | null;
  onResend: () => void;
  onVerify: () => void;
  onBack: () => void;
}) {
  const masked = `+98 ${phone.slice(1, 4)} *** ${phone.slice(7, 11)}`;
  const codeComplete = code.every((c) => c !== "");

  // تأیید خودکار وقتی همه فیلدها پر شد
  useEffect(() => {
    if (codeComplete && !verifying) {
      const t = setTimeout(() => onVerify(), 200);
      return () => clearTimeout(t);
    }
  }, [codeComplete]);

  return (
    <div className="px-4 py-6 flex flex-col items-center">
      <div className="size-24 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
        <ShieldCheck className="size-12 text-emerald-600" strokeWidth={1.5} />
      </div>

      <h2 className="text-lg font-bold text-foreground text-center">
        کد تأیید را وارد کنید
      </h2>
      <p className="text-xs text-muted-foreground text-center mt-1 max-w-xs leading-relaxed">
        کد ۵ رقمی به شماره{" "}
        <span className="font-bold text-foreground tabular-nums" dir="ltr">{masked}</span>{" "}
        ارسال شد
      </p>

      <div className="mt-6 flex gap-2 justify-center" dir="ltr">
        {Array.from({ length: CODE_LENGTH }).map((_, idx) => (
          <input
            key={idx}
            id={`code-${idx}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={code[idx]}
            onChange={(e) => onChange(idx, e.target.value)}
            onKeyDown={(e) => onKeyDown(idx, e)}
            disabled={verifying}
            className={cn(
              "size-12 sm:size-14 text-center text-xl font-bold tabular-nums",
              "bg-card border-2 rounded-xl outline-none transition-all",
              error ? "border-rose-400 focus:border-rose-500"
                : code[idx] ? "border-primary bg-primary/5"
                : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
            )}
            autoFocus={idx === 0}
          />
        ))}
      </div>

      {error && (
        <div className="mt-4 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-[11px] text-rose-700 flex items-center gap-1.5 max-w-xs">
          <Info className="size-4 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={onVerify}
        disabled={!codeComplete || verifying}
        className={cn(
          "mt-6 w-full font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2",
          codeComplete && !verifying
            ? "bg-primary text-primary-foreground active:scale-[0.98]"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        {verifying ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            در حال تأیید…
          </>
        ) : (
          <>
            تأیید و ورود
            <ArrowLeft className="size-5" />
          </>
        )}
      </button>

      <div className="mt-4 text-center">
        {resendTimer > 0 ? (
          <p className="text-[11px] text-muted-foreground">
            ارسال مجدد کد تا{" "}
            <span className="font-bold tabular-nums text-foreground">
              {resendTimer.toLocaleString("fa-IR")}
            </span>{" "}
            ثانیه دیگر
          </p>
        ) : (
          <button
            type="button"
            onClick={onResend}
            className="text-[11px] text-primary font-bold hover:underline flex items-center gap-1"
          >
            <RefreshCw className="size-3" />
            ارسال مجدد کد
          </button>
        )}
      </div>

      {sandboxCode && (
        <div className="mt-6 w-full bg-amber-50 border border-amber-200 rounded-xl p-3">
          <div className="flex items-start gap-2">
            <Info className="size-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-amber-900">کد تستی (سندباکس)</p>
              <p className="text-[10px] text-amber-800/90 mt-0.5 leading-relaxed">
                در محیط سندباکس، کد به‌صورت SMS ارسال نمی‌شود. کد شما:{" "}
                <span className="font-bold tabular-nums bg-amber-100 px-1.5 py-0.5 rounded">
                  {sandboxCode}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className="mt-4 text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        onClick={onBack}
      >
        <ArrowRight className="size-3" />
        تغییر شماره موبایل
      </button>
    </div>
  );
}
