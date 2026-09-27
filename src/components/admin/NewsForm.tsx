"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackLink, AdminButton, AdminError } from "./ui";
import { Loader2, Save } from "lucide-react";
import type { NewsItem } from "@prisma/client";

const EMOJIS = ["🚇", "🌳", "🎭", "📞", "📰", "🏗️", "💧", "⚡", "🚦"];

export function NewsForm({ mode, news }: { mode: "create" | "edit"; news?: NewsItem }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(news?.title || "");
  const [excerpt, setExcerpt] = useState(news?.excerpt || "");
  const [body, setBody] = useState(news?.body || "");
  const [category, setCategory] = useState(news?.category || "شهری");
  const [timeAgo, setTimeAgo] = useState(news?.timeAgo || "همین الان");
  const [readTime, setReadTime] = useState(news?.readTime || "۲ دقیقه");
  const [emoji, setEmoji] = useState(news?.emoji || "📰");
  const [accent, setAccent] = useState(news?.accent || "bg-primary");
  const [isPublished, setIsPublished] = useState(news?.isPublished ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const body_data = {
        title,
        excerpt,
        body,
        category,
        timeAgo,
        readTime,
        emoji,
        accent,
        isPublished,
      };
      const url = mode === "create" ? "/api/admin/news" : `/api/admin/news/${news!.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body_data),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "خطا");
      }
      router.push("/admin/news");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BackLink href="/admin/news" label="بازگشت به اخبار" />
      <h1 className="text-xl font-bold mb-4">
        {mode === "create" ? "افزودن خبر جدید" : "ویرایش خبر"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="عنوان *">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="form-input" />
        </Field>

        <Field label="خلاصه *">
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required rows={2} className="form-input" />
        </Field>

        <Field label="متن کامل">
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} className="form-input" />
        </Field>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Field label="دسته‌بندی">
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="form-input" />
          </Field>
          <Field label="مدت زمان قبل">
            <input type="text" value={timeAgo} onChange={(e) => setTimeAgo(e.target.value)} className="form-input" />
          </Field>
          <Field label="زمان مطالعه">
            <input type="text" value={readTime} onChange={(e) => setReadTime(e.target.value)} className="form-input" />
          </Field>
        </div>

        <Field label="اموجی">
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => setEmoji(em)}
                className={`size-10 rounded-lg flex items-center justify-center text-xl ${
                  emoji === em ? "bg-primary/10 ring-2 ring-primary" : "bg-muted"
                }`}
              >
                {em}
              </button>
            ))}
          </div>
        </Field>

        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="size-4" />
          منتشر شود
        </label>

        {error && <AdminError message={error} />}

        <div className="flex gap-2">
          <AdminButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                در حال ذخیره…
              </>
            ) : (
              <>
                <Save className="size-4" />
                {mode === "create" ? "افزودن" : "ذخیره"}
              </>
            )}
          </AdminButton>
          <AdminButton href="/admin/news" variant="outline">انصراف</AdminButton>
        </div>
      </form>

      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          background: var(--background, white);
          border: 1px solid var(--border, #e5e5e5);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        :global(.form-input:focus) {
          border-color: var(--primary, #0f766e);
          box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.2);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
