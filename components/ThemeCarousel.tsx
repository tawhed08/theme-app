import CarouselControls from "@/components/CarouselControls";
import ThemeCard from "@/components/ThemeCard";
import { themes } from "@/data/themes";

export default function ThemeCarousel() {
  return (
    <CarouselControls label="A few favorites">
      {themes.slice(0, 14).map((theme, index) => (
        <ThemeCard key={`${theme.name}-${theme.primary}`} theme={theme} index={index} />
      ))}
    </CarouselControls>
  );
}
