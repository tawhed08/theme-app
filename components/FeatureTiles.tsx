import Link from "next/link";
import Reveal from "@/components/Reveal";

const features = [
  ["01", "Color systems", "Harmonies, shades, tints, and semantic roles.", "/colors", "#9678ff"],
  ["02", "Typography", "An expressive type scale, tuned to your product.", "/fonts", "#66c8fa"],
  ["03", "Gradients", "Beautiful blends, ready to copy into your workflow.", "/gradients", "#f174ad"],
  ["04", "Design tokens", "Consistent shape, elevation, and spacing scales.", "/generator", "#69ddb2"],
];

export default function FeatureTiles() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {features.map(([number, title, detail, href, color], index) => (
        <Reveal key={number} delay={index * 75}>
          <Link href={href} className="surface-card group flex min-h-40 flex-col justify-between rounded-2xl p-5 transition hover:-translate-y-1 hover:border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[.16em] text-white/40">{number} / TOOL</span>
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            </div>
            <span>
              <span className="block font-semibold text-white">{title}</span>
              <span className="mt-1 block text-xs leading-5 text-white/50">{detail}</span>
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
