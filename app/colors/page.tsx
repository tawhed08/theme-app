import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = { title: "Color system generator" };
export default function ColorsPage() {
  return <ToolPage tool="colors" />;
}
