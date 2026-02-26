"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Minus, Plus, ChevronRight } from "lucide-react";
import { MAX_LEVELS, WATER_COLORS, type TubeState } from "@/lib/colors";
import { Card } from "./ui/card";
import { Tube } from "./tube";

interface StepStructureProps {
  totalTubes: number;
  emptyTubes: number;
  onTotalChange: (delta: number) => void;
  onEmptyChange: (delta: number) => void;
  tubes: TubeState[];
  onNext: () => void;
}

export function StepStructure({
  totalTubes,
  emptyTubes,
  onTotalChange,
  onEmptyChange,
  tubes,
  onNext,
}: StepStructureProps) {
  const fillableTubes = totalTubes - emptyTubes;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
        <Card className="bg-secondary-background px-4 py-6">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground block">
            Tubos totales
          </Label>
          <div className="flex items-center justify-between">
            <Button
              size="icon"
              onClick={() => onTotalChange(-1)}
              disabled={totalTubes <= 2}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-4xl font-bold text-foreground tabular-nums">
              {totalTubes}
            </span>
            <Button
              size="icon"
              onClick={() => onTotalChange(1)}
              disabled={totalTubes >= WATER_COLORS.length}
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <Card className="bg-secondary-background px-4 py-6">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground block">
            Tubos vacios
          </Label>
          <div className="flex items-center justify-between">
            <Button
              size="icon"
              onClick={() => onEmptyChange(-1)}
              disabled={emptyTubes <= 0}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-4xl font-bold text-foreground tabular-nums">
              {emptyTubes}
            </span>
            <Button
              size="icon"
              onClick={() => onEmptyChange(1)}
              disabled={emptyTubes >= totalTubes - 1}
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      <Card className="bg-secondary-background p-6 w-full flex flex-row items-center justify-center overflow-x-auto">
        {tubes.map((tube, i) => (
          <div
            key={`fill-${i}`}
            className="flex flex-col items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <Tube tube={tube} index={i} />
          </div>
        ))}

        {Array.from({ length: emptyTubes }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex flex-col items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200"
            style={{ animationDelay: `${(fillableTubes + i) * 30}ms` }}
          >
            <span className="text-[11px] font-medium text-muted-foreground">
              {fillableTubes + i + 1}
            </span>
            <div className="relative flex w-14 flex-col-reverse gap-0.5 rounded-b-[10px] border-2 border-t-0 border-dashed border-border bg-secondary-background px-1 pb-1 pt-4 shadow-shadow">
              {Array.from({ length: MAX_LEVELS }).map((_, si) => (
                <div
                  key={si}
                  className="h-10 w-full rounded-[3px] border-2 border-dashed border-border bg-secondary-background/70"
                />
              ))}
            </div>
          </div>
        ))}
      </Card>

      <Button
        size="lg"
        onClick={onNext}
        className=" max-w-xs text-base font-semibold h-12 self-end"
      >
        Siguiente
        <ChevronRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );
}
