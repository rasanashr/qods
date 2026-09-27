"use client";

import { useState, useRef } from "react";
import {
  sama137Categories,
  sama137Priorities,
  type Attachment,
  type RequestCategory,
  type RequestPriority,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  Upload,
  Image as ImageIcon,
  Video,
  X,
  MapPin,
  AlertTriangle,
  Tag,
  FileText,
  Send,
  Camera,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export function RequestForm() {
  const [category, setCategory] = useState<RequestCategory>("cleaning");
  const [priority, setPriority] = useState<RequestPriority>("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const selectedCategory = sama137Categories.find((c) => c.id === category);

  const addFakeAttachments = (type: "image" | "video") => {
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

  const canSubmit =
    title.trim().length > 3 && description.trim().length > 10 && address.trim().length > 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    // شبیه‌سازی ارسال به سرور
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const resetForm = () => {
    setSubmitted(false);
    setTitle("");
    setDescription("");
    setAddress("");
    setPhone("");
    setAttachments([]);
    setCategory("cleaning");
    setPriority("medium");
  };

  if (submitted) {
    const trackingCode = `۱۳۷-${Math.floor(Math.random() * 90000) + 10000}`;
    return (
      <div className="px-4 py-8 flex flex-col items-center text-center">
        <div className="size-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
          <CheckCircle2 className="size-12 text-emerald-600" strokeWidth={1.8} />
        </div>
        <h3 className="text-lg font-bold text-foreground">درخواست شما ثبت شد</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          درخواست شما با موفقیت در سامانه ۱۳۷ ثبت شد. کد رهگیری شما:
        </p>
        <div className="mt-3 inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2">
          <span className="text-xs text-muted-foreground">کد رهگیری:</span>
          <span className="text-lg font-bold text-primary tabular-nums tracking-wider">
            {trackingCode}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-3 max-w-xs">
          واحد مربوطه در اولین فرصت بررسی کرده و نتیجه را از طریق پیامک و همین صفحه به اطلاع شما خواهد رساند.
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="mt-6 bg-primary text-primary-foreground text-sm font-bold px-6 py-2.5 rounded-xl shadow active:scale-95 transition-transform"
        >
          ثبت درخواست جدید
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 pt-3 pb-4 space-y-4">
      {/* انتخاب دسته‌بندی */}
      <div>
        <label className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
          <Tag className="size-3.5 text-primary" />
          نوع مشکل
          <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {sama137Categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
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
      </div>

      {/* اولویت */}
      <div>
        <label className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
          <AlertTriangle className="size-3.5 text-primary" />
          اولویت درخواست
        </label>
        <div className="flex gap-1.5">
          {sama137Priorities.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPriority(p.id)}
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
      </div>

      {/* عنوان درخواست */}
      <div>
        <label
          htmlFor="req-title"
          className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5"
        >
          <FileText className="size-3.5 text-primary" />
          عنوان درخواست
          <span className="text-rose-500">*</span>
        </label>
        <input
          id="req-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="مثلاً: خرابی چراغ چشاغ خیابان قدس"
          className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* توضیحات */}
      <div>
        <label
          htmlFor="req-desc"
          className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5"
        >
          <FileText className="size-3.5 text-primary" />
          شرح مشکل
          <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="req-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="شرح کامل مشکل، مدت زمان بروز، و نحوه تأثیر آن بر شهروندان…"
          rows={4}
          className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />
        <div className="mt-1 text-[10px] text-muted-foreground text-left">
          {description.length.toLocaleString("fa-IR")} کاراکتر
        </div>
      </div>

      {/* آدرس */}
      <div>
        <label
          htmlFor="req-addr"
          className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5"
        >
          <MapPin className="size-3.5 text-primary" />
          آدرس دقیق محل
          <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="req-addr"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="استان، شهر، منطقه، خیابان، کوچه، پلاک و مشخصه دقیق محل"
          rows={2}
          className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />
        <button
          type="button"
          className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-primary font-bold bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
        >
          <MapPin className="size-3.5" />
          انتخاب موقعیت روی نقشه
        </button>
      </div>

      {/* تلفن تماس */}
      <div>
        <label
          htmlFor="req-phone"
          className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5"
        >
          <span className="text-primary">📞</span>
          شماره تماس (اختیاری)
        </label>
        <input
          id="req-phone"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
          className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all tabular-nums"
        />
      </div>

      {/* آپلود فایل */}
      <div>
        <label className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
          <Upload className="size-3.5 text-primary" />
          پیوست‌ها (عکس و فیلم)
        </label>

        {/* دکمه‌های آپلود */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => addFakeAttachments("image")}
            className="flex flex-col items-center justify-center gap-1 py-4 bg-card border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
          >
            <ImageIcon className="size-6 text-muted-foreground" />
            <span className="text-[11px] font-medium text-foreground">افزودن عکس</span>
            <span className="text-[10px] text-muted-foreground">JPG, PNG</span>
          </button>
          <button
            type="button"
            onClick={() => addFakeAttachments("video")}
            className="flex flex-col items-center justify-center gap-1 py-4 bg-card border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
          >
            <Video className="size-6 text-muted-foreground" />
            <span className="text-[11px] font-medium text-foreground">افزودن ویدیو</span>
            <span className="text-[10px] text-muted-foreground">MP4, MOV</span>
          </button>
        </div>

        {/* ورودی‌های مخفی (برای دسترسی‌پذیری) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          aria-hidden
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          aria-hidden
        />

        {/* لیست فایل‌های آپلود شده */}
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
          </div>
        )}

        {attachments.length > 0 && (
          <div className="mt-1.5 text-[10px] text-muted-foreground">
            {attachments.length.toLocaleString("fa-IR")} فایل پیوست شد
            {attachments.filter((a) => a.type === "image").length > 0 && (
              <span>
                {" "}
                ·{" "}
                {attachments.filter((a) => a.type === "image").length.toLocaleString("fa-IR")}{" "}
                عکس
              </span>
            )}
            {attachments.filter((a) => a.type === "video").length > 0 && (
              <span>
                {" "}
                ·{" "}
                {attachments.filter((a) => a.type === "video").length.toLocaleString("fa-IR")}{" "}
                ویدیو
              </span>
            )}
          </div>
        )}
      </div>

      {/* دکمه ثبت */}
      <button
        type="submit"
        disabled={!canSubmit || submitting}
        className={cn(
          "w-full font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2",
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
            <Send className="size-5" />
            ثبت درخواست
          </>
        )}
      </button>

      {!canSubmit && (
        <p className="text-[10px] text-muted-foreground text-center">
          برای فعال شدن دکمه ثبت، عنوان، شرح مشکل و آدرس را کامل کنید
        </p>
      )}

      {selectedCategory && (
        <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
          با ثبت درخواست، شما تأیید می‌کنید که اطلاعات وارد شده صحیح است و در صورت
          نیاز، با کارشناسان شهرداری همکاری خواهید کرد.
        </p>
      )}
    </form>
  );
}
