import { NextResponse } from "next/server";

interface GoogleFont {
  family: string;
  category: string;
  variants: string[];
  subsets: string[];
  files: Record<string, string>;
  version?: string;
  lastModified?: string;
}

const isGoogleFont = (font: unknown): font is GoogleFont =>
  typeof font === "object" &&
  font !== null &&
  "family" in font &&
  typeof font.family === "string" &&
  "category" in font &&
  typeof font.category === "string" &&
  "variants" in font &&
  Array.isArray(font.variants) &&
  font.variants.every(
    (variant: unknown) => typeof variant === "string",
  ) &&
  "subsets" in font &&
  Array.isArray(font.subsets) &&
  font.subsets.every(
    (subset: unknown) => typeof subset === "string",
  ) &&
  "files" in font &&
  typeof font.files === "object" &&
  font.files !== null &&
  Object.values(font.files).every(
    (file) => typeof file === "string",
  );

export async function GET() {
  const apiKey = process.env.GOOGLE_FONTS_API_KEY?.trim();

  if (!apiKey) {
    return NextResponse.json(
      {
        fonts: [],
      },
    );
  }

  try {
    const url =
      `https://www.googleapis.com/webfonts/v1/webfonts` +
      `?key=${encodeURIComponent(apiKey)}` +
      `&sort=popularity`;

    const response = await fetch(url, {
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ fonts: [] });
    }

    const data: unknown = await response.json();
    const items =
      typeof data === "object" &&
      data !== null &&
      "items" in data &&
      Array.isArray(data.items)
        ? data.items
        : null;

    const fonts: GoogleFont[] | null =
      items && items.every(isGoogleFont) ? items : null;

    return NextResponse.json({ fonts: fonts ?? [] });
  } catch {
    return NextResponse.json({ fonts: [] });
  }
}