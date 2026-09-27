import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  // اگر از قبل وارد شده، به داشبورد برو
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-muted/30 to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="size-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-3xl mx-auto shadow-lg">
            ق
          </div>
          <h1 className="text-2xl font-bold mt-3">پنل مدیریت شبکه قدس</h1>
          <p className="text-sm text-muted-foreground mt-1">
            برای ادامه وارد شوید
          </p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>🧪 اطلاعات نمونه:</p>
          <p className="mt-1">
            نام کاربری: <span className="font-bold">admin</span> · رمز:{" "}
            <span className="font-bold">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
