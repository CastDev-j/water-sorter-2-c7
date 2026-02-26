"use client";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface Step {
  label: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const totalSteps = Math.max(steps.length - 1, 1);
  const progress = (currentStep / totalSteps) * 100;
  const activeStep = steps[currentStep];

  return (
    <nav aria-label="Progreso" className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-2">
        <Progress value={progress} className="w-full" />
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {currentStep + 1} / {steps.length}
          </span>
          {activeStep ? (
            <span className={cn("font-medium", "text-foreground")}>
              {activeStep.label}
            </span>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
