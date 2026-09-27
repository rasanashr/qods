"use client";

import { useEffect, useState, useCallback } from "react";
import { useNav } from "@/lib/nav-store";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Phone,
  Wallet,
  ChevronLeft,
  LogOut,
  Edit3,
  Check,
  X,
  Package,
  Search,
  AlertCircle,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ListChecks,
  ShoppingBag,
  Phone as PhoneIcon,
  User as UserIcon,
  History,
} from "lucide-react";

type Tab = "overview" | "wallet" | "classifieds" | "lostfound" | "sama137" | "orders" | "visits";

type UserInfo = {
  id: string;
  phone: string;
  name: string | null;
  joinedAt: string;
};

type UserStats = {
  classifieds: number;
  pendingClassifieds: number;
  lostFound: number;
  pendingLostFound: number;
  sama137: number;
  pendingSama: number;
  orders: number;
  walletBalance: number;
};

type Visit = {
  id: string;
  path: string;
  title: string | null;
  visitedAt: string;
};

type WalletTx = {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string | null;
  reference: string | null;
  status: string;
  createdAt: string;
};

type Classified = {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  emoji: string;
  description: string;
  price: string;
  location: string;
  status: string;
  plan: string;
  isPaid: boolean;
  paidAmount: number;
  createdAt: string;
};

type LostFoundItem = {
  id: string;
  title: string;
  status: string;
  categoryLabel: string;
  emoji: string;
  description: string;
  location: string;
  status_admin: string;
  createdAt: string;
};

type Sama137Request = {
  id: string;
  trackingCode: string;
  title: string;
  status: string;
  statusLabel: string;
  priority: string;
  priorityLabel: string;
  createdAt: string;
  description: string;
  address: string;
};

type Order = {
  id: string;
  type: string;
  status: string;
  totalAmount: number;
  address: string | null;
  notes: string | null;
  createdAt: string;
  items?: Array<{
    id: string;
    quantity: number;
    price: number;
    product: { id: string; name: string; emoji: string; brand: string };
  }>;
  restaurant?: { id: string; name: string; categoryEmoji: string } | null;
};

export function ProfilePage() {
  const setView = useNav((s) => s.setView);
  const { user, logout, updateProfile } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [confirmLogout, setConfirmLogout] = useState(false);

  // stateهای داده‌ها
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOverview = useCallback(async () => {
    try {
      const res = await fetch("/api/user/me");
      const data = await res.json();
      if (res.ok && data.user) {
        setUserInfo(data.user);
        setStats(data.stats);
        setRecentVisits(data.recentVisits || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  // وقتی user از persist بارگذاری شد
  useEffect(() => {
    if (user && !editing) {
      const t = setTimeout(() => setNameInput(user.name), 0);
      return () => clearTimeout(t);
    }
  }, [user, editing]);

  useEffect(() => {
    if (!user) {
      const t = setTimeout(() => setView("auth"), 0);
      return () => clearTimeout(t);
    }
  }, [user, setView]);

  if (!user) return null;

  const handleSaveName = async () => {
    try {
      const res = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput }),
      });
      if (res.ok) {
        updateProfile(nameInput);
        setEditing(false);
        // reload overview
        loadOverview();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/user/auth", { method: "DELETE" });
    } catch {}
    logout();
    setView("home");
  };

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: "overview", label: "خلاصه", emoji: "📊" },
    { id: "wallet", label: "کیف پول", emoji: "💳" },
    { id: "classifieds", label: "آگهی‌های من", emoji: "📋" },
    { id: "lostfound", label: "اشیاء گمشده", emoji: "🔍" },
    { id: "sama137", label: "سامانه ۱۳۷", emoji: "📞" },
    { id: "orders", label: "سفارش‌ها", emoji: "🛍️" },
    { id: "visits", label: "بازدیدها", emoji: "👁️" },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-gradient-to-b from-primary to-primary/95 text-primary-foreground shadow-lg">
        <div className="px-4 pt-3 pb-2 flex items-center gap-3">
          <button onClick={() => setView("home")} aria-label="بازگشت" className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15">
            <ChevronRight className="size-5" />
          </button>
          <h1 className="text-base font-bold flex-1">پروفایل کاربر</h1>
          <button onClick={handleLogout} className="lg:hidden size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15" aria-label="خروج">
            <LogOut className="size-4.5" />
          </button>
        </div>
        {/* تب‌های افقی */}
        <div className="px-2 pb-1 overflow-x-auto no-scrollbar">
          <div className="flex gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-t-lg text-xs font-bold transition-all",
                  tab === t.id ? "bg-background text-primary" : "text-white/80 hover:text-white"
                )}
              >
                <span>{t.emoji}</span>
                {t.label}
                {t.id === "classifieds" && stats && stats.pendingClassifieds > 0 && (
                  <span className="bg-amber-400 text-amber-900 text-[10px] px-1 rounded-full">
                    {stats.pendingClassifieds.toLocaleString("fa-IR")}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30 pb-2">
        {tab === "overview" && (
          <OverviewTab
            user={user}
            userInfo={userInfo}
            stats={stats}
            recentVisits={recentVisits}
            loading={loading}
            editing={editing}
            setEditing={setEditing}
            nameInput={nameInput}
            setNameInput={setNameInput}
            onSaveName={handleSaveName}
            setView={setView}
            onLogout={handleLogout}
            confirmLogout={confirmLogout}
            setConfirmLogout={setConfirmLogout}
          />
        )}
        {tab === "wallet" && <WalletTab setView={setView} />}
        {tab === "classifieds" && <ClassifiedsTab />}
        {tab === "lostfound" && <LostFoundTab setView={setView} />}
        {tab === "sama137" && <SamaTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "visits" && <VisitsTab />}

        <footer className="px-4 py-6 text-center">
          <div className="text-[11px] text-muted-foreground">شبکه قدس © ۱۴۰۴</div>
          <div className="text-[10px] text-muted-foreground/70 mt-0.5">ارائه شده توسط رسا نشر</div>
        </footer>
      </main>
    </>
  );
}

