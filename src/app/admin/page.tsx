import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin/AdminPanel.tsx";

export const metadata: Metadata = { title: "İdarəetmə - NovaTech" };

export default function AdminPage() {
  return <AdminPanel />;
}
