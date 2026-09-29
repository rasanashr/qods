"use client";

import { useCallback, useEffect, useState } from "react";
import { useNav } from "@/lib/nav-store";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Copy,
  Check,
  MessageSquarePlus,
  Loader2,
  Inbox,
  UserCheck,
  X,
  Bell,
} from "lucide-react";

type Conversation = {
  id: string;
  status: string;
  lastMessageContent: string;
  lastMessageSenderId: string | null;
  lastMessageAt: string;
  unreadCount: number;
  otherUser: {
    id: string;
    name: string | null;
    phone: string;
    chatId: string | null;
  };
};

type ChatRequest = {
  id: string;
  createdAt: string;
  requester: {
    id: string;
    name: string | null;
    phone: string;
    chatId: string | null;
  };
};

type Tab = "chats" | "requests";

// رنگ آواتار بر اساس آخرین حرف شماره تلفن
function avatarColor(seed: string): string {
  const colors = [
    "bg-teal-500",
    "bg-emerald-500",
    "bg-sky-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-lime-500",
  ];
  const idx = (seed.replace(/\D/g, "").slice(-1) || "0") as string;
  return colors[parseInt(idx) % colors.length] || colors[0];
}

function formatTimeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const min = Math.floor(diff / 60000);
  if (min < 1) return "اکنون";
  if (min < 60) return `${min.toLocaleString("fa-IR")} دقیقه`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr.toLocaleString("fa-IR")} ساعت`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days.toLocaleString("fa-IR")} روز`;
  return new Date(iso).toLocaleDateString("fa-IR");
}

function initials(name: string | null, phone: string): string {
  if (name && name.trim()) return name.trim().charAt(0).toUpperCase();
  return phone.slice(-2);
}

