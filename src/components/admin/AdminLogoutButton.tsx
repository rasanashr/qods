"use server";

import { redirect } from "next/navigation";
import { clearAdminSession } from "@/lib/admin-auth";

export async function AdminLogoutButton() {
  // کامپوننت سروری نامرئی — فقط برای امکان فراخوانی logoutAction
  return null;
}

export async function adminLogoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}
