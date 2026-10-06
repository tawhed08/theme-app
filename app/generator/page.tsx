import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = { title: "Complete theme generator" };
export default function GeneratorPage() {
  return <ToolPage tool="generator" />;
}
