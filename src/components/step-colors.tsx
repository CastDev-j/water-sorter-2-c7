"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronLeft, RotateCcw, Cat } from "lucide-react";
import { WATER_COLORS, COLOR_HEX_MAP } from "@/lib/colors";
import { Card } from "./ui/card";
import { Tube } from "./tube";

interface StepColorsProps {
  requiredCount: number;
  selectedColors: string[];
  onSelectedColorsChange: (colors: string[]) => void;
  onBack: () => void;
  onGenerateFill: () => void;
}

export function StepColors({
  requiredCount,
  selectedColors,
  onSelectedColorsChange,
  onBack,
  onGenerateFill,
}: StepColorsProps) {
  const selectedSet = new Set(selectedColors);
  const isComplete = selectedColors.length === requiredCount;

  const handleToggleColor = (color: string) => {
    const alreadySelected = selectedSet.has(color);

    if (alreadySelected) {
      onSelectedColorsChange(selectedColors.filter((item) => item !== color));
      return;
    }

    if (selectedColors.length >= requiredCount) {
      return;
    }

    onSelectedColorsChange([...selectedColors, color]);
  };

  const handleReset = () => {
    onSelectedColorsChange([]);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
      <Card className="bg-secondary-background p-5 w-full">
        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground block">
          Seleccion de colores ({selectedColors.length}/{requiredCount})
        </Label>
        <div className="flex flex-wrap gap-2.5">
          {WATER_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleToggleColor(color.value)}
              disabled={
                !selectedSet.has(color.value) &&
                selectedColors.length >= requiredCount
              }
              className={`h-10 w-10 cursor-pointer rounded-base border-2 border-border shadow-shadow transition-all duration-150 ${
                selectedSet.has(color.value)
                  ? "-translate-x-boxShadowX -translate-y-boxShadowY"
                  : "hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-shadow"
              }`}
              style={{ backgroundColor: COLOR_HEX_MAP[color.value] }}
              title={color.name}
              aria-label={`Seleccionar color ${color.name}`}
            />
          ))}
        </div>
      </Card>

      <Card className="bg-secondary-background p-5 w-full">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Vista previa de tubos ({requiredCount})
          </Label>
          <Button
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Limpiar
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          {Array.from({ length: requiredCount }).map((_, index) => {
            const color = selectedColors[index];
            const tube = color ? [color, color] : [null, null];

            return <Tube key={index} tube={tube} index={index} />;
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Selecciona {requiredCount} color{requiredCount !== 1 ? "es" : ""}{" "}
            para llenar {requiredCount} tubo{requiredCount !== 1 ? "s" : ""}.
          </p>
        </div>
      </Card>

      <div className="flex justify-between gap-3 w-full ">
        <Button size="lg" onClick={onBack} className="h-12">
          <ChevronLeft className="h-5 w-5 mr-2" />
          Atras
        </Button>
        <Button
          size="lg"
          onClick={onGenerateFill}
          disabled={!isComplete}
          className="text-base font-semibold h-12"
        >
          <Cat className="h-5 w-5 mr-2" />
          Generar llenado
        </Button>
      </div>
    </div>
  );
}
