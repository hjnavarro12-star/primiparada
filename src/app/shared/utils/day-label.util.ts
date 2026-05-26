export const DAY_LABELS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] as const;

export function dayLabel(day: number): string {
  return DAY_LABELS[day] ?? 'Día';
}