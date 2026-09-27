"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn, User, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در ورود");
        setLoading(false);
        return;
      }
      // موفق — به داشبورد برو
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setError("خطای شبکه: " + String(e));
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setUsername("admin");
    setPassword("admin123");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border/70 rounded-2xl shadow-lg p-6 space-y-4"
    >
      <div>
        <label htmlFor="username" className="text-xs font-bold mb-1.5 flex items-center gap-1.5">
          <User className="size-3.5" />
          نام کاربری
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="admin"
          dir="ltr"
          className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          autoFocus
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="text-xs font-bold mb-1.5 flex items-center gap-1.5">
          <Lock className="size-3.5" />
          رمز عبور
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          dir="ltr"
          className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          required
        />
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-xs text-rose-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !username || !password}
        className={cn(
          "w-full inline-flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl shadow transition-all text-sm",
          loading || !username || !password
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-primary text-primary-foreground active:scale-[0.98]"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            در حال ورود…
          </>
        ) : (
          <>
            <LogIn className="size-4" />
            ورود
          </>
        )}
      </button>

      <button
        type="button"
        onClick={fillDemo}
        className="w-full text-xs text-primary hover:underline"
      >
        پر کردن با ادمین نمونه
      </button>
    </form>
  );
}
