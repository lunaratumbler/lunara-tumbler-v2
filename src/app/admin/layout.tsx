import { getAdmin } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import "./admin.css";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) return <main className="admin-login-wrap">{children}</main>;
  return <div className="admin-shell"><AdminSidebar/><main className="admin-main">{children}</main></div>;
}
