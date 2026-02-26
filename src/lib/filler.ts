import { MAX_LEVELS, type TubeState } from "@/lib/colors";

export interface FillEvent {
  tubeIndex: number;
  color: string;
}

export interface FillResult {
  states: TubeState[][];
  events: FillEvent[];
  selectedColors: string[];
}

function cloneTubes(tubes: TubeState[]): TubeState[] {
  return tubes.map((tube) => [...tube]);
}

function getEmptyTubes(tubeCount: number): TubeState[] {
  return Array.from({ length: tubeCount }, () =>
    Array.from({ length: MAX_LEVELS }, () => null),
  );
}

function shuffleColors(colors: string[]): string[] {
  const copy = [...colors];

  for (let index = copy.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

export function generateFillResult(selectedColors: string[]): FillResult {
  const tubes = getEmptyTubes(selectedColors.length);
  const inventory = new Map<string, number>();
  const tubeByColor = new Map<string, number>();

  selectedColors.forEach((color, index) => {
    inventory.set(color, MAX_LEVELS);
    tubeByColor.set(color, index);
  });

  const events: FillEvent[] = [];
  const states: TubeState[][] = [cloneTubes(tubes)];
  let remaining = selectedColors.length * MAX_LEVELS;
  let queue: string[] = [];

  while (remaining > 0) {
    if (queue.length === 0) {
      const availableColors = selectedColors.filter((color) => {
        const units = inventory.get(color) ?? 0;
        return units > 0;
      });

      queue = shuffleColors(availableColors);
    }

    const nextColor = queue.shift();

    if (!nextColor) {
      continue;
    }

    const targetTubeIndex = tubeByColor.get(nextColor);

    if (targetTubeIndex === undefined) {
      continue;
    }

    const targetTube = tubes[targetTubeIndex];
    const slotIndex = targetTube.findIndex((slot) => slot === null);

    if (slotIndex === -1) {
      inventory.set(nextColor, 0);
      continue;
    }

    targetTube[slotIndex] = nextColor;
    inventory.set(nextColor, (inventory.get(nextColor) ?? 0) - 1);
    remaining--;

    events.push({
      tubeIndex: targetTubeIndex,
      color: nextColor,
    });
    states.push(cloneTubes(tubes));
  }

  return {
    states,
    events,
    selectedColors: [...selectedColors],
  };
}
