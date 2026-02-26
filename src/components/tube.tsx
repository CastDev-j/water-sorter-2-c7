"use client";

import { COLOR_HEX_MAP, MAX_LEVELS, type TubeState } from "@/lib/colors";
import { cn } from "@/lib/utils";

interface TubeProps {
  tube: TubeState;
  index: number;
  isSource?: boolean;
  isTarget?: boolean;
  onClick?: () => void;
}

export function Tube({ tube, index, isSource, isTarget, onClick }: TubeProps) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center gap-1.5 transition-all duration-150",
        onClick &&
          "cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
      )}
      aria-label={`Tubo ${index + 1}`}
    >
      <span
        className={cn(
          "text-[11px] font-base transition-colors duration-150",
          isSource ? "text-foreground font-heading" : "text-foreground/80",
        )}
      >
        {index + 1}
      </span>
      <div
        className={cn(
          "relative flex w-14 flex-col-reverse gap-0.5 rounded-b-[10px] border-2 border-t-0 border-border px-1 pb-1 pt-4 transition-all duration-150",
          onClick &&
            "group-hover:translate-x-boxShadowX group-hover:translate-y-boxShadowY group-hover:shadow-none",
          isSource
            ? "bg-main/40 shadow-shadow -translate-y-1"
            : isTarget
              ? "bg-chart-4/40 shadow-shadow"
              : "bg-secondary-background shadow-shadow",
        )}
      >
        {Array.from({ length: MAX_LEVELS }).map((_, si) => {
          const color = tube[si];
          return (
            <div
              key={si}
              className={cn(
                "h-10 w-full rounded-[3px] border-2 border-border transition-all duration-150",
                !color && "border-dashed bg-secondary-background/70",
              )}
              style={
                color
                  ? {
                      backgroundColor: COLOR_HEX_MAP[color],
                    }
                  : undefined
              }
            />
          );
        })}
      </div>
    </Wrapper>
  );
}
