import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const addZeroIfNecessary = (value: number) =>
  value < 10 ? `0${value}` : value;

export const generateKeyMonthYear = (month: number, year: number) => {
  if (month > 12 || month < 1) {
    throw new Error("Month must be between 1 and 12");
  }

  return `${addZeroIfNecessary(month)}-${year}`;
};
