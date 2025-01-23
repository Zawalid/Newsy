import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import DOMPurify from "dompurify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const objectDeepEquals = (a: unknown, b: unknown): boolean => {
  if (!a && !b) return true;
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object") return false;
  if (a && b && Object.keys(a).length !== Object.keys(b).length) return false;

  for (const key in a as Record<string, unknown>) {
    if (!objectDeepEquals((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]))
      return false;
  }

  return true;
};

export const filterObject = <T>(
  obj: T,
  keys: (keyof T)[],
  keysType: "include" | "exclude"
): Partial<T> => {
  const filtered: Partial<T> = {};
  for (const key in obj) {
    if (keysType === "include" && keys.includes(key)) filtered[key] = obj[key];
    if (keysType === "exclude" && !keys.includes(key)) filtered[key] = obj[key];
  }
  return filtered;
};

export const usesTauri = () => {
  return typeof (window as any).__TAURI_INTERNALS__ !== "undefined";
};

export const sanitize = (html: string) => DOMPurify.sanitize(html);

export const formatEmailText = (text: string) => {
  const cleaned = text.replace(/(\r?\n){3,}/g, "\n\n");
  const linked = cleaned.replace(
    /(https?:\/\/[^\s]+)/g,
    (url: string) =>
      `<a href="${url}" class="text-blue-500 underline" target="_blank" rel="noopener noreferrer">${url}</a>`
  );

  return linked.replace(/(\s*https?:\/\/[^\s]+)/g, "\n$1\n");
};
