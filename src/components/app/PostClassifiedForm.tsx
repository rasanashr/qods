"use client";

import { useEffect, useState } from "react";
import { useNav } from "@/lib/nav-store";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Tag,
  FileText,
  MapPin,
  Phone,
  User,
  Loader2,
  Save,
  CheckCircle2,
  Wallet,
  Sparkles,
  Zap,
} from "lucide-react";

type Pricing = {
  id: string;
  category: string;
  categoryLabel: string;
  freeDays: number;
  featuredPrice: number;
  urgentPrice: number;
  featuredDays: number;
  urgentDays: number;
  isActive: boolean;
};

const EMOJIS = ["📦", "📱", "🚲", "🏠", "💼", "🔑", "🪑", "📚", "🎮", "👕", "🔧", "🎁", "🛒", "💡"];

export function PostClassifiedForm() {
  const setView = useNav((s) => s.setView);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const user = useAuth((s) => s.user);

  const [pricings, setPricings] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  // فیلدهای فرم
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [emoji, setEmoji] = useState("📦");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [district, setDistrict] = useState("");
  const [plan, setPlan] = useState<"free" | "featured" | "urgent">("free");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [tagsText, setTagsText] = useState("");

  // اگر کاربر وارد نشده بود، به صفحه ورود هدایت کن
  useEffect(() => {
    if (!isAuthenticated) {
      setView("auth");
    }
  }, [isAuthenticated, setView]);

  // بارگذاری قیمت‌گذاری دسته‌ها و موجودی کیف پول
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [pricingRes, walletRes] = await Promise.all([
          fetch("/api/user/classifieds/pricing"),
          fetch("/api/user/wallet"),
        ]);
        const pricingData = await pricingRes.json();
        if (active && Array.isArray(pricingData.pricing)) {
          const activePricings = pricingData.pricing.filter((p: Pricing) => p.isActive);
          setPricings(activePricings);
          if (activePricings.length > 0 && !category) {
            setCategory(activePricings[0].category);
          }
        }
        if (walletRes.ok) {
          const walletData = await walletRes.json();
          if (active) setWalletBalance(walletData.balance ?? 0);
        }
      } catch {
        // ignore
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // prefill نام کاربر و شماره تماس
  useEffect(() => {
    if (user && !contactName) {
      setContactName(user.name);
    }
    if (user && !contactPhone) {
      setContactPhone(user.phone);
    }
  }, [user]);

  const selectedPricing = pricings.find((p) => p.category === category);
  const planPrice = plan === "featured" ? selectedPricing?.featuredPrice ?? 0 : plan === "urgent" ? selectedPricing?.urgentPrice ?? 0 : 0;
  const planDays = plan === "free" ? selectedPricing?.freeDays ?? 7 : plan === "featured" ? selectedPricing?.featuredDays ?? 30 : selectedPricing?.urgentDays ?? 14;

  const canSubmit =
    title.trim().length > 3 &&
    category &&
    description.trim().length > 10 &&
    price.trim() &&
    location.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !canSubmit) return;
    setError("");
    setSubmitting(true);
    try {
      const tags = tagsText
        .split("،")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/user/classifieds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          emoji,
          description,
          price,
          location,
          district,
          plan,
          contactName,
          contactPhone,
          tags,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در ثبت آگهی");
      }
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setTitle("");
    setDescription("");
    setPrice("");
    setLocation("");
    setDistrict("");
    setPlan("free");
    setTagsText("");
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <>
        <SuccessHeader onBack={() => setView("classifieds")} />
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="px-4 py-8 flex flex-col items-center text-center">
            <div className="size-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <CheckCircle2 className="size-12 text-emerald-600" strokeWidth={1.8} />
            </div>
            <h2 className="text-lg font-bold">آگهی شما ثبت شد</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              آگهی شما با موفقیت ثبت شد و در انتظار تأیید مدیر است. پس از تأیید، در صفحه نیازمندی‌ها نمایش داده می‌شود.
            </p>
            {planPrice > 0 && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
                {planPrice.toLocaleString("fa-IR")} تومان از کیف پول شما کم شد
              </div>
            )}
            <div className="mt-6 flex flex-col gap-2 w-full max-w-xs">
              <button
                type="button"
                onClick={() => setView("classifieds")}
                className="bg-primary text-primary-foreground text-sm font-bold py-2.5 rounded-xl shadow active:scale-95 transition-transform"
              >
                مشاهده آگهی‌ها
              </button>
              <button
                type="button"
                onClick={() => setView("profile")}
                className="bg-card border border-border text-foreground text-sm font-bold py-2.5 rounded-xl"
              >
                مشاهده آگهی‌های من
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-primary font-bold hover:underline"
              >
                ثبت آگهی جدید
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {/* هدر */}
      <header className="sticky top-0 z-30 bg-gradient-to-b from-primary to-primary/95 text-primary-foreground shadow-lg">
        <div className="px-4 pt-3 pb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView("classifieds")}
            aria-label="بازگشت"
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15"
          >
            <ChevronRight className="size-5" />
          </button>
          <h1 className="text-base font-bold flex-1">ثبت آگهی جدید</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30">
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* انتخاب دسته */}
          <Field label="دسته‌بندی" icon={Tag} required>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-input"
            >
              {pricings.map((p) => (
                <option key={p.category} value={p.category}>
                  {p.categoryLabel}
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
          <Field label="عنوان آگهی" icon={FileText} required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: فروش گاز پلاستیکی نو"
              className="form-input"
              maxLength={80}
            />
            <div className="text-[10px] text-muted-foreground text-left mt-1 tabular-nums">
              {title.length.toLocaleString("fa-IR")} / ۸۰
            </div>
          </Field>

          {/* توضیحات */}
          <Field label="توضیحات" icon={FileText} required>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="شرح کامل آگهی، مشخصات، وضعیت، قیمت توافقی یا ثابت و..."
              rows={5}
              className="form-input resize-none"
              maxLength={500}
            />
            <div className="text-[10px] text-muted-foreground text-left mt-1 tabular-nums">
              {description.length.toLocaleString("fa-IR")} / ۵۰۰
            </div>
          </Field>

          {/* قیمت و مکان */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="قیمت" required>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="۱٫۸۵۰٫۰۰۰ ت"
                className="form-input"
              />
            </Field>
            <Field label="محل" icon={MapPin} required>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="میدان قدس"
                className="form-input"
              />
            </Field>
          </div>

          {/* منطقه */}
          <Field label="منطقه/محله">
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="شهرک قدس"
              className="form-input"
            />
          </Field>

          {/* برچسب‌ها */}
          <Field label="برچسب‌ها (با «،» جدا کنید)">
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="گاز، پلاستیکی، نو"
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
            <Field label="شماره تماس" icon={Phone}>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="09xxxxxxxxx"
                dir="ltr"
                className="form-input text-left tabular-nums"
              />
            </Field>
          </div>

          {/* انتخاب طرح */}
          {selectedPricing && (
            <Field label="نوع آگهی">
              <div className="grid grid-cols-3 gap-2">
                <PlanCard
                  active={plan === "free"}
                  onClick={() => setPlan("free")}
                  title="رایگان"
                  emoji="📦"
                  price="۰ ت"
                  days={selectedPricing.freeDays}
                  tone="border"
                />
                <PlanCard
                  active={plan === "featured"}
                  onClick={() => setPlan("featured")}
                  title="ویژه"
                  emoji="✨"
                  price={`${selectedPricing.featuredPrice.toLocaleString("fa-IR")} ت`}
                  days={selectedPricing.featuredDays}
                  tone="amber"
                />
                <PlanCard
                  active={plan === "urgent"}
                  onClick={() => setPlan("urgent")}
                  title="فوری"
                  emoji="⚡"
                  price={`${selectedPricing.urgentPrice.toLocaleString("fa-IR")} ت`}
                  days={selectedPricing.urgentDays}
                  tone="rose"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                💡 آگهی ویژه و فوری از کیف پول شما کسر می‌شود و در بالای لیست نمایش داده می‌شود.
              </p>
            </Field>
          )}

          {/* موجودی کیف پول */}
          {walletBalance !== null && planPrice > 0 && (
            <div className={cn(
              "rounded-xl p-3 border flex items-center gap-2",
              walletBalance >= planPrice
                ? "bg-emerald-50 border-emerald-200"
                : "bg-rose-50 border-rose-200"
            )}>
              <Wallet className={cn("size-5 shrink-0", walletBalance >= planPrice ? "text-emerald-600" : "text-rose-600")} />
              <div className="text-xs">
                <div className={cn("font-bold", walletBalance >= planPrice ? "text-emerald-900" : "text-rose-900")}>
                  موجودی کیف پول: {walletBalance.toLocaleString("fa-IR")} ت
                </div>
                {walletBalance < planPrice ? (
                  <div className="text-rose-700 mt-0.5">
                    موجودی کافی نیست — {planPrice.toLocaleString("fa-IR")} ت لازم است.{" "}
                    <button
                      type="button"
                      onClick={() => setView("profile")}
                      className="underline font-bold"
                    >
                      شارژ کنید
                    </button>
                  </div>
                ) : (
                  <div className="text-emerald-700 mt-0.5">
                    پس از ثبت، {planPrice.toLocaleString("fa-IR")} ت کسر می‌شود
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* دکمه ثبت */}
          <button
            type="submit"
            disabled={!canSubmit || submitting || (planPrice > 0 && (walletBalance === null || walletBalance < planPrice))}
            className={cn(
              "w-full font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm",
              canSubmit && !submitting && (planPrice === 0 || (walletBalance !== null && walletBalance >= planPrice))
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
                {planPrice > 0 ? `ثبت با پرداخت ${planPrice.toLocaleString("fa-IR")} ت` : "ثبت آگهی رایگان"}
              </>
            )}
          </button>

          <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
            با ثبت آگهی، شما قوانین و مقررات شبکه قدس را می‌پذیرید. آگهی پس از تأیید مدیر منتشر می‌شود.
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

function PlanCard({
  active,
  onClick,
  title,
  emoji,
  price,
  days,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  emoji: string;
  price: string;
  days: number;
  tone: "border" | "amber" | "rose";
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-300 bg-amber-50"
      : tone === "rose"
      ? "border-rose-300 bg-rose-50"
      : "border-border bg-card";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-2 rounded-xl border-2 transition-all text-center",
        active ? `${toneClass} ring-2 ring-primary` : "border-transparent bg-card hover:bg-muted"
      )}
    >
      <div className="text-2xl">{emoji}</div>
      <div className="text-xs font-bold mt-1">{title}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5 tabular-nums">{price}</div>
      <div className="text-[9px] text-muted-foreground">{days.toLocaleString("fa-IR")} روز</div>
    </button>
  );
}

function SuccessHeader({ onBack }: { onBack: () => void }) {
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
        <h1 className="text-base font-bold flex-1">ثبت آگهی</h1>
      </div>
    </header>
  );
}
