import CarouselControls from "@/components/CarouselControls";
import Link from "next/link";

const features = [
  { icon: "◉", name: "Color systems", description: "Build balanced palettes, semantic states, and accessible color ramps.", route: "/colors", color: "#8B5CF6", token: "01 · COLOR" },
  { icon: "Aa", name: "Typography", description: "Shape a clear typographic voice with a searchable font library.", route: "/fonts", color: "#38BDF8", token: "02 · TYPE" },
  { icon: "◒", name: "Gradients", description: "Create expressive linear and radial blends, ready for CSS.", route: "/gradients", color: "#EC4899", token: "03 · BLEND" },
  { icon: "⌑", name: "Border radius", description: "Bring consistency to every surface, control, and component.", route: "/radius", color: "#F59E0B", token: "04 · SHAPE" },
  { icon: "▱", name: "Shadows", description: "Design a thoughtful elevation scale from soft to dramatic.", route: "/shadows", color: "#34D399", token: "05 · DEPTH" },
  { icon: "↔", name: "Spacing", description: "Set a reliable spatial rhythm for layouts that breathe.", route: "/spacing", color: "#A78BFA", token: "06 · RHYTHM" },
];

export default function FeatureCarousel() {
  return (
    <CarouselControls label="Your design toolkit">
      {features.map((feature) => (
        <Link
          data-carousel-card
          key={feature.name}
          href={feature.route}
          className="surface-card group min-w-[min(78vw,300px)] snap-start rounded-[1.4rem] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]"
        >
          <div className="flex items-center justify-between">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-semibold"
              style={{ backgroundColor: `${feature.color}1c`, color: feature.color }}
              aria-hidden="true"
            >
              {feature.icon}
            </span>
            <span className="text-[10px] tracking-[.15em] text-white/35">{feature.token}</span>
          </div>
          <h3 className="mt-7 text-lg font-semibold text-white">{feature.name}</h3>
          <p className="mt-2 min-h-12 text-sm leading-6 text-white/50">{feature.description}</p>
          <span className="mt-5 inline-flex text-xs font-semibold text-white/55 transition group-hover:text-white">Explore tool <span className="ml-2">↗</span></span>
        </Link>
      ))}
    </CarouselControls>
  );
}
