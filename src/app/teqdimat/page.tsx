import type { Metadata } from "next";
import { DeckStage } from "@/components/deck/DeckStage.tsx";

export const metadata: Metadata = { title: "Təqdimat - NovaTech" };

export default function PresentationPage() {
  return <DeckStage />;
}
