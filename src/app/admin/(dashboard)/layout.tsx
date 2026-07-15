import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-bg">
      <AdminSidebar name={session.name} email={session.email} />
      <main className="flex-1 px-6 py-8 sm:px-10">{children}</main>
    </div>
  );
}