export function MessengerPage() {
  const setView = useNav((s) => s.setView);
  const openChat = useNav((s) => s.openChat);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);

  const [tab, setTab] = useState<Tab>("chats");
  const [chatId, setChatId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [requests, setRequests] = useState<ChatRequest[]>([]);
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingReq, setLoadingReq] = useState(false);

  // هدایت به صفحه ورود اگر لاگین نیست
  useEffect(() => {
    if (!isAuthenticated) {
      setView("auth");
    }
  }, [isAuthenticated, setView]);

  // دریافت chatId خود کاربر
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

  // دریافت گفتگوها
  const fetchConversations = useCallback(async () => {
    setLoadingConv(true);
    try {
      const res = await fetch("/api/user/chat/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.items || []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingConv(false);
    }
  }, []);

  // دریافت درخواست‌ها
  const fetchRequests = useCallback(async () => {
    setLoadingReq(true);
    try {
      const res = await fetch("/api/user/chat/requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.items || []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingReq(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyChatId();
      fetchConversations();
    }
  }, [isAuthenticated, fetchMyChatId, fetchConversations]);

  useEffect(() => {
    if (isAuthenticated && tab === "requests") {
      fetchRequests();
    }
  }, [isAuthenticated, tab, fetchRequests]);

  const handleCopyChatId = async () => {
    if (!chatId) return;
    try {
      await navigator.clipboard.writeText(chatId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const handleAccept = async (id: string) => {
    try {
      const res = await fetch(`/api/user/chat/${id}/accept`, { method: "POST" });
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        fetchConversations();
      }
    } catch {
      // ignore
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/user/chat/${id}/reject`, { method: "POST" });
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {
      // ignore
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-gradient-to-b from-primary to-primary/95 text-primary-foreground shadow-lg">
        <div className="px-4 pt-3 pb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView("home")}
            aria-label="بازگشت به خانه"
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold">پیامرسان</h1>
            <p className="text-[11px] text-white/80">
              گفتگوهای امن و رمزنگاری‌شده
            </p>
          </div>
          <button
            type="button"
            onClick={() => setView("new-chat")}
            aria-label="چت جدید"
            className="size-9 rounded-full bg-white text-primary hover:bg-white/90 transition-colors flex items-center justify-center shadow"
          >
            <MessageSquarePlus className="size-5" strokeWidth={2.4} />
          </button>
        </div>

        {/* نمایش شناسه چت کاربر با دکمه کپی */}
        {chatId && (
          <div className="px-4 pb-3">
            <button
              type="button"
              onClick={handleCopyChatId}
              className="w-full bg-white/95 rounded-xl px-3 py-2.5 shadow-sm flex items-center justify-between gap-2 active:scale-[0.99] transition-transform"
            >
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-muted-foreground">شناسه چت شما</span>
                <span dir="ltr" className="text-sm font-bold text-foreground tabular-nums">
                  {chatId}
                </span>
              </div>
              <span
                className={cn(
                  "size-8 rounded-full flex items-center justify-center",
                  copied ? "bg-emerald-100 text-emerald-700" : "bg-primary/10 text-primary"
                )}
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </span>
            </button>
          </div>
        )}

        {/* تب‌ها */}
        <div className="flex px-4 gap-1">
          <TabButton active={tab === "chats"} onClick={() => setTab("chats")}>
            چت‌ها
            {conversations.some((c) => c.unreadCount > 0) && (
              <span className="mr-1 size-1.5 rounded-full bg-rose-400" />
            )}
          </TabButton>
          <TabButton active={tab === "requests"} onClick={() => setTab("requests")}>
            درخواست‌ها
            {requests.length > 0 && (
              <span className="mr-1 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {requests.length.toLocaleString("fa-IR")}
              </span>
            )}
          </TabButton>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30 pb-4">
        {tab === "chats" ? (
          <ChatsList
            conversations={conversations}
            loading={loadingConv}
            onOpen={(id) => openChat(id)}
            onStartNew={() => setView("new-chat")}
          />
        ) : (
          <RequestsList
            requests={requests}
            loading={loadingReq}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        )}
      </main>
    </>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 py-2 text-sm font-bold rounded-t-lg transition-all flex items-center justify-center gap-1.5",
        active
          ? "bg-background text-primary border-b-2 border-primary"
          : "text-white/70 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

function Avatar({ name, phone, size = "size-12" }: { name: string | null; phone: string; size?: string }) {
  const color = avatarColor(phone);
  return (
    <div
      className={cn(
        size,
        "rounded-full flex items-center justify-center text-white font-bold shrink-0",
        color
      )}
    >
      {initials(name, phone)}
    </div>
  );
}

function ChatsList({
  conversations,
  loading,
  onOpen,
  onStartNew,
}: {
  conversations: Conversation[];
  loading: boolean;
  onOpen: (id: string) => void;
  onStartNew: () => void;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="size-8 animate-spin mb-2" />
        <p className="text-sm">در حال بارگذاری گفتگوها…</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <Inbox className="size-10 text-primary" strokeWidth={1.5} />
        </div>
        <h3 className="text-sm font-bold text-foreground">هنوز گفتگویی ندارید</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
          با وارد کردن شناسه چت یک دوست، گفتگوی جدید را آغاز کنید.
        </p>
        <button
          type="button"
          onClick={onStartNew}
          className="mt-4 inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-lg shadow active:scale-95 transition-transform"
        >
          <MessageSquarePlus className="size-4" />
          شروع چت جدید
        </button>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border/60 bg-card">
      {conversations.map((c) => (
        <li key={c.id}>
          <button
            type="button"
            onClick={() => onOpen(c.id)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/60 active:bg-muted transition-colors text-right"
          >
            <Avatar name={c.otherUser.name} phone={c.otherUser.phone} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-foreground truncate">
                  {c.otherUser.name || `کاربر ${c.otherUser.phone.slice(-4)}`}
                </h3>
                <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
                  {formatTimeAgo(c.lastMessageAt)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {c.lastMessageContent || (
                  <span className="italic">بدون پیام</span>
                )}
              </p>
            </div>
            {c.unreadCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shrink-0">
                {c.unreadCount.toLocaleString("fa-IR")}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}

function RequestsList({
  requests,
  loading,
  onAccept,
  onReject,
}: {
  requests: ChatRequest[];
  loading: boolean;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="size-8 animate-spin mb-2" />
        <p className="text-sm">در حال بارگذاری درخواست‌ها…</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="size-20 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
          <Bell className="size-10 text-emerald-600" strokeWidth={1.5} />
        </div>
        <h3 className="text-sm font-bold text-foreground">درخواستی ندارید</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
          وقتی کسی درخواست چت بفرستد، اینجا نمایش داده می‌شود.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border/60 bg-card">
      {requests.map((r) => (
        <li key={r.id} className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar name={r.requester.name} phone={r.requester.phone} />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground truncate">
                {r.requester.name || `کاربر ${r.requester.phone.slice(-4)}`}
              </h3>
              <p className="text-[11px] text-muted-foreground tabular-nums" dir="ltr">
                {r.requester.phone}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onAccept(r.id)}
                aria-label="پذیرفتن درخواست"
                className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-[11px] font-bold px-2.5 py-1.5 rounded-lg active:scale-95 transition-transform"
              >
                <UserCheck className="size-3.5" />
                پذیرفتن
              </button>
              <button
                type="button"
                onClick={() => onReject(r.id)}
                aria-label="رد درخواست"
                className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold px-2.5 py-1.5 rounded-lg active:scale-95 transition-transform"
              >
                <X className="size-3.5" />
                رد
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
