import type { Metadata } from "next";
import ThemeLibrary from "@/components/ThemeLibrary";

export const metadata: Metadata = {
  title: "Explore the theme library",
  description: "Browse more than 50 original design themes and use one as your starting point.",
};

export default function ThemesPage() {
  return <ThemeLibrary />;
}
