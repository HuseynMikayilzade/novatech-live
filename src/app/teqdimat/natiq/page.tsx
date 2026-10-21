import type { Metadata } from "next";
import { PresenterView } from "@/components/deck/PresenterView.tsx";

export const metadata: Metadata = { title: "Natiq görünüşü - NovaTech" };

export default function PresenterPage() {
  return <PresenterView />;
}
