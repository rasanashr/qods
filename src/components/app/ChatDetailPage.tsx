"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNav } from "@/lib/nav-store";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  MoreVertical,
  Send,
  Smile,
  Image as ImageIcon,
  Loader2,
  Ban,
  Flag,
  Trash2,
  X,
  AlertTriangle,
  CheckCheck,
  Check,
} from "lucide-react";

type OtherUser = {
  id: string;
  name: string | null;
  phone: string;
  chatId: string | null;
};

type Message = {
  id: string;
  senderId: string;
  content: string;
  messageType: "text" | "image";
  isRead: boolean;
  isReported: boolean;
  createdAt: string;
};

const EMOJIS = [
  "😀", "😂", "🥰", "😍", "😎", "🤔", "😅", "😭", "😡", "👍",
  "👎", "🙏", "👏", "💪", "🎉", "🔥", "✨", "⭐", "💡", "❤️",
  "💙", "💚", "💛", "💜", "🖤", "🌹", "🌸", "☕", "🍎", "🥗",
];

const REPORT_REASONS: { value: string; label: string }[] = [
  { value: "spam", label: "اسپم / تبلیغات" },
  { value: "harassment", label: "آزار و اذیت" },
  { value: "inappropriate", label: "محتوای نامناسب" },
  { value: "other", label: "سایر" },
];

// رنگ آواتار
function avatarColor(seed: string): string {
  const colors = [
    "bg-teal-500", "bg-emerald-500", "bg-sky-500", "bg-amber-500",
    "bg-rose-500", "bg-purple-500", "bg-orange-500", "bg-lime-500",
  ];
  const idx = (seed.replace(/\D/g, "").slice(-1) || "0") as string;
  return colors[parseInt(idx) % colors.length] || colors[0];
}

function initials(name: string | null, phone: string): string {
  if (name && name.trim()) return name.trim().charAt(0).toUpperCase();
  return phone.slice(-2);
}

function formatClockTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "";
  }
}

function formatDayLabel(iso: string): string {
  try {
    const d = new Date(iso);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const that = new Date(d);
    that.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today.getTime() - that.getTime()) / 86400000);
    if (diffDays <= 0) return "امروز";
    if (diffDays === 1) return "دیروز";
    return d.toLocaleDateString("fa-IR", { day: "numeric", month: "long" });
  } catch {
    return "";
  }
}

function isSameDay(a: string, b: string): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

