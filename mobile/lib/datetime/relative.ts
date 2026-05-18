import { differenceInDays, differenceInMonths, differenceInWeeks, format } from "date-fns";
import { pt } from "date-fns/locale";

export function formatRelativeDate(date: Date, now: Date = new Date()): string {
  const days = differenceInDays(now, date);

  if (days < 0) {
    return format(date, "dd/MM/yyyy", { locale: pt });
  }

  if (days < 7) {
    if (days === 0) return "hoje";
    if (days === 1) return "há 1 dia";
    return `há ${days} dias`;
  }

  const weeks = differenceInWeeks(now, date);
  if (weeks < 4) {
    if (weeks === 1) return "há 1 semana";
    return `há ${weeks} semanas`;
  }

  const months = differenceInMonths(now, date);
  if (months < 12) {
    if (months === 1) return "há 1 mês";
    return `há ${months} meses`;
  }

  return format(date, "dd/MM/yyyy", { locale: pt });
}
