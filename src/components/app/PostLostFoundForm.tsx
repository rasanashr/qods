"use client";

import { useEffect, useState } from "react";
import { useNav } from "@/lib/nav-store";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Search,
  MapPin,
  Phone,
  User,
  Loader2,
  Save,
  CheckCircle2,
  Gift,
  Tag,
  FileText,
  Calendar,
} from "lucide-react";

type Step = "form" | "success";

const CATEGORIES = [
  { value: "documents", label: "مدارک", emoji: "📄" },
  { value: "electronics", label: "الکترونیک", emoji: "📱" },
  { value: "keys", label: "کلید و قفل", emoji: "🔑" },
  { value: "bags", label: "کیف و کوله", emoji: "💼" },
  { value: "pets", label: "حیوانات", emoji: "🐾" },
  { value: "jewelry", label: "جواهرات", emoji: "💎" },
  { value: "vehicles", label: "وسایل نقلیه", emoji: "🚲" },
  { value: "other", label: "سایر", emoji: "❓" },
];

const EMOJIS = ["📄", "📱", "🔑", "💼", "🐾", "💎", "🚲", "📦", "🎒", "💳", "🎫", "💍", "🎭", "❓"];

export function PostLostFoundForm() {
  const setView = useNav((s) => s.setView);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const user = useAuth((s) => s.user);

  const [step, setStep] = useState<Step>("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // فیلدهای فرم
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"lost" | "found">("lost");
  const [category, setCategory] = useState("documents");
  const [categoryLabel, setCategoryLabel] = useState("مدارک");
  const [emoji, setEmoji] = useState("📄");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [district, setDistrict] = useState("");
  const [date, setDate] = useState(() => new Date().toLocaleDateString("fa-IR"));
  const [timeAgo, setTimeAgo] = useState("همین الان");
  const [reward, setReward] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactType, setContactType] = useState<"owner" | "finder">("owner");
  const [tagsText, setTagsText] = useState("");

  // اگر کاربر وارد نشده بود، به صفحه ورود هدایت کن
  useEffect(() => {
    if (!isAuthenticated) {
      setView("auth");
    }
  }, [isAuthenticated, setView]);

  // prefill نام کاربر و نوع تماس
  useEffect(() => {
    if (user && !contactName) {
      setContactName(user.name || "");
    }
  }, [user]);

  // اگر lost → owner, اگر found → finder
  useEffect(() => {
    setContactType(status === "lost" ? "owner" : "finder");
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);

    try {
      const tags = tagsText
        .split("،")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/user/lost-found", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          status,
          category,
          categoryLabel,
          emoji,
          description,
          location,
          district,
          date,
          timeAgo,
          reward: reward || null,
          contactName,
          contactType,
          tags,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در ثبت مورد");
      }
      setStep("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep("form");
    setTitle("");
    setDescription("");
    setLocation("");
    setReward("");
    setTagsText("");
  };

  if (!isAuthenticated) return null;

  if (step === "success") {
    return (
      <>
        <SuccessHeader onBack={() => setView("lostfound")} title="ثبت مورد اشیاء گمشده" />
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="px-4 py-8 flex flex-col items-center text-center">
            <div className="size-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <CheckCircle2 className="size-12 text-emerald-600" strokeWidth={1.8} />
            </div>
            <h2 className="text-lg font-bold">مورد شما ثبت شد</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs leading-relaxed">
              مورد شما با موفقیت ثبت شد و در انتظار تأیید مدیر است. پس از تأیید، در صفحه اشیاء گمشده نمایش داده می‌شود.
            </p>
            <div className="mt-6 flex flex-col gap-2 w-full max-w-xs">
              <button
                type="button"
                onClick={() => setView("lostfound")}
                className="bg-primary text-primary-foreground text-sm font-bold py-2.5 rounded-xl shadow active:scale-95 transition-transform"
              >
                مشاهده اشیاء گمشده
              </button>
              <button
                type="button"
                onClick={() => setView("profile")}
                className="bg-card border border-border text-foreground text-sm font-bold py-2.5 rounded-xl"
              >
                موارد من در پروفایل
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-primary font-bold hover:underline"
              >
                ثبت مورد جدید
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  const canSubmit =
    title.trim().length > 3 &&
    description.trim().length > 10 &&
    location.trim().length > 0;

  return (
    <>
      {/* هدر */}
      <header className="sticky top-0 z-30 bg-gradient-to-b from-primary to-primary/95 text-primary-foreground shadow-lg">
        <div className="px-4 pt-3 pb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView("lostfound")}
            aria-label="بازگشت"
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15"
          >
            <ChevronRight className="size-5" />
          </button>
          <h1 className="text-base font-bold flex-1">ثبت مورد اشیاء گمشده</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30">
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* انتخاب وضعیت: گم‌شده یا پیدا‌شده */}
          <Field label="نوع مورد" required>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus("lost")}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all text-center",
                  status === "lost" ? "border-rose-300 bg-rose-50 ring-2 ring-rose-200" : "border-transparent bg-card hover:bg-muted"
                )}
              >
                <div className="text-3xl">❌</div>
                <div className="text-xs font-bold mt-1 text-rose-700">گم‌شده</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">وسیله خودم گم شده</div>
              </button>
              <button
                type="button"
                onClick={() => setStatus("found")}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all text-center",
                  status === "found" ? "border-emerald-300 bg-emerald-50 ring-2 ring-emerald-200" : "border-transparent bg-card hover:bg-muted"
                )}
              >
                <div className="text-3xl">✅</div>
                <div className="text-xs font-bold mt-1 text-emerald-700">پیدا‌شده</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">وسیله‌ای پیدا کردم</div>
              </button>
            </div>
          </Field>

          {/* انتخاب دسته‌بندی */}
          <Field label="دسته‌بندی" icon={Tag} required>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                const c = CATEGORIES.find((x) => x.value === e.target.value);
                if (c) {
                  setCategoryLabel(c.label);
                  setEmoji(c.emoji);
                }
              }}
              className="form-input"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </Field>

          {/* انتخاب اموجی */}
          <Field label="آیکن">
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setEmoji(em)}
                  className={cn(
                    "size-10 rounded-lg flex items-center justify-center text-xl",
                    emoji === em ? "bg-primary/10 ring-2 ring-primary" : "bg-muted"
                  )}
                >
                  {em}
                </button>
              ))}
            </div>
          </Field>

          {/* عنوان */}
          <Field label="عنوان" icon={FileText} required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: گواهینامه به نام محمد رضایی"
              className="form-input"
              maxLength={100}
            />
            <div className="text-[10px] text-muted-foreground text-left mt-1 tabular-nums">
              {title.length.toLocaleString("fa-IR")} / ۱۰۰
            </div>
          </Field>

          {/* توضیحات */}
          <Field label="توضیحات کامل" icon={FileText} required>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="شرح کامل: مشخصات وسیله، رنگ، مدل، شماره سریال، جزئیات و هر چیز مفید دیگر"
              rows={5}
              className="form-input resize-none"
              maxLength={500}
            />
            <div className="text-[10px] text-muted-foreground text-left mt-1 tabular-nums">
              {description.length.toLocaleString("fa-IR")} / ۵۰۰
            </div>
          </Field>

          {/* مکان */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="محل" icon={MapPin} required>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="میدان قدس"
                className="form-input"
              />
            </Field>
            <Field label="منطقه">
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="مرکز شهر"
                className="form-input"
              />
            </Field>
          </div>

          {/* تاریخ */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="تاریخ (شمسی)" icon={Calendar}>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="1404/06/25"
                dir="ltr"
                className="form-input text-left tabular-nums"
              />
            </Field>
            <Field label="زمان نمایش">
              <input
                type="text"
                value={timeAgo}
                onChange={(e) => setTimeAgo(e.target.value)}
                placeholder="همین الان"
                className="form-input"
              />
            </Field>
          </div>

          {/* پاداش (فقط برای گم‌شده) */}
          {status === "lost" && (
            <Field label="پاداش (اختیاری)" icon={Gift}>
              <input
                type="text"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                placeholder="۵۰۰٬۰۰۰ تومان پاداش"
                className="form-input"
              />
              <div className="text-[10px] text-muted-foreground mt-1">
                💡 ارائه پاداش شانس پیدا شدن وسیله شما را افزایش می‌دهد
              </div>
            </Field>
          )}

          {/* برچسب‌ها */}
          <Field label="برچسب‌ها (با «،» جدا کنید)">
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="گواهینامه، مدارک هویتی"
              className="form-input"
            />
          </Field>

          {/* اطلاعات تماس */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="نام تماس" icon={User}>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="نام شما"
                className="form-input"
              />
            </Field>
            <Field label="نوع تماس‌گیرنده">
              <select
                value={contactType}
                onChange={(e) => setContactType(e.target.value as "owner" | "finder")}
                className="form-input"
              >
                <option value="owner">مالک</option>
                <option value="finder">یابنده</option>
              </select>
            </Field>
          </div>

          {/* راهنما */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-[11px] text-amber-800 leading-relaxed">
              ⚠️ <span className="font-bold">هشدار امنیتی:</span> پیش از تحویل وسیله، هویت طرف مقابل را احراز کنید. در موارد حساس (مدارک هویتی، جواهرات) حتماً به کلانتری مراجعه کنید.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* دکمه ثبت */}
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className={cn(
              "w-full font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm",
              canSubmit && !submitting
                ? "bg-primary text-primary-foreground active:scale-[0.98]"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {submitting ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                در حال ثبت…
              </>
            ) : (
              <>
                <Save className="size-5" />
                ثبت مورد
              </>
            )}
          </button>

          <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
            با ثبت مورد، شما قوانین و مقررات شبکه قدس را می‌پذیرید. مورد پس از تأیید مدیر منتشر می‌شود.
          </p>
        </form>
      </main>
    </>
  );
}

function Field({
  label,
  icon: Icon,
  required,
  children,
}: {
  label: string;
  icon?: typeof Tag;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
        {Icon && <Icon className="size-3.5 text-primary" />}
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function SuccessHeader({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-b from-primary to-primary/95 text-primary-foreground shadow-lg">
      <div className="px-4 pt-3 pb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="بازگشت"
          className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15"
        >
          <ChevronRight className="size-5" />
        </button>
        <h1 className="text-base font-bold flex-1">{title}</h1>
      </div>
    </header>
  );
}
