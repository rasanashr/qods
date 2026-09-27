"use client";

import { useEffect, useState } from "react";
import { useNav } from "@/lib/nav-store";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Loader2,
  Save,
  CheckCircle2,
  Tag,
  FileText,
  MapPin,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Video,
  X,
  Camera,
  Headphones,
} from "lucide-react";

type Step = "form" | "success";

const CATEGORIES = [
  { id: "cleaning", label: "نظافت و روشنایی معابر", emoji: "🧹", description: "تمیزکاری خیابان، جمع‌آوری زباله، شستشوی معابر" },
  { id: "asphalt", label: "آسفالت و معابر", emoji: "🛣️", description: "چاله جاده، ترمیم آسفالت، جدول‌گذاری" },
  { id: "lighting", label: "روشنایی شهری", emoji: "💡", description: "خرابی چراغ، تعویض لامپ، قطع برق پارک" },
  { id: "green-space", label: "فضای سبز", emoji: "🌳", description: "هرس درخت، آبیاری، کاشت فضای سبز" },
  { id: "trash", label: "زباله و پسماند", emoji: "🗑️", description: "سرریز سطل، جمع‌آوری پسماند بزرگ" },
  { id: "water", label: "آب و فاضلاب", emoji: "💧", description: "نشتی لوله، قطع آب، خرابی شیر" },
  { id: "electricity", label: "برق شهری", emoji: "⚡", description: "قطع برق، خرابی تابلو، اتصالی" },
  { id: "traffic", label: "ترافیک و علائم", emoji: "🚦", description: "خرابی چراغ، علائم جاده‌ای" },
  { id: "construction", label: "ساختمان و محوطه", emoji: "🏗️", description: "خرابی پیاده‌رو، دیوار، پل عابر" },
  { id: "other", label: "سایر موارد", emoji: "❓", description: "مواردی که در دسته‌بندی بالا قرار نمی‌گیرند" },
];

const PRIORITIES = [
  { id: "low", label: "کم", color: "bg-slate-100 text-slate-700", description: "مهم اما فوری نیست" },
  { id: "medium", label: "متوسط", color: "bg-sky-50 text-sky-700", description: "نیاز به رسیدگی دارد" },
  { id: "high", label: "زیاد", color: "bg-amber-50 text-amber-700", description: "تأثیر بر چندین نفر" },
  { id: "urgent", label: "فوری", color: "bg-rose-50 text-rose-700", description: "خطرناک یا بحرانی" },
];

const EMOJIS = ["🧹", "🛣️", "💡", "🌳", "🗑️", "💧", "⚡", "🚦", "🏗️", "❓"];

type Attachment = {
  id: string;
  type: "image" | "video";
  name: string;
  size: string;
};

