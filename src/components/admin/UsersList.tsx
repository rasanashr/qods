"use client";

import { useState } from "react";
import { AdminPageHeader, AdminBadge, EmptyState } from "./ui";
import { Search, Loader2, Shield, User } from "lucide-react";
import type { AppUser, AdminUser } from "@prisma/client";

type AppUserSerialized = AppUser;
type AdminUserSerialized = Omit<AdminUser, "passwordHash"> & { passwordHash?: string };

export function UsersList({
  users,
  admins,
  currentAdminId,
}: {
  users: AppUserSerialized[];
  admins: AdminUserSerialized[];
  currentAdminId: string;
}) {
  const [tab, setTab] = useState<"app" | "admin">("app");
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (u) => u.name?.includes(search) || u.phone.includes(search)
  );
  const filteredAdmins = admins.filter(
    (a) => a.fullName.includes(search) || a.username.includes(search)
  );

  const toggleBlock = async (id: string, isBlocked: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !isBlocked }),
      });
      if (res.ok) {
        // refresh — برای سادگی، کل صفحه را reload می‌کنیم
        window.location.reload();
      }
    } catch (e) {
      console.error("Toggle block error:", e);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <AdminPageHeader title="کاربران" description="مدیریت کاربران و ادمین‌ها" />

      {/* تب‌ها */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("app")}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold ${
            tab === "app" ? "bg-primary text-primary-foreground" : "bg-card border border-border"
          }`}
        >
          <User className="size-4" />
          کاربران اپ ({users.length.toLocaleString("fa-IR")})
        </button>
        <button
          onClick={() => setTab("admin")}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold ${
            tab === "admin" ? "bg-primary text-primary-foreground" : "bg-card border border-border"
          }`}
        >
          <Shield className="size-4" />
          ادمین‌ها ({admins.length.toLocaleString("fa-IR")})
        </button>
      </div>

      <div className="mb-4 relative">
        <Search className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی نام یا شماره…"
          className="w-full bg-card border border-border rounded-xl py-2 pr-10 pl-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {tab === "app" ? (
        filteredUsers.length === 0 ? (
          <EmptyState emoji="👥" title="کاربری یافت نشد" />
        ) : (
          <div className="space-y-2">
            {filteredUsers.map((u) => (
              <div key={u.id} className="bg-card border border-border/70 rounded-xl p-3 flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {(u.name || u.phone).charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold">{u.name || "—"}</div>
                  <div className="text-xs text-muted-foreground tabular-nums" dir="ltr">
                    {u.phone}
                  </div>
                </div>
                {u.isBlocked && <AdminBadge color="bg-rose-50 text-rose-700">مسدود</AdminBadge>}
                <button
                  onClick={() => toggleBlock(u.id, u.isBlocked)}
                  disabled={togglingId === u.id}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                    u.isBlocked
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {togglingId === u.id ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : u.isBlocked ? (
                    "آزاد کردن"
                  ) : (
                    "مسدود"
                  )}
                </button>
              </div>
            ))}
          </div>
        )
      ) : filteredAdmins.length === 0 ? (
        <EmptyState emoji="🛡️" title="ادمینی یافت نشد" />
      ) : (
        <div className="space-y-2">
          {filteredAdmins.map((a) => (
            <div key={a.id} className="bg-card border border-border/70 rounded-xl p-3 flex items-center gap-3">
              <div className="size-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                {a.fullName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold">
                  {a.fullName}
                  {a.id === currentAdminId && (
                    <span className="text-xs text-primary mr-2">(شما)</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  @{a.username}
                </div>
              </div>
              <AdminBadge
                color={
                  a.role === "superadmin"
                    ? "bg-purple-50 text-purple-700"
                    : a.role === "admin"
                    ? "bg-sky-50 text-sky-700"
                    : "bg-slate-100 text-slate-700"
                }
              >
                {a.role === "superadmin" ? "مدیر ارشد" : a.role === "admin" ? "مدیر" : "ویرایشگر"}
              </AdminBadge>
              {!a.isActive && <AdminBadge color="bg-rose-50 text-rose-700">غیرفعال</AdminBadge>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
