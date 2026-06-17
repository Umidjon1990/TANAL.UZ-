import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("uz-Latn-UZ", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Tashkent"
  }).format(date);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("uz-Latn-UZ", {
    dateStyle: "medium",
    timeZone: "Asia/Tashkent"
  }).format(date);
}

export function formatMoney(amount?: number | null) {
  if (!amount) return "Ko'rsatilmagan";

  return new Intl.NumberFormat("uz-Latn-UZ").format(amount) + " so'm";
}