export function PostSama137Form() {
  const setView = useNav((s) => s.setView);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);

  const [step, setStep] = useState<Step>("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  // فیلدهای فرم
  const [category, setCategory] = useState("cleaning");
  const [categoryLabel, setCategoryLabel] = useState("نظافت و روشنایی معابر");
  const [emoji, setEmoji] = useState("🧹");
  const [priority, setPriority] = useState("medium");
  const [priorityLabel, setPriorityLabel] = useState("متوسط");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [phone, setPhone] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // اگر کاربر وارد نشده بود
  useEffect(() => {
    if (!isAuthenticated) {
      setView("auth");
    }
  }, [isAuthenticated, setView]);

  const selectedCategory = CATEGORIES.find((c) => c.id === category);

  const addFakeAttachment = (type: "image" | "video") => {
    const id = `up-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const sizes =
      type === "image"
        ? ["۱٫۸ MB", "۲٫۳ MB", "۳٫۱ MB", "۱٫۲ MB"]
        : ["۱۲ MB", "۱۸ MB", "۲۴ MB"];
    const names =
      type === "image"
        ? [`تصویر-${attachments.length + 1}.jpg`, `نمای-${attachments.length + 1}.jpg`]
        : [`ویدیو-${attachments.length + 1}.mp4`];
    const newAtt: Attachment = {
      id,
      type,
      name: names[Math.floor(Math.random() * names.length)],
      size: sizes[Math.floor(Math.random() * sizes.length)],
    };
    setAttachments((prev) => [...prev, newAtt]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/user/sama137", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          categoryLabel,
          emoji,
          priority,
          priorityLabel,
          description,
          address,
          district,
          phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در ثبت درخواست");
      }
      setTrackingCode(data.request?.trackingCode || null);
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
    setAddress("");
    setDistrict("");
    setPhone("");
    setAttachments([]);
    setPriority("medium");
    setPriorityLabel("متوسط");
  };

  if (!isAuthenticated) return null;

  if (step === "success") {
    return (
      <>
        <SuccessHeader onBack={() => setView("sama137")} title="ثبت درخواست سامانه ۱۳۷" />
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="px-4 py-8 flex flex-col items-center text-center">
            <div className="size-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <CheckCircle2 className="size-12 text-emerald-600" strokeWidth={1.8} />
            </div>
            <h2 className="text-lg font-bold">درخواست شما ثبت شد</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs leading-relaxed">
              درخواست شما با موفقیت در سامانه ۱۳۷ ثبت شد. کد رهگیری شما:
            </p>
            {trackingCode && (
              <div className="mt-3 inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2">
                <span className="text-xs text-muted-foreground">کد رهگیری:</span>
                <span className="text-lg font-bold text-primary tabular-nums tracking-wider">
                  {trackingCode}
                </span>
              </div>
            )}
            <p className="text-[11px] text-muted-foreground mt-3 max-w-xs leading-relaxed">
              واحد مربوطه در اولین فرصت بررسی کرده و نتیجه را از طریق همین صفحه به اطلاع شما خواهد رساند.
            </p>
            <div className="mt-6 flex flex-col gap-2 w-full max-w-xs">
              <button
                type="button"
                onClick={() => setView("sama137")}
                className="bg-primary text-primary-foreground text-sm font-bold py-2.5 rounded-xl shadow active:scale-95 transition-transform"
              >
                مشاهده درخواست‌های من
              </button>
              <button
                type="button"
                onClick={() => setView("profile")}
                className="bg-card border border-border text-foreground text-sm font-bold py-2.5 rounded-xl"
              >
                رفتن به پروفایل
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-primary font-bold hover:underline"
              >
                ثبت درخواست جدید
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
    address.trim().length > 5;

  return (
    <>
      {/* هدر */}
      <header className="sticky top-0 z-30 bg-gradient-to-b from-primary to-primary/95 text-primary-foreground shadow-lg">
        <div className="px-4 pt-3 pb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView("sama137")}
            aria-label="بازگشت"
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15"
          >
            <ChevronRight className="size-5" />
          </button>
          <h1 className="text-base font-bold flex-1">ثبت درخواست سامانه ۱۳۷</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30">
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* راهنما */}
          <div className="flex items-start gap-2 bg-sky-50 border border-sky-100 rounded-xl p-3">
            <Headphones className="size-5 text-sky-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-sky-800 leading-relaxed">
              <span className="font-bold">راهنما:</span> برای ثبت سریع‌تر درخواست، نوع مشکل را دقیق انتخاب کنید، آدرس کامل وارد کنید و در صورت امکان عکس یا ویدیو از محل پیوست کنید.
            </p>
          </div>

          {/* انتخاب دسته‌بندی */}
          <Field label="نوع مشکل" icon={Tag} required>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCategory(c.id);
                    setCategoryLabel(c.label);
                    setEmoji(c.emoji);
                  }}
                  className={cn(
                    "flex items-start gap-2 p-2.5 rounded-xl border text-right transition-all",
                    category === c.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border bg-card hover:bg-muted/50"
                  )}
                >
                  <span className="text-xl shrink-0">{c.emoji}</span>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-foreground leading-tight">
                      {c.label}
                    </div>
                    {category === c.id && (
                      <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight line-clamp-2">
                        {c.description}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </Field>

          {/* اولویت */}
          <Field label="اولویت درخواست" icon={AlertTriangle}>
            <div className="flex gap-1.5">
              {PRIORITIES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPriority(p.id);
                    setPriorityLabel(p.label);
                  }}
                  className={cn(
                    "flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all border",
                    priority === p.id
                      ? p.color + " border-current ring-1 ring-current/30"
                      : "bg-card border-border text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {selectedCategory && (
              <p className="text-[10px] text-muted-foreground mt-2">
                {PRIORITIES.find((p) => p.id === priority)?.description}
              </p>
            )}
          </Field>

          {/* عنوان درخواست */}
          <Field label="عنوان درخواست" icon={FileText} required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: خرابی چراغ چراغ خیابان قدس"
              className="form-input"
              maxLength={100}
            />
            <div className="text-[10px] text-muted-foreground text-left mt-1 tabular-nums">
              {title.length.toLocaleString("fa-IR")} / ۱۰۰
            </div>
          </Field>

          {/* توضیحات */}
          <Field label="شرح مشکل" icon={FileText} required>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="شرح کامل مشکل، مدت زمان بروز، و نحوه تأثیر آن بر شهروندان…"
              rows={4}
              className="form-input resize-none"
              maxLength={500}
            />
            <div className="text-[10px] text-muted-foreground text-left mt-1 tabular-nums">
              {description.length.toLocaleString("fa-IR")} / ۵۰۰
            </div>
          </Field>

          {/* آدرس */}
          <Field label="آدرس دقیق محل" icon={MapPin} required>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="استان، شهر، منطقه، خیابان، کوچه، پلاک و مشخصه دقیق محل"
              rows={2}
              className="form-input resize-none"
            />
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-primary font-bold bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <MapPin className="size-3.5" />
              انتخاب موقعیت روی نقشه
            </button>
          </Field>

          {/* منطقه و شماره تماس */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="منطقه">
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="منطقه ۳"
                className="form-input"
              />
            </Field>
            <Field label="شماره تماس (اختیاری)">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xxxxxxxxx"
                dir="ltr"
                className="form-input text-left tabular-nums"
              />
            </Field>
          </div>

          {/* آپلود فایل */}
          <Field label="پیوست‌ها (عکس و فیلم)" icon={Upload}>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => addFakeAttachment("image")}
                className="flex flex-col items-center justify-center gap-1 py-4 bg-card border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
              >
                <ImageIcon className="size-6 text-muted-foreground" />
                <span className="text-[11px] font-medium text-foreground">افزودن عکس</span>
                <span className="text-[10px] text-muted-foreground">JPG, PNG</span>
              </button>
              <button
                type="button"
                onClick={() => addFakeAttachment("video")}
                className="flex flex-col items-center justify-center gap-1 py-4 bg-card border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Video className="size-6 text-muted-foreground" />
                <span className="text-[11px] font-medium text-foreground">افزودن ویدیو</span>
                <span className="text-[10px] text-muted-foreground">MP4, MOV</span>
              </button>
            </div>

            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-2 bg-card border border-border rounded-xl p-2"
                  >
                    <div
                      className={cn(
                        "size-9 rounded-lg flex items-center justify-center shrink-0",
                        att.type === "image" ? "bg-sky-50" : "bg-purple-50"
                      )}
                    >
                      {att.type === "image" ? (
                        <ImageIcon className="size-4 text-sky-600" />
                      ) : (
                        <Video className="size-4 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-foreground truncate">
                        {att.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground tabular-nums">
                        {att.size}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      aria-label="حذف فایل"
                      className="size-7 rounded-full hover:bg-muted transition-colors flex items-center justify-center"
                    >
                      <X className="size-3.5 text-muted-foreground" />
                    </button>
                  </div>
                ))}
                <div className="text-[10px] text-muted-foreground">
                  {attachments.length.toLocaleString("fa-IR")} فایل پیوست شد
                </div>
              </div>
            )}
          </Field>

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
                در حال ارسال…
              </>
            ) : (
              <>
                <Save className="size-5" />
                ثبت درخواست
              </>
            )}
          </button>

          {!canSubmit && (
            <p className="text-[10px] text-muted-foreground text-center">
              برای فعال شدن دکمه ثبت، عنوان، شرح مشکل و آدرس را کامل کنید
            </p>
          )}

          <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
            با ثبت درخواست، شما تأیید می‌کنید که اطلاعات وارد شده صحیح است و در صورت نیاز، با کارشناسان شهرداری همکاری خواهید کرد.
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
