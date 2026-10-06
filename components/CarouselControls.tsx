"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";

export default function CarouselControls({
  label,
  children,
  className = "",
}: Readonly<{
  label: string;
  children: React.ReactNode;
  className?: string;
}>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);
  const focusedRef = useRef(false);
  const movementRemainderRef = useRef(0);
  const interactionTimerRef = useRef<number | null>(null);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const items = Children.toArray(children);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-carousel-card]");
    const step = (card?.offsetWidth ?? 320) * 0.9;
    const loopWidth = track.scrollWidth / 2;
    movementRemainderRef.current = 0;
    if (direction < 0 && track.scrollLeft < step && loopWidth > 0) {
      track.scrollLeft += loopWidth;
    }
    track.scrollBy({
      left: direction * step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !autoplayEnabled || reducedMotion) return;

    let frame = 0;
    let lastTime = 0;
    const animate = (time: number) => {
      const elapsed = lastTime ? Math.min(time - lastTime, 64) : 0;
      lastTime = time;
      if (
        !document.hidden &&
        !hoveredRef.current &&
        !focusedRef.current
      ) {
        const loopWidth = track.scrollWidth / 2;
        if (loopWidth > 0) {
          movementRemainderRef.current += elapsed * 0.022;
          const distance = Math.floor(movementRemainderRef.current);
          if (distance > 0) {
            track.scrollLeft += distance;
            movementRemainderRef.current -= distance;
          }
          if (track.scrollLeft >= loopWidth) {
            track.scrollLeft -= loopWidth;
          }
        }
      }
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [autoplayEnabled, reducedMotion]);

  useEffect(
    () => () => {
      if (interactionTimerRef.current !== null) {
        window.clearTimeout(interactionTimerRef.current);
      }
    },
    [],
  );

  const pauseForInteraction = () => {
    if (interactionTimerRef.current !== null) {
      window.clearTimeout(interactionTimerRef.current);
      interactionTimerRef.current = null;
    }
    hoveredRef.current = true;
  };

  const resumeAfterInteraction = () => {
    if (interactionTimerRef.current !== null) {
      window.clearTimeout(interactionTimerRef.current);
    }
    interactionTimerRef.current = window.setTimeout(() => {
      hoveredRef.current = false;
      interactionTimerRef.current = null;
    }, 1200);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
          {label}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAutoplayEnabled((enabled) => !enabled)}
            disabled={reducedMotion}
            aria-label={
              reducedMotion
                ? "Automatic scrolling is off because reduced motion is enabled"
                : autoplayEnabled
                  ? "Pause automatic scrolling"
                  : "Resume automatic scrolling"
            }
            title={
              reducedMotion
                ? "Automatic scrolling is off for reduced motion"
                : autoplayEnabled
                  ? "Pause automatic scrolling"
                  : "Resume automatic scrolling"
            }
            className="flex h-10 items-center gap-2 rounded-full border border-white/10 px-3 text-[11px] text-white/65 transition hover:border-white/25 hover:bg-white/5 disabled:cursor-default disabled:opacity-50"
          >
            <span aria-hidden="true">{autoplayEnabled ? "Ⅱ" : "▶"}</span>
            <span className="hidden sm:inline">
              {reducedMotion
                ? "Reduced motion"
                : autoplayEnabled
                  ? "Pause"
                  : "Play"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label={`Previous ${label.toLowerCase()}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/75 transition hover:border-white/25 hover:bg-white/5 active:scale-95"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label={`Next ${label.toLowerCase()}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/75 transition hover:border-white/25 hover:bg-white/5 active:scale-95"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <div
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-label={label}
        onMouseEnter={() => {
          hoveredRef.current = true;
        }}
        onMouseLeave={() => {
          hoveredRef.current = false;
        }}
        onFocus={() => {
          focusedRef.current = true;
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            focusedRef.current = false;
          }
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse") pauseForInteraction();
        }}
        onPointerUp={(event) => {
          if (event.pointerType !== "mouse") resumeAfterInteraction();
        }}
        onPointerCancel={resumeAfterInteraction}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
        }}
        className={`carousel-track flex gap-0 overflow-x-auto pb-3 focus-visible:rounded-2xl ${className}`}
      >
        <div className="flex shrink-0 gap-4 pr-4">
          {items}
        </div>
        <div
          aria-hidden="true"
          inert
          className="flex shrink-0 gap-4 pr-4"
        >
          {items.map((item, index) =>
            isValidElement(item)
              ? cloneElement(item, { key: `carousel-copy-${index}` })
              : item,
          )}
        </div>
      </div>
    </div>
  );
}
