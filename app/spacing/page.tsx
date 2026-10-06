import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = { title: "Spacing scale studio" };
export default function SpacingPage() {
  return <ToolPage tool="spacing" />;
}
