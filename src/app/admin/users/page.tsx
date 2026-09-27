import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { UsersList } from "@/components/admin/UsersList";

export default async function AdminUsersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const users = await db.appUser.findMany({
    orderBy: { joinedAt: "desc" },
    take: 200,
  });

  const admins = await db.adminUser.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      fullName: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  return <UsersList users={users} admins={admins} currentAdminId={session.id} />;
}