// ============================
// تب خلاصه (overview)
// ============================
function OverviewTab({
  user, userInfo, stats, recentVisits, loading,
  editing, setEditing, nameInput, setNameInput, onSaveName,
  setView, onLogout, confirmLogout, setConfirmLogout,
}: {
  user: { phone: string; name: string; joinedAt: string };
  userInfo: UserInfo | null;
  stats: UserStats | null;
  recentVisits: Visit[];
  loading: boolean;
  editing: boolean;
  setEditing: (v: boolean) => void;
  nameInput: string;
  setNameInput: (v: string) => void;
  onSaveName: () => void;
  setView: (v: "home" | "auth" | "profile") => void;
  onLogout: () => void;
  confirmLogout: boolean;
  setConfirmLogout: (v: boolean) => void;
}) {
  if (loading) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        در حال بارگذاری…
      </div>
    );
  }
  const balance = stats?.walletBalance ?? 0;

  return (
    <div className="space-y-4 p-4">
      {/* کارت پروفایل */}
      <div className="rounded-2xl bg-card border border-border/70 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4">
          <div className="flex items-center gap-3">
            <div className="size-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold shrink-0 shadow">
              {(user.name || user.phone).charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="flex-1 bg-card border border-primary rounded-lg px-2 py-1 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    autoFocus
                  />
                  <button onClick={onSaveName} aria-label="ذخیره" className="size-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow">
                    <Check className="size-4" />
                  </button>
                  <button onClick={() => setEditing(false)} aria-label="لغو" className="size-7 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground truncate">{user.name || "بدون نام"}</h2>
                  <button onClick={() => setEditing(true)} aria-label="ویرایش نام" className="text-muted-foreground hover:text-primary transition-colors">
                    <Edit3 className="size-3.5" />
                  </button>
                </div>
              )}
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Phone className="size-3" />
                <span dir="ltr" className="tabular-nums">{user.phone}</span>
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">
                عضویت از {user.joinedAt}
              </div>
            </div>
          </div>
        </div>
        {stats && (
          <div className="grid grid-cols-3 divide-x divide-x-reverse divide-border/60 border-t border-border/60">
            <OverviewStat value={stats.classifieds.toLocaleString("fa-IR")} label="آگهی" />
            <OverviewStat value={stats.sama137.toLocaleString("fa-IR")} label="درخواست ۱۳۷" />
            <OverviewStat value={stats.orders.toLocaleString("fa-IR")} label="سفارش" />
          </div>
        )}
      </div>

      {/* کیف پول */}
      <button onClick={() => setView("profile")} className="w-full text-right">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 text-white p-4 shadow-md">
          <div className="pointer-events-none absolute -top-6 -left-6 size-24 rounded-full bg-white/10 blur-lg" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-[10px] text-white/85">موجودی کیف پول</div>
              <div className="text-xl font-extrabold tabular-nums mt-0.5">
                {balance.toLocaleString("fa-IR")} تومان
              </div>
              <div className="mt-2 inline-flex items-center gap-1 bg-white text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-lg shadow">
                <Plus className="size-3" />
                شارژ کیف پول
              </div>
            </div>
            <Wallet className="size-12 text-white/30" strokeWidth={1.5} />
          </div>
        </div>
      </button>

      {/* موارد در انتظار */}
      {stats && (stats.pendingClassifieds > 0 || stats.pendingSama > 0 || stats.pendingLostFound > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
          <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-bold text-amber-900">آگهی/درخواست در انتظار تأیید</div>
            <div className="text-amber-800 mt-0.5 text-xs space-y-0.5">
              {stats.pendingClassifieds > 0 && (
                <div>• آگهی: {stats.pendingClassifieds.toLocaleString("fa-IR")} مورد</div>
              )}
              {stats.pendingLostFound > 0 && (
                <div>• اشیاء گمشده: {stats.pendingLostFound.toLocaleString("fa-IR")} مورد</div>
              )}
              {stats.pendingSama > 0 && (
                <div>• درخواست ۱۳۷: {stats.pendingSama.toLocaleString("fa-IR")} مورد</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* آخرین بازدیدها */}
      {recentVisits.length > 0 && (
        <div className="bg-card border border-border/70 rounded-xl shadow-sm overflow-hidden">
          <div className="px-3 py-2 border-b border-border/60">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <History className="size-4 text-primary" />
              آخرین بازدیدها
            </h3>
          </div>
          <div className="divide-y divide-border/40">
            {recentVisits.slice(0, 5).map((v) => (
              <div key={v.id} className="px-3 py-2 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{v.title || v.path}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {new Date(v.visitedAt).toLocaleString("fa-IR")}
                  </div>
                </div>
                <ChevronLeft className="size-4 text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* خروج */}
      {!confirmLogout ? (
        <button
          onClick={() => setConfirmLogout(true)}
          className="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 font-bold py-3 rounded-xl border border-rose-200 active:scale-[0.98] transition-transform"
        >
          <LogOut className="size-5" />
          خروج از حساب کاربری
        </button>
      ) : (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
          <p className="text-xs font-bold text-rose-900 text-center mb-2">
            آیا از خروج اطمینان دارید؟
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onLogout} className="bg-rose-500 text-white text-xs font-bold py-2 rounded-lg">
              بله، خارج می‌شوم
            </button>
            <button onClick={() => setConfirmLogout(false)} className="bg-card text-foreground text-xs font-bold py-2 rounded-lg border border-border">
              انصراف
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="py-3 text-center">
      <div className="text-base font-extrabold text-foreground tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

// ============================
// تب کیف پول
// ============================
function WalletTab({ setView }: { setView: (v: "home" | "auth" | "profile") => void }) {
  const [balance, setBalance] = useState(0);
  const [txs, setTxs] = useState<WalletTx[]>([]);
  const [loading, setLoading] = useState(true);
  const [charging, setCharging] = useState(false);
  const [chargeAmount, setChargeAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/user/wallet");
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance || 0);
        setTxs(data.transactions || []);
      }
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCharge = async () => {
    const amount = parseInt(chargeAmount.replace(/[^\d]/g, ""));
    if (!amount || amount < 1000) {
      setError("حداقل مبلغ ۱٬۰۰۰ تومان است");
      return;
    }
    setCharging(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/user/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, method: "sandbox" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setBalance(data.newBalance);
      setSuccess(true);
      setChargeAmount("");
      setTimeout(() => setSuccess(false), 3000);
      load(); // refresh txs
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally { setCharging(false); }
  };

  if (loading) return <div className="p-4 text-center text-sm text-muted-foreground">در حال بارگذاری…</div>;

  return (
    <div className="p-4 space-y-4">
      {/* موجودی */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 text-white p-5 shadow-md">
        <div className="pointer-events-none absolute -top-6 -left-6 size-24 rounded-full bg-white/10 blur-lg" />
        <div className="relative">
          <div className="text-[11px] text-white/85">موجودی فعلی</div>
          <div className="text-3xl font-extrabold tabular-nums mt-1">
            {balance.toLocaleString("fa-IR")}
          </div>
          <div className="text-sm mt-0.5 text-white/80">تومان</div>
        </div>
      </div>

      {/* شارژ */}
      <div className="bg-card border border-border/70 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5">
          <Plus className="size-4 text-primary" />
          شارژ کیف پول
        </h3>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[50000, 100000, 200000, 500000].map((amt) => (
            <button
              key={amt}
              onClick={() => setChargeAmount(String(amt))}
              className="text-xs font-bold bg-muted hover:bg-primary/10 transition-colors rounded-lg py-2 tabular-nums"
            >
              {amt.toLocaleString("fa-IR")} ت
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            dir="ltr"
            value={chargeAmount}
            onChange={(e) => setChargeAmount(e.target.value)}
            placeholder="مبلغ به تومان"
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 tabular-nums"
          />
          <button
            onClick={handleCharge}
            disabled={charging || !chargeAmount}
            className={cn(
              "inline-flex items-center gap-1 font-bold rounded-lg px-4 py-2 text-sm transition-all",
              charging || !chargeAmount ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground active:scale-95"
            )}
          >
            {charging ? <RefreshCw className="size-4 animate-spin" /> : <Wallet className="size-4" />}
            شارژ
          </button>
        </div>
        {error && <div className="mt-2 text-xs text-rose-600">{error}</div>}
        {success && (
          <div className="mt-2 text-xs text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="size-4" />
            کیف پول با موفقیت شارژ شد!
          </div>
        )}
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2">
          <p className="text-[10px] text-amber-800">
            💡 در محیط سندباکس، شارژ مستقیم انجام می‌شود. در محیط تولید به درگاه پرداخت متصل می‌شود.
          </p>
        </div>
      </div>

      {/* تراکنش‌ها */}
      <div className="bg-card border border-border/70 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-3 py-2 border-b border-border/60">
          <h3 className="text-sm font-bold">تراکنش‌های اخیر</h3>
        </div>
        {txs.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            هنوز تراکنشی ثبت نشده است
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {txs.map((tx) => (
              <div key={tx.id} className="px-3 py-2 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold">{tx.description || tx.type}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {new Date(tx.createdAt).toLocaleString("fa-IR")}
                    {tx.status !== "completed" && ` · ${tx.status}`}
                  </div>
                </div>
                <div className={cn(
                  "text-sm font-extrabold tabular-nums",
                  tx.amount > 0 ? "text-emerald-600" : "text-rose-600"
                )}>
                  {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("fa-IR")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================
// تب آگهی‌های من
// ============================
function ClassifiedsTab() {
  const [items, setItems] = useState<Classified[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/user/classifieds?status=${statusFilter}`);
      const data = await res.json();
      if (res.ok) setItems(data.items || []);
    } catch {} finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="p-4 text-center text-sm text-muted-foreground">در حال بارگذاری…</div>;

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold">آگهی‌های من</h2>
        <span className="text-xs text-muted-foreground">{items.length.toLocaleString("fa-IR")} آگهی</span>
      </div>

      {/* فیلتر */}
      <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
        {[
          { id: "all", label: "همه" },
          { id: "pending", label: "در انتظار" },
          { id: "approved", label: "تأیید شده" },
          { id: "rejected", label: "رد شده" },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setStatusFilter(s.id)}
            className={cn(
              "flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all",
              statusFilter === s.id ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-muted"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-5xl mb-2">📋</div>
          <p className="text-sm">آگهی‌ای ثبت نکرده‌اید</p>
        </div>
      ) : (
        items.map((it) => (
          <div key={it.id} className="bg-card border border-border/70 rounded-xl p-3">
            <div className="flex items-start gap-3">
              <div className="size-12 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0">
                {it.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold">{it.title}</h4>
                  {it.isPaid && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                      {it.plan === "featured" ? "ویژه" : "فوری"}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {it.categoryLabel} · {it.location} · {it.price}
                </div>
                <p className="text-xs text-foreground/70 mt-1 line-clamp-2">{it.description}</p>
                <div className="mt-2">
                  <StatusBadge status={it.status} />
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ============================
// تب اشیاء گمشده
// ============================
function LostFoundTab({ setView }: { setView: (v: "home" | "auth" | "profile") => void }) {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/user/lost-found");
        const data = await res.json();
        if (res.ok) setItems(data.items || []);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="p-4 text-center text-sm text-muted-foreground">در حال بارگذاری…</div>;

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold">اشیاء گمشده من</h2>
        <span className="text-xs text-muted-foreground">{items.length.toLocaleString("fa-IR")} مورد</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-5xl mb-2">🔍</div>
          <p className="text-sm">موردی ثبت نکرده‌اید</p>
          <p className="text-xs mt-2">برای ثبت مورد جدید به بخش «اشیاء گمشده» در صفحه اصلی بروید</p>
        </div>
      ) : (
        items.map((it) => (
          <div key={it.id} className="bg-card border border-border/70 rounded-xl p-3">
            <div className="flex items-start gap-3">
              <div className="size-12 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0">
                {it.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold">{it.title}</h4>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {it.status === "lost" ? "گم‌شده" : "پیدا‌شده"} · {it.categoryLabel} · {it.location}
                </div>
                <p className="text-xs text-foreground/70 mt-1 line-clamp-2">{it.description}</p>
                <div className="mt-2">
                  <StatusBadge status={it.status_admin} />
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ============================
// تب سامانه ۱۳۷
// ============================
function SamaTab() {
  const [requests, setRequests] = useState<Sama137Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/user/sama137");
        const data = await res.json();
        if (res.ok) setRequests(data.requests || []);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="p-4 text-center text-sm text-muted-foreground">در حال بارگذاری…</div>;

  if (selected) {
    const r = requests.find((x) => x.id === selected);
    if (r) return <SamaDetail request={r} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold">درخواست‌های سامانه ۱۳۷</h2>
        <span className="text-xs text-muted-foreground">{requests.length.toLocaleString("fa-IR")} مورد</span>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-5xl mb-2">📞</div>
          <p className="text-sm">درخواستی ثبت نکرده‌اید</p>
        </div>
      ) : (
        requests.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelected(r.id)}
            className="w-full text-right bg-card border border-border/70 rounded-xl p-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold truncate">{r.title}</h4>
                <div className="text-[11px] text-muted-foreground mt-0.5 tabular-nums">
                  {r.trackingCode} · {r.priorityLabel}
                </div>
                <div className="mt-2">
                  <StatusBadge status={r.status} label={r.statusLabel} />
                </div>
              </div>
              <ChevronLeft className="size-4 text-muted-foreground shrink-0" />
            </div>
          </button>
        ))
      )}
    </div>
  );
}

function SamaDetail({ request, onBack }: { request: Sama137Request; onBack: () => void }) {
  return (
    <div className="p-4 space-y-3">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline">
        <ChevronRight className="size-4" />
        بازگشت به لیست
      </button>
      <div className="bg-card border border-border/70 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <StatusBadge status={request.status} label={request.statusLabel} />
        </div>
        <h3 className="text-base font-bold">{request.title}</h3>
        <div className="text-xs text-muted-foreground mt-1 tabular-nums">
          کد رهگیری: {request.trackingCode}
        </div>
        <div className="mt-3 pt-3 border-t border-border/40">
          <div className="text-[10px] text-muted-foreground mb-1">شرح مشکل</div>
          <p className="text-xs leading-relaxed">{request.description}</p>
        </div>
        <div className="mt-3 pt-3 border-t border-border/40">
          <div className="text-[10px] text-muted-foreground mb-1">آدرس</div>
          <p className="text-xs">{request.address}</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <div className="text-[10px] text-muted-foreground">اولویت</div>
            <div className="text-xs font-bold">{request.priorityLabel}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">تاریخ ثبت</div>
            <div className="text-xs font-bold">{request.createdAt}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================
// تب سفارش‌ها
// ============================
function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/user/orders?type=${typeFilter}`);
      const data = await res.json();
      if (res.ok) setOrders(data.orders || []);
    } catch {} finally { setLoading(false); }
  }, [typeFilter]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="p-4 text-center text-sm text-muted-foreground">در حال بارگذاری…</div>;

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold">سفارش‌های من</h2>
        <span className="text-xs text-muted-foreground">{orders.length.toLocaleString("fa-IR")} سفارش</span>
      </div>

      <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
        {[
          { id: "all", label: "همه" },
          { id: "product", label: "فروشگاه" },
          { id: "food", label: "غذا" },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setTypeFilter(s.id)}
            className={cn(
              "flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all",
              typeFilter === s.id ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-5xl mb-2">🛍️</div>
          <p className="text-sm">سفارشی ثبت نکرده‌اید</p>
        </div>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="bg-card border border-border/70 rounded-xl p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="size-9 rounded-lg bg-muted flex items-center justify-center text-lg">
                  {o.type === "food" ? "🍽️" : "📦"}
                </div>
                <div>
                  <div className="text-xs font-bold">
                    {o.restaurant ? o.restaurant.name : o.items && o.items[0]?.product.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {new Date(o.createdAt).toLocaleDateString("fa-IR")}
                  </div>
                </div>
              </div>
              <div className="text-sm font-extrabold text-primary tabular-nums">
                {o.totalAmount.toLocaleString("fa-IR")} ت
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <OrderStatusBadge status={o.status} />
              <div className="text-[10px] text-muted-foreground tabular-nums">
                کد: {o.id.slice(-6)}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ============================
// تب بازدیدها
// ============================
function VisitsTab() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/user/visits");
        const data = await res.json();
        if (res.ok) setVisits(data.visits || []);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="p-4 text-center text-sm text-muted-foreground">در حال بارگذاری…</div>;

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-sm font-bold">سابقه بازدید</h2>
      {visits.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-5xl mb-2">👁️</div>
          <p className="text-sm">بازدیدی ثبت نشده است</p>
        </div>
      ) : (
        <div className="bg-card border border-border/70 rounded-xl divide-y divide-border/40 overflow-hidden">
          {visits.map((v) => (
            <div key={v.id} className="px-3 py-2 flex items-center gap-2">
              <History className="size-4 text-primary/70 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{v.title || v.path}</div>
                <div className="text-[10px] text-muted-foreground">
                  {new Date(v.visitedAt).toLocaleString("fa-IR")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================
// کامپوننت‌های کمکی
// ============================
function StatusBadge({ status, label }: { status: string; label?: string }) {
  const colorMap: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    approved: "bg-emerald-50 text-emerald-700",
    in_progress: "bg-sky-50 text-sky-700",
    "in-progress": "bg-amber-50 text-amber-700",
    resolved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-rose-50 text-rose-700",
    expired: "bg-slate-100 text-slate-700",
    dispatched: "bg-sky-50 text-sky-700",
    completed: "bg-emerald-50 text-emerald-700",
  };
  const labelMap: Record<string, string> = {
    pending: "در انتظار تأیید",
    approved: "تأیید شده",
    in_progress: "در حال پیگیری",
    "in-progress": "در حال پیگیری",
    resolved: "حل‌شده",
    rejected: "رد شده",
    expired: "منقضی",
    dispatched: "اعزام کارشناس",
    completed: "تکمیل شده",
  };
  return (
    <span className={cn("inline-block text-[10px] font-bold px-2 py-0.5 rounded-md", colorMap[status] || "bg-slate-100 text-slate-700")}>
      {label || labelMap[status] || status}
    </span>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    pending: { label: "در انتظار", color: "bg-amber-50 text-amber-700" },
    paid: { label: "پرداخت شده", color: "bg-sky-50 text-sky-700" },
    shipped: { label: "ارسال شده", color: "bg-purple-50 text-purple-700" },
    delivered: { label: "تحویل شده", color: "bg-emerald-50 text-emerald-700" },
    cancelled: { label: "لغو شده", color: "bg-rose-50 text-rose-700" },
  };
  const s = map[status] || { label: status, color: "bg-slate-100 text-slate-700" };
  return (
    <span className={cn("inline-block text-[10px] font-bold px-2 py-0.5 rounded-md", s.color)}>
      {s.label}
    </span>
  );
}
