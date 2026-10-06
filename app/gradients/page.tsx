import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = { title: "Gradient generator" };
export default function GradientsPage() {
  return <ToolPage tool="gradients" />;
}
