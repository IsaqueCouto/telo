export type Pace = "3months" | "6months" | "9months" | "1year";

export const PACE_DAYS: Record<Pace, number> = {
  "3months": 90,
  "6months": 182,
  "9months": 273,
  "1year": 365,
};

export const PACE_LABELS: Record<Pace, string> = {
  "3months": "3 meses",
  "6months": "6 meses",
  "9months": "9 meses",
  "1year": "1 ano",
};

export const FREE_PACE: Pace = "9months";

export function isPaceFree(pace: Pace): boolean {
  return pace === FREE_PACE;
}

export function getDayNumber(startDate: string): number {
  const start = new Date(startDate);
  const today = new Date();
  const diffMs =
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
    Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
}

export const MILESTONES = [
  { day: 7,   emoji: "🌱", message: "Você plantou uma semente!" },
  { day: 30,  emoji: "🌿", message: "Um mês de fidelidade!" },
  { day: 60,  emoji: "🌳", message: "Suas raízes estão crescendo!" },
  { day: 90,  emoji: "⭐", message: "Você já leu um quarto da Bíblia!" },
  { day: 182, emoji: "🏆", message: "Seis meses — que jornada!" },
  { day: 273, emoji: "👑", message: "Você leu a Bíblia inteira!" },
  { day: 365, emoji: "👑", message: "Um ano completo — que jornada!" },
];
