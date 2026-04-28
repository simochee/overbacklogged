import { storage } from "wxt/utils/storage";

export type Space = {
  id: string;
  domain: string;
  apiKey: string;
  label?: string;
};

export const spacesStorage = storage.defineItem<Space[]>("local:spaces", {
  fallback: [],
});

export const activeSpaceIdStorage = storage.defineItem<string | null>(
  "local:activeSpaceId",
  { fallback: null },
);

export function normalizeDomain(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "")
    .toLowerCase();
}
