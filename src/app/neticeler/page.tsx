import type { Metadata } from "next";
import { ResultsBoard } from "@/components/results/ResultsBoard.tsx";

export const metadata: Metadata = { title: "Canlı nəticələr - NovaTech" };

export default function ResultsPage() {
  return <ResultsBoard />;
}
