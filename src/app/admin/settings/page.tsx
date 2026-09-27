import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">تنظیمات سیستم</h1>
      <div className="bg-card border border-border/70 rounded-xl p-4">
        <p className="text-sm text-muted-foreground mb-4">
          این بخش در نسخه فعلی شامل اطلاعات پایه‌ای سیستم است.
        </p>
        <div className="space-y-3">
          <SettingRow label="نام سامانه" value="شبکه قدس" />
          <SettingRow label="نسخه" value="۱٫۰٫۰" />
          <SettingRow label="پایگاه داده" value="SQLite" />
          <SettingRow label="فریم‌ورک" value="Next.js 16" />
          <SettingRow label="ادمین فعلی" value={session.fullName} />
          <SettingRow label="نقش" value={session.role} />
        </div>
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-xs text-amber-800">
          🚧 برای ویرایش تنظیمات پیشرفته (اعم از نام سامانه، رنگ‌ها، متن‌های بنر و غیره) از API و یا فایل‌های کد استفاده کنید. در نسخه‌های آینده یک فرم کامل پیکربندی اضافه خواهد شد.
        </p>
      </div>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}