export function ChatDetailPage() {
  const setView = useNav((s) => s.setView);
  const conversationId = useNav((s) => s.selectedConversationId);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);

  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0].value);
  const [reportDescription, setReportDescription] = useState("");
  const [submittingAction, setSubmittingAction] = useState(false);
  const [linkWarning, setLinkWarning] = useState(false);
  const [imageTooLarge, setImageTooLarge] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setView("auth");
    }
  }, [isAuthenticated, setView]);

  const fetchConversation = useCallback(
    async (silent = false) => {
      if (!conversationId) return;
      if (!silent) {
        setLoading(true);
        setError("");
      }
      try {
        const res = await fetch(`/api/user/chat/${conversationId}`);
        if (res.status === 401) {
          setView("auth");
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "خطا در بارگذاری گفتگو");
          return;
        }
        setOtherUser(data.otherUser);
        setMessages(data.messages || []);
        setStatus(data.conversation?.status || "");
      } catch {
        if (!silent) setError("ارتباط با سرور برقرار نشد");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [conversationId, setView]
  );

  useEffect(() => {
    if (!conversationId) {
      setView("messenger");
      return;
    }
    fetchConversation();

    // polling هر ۳ ثانیه برای پیام‌های جدید
    pollRef.current = setInterval(() => {
      fetchConversation(true);
    }, 3000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [conversationId, fetchConversation]);

  // اسکرول به پایین هنگام دریافت پیام جدید
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length]);

  // بستن منو با کلیک خارج از آن
  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = () => setMenuOpen(false);
    window.addEventListener("click", onDoc);
    return () => window.removeEventListener("click", onDoc);
  }, [menuOpen]);

  // گروه‌بندی پیام‌ها بر اساس روز برای نمایش جداکنندهٔ تاریخ
  const grouped = useMemo(() => {
    const out: { dayLabel: string; items: Message[] }[] = [];
    let lastDay = "";
    for (const m of messages) {
      if (!lastDay || !isSameDay(lastDay, m.createdAt)) {
        out.push({ dayLabel: formatDayLabel(m.createdAt), items: [m] });
        lastDay = m.createdAt;
      } else {
        out[out.length - 1].items.push(m);
      }
    }
    return out;
  }, [messages]);

  const handleSend = async (overrideContent?: string, type: "text" | "image" = "text") => {
    const content = (overrideContent ?? input).trim();
    if (!content || sending || !conversationId) return;

    // بررسی لینک برای پیام متنی
    if (type === "text") {
      if (containsUrlClient(content)) {
        setLinkWarning(true);
        setTimeout(() => setLinkWarning(false), 2500);
        return;
      }
    }

    setSending(true);
    try {
      const res = await fetch(`/api/user/chat/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, messageType: type }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در ارسال پیام");
        return;
      }
      setMessages((prev) => [...prev, data]);
      setInput("");
      setEmojiOpen(false);
      setError("");
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setSending(false);
    }
  };

  const handlePickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setImageTooLarge(true);
      setTimeout(() => setImageTooLarge(false), 3000);
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      handleSend(result, "image");
      e.target.value = "";
    };
    reader.onerror = () => {
      setError("بارگذاری تصویر ناموفق بود");
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleBlock = async () => {
    if (!conversationId) return;
    setSubmittingAction(true);
    try {
      const res = await fetch(`/api/user/chat/${conversationId}/block`, {
        method: "POST",
      });
      if (res.ok) {
        setView("messenger");
      } else {
        const data = await res.json();
        setError(data.error || "خطا در بلاک کاربر");
      }
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleReport = async () => {
    if (!conversationId) return;
    setSubmittingAction(true);
    try {
      const res = await fetch(`/api/user/chat/${conversationId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: reportReason,
          description: reportDescription.trim() || undefined,
        }),
      });
      if (res.ok) {
        setReportOpen(false);
        setView("messenger");
      } else {
        const data = await res.json();
        setError(data.error || "خطا در ثبت ریپورت");
      }
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleDelete = async () => {
    if (!conversationId) return;
    setSubmittingAction(true);
    try {
      const res = await fetch(`/api/user/chat/${conversationId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setView("messenger");
      } else {
        const data = await res.json();
        setError(data.error || "خطا در حذف گفتگو");
      }
    } finally {
      setSubmittingAction(false);
    }
  };

  if (!conversationId) {
    return null;
  }

  if (loading) {
    return (
      <>
        <Header
          otherUser={otherUser}
          onBack={() => setView("messenger")}
          onMenu={() => {}}
          menuOpen={false}
        />
        <main className="flex-1 flex items-center justify-center bg-muted/30">
          <Loader2 className="size-8 animate-spin text-primary" />
        </main>
      </>
    );
  }

  // اگر گفتگو pending است (هنوز تأیید نشده)
  if (status === "pending") {
    return (
      <>
        <Header
          otherUser={otherUser}
          onBack={() => setView("messenger")}
          onMenu={() => {}}
          menuOpen={false}
        />
        <main className="flex-1 flex flex-col items-center justify-center bg-muted/30 px-6 text-center">
          <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center mb-3">
            <AlertTriangle className="size-8 text-amber-600" />
          </div>
          <h3 className="text-sm font-bold text-foreground">گفتگو در انتظار تأیید</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
            این گفتجو هنوز از طرف مقابل تأیید نشده است. پس از پذیرش طرف مقابل، امکان ارسال پیام فعال خواهد شد.
          </p>
          <button
            type="button"
            onClick={() => setView("messenger")}
            className="mt-4 inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-lg shadow active:scale-95 transition-transform"
          >
            بازگشت به پیامرسان
          </button>
        </main>
      </>
    );
  }

  if (status === "blocked") {
    return (
      <>
        <Header
          otherUser={otherUser}
          onBack={() => setView("messenger")}
          onMenu={() => {}}
          menuOpen={false}
        />
        <main className="flex-1 flex flex-col items-center justify-center bg-muted/30 px-6 text-center">
          <div className="size-16 rounded-full bg-rose-100 flex items-center justify-center mb-3">
            <Ban className="size-8 text-rose-600" />
          </div>
          <h3 className="text-sm font-bold text-foreground">این گفتگو مسدود شده است</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
            امکان ارسال یا دریافت پیام در این گفتگو وجود ندارد.
          </p>
          <button
            type="button"
            onClick={() => setView("messenger")}
            className="mt-4 inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-lg shadow active:scale-95 transition-transform"
          >
            بازگشت به پیامرسان
          </button>
        </main>
      </>
    );
  }



  return (
    <>
      <Header
        otherUser={otherUser}
        onBack={() => setView("messenger")}
        onMenu={() => setMenuOpen((v) => !v)}
        menuOpen={menuOpen}
      />

      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30 px-3 py-3"
      >
        {/* جداکننده‌های روز و پیام‌ها */}
        {grouped.map((group, gi) => (
          <div key={gi} className="mb-2">
            <div className="sticky top-0 z-10 flex justify-center mb-2">
              <span className="text-[10px] font-bold text-muted-foreground bg-card border border-border/60 rounded-full px-3 py-1 shadow-sm">
                {group.dayLabel}
              </span>
            </div>
            <div className="space-y-1.5">
              {group.items.map((m) => (
                <MessageBubble key={m.id} message={m} otherUser={otherUser} />
              ))}
            </div>
          </div>
        ))}

        {/* اعلان خطا */}
        {error && (
          <div className="fixed inset-x-0 top-16 z-40 mx-auto max-w-[90%] bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-[11px] text-rose-700 flex items-center gap-1.5 shadow-md">
            <AlertTriangle className="size-4 shrink-0" />
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="mr-auto shrink-0"
              aria-label="بستن"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* هشدار لینک */}
      {linkWarning && (
        <div className="fixed inset-x-0 bottom-24 z-40 mx-auto max-w-[90%] bg-rose-600 text-white rounded-xl px-3 py-2 text-[11px] text-center shadow-md">
          ارسال لینک مجاز نیست
        </div>
      )}
      {imageTooLarge && (
        <div className="fixed inset-x-0 bottom-24 z-40 mx-auto max-w-[90%] bg-amber-500 text-white rounded-xl px-3 py-2 text-[11px] text-center shadow-md">
          حجم تصویر نباید بیش از ۱ مگابایت باشد
        </div>
      )}

      {/* ناحیه ورودی */}
      {emojiOpen && (
        <div className="border-t border-border/60 bg-card px-2 py-2">
          <div className="grid grid-cols-10 gap-1 max-h-40 overflow-y-auto thin-scrollbar">
            {EMOJIS.map((e, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInput((v) => v + e)}
                className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-xl active:scale-95 transition-transform"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card border-t border-border/70 px-2 py-2 flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePickImage}
        />
        <button
          type="button"
          onClick={() => setEmojiOpen((v) => !v)}
          aria-label="ایموجی"
          className="size-10 rounded-full text-muted-foreground hover:bg-muted flex items-center justify-center shrink-0 transition-colors"
        >
          <Smile className="size-6" />
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="ارسال تصویر"
          disabled={sending}
          className="size-10 rounded-full text-muted-foreground hover:bg-muted flex items-center justify-center shrink-0 transition-colors disabled:opacity-50"
        >
          <ImageIcon className="size-6" />
        </button>
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="پیام خود را بنویسید…"
          className="flex-1 resize-none bg-background border border-border rounded-2xl px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all max-h-32"
        />
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!input.trim() || sending}
          aria-label="ارسال"
          className={cn(
            "size-10 rounded-full flex items-center justify-center shrink-0 transition-all",
            input.trim() && !sending
              ? "bg-primary text-primary-foreground active:scale-95 shadow"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {sending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Send className="size-5" />
          )}
        </button>
      </div>

      {/* منوی کشویی (سه نقطه) */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute top-14 left-3 w-48 bg-card border border-border/70 rounded-xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setConfirmBlock(true);
              }}
              className="w-full text-right px-3 py-2.5 text-xs hover:bg-muted flex items-center gap-2 text-foreground border-b border-border/60"
            >
              <Ban className="size-4 text-rose-600" />
              بلاک کاربر
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setReportOpen(true);
              }}
              className="w-full text-right px-3 py-2.5 text-xs hover:bg-muted flex items-center gap-2 text-foreground border-b border-border/60"
            >
              <Flag className="size-4 text-amber-600" />
              ریپورت
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setConfirmDelete(true);
              }}
              className="w-full text-right px-3 py-2.5 text-xs hover:bg-muted flex items-center gap-2 text-rose-700"
            >
              <Trash2 className="size-4" />
              حذف گفتگو
            </button>
          </div>
        </div>
      )}

      {/* مدال بلاک */}
      {confirmBlock && (
        <Modal onClose={() => setConfirmBlock(false)}>
          <div className="text-center">
            <div className="size-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3">
              <Ban className="size-6 text-rose-600" />
            </div>
            <h3 className="text-sm font-bold text-foreground">بلاک کردن کاربر</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              آیا از بلاک کردن {otherUser?.name || otherUser?.phone} مطمئن هستید؟ پس از بلاک، امکان ارتباط قطع می‌شود.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmBlock(false)}
                className="flex-1 py-2 rounded-lg bg-muted text-foreground text-xs font-bold"
              >
                انصراف
              </button>
              <button
                type="button"
                disabled={submittingAction}
                onClick={handleBlock}
                className="flex-1 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold disabled:opacity-50"
              >
                {submittingAction ? "در حال بلاک…" : "بلاک کن"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* مدال ریپورت */}
      {reportOpen && (
        <Modal onClose={() => setReportOpen(false)}>
          <div>
            <div className="text-center mb-3">
              <div className="size-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                <Flag className="size-6 text-amber-600" />
              </div>
              <h3 className="text-sm font-bold text-foreground">ریپورت کاربر</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                لطفاً دلیل ریپورت را انتخاب کنید.
              </p>
            </div>
            <div className="space-y-1.5">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r.value}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors",
                    reportReason === r.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted"
                  )}
                >
                  <input
                    type="radio"
                    name="report-reason"
                    value={r.value}
                    checked={reportReason === r.value}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="size-4 accent-primary"
                  />
                  <span className="text-xs text-foreground">{r.label}</span>
                </label>
              ))}
            </div>
            <textarea
              rows={3}
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="توضیحات (اختیاری)"
              className="mt-2 w-full resize-none bg-background border border-border rounded-lg px-3 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                className="flex-1 py-2 rounded-lg bg-muted text-foreground text-xs font-bold"
              >
                انصراف
              </button>
              <button
                type="button"
                disabled={submittingAction}
                onClick={handleReport}
                className="flex-1 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold disabled:opacity-50"
              >
                {submittingAction ? "در حال ثبت…" : "ثبت ریپورت"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* مدال حذف */}
      {confirmDelete && (
        <Modal onClose={() => setConfirmDelete(false)}>
          <div className="text-center">
            <div className="size-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="size-6 text-rose-600" />
            </div>
            <h3 className="text-sm font-bold text-foreground">حذف گفتگو</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              آیا از حذف این گفتگو مطمئن هستید؟ این عمل قابل بازگشت نیست.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2 rounded-lg bg-muted text-foreground text-xs font-bold"
              >
                انصراف
              </button>
              <button
                type="button"
                disabled={submittingAction}
                onClick={handleDelete}
                className="flex-1 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold disabled:opacity-50"
              >
                {submittingAction ? "در حال حذف…" : "حذف کن"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// هدر گفتگو
function Header({
  otherUser,
  onBack,
  onMenu,
  menuOpen,
}: {
  otherUser: OtherUser | null;
  onBack: () => void;
  onMenu: () => void;
  menuOpen: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-b from-primary to-primary/95 text-primary-foreground shadow-lg">
      <div className="px-3 pt-3 pb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="بازگشت"
          className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15"
        >
          <ChevronRight className="size-5" />
        </button>
        <div className="size-9 rounded-full flex items-center justify-center text-white font-bold shrink-0"
          style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
        >
          {otherUser ? initials(otherUser.name, otherUser.phone) : "?"}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold truncate">
            {otherUser?.name || (otherUser ? `کاربر ${otherUser.phone.slice(-4)}` : "گفتگو")}
          </h1>
          <p className="text-[10px] text-white/80 tabular-nums" dir="ltr">
            {otherUser?.phone}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMenu();
          }}
          aria-label="منو"
          aria-expanded={menuOpen}
          className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15"
        >
          <MoreVertical className="size-5" />
        </button>
      </div>
    </header>
  );
}

// حباب پیام
function MessageBubble({
  message,
  otherUser,
}: {
  message: Message;
  otherUser: OtherUser | null;
}) {
  // اگر currentUserId برابر senderId نباشد، یعنی پیام دریافتی است
  // ما باید بدانیم که این پیام از طرف ماست یا از طرف مقابل
  // برای این کار، از یک flag استفاده می‌کنیم: پیام ارسالی = senderId برابر کاربر فعلی
  // اما چون currentUserId را در اینجا نداریم، آن را از طریق تبدیل reverse محاسبه می‌کنیم.
  // در واقع ما در fetchConversation یک currentUserId دریافت کرده‌ایم؛ اما اینجا صرفاً برای تصمیم‌گیری side کافیست.
  // برای ساده‌سازی، side را با useNav نمی‌توان گرفت. به جای آن، currentUserId را از طریق comparison با otherUser.id می‌سنجیم.
  const isMine = otherUser ? message.senderId !== otherUser.id : false;

  return (
    <div className={cn("flex flex-col", isMine ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3 py-2 shadow-sm",
          isMine
            ? "bg-primary text-primary-foreground rounded-bl-md"
            : "bg-card text-foreground border border-border/60 rounded-br-md",
          message.isReported && "ring-2 ring-rose-300"
        )}
      >
        {message.messageType === "image" ? (
          <img
            src={message.content}
            alt="تصویر ارسالی"
            className="max-w-full max-h-64 rounded-lg object-cover"
          />
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 mt-0.5 px-1">
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {formatClockTime(message.createdAt)}
        </span>
        {isMine && (
          message.isRead ? (
            <CheckCheck className="size-3 text-sky-500" />
          ) : (
            <Check className="size-3 text-muted-foreground" />
          )
        )}
      </div>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-card rounded-2xl shadow-2xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// نسخهٔ سمت کلاینت برای تشخیص لینک — منطق باید با نسخهٔ سرور (containsUrl) یکسان باشد.
function containsUrlClient(text: string): boolean {
  if (!text) return false;
  const re =
    /(https?:\/\/|www\.|[a-z0-9-]+\.(com|ir|org|net|info|edu|gov|biz|io|co|me|tv|cc|pk|uk|us|ca|au|de|fr|it|es|nl|ru|br|in|jp|cn)\b)/i;
  return re.test(text);
}
