"use client";

import { useCallback, useEffect, useState } from "react";
import { useNav } from "@/lib/nav-store";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Copy,
  Check,
  Loader2,
  Send,
  Info,
  MessageSquarePlus,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

type Result =
  | { kind: "pending"; message?: string }
  | { kind: "accepted"; conversationId: string }
  | { kind: "error"; message: string };

export function NewChatPage() {
  const setView = useNav((s) => s.setView);
  const openChat = useNav((s) => s.openChat);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);

  const [chatId, setChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setView("auth");
    }
  }, [isAuthenticated, setView]);

  const fetchMyChatId = useCallback(async () => {
    try {
      const res = await fetch("/api/user/chat/me");
      if (res.ok) {
        const data = await res.json();
        setChatId(data.chatId);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyChatId();
    }
  }, [isAuthenticated, fetchMyChatId]);

  const handleCopy = async () => {
    if (!chatId) return;
    try {
      await navigator.clipboard.writeText(chatId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const normalized = input.trim().toLowerCase();
  const inputValid = normalized.startsWith("qd-") && normalized.length >= 5;

  const handleSubmit = async () => {
    if (!inputValid || submitting) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/user/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: normalized }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ kind: "error", message: data.error || "خطا در ارسال درخواست" });
        return;
      }
      if (data.status === "accepted") {
        setResult({ kind: "accepted", conversationId: data.conversationId });
        // پس از مدت کوتاهی به گفتگو برو
        setTimeout(() => openChat(data.conversationId), 900);
      } else if (data.status === "pending") {
        setResult({
          kind: "pending",
          message: data.message || "درخواست چت ارسال شد. منتظر تأیید طرف مقابل بمانید.",
        });
      } else if (data.status === "deleted") {
        setResult({
          kind: "error",
          message: data.message || "این گفتگو قبلاً حذف شده است",
        });
      } else if (data.status === "blocked") {
        setResult({ kind: "error", message: "امکان ارتباط با این کاربر وجود ندارد" });
      } else {
        setResult({
          kind: "error",
          message: data.error || "وضعیت ناشناخته",
        });
      }
    } catch {
      setResult({ kind: "error", message: "ارتباط با سرور برقرار نشد" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-gradient-to-b from-primary to-primary/95 text-primary-foreground shadow-lg">
        <div className="px-4 pt-3 pb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView("messenger")}
            aria-label="بازگشت"
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold">چت جدید</h1>
            <p className="text-[11px] text-white/80">
              یک شناسه چت وارد کنید
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30 px-4 py-5">
        {/* کارت شناسه خود کاربر */}
        <section className="rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 text-white p-4 shadow-md">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold">شناسه چت شما</h2>
              <p className="text-[11px] text-white/85 mt-0.5 leading-relaxed">
                این شناسه را با دوستان به اشتراک بگذارید تا بتوانند با شما چت کنند.
              </p>
            </div>
          </div>
          {chatId ? (
            <button
              type="button"
              onClick={handleCopy}
              className="mt-3 w-full bg-white/15 hover:bg-white/25 rounded-xl px-3 py-2.5 backdrop-blur-sm transition-colors flex items-center justify-between"
            >
              <span dir="ltr" className="text-sm font-bold tabular-nums">
                {chatId}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold">
                {copied ? (
                  <>
                    <Check className="size-4" />
                    کپی شد
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    کپی
                  </>
                )}
              </span>
            </button>
          ) : (
            <div className="mt-3 w-full bg-white/15 rounded-xl px-3 py-2.5 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin" />
              <span className="text-xs mr-2">در حال تولید شناسه…</span>
            </div>
          )}
        </section>

        {/* فرم ورود شناسه طرف مقابل */}
        <section className="mt-4 bg-card border border-border/70 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <MessageSquarePlus className="size-4 text-primary" />
            شروع گفتگو با کاربر دیگر
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
            شناسه چت دوست خود را (مثلاً <span dir="ltr" className="font-mono">qd-abc123</span>) وارد کنید تا درخواست چت ارسال شود.
          </p>

          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="relative">
              <input
                type="text"
                dir="ltr"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="qd-xxxxxx"
                spellCheck={false}
                autoCapitalize="none"
                className={cn(
                  "w-full bg-background border rounded-xl px-4 py-3 text-sm outline-none transition-all text-center font-bold tracking-wider",
                  result?.kind === "error"
                    ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    : inputValid
                    ? "border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                )}
                autoFocus
              />
            </div>

            {result?.kind === "error" && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-[11px] text-rose-700 flex items-start gap-1.5">
                <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                <span>{result.message}</span>
              </div>
            )}

            {result?.kind === "pending" && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-[11px] text-emerald-700 flex items-start gap-1.5">
                <ShieldCheck className="size-4 shrink-0 mt-0.5" />
                <span>{result.message}</span>
              </div>
            )}

            {result?.kind === "accepted" && (
              <div className="bg-sky-50 border border-sky-200 rounded-xl px-3 py-2 text-[11px] text-sky-700 flex items-start gap-1.5">
                <Check className="size-4 shrink-0 mt-0.5" />
                <span>گفتگو از قبل فعال است. در حال باز کردن…</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!inputValid || submitting}
              className={cn(
                "w-full font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm",
                inputValid && !submitting
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
                  <Send className="size-4" />
                  ارسال درخواست چت
                </>
              )}
            </button>
          </form>
        </section>

        {/* نکات */}
        <section className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-3">
          <div className="flex items-start gap-2">
            <Info className="size-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-800 leading-relaxed">
              <p className="font-bold">نکات مهم:</p>
              <ul className="mt-1 space-y-1 list-disc pr-4">
                <li>ارسال لینک در پیام‌ها مجاز نیست.</li>
                <li>پیام‌ها به‌صورت رمزنگاری‌شده ذخیره می‌شوند.</li>
                <li>در صورت بلاک بودن، امکان گفتگو وجود ندارد.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
