// Tremor Raw cx [v0.0.0]

import clsx from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...args) {
  return twMerge(clsx(...args))
}

// Tremor Raw focusInput [v0.0.1]

export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-blue-200 focus:dark:ring-blue-700/30",
  // border color
  "focus:border-blue-500 focus:dark:border-blue-700",
]

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-blue-500 dark:outline-blue-500",
]

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
  // base
  "ring-2",
  // border color
  "border-red-500 dark:border-red-700",
  // ring color
  "ring-red-200 dark:ring-red-700/30",
]

const usdToEur = 0.92;
const usdToEgp = 48.59;

export const convertPrice = (price, currency) => {
  if(currency === 'USD') return price;
  if(currency === 'EUR') return (price * usdToEur).toFixed(2);
  if(currency === 'EGP') return (price * usdToEgp).toFixed(2);
  return price;
}