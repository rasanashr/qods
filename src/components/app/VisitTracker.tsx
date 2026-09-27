"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-store";

/**
 * کامپوننتی برای ردیابی خودکار بازدید صفحات
 * در هر صفحه از سوپر اپ که کاربر وارد شده باشد، در footer قرار دهید
 */
export function VisitTracker({ path, title }: { path: string; title: string }) {
  const isAuthenticated = useAuth((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;
    // ثبت بازدید در background (بدون انتظار)
    fetch("/api/user/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, title }),
    }).catch(() => {});
  }, [isAuthenticated, path, title]);

  return null;
}
