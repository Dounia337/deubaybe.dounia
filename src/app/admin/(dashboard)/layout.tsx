import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { CVRepo } from "@/db/repo";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const profile = await CVRepo.profile();

  return (
    <div className="hero-wash flex min-h-screen flex-col bg-bg md:flex-row">
      <AdminSidebar name={session.name} email={session.email} photoUrl={profile.photo_url} />
      <main className="flex-1 px-4 py-6 sm:px-6 md:px-10 md:py-8">{children}</main>
    </div>
  );
}
