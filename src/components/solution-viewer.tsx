"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tube } from "@/components/tube";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Play,
  Pause,
  ArrowDown,
} from "lucide-react";
import type { FillEvent, FillResult } from "@/lib/filler";
import { Alert, AlertDescription } from "./ui/alert";
import { Card } from "./ui/card";
import { COLOR_HEX_MAP } from "@/lib/colors";

interface SolutionViewerProps {
  result: FillResult;
  onBackToSetup: () => void;
}

export function SolutionViewer({ result, onBackToSetup }: SolutionViewerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSteps = result.states.length;
  const tubes = result.states[currentStep];
  const currentEvent: FillEvent | null =
    currentStep > 0 ? result.events[currentStep - 1] : null;

  const goToStart = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const goToEnd = useCallback(() => {
    setCurrentStep(totalSteps - 1);
    setIsPlaying(false);
  }, [totalSteps]);

  const goForward = useCallback(() => {
    setCurrentStep((s) => {
      if (s >= totalSteps - 1) {
        setIsPlaying(false);
        return s;
      }
      return s + 1;
    });
  }, [totalSteps]);

  const goBackward = useCallback(() => {
    setCurrentStep((s) => Math.max(0, s - 1));
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => {
      if (!p && currentStep >= totalSteps - 1) {
        setCurrentStep(0);
      }
      return !p;
    });
  }, [currentStep, totalSteps]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((s) => {
          if (s >= totalSteps - 1) {
            setIsPlaying(false);
            return s;
          }
          return s + 1;
        });
      }, 800);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, totalSteps]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goForward();
      if (e.key === "ArrowLeft") goBackward();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goForward, goBackward, togglePlay]);

  const isFinalStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between w-full flex-wrap gap-3">
        <Button
          size="sm"
          onClick={onBackToSetup}
          className="text-muted-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Configurar colores
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Llenado en</span>
          <span className="text-lg font-bold text-foreground tabular-nums">
            {result.events.length}
          </span>
          <span className="text-sm text-muted-foreground">
            iteracion{result.events.length !== 1 ? "es" : ""}
          </span>
        </div>
      </div>

      <Alert className="bg-secondary-background flex items-center justify-center w-full">
        {isFirstStep ? (
          <AlertDescription>
            Estado inicial &mdash; avanza para ver el llenado
          </AlertDescription>
        ) : isFinalStep ? (
          <AlertDescription>
            Tubos completos con un color por tubo.
          </AlertDescription>
        ) : currentEvent ? (
          <AlertDescription className="flex items-center justify-center gap-3">
            <span className="uppercase">Iteracion {currentStep}:</span>
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <span
                className="rounded-md px-2.5 tabular-nums"
                style={{ backgroundColor: COLOR_HEX_MAP[currentEvent.color] }}
              >
                {currentEvent.color}
              </span>
              <ArrowDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-accent-foreground rounded-md px-2.5 tabular-nums">
                Tubo {currentEvent.tubeIndex + 1}
              </span>
            </span>
          </AlertDescription>
        ) : null}
      </Alert>

      <Card className="bg-secondary-background p-6 md:p-8 w-full min-h-60 flex items-center justify-center">
        <div className="flex flex-wrap justify-center gap-4 md:gap-5">
          {tubes.map((tube, i) => {
            const isTo = currentEvent?.tubeIndex === i && !isFirstStep;
            return <Tube key={i} tube={tube} index={i} isTarget={isTo} />;
          })}
        </div>
      </Card>

      <div className="w-full flex flex-col gap-2">
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${totalSteps <= 1 ? 100 : (currentStep / (totalSteps - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          onClick={goToStart}
          disabled={isFirstStep}
          className="h-10 w-10"
          aria-label="Ir al inicio"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          onClick={goBackward}
          disabled={isFirstStep}
          className="h-10 w-10"
          aria-label="Paso anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          onClick={togglePlay}
          disabled={totalSteps <= 1}
          className="h-12 w-12"
          aria-label={isPlaying ? "Pausar" : "Reproducir"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        <Button
          size="icon"
          onClick={goForward}
          disabled={isFinalStep}
          className="h-10 w-10"
          aria-label="Paso siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          onClick={goToEnd}
          disabled={isFinalStep}
          className="h-10 w-10"
          aria-label="Ir al final"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
