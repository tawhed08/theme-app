import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = { title: "Typography and font studio" };
export default function FontsPage() {
  return <ToolPage tool="fonts" />;
}
