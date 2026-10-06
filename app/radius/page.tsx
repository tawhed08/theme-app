import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = { title: "Border radius studio" };
export default function RadiusPage() {
  return <ToolPage tool="radius" />;
}
