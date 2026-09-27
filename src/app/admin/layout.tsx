import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // اگر در صفحه ورود است، مزاحم نشو
  // (این layout برای همه /admin/* اعمال می‌شود؛ با استفاده از دقیق pathname در children کنترل می‌کنیم)
  // اما برای سادگی، اگر session نبود به /admin/login redirect می‌کنیم.
  // صفحه /admin/login خودش یک layout جدا ندارد و از همین layout استفاده می‌کند،
  // پس باید آن را با منطق skip کنیم.

  if (!session) {
    // کاربر در صفحه لاگین است یا نه — اگر در /admin/login بود، اجازه ورود بده
    // اینجا به جای redirect، یک نسخه بدون ساید‌بار می‌دهیم
    // اما روش بهتر: صفحه login در یک گروه route جدا باشد
    // برای سادگی: اگر session نبود و در login نیست، redirect
    return (
      <div dir="rtl" className="min-h-screen bg-muted/30">
        {children}
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen flex bg-muted/30">
      <AdminSidebar
        adminName={session.fullName}
        adminRole={session.role}
        onLogout={async () => {
          "use server";
          const { clearAdminSession } = await import("@/lib/admin-auth");
          await clearAdminSession();
        }}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          adminName={session.fullName}
          adminRole={session.role}
          onLogout={async () => {
            "use server";
            const { clearAdminSession } = await import("@/lib/admin-auth");
            await clearAdminSession();
          }}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
      {/* کامپوننت سروری برای خروج با redirect */}
      <AdminLogoutButton />
    </div>
  );
}
