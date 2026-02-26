import { useState, useCallback } from "react";
import { StepIndicator } from "@/components/step-indicator";
import { StepStructure } from "@/components/step-structure";
import { StepColors } from "@/components/step-colors";
import { SolutionViewer } from "@/components/solution-viewer";
import { generateFillResult, type FillResult } from "@/lib/filler";
import { Loader2, Droplets } from "lucide-react";
import { MAX_LEVELS, WATER_COLORS, type TubeState } from "@/lib/colors";

const STEPS = [
  { label: "Estructura", description: "Tubos y vacios" },
  { label: "Colores", description: "Rellenar colores" },
  { label: "Llenado", description: "Ver iteraciones" },
];

type AppStep = 0 | 1 | 2;
type FillState = "idle" | "generating";

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>(0);
  const [fillState, setFillState] = useState<FillState>("idle");
  const [fillResult, setFillResult] = useState<FillResult | null>(null);

  const [totalTubes, setTotalTubes] = useState(3);
  const [emptyTubes, setEmptyTubes] = useState(1);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const fillableTubes = totalTubes - emptyTubes;
  const tubes: TubeState[] = Array.from({ length: fillableTubes }, () =>
    Array.from({ length: MAX_LEVELS }, () => null),
  );

  const handleTotalChange = useCallback((delta: number) => {
    setTotalTubes((prev) => {
      const next = Math.max(2, Math.min(WATER_COLORS.length, prev + delta));
      setEmptyTubes((prevEmpty) => {
        return Math.min(prevEmpty, next - 1);
      });
      return next;
    });
  }, []);

  const handleEmptyChange = useCallback(
    (delta: number) => {
      setEmptyTubes((prev) => {
        return Math.max(0, Math.min(totalTubes - 1, prev + delta));
      });
    },
    [totalTubes],
  );

  const normalizeSelectedColors = useCallback(() => {
    setSelectedColors((prev) => prev.slice(0, fillableTubes));
  }, [fillableTubes]);

  const handleGenerateFill = useCallback(() => {
    if (selectedColors.length !== fillableTubes) {
      return;
    }

    setFillState("generating");
    setCurrentStep(2);

    setTimeout(() => {
      const result = generateFillResult(selectedColors);
      setFillResult(result);
      setFillState("idle");
    }, 50);
  }, [selectedColors, fillableTubes]);

  const handleBackToSetup = useCallback(() => {
    setCurrentStep(1);
    setFillResult(null);
    setFillState("idle");
  }, []);

  const handleBackToStructure = useCallback(() => {
    setCurrentStep(0);
  }, []);

  const handleContinueToColors = useCallback(() => {
    normalizeSelectedColors();
    setCurrentStep(1);
  }, [normalizeSelectedColors]);

  return (
    <main className="min-h-screen bg-secondary-background py-8 px-4">
      <div className="flex flex-col items-center gap-8 w-full">
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {currentStep === 0 && (
          <StepStructure
            totalTubes={totalTubes}
            emptyTubes={emptyTubes}
            onTotalChange={handleTotalChange}
            onEmptyChange={handleEmptyChange}
            tubes={tubes}
            onNext={handleContinueToColors}
          />
        )}

        {currentStep === 1 && (
          <StepColors
            requiredCount={fillableTubes}
            selectedColors={selectedColors}
            onSelectedColorsChange={setSelectedColors}
            onBack={handleBackToStructure}
            onGenerateFill={handleGenerateFill}
          />
        )}

        {currentStep === 2 && fillState === "generating" && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-5 animate-in fade-in duration-300">
            <Droplets className="h-10 w-10 text-primary animate-pulse" />
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm font-medium">
              Generando llenado...
            </p>
          </div>
        )}

        {currentStep === 2 && fillState === "idle" && fillResult && (
          <SolutionViewer
            result={fillResult}
            onBackToSetup={handleBackToSetup}
          />
        )}
      </div>
    </main>
  );
}

export default App;
