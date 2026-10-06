import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = { title: "Shadow and elevation studio" };
export default function ShadowsPage() {
  return <ToolPage tool="shadows" />;
}
