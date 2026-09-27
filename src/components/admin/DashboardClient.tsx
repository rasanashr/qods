"use client";

import Link from "next/link";
import { StatCard, AdminBadge } from "./ui";
import type { AdminSession } from "@/lib/admin-auth";
import { LogOut, ChevronLeft, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Stats = {
  totalAppUsers: number;
  totalAdminUsers: number;
  totalProducts: number;
  totalProperties: number;
  totalLostFound: number;
  totalRestaurants: number;
  totalSamaRequests: number;
  totalNews: number;
  totalBanners: number;
  totalOrders: number;
};

type Pending = {
  properties: number;
  lostFound: number;
  samaRequests: number;
  total: number;
};

type RecentUser = {
  id: string;
  name: string | null;
  phone: string;
  joinedAt: string;
  isBlocked: boolean;
};

type RecentSama = {
  id: string;
  trackingCode: string;
  title: string;
  status: string;
  statusLabel: string;
  priority: string;
  priorityLabel: string;
  created_at: string;
};

type RecentLog = {
  id: string;
  adminId: string;
  action: string;
  resource: string;
  resourceId: string | null;
  detail: string | null;
  createdAt: string;
  admin: { fullName: string; username: string };
};

export function DashboardClient({
  session,
  stats,
  pending,
  recent,
}: {
  session: AdminSession;
  stats: Stats;
  pending: Pending;
  recent: {
    users: RecentUser[];
    samaRequests: RecentSama[];
    logs: RecentLog[];
  };
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* سلام ادمین */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">سلام {session.fullName} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">
            به پنل مدیریت شبکه قدس خوش آمدید
          </p>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="lg:hidden inline-flex items-center gap-1 bg-rose-50 text-rose-600 font-bold text-xs px-3 py-2 rounded-lg"
        >
          <LogOut className="size-4" />
          خروج
        </button>
      </div>

      {/* هشدار موارد در انتظار */}
      {pending.total > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3">
          <AlertCircle className="size-5 text-amber-600 shrink-0" />
          <div className="text-sm">
            <span className="font-bold text-amber-900">
              {pending.total.toLocaleString("fa-IR")} مورد در انتظار تأیید
            </span>
            <span className="text-amber-800 mr-2">
              · املاک: {pending.properties.toLocaleString("fa-IR")}، اشیاء:{" "}
              {pending.lostFound.toLocaleString("fa-IR")}، ۱۳۷:{" "}
              {pending.samaRequests.toLocaleString("fa-IR")}
            </span>
          </div>
        </div>
      )}

      {/* آمار اصلی */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="کاربران" value={stats.totalAppUsers} emoji="👥" tone="bg-sky-50 border-sky-100" />
        <StatCard label="ادمین‌ها" value={stats.totalAdminUsers} emoji="🛡️" tone="bg-purple-50 border-purple-100" />
        <StatCard label="محصولات" value={stats.totalProducts} emoji="📦" tone="bg-emerald-50 border-emerald-100" />
        <StatCard label="آگهی املاک" value={stats.totalProperties} emoji="🏠" tone="bg-amber-50 border-amber-100" />
        <StatCard label="اشیاء گمشده" value={stats.totalLostFound} emoji="🔍" tone="bg-rose-50 border-rose-100" />
        <StatCard label="رستوران‌ها" value={stats.totalRestaurants} emoji="🍽️" tone="bg-orange-50 border-orange-100" />
        <StatCard label="درخواست ۱۳۷" value={stats.totalSamaRequests} emoji="📞" tone="bg-teal-50 border-teal-100" />
        <StatCard label="اخبار" value={stats.totalNews} emoji="📰" tone="bg-cyan-50 border-cyan-100" />
        <StatCard label="بنرها" value={stats.totalBanners} emoji="🖼️" tone="bg-fuchsia-50 border-fuchsia-100" />
        <StatCard label="سفارش‌ها" value={stats.totalOrders} emoji="🛒" tone="bg-lime-50 border-lime-100" />
      </div>

      {/* دو ستون: آخرین کاربران + آخرین درخواست‌های ۱۳۷ */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* آخرین کاربران */}
        <div className="bg-card border border-border/70 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border/70">
            <h2 className="text-sm font-bold">آخرین کاربران عضو شده</h2>
            <Link href="/admin/users" className="text-xs text-primary hover:underline">
              همه
            </Link>
          </div>
          <div className="divide-y divide-border/60">
            {recent.users.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                کاربری وجود ندارد
              </div>
            ) : (
              recent.users.map((u) => (
                <div key={u.id} className="p-3 flex items-center gap-2">
                  <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {(u.name || u.phone).charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{u.name || "—"}</div>
                    <div className="text-xs text-muted-foreground tabular-nums" dir="ltr">
                      {u.phone}
                    </div>
                  </div>
                  {u.isBlocked && (
                    <AdminBadge color="bg-rose-50 text-rose-700">مسدود</AdminBadge>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* آخرین درخواست‌های ۱۳۷ */}
        <div className="bg-card border border-border/70 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border/70">
            <h2 className="text-sm font-bold">آخرین درخواست‌های ۱۳۷</h2>
            <Link href="/admin/sama137" className="text-xs text-primary hover:underline">
              همه
            </Link>
          </div>
          <div className="divide-y divide-border/60">
            {recent.samaRequests.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                درخواستی وجود ندارد
              </div>
            ) : (
              recent.samaRequests.map((r) => (
                <Link
                  key={r.id}
                  href={`/admin/sama137/${r.id}`}
                  className="p-3 flex items-center gap-2 hover:bg-muted/30"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{r.title}</div>
                    <div className="text-xs text-muted-foreground tabular-nums">
                      {r.trackingCode} · {r.priorityLabel}
                    </div>
                  </div>
                  <AdminBadge
                    color={
                      r.status === "resolved"
                        ? "bg-emerald-50 text-emerald-700"
                        : r.status === "in-progress"
                        ? "bg-amber-50 text-amber-700"
                        : r.status === "pending"
                        ? "bg-slate-100 text-slate-700"
                        : "bg-rose-50 text-rose-700"
                    }
                  >
                    {r.statusLabel}
                  </AdminBadge>
                  <ChevronLeft className="size-4 text-muted-foreground" />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* لاگ اقدامات اخیر */}
      <div className="bg-card border border-border/70 rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 border-b border-border/70">
          <h2 className="text-sm font-bold">آخرین اقدامات ادمین</h2>
        </div>
        <div className="divide-y divide-border/60">
          {recent.logs.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              اقدامی ثبت نشده است
            </div>
          ) : (
            recent.logs.map((log) => (
              <div key={log.id} className="p-3 flex items-center gap-2">
                <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs">
                  {log.action === "create" && "➕"}
                  {log.action === "update" && "✏️"}
                  {log.action === "delete" && "🗑️"}
                  {log.action === "approve" && "✅"}
                  {log.action === "reject" && "❌"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">
                    <span className="font-bold">{log.admin.fullName}</span>
                    <span className="text-muted-foreground mr-1">
                      {" "}
                      — {log.detail || `${log.action} ${log.resource}`}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString("fa-IR")}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
