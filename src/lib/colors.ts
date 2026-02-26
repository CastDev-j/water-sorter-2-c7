export const MAX_LEVELS = 2;

export const WATER_COLORS: {
  name: string;
  value: string;
  bg: string;
  border: string;
}[] = [
  { name: "Rojo", value: "red", bg: "bg-red-500", border: "border-red-600" },
  { name: "Azul", value: "blue", bg: "bg-blue-500", border: "border-blue-600" },
  {
    name: "Verde",
    value: "green",
    bg: "bg-green-500",
    border: "border-green-600",
  },
  {
    name: "Amarillo",
    value: "yellow",
    bg: "bg-yellow-400",
    border: "border-yellow-500",
  },
  {
    name: "Naranja",
    value: "orange",
    bg: "bg-orange-500",
    border: "border-orange-600",
  },
  { name: "Rosa", value: "pink", bg: "bg-pink-400", border: "border-pink-500" },
  { name: "Cyan", value: "cyan", bg: "bg-cyan-400", border: "border-cyan-500" },
  {
    name: "Morado",
    value: "purple",
    bg: "bg-purple-500",
    border: "border-purple-600",
  },
  { name: "Lima", value: "lime", bg: "bg-lime-400", border: "border-lime-500" },
  {
    name: "Indigo",
    value: "indigo",
    bg: "bg-indigo-500",
    border: "border-indigo-600",
  },
];

export const COLOR_HEX_MAP: Record<string, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#facc15",
  orange: "#f97316",
  pink: "#f472b6",
  cyan: "#22d3ee",
  purple: "#a855f7",
  lime: "#a3e635",
  indigo: "#6366f1",
};

export type TubeState = (string | null)[];
