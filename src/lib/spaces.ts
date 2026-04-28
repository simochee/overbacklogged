import { storage, type WxtStorageItem } from "wxt/utils/storage";
import type { SpaceProfile, UserProfile } from "@/src/lib/backlog";

export type Space = {
  id: string;
  domain: string;
  apiKey: string;
  label?: string;
};

export type SpaceMetadata = {
  spaceProfile: SpaceProfile;
  user: UserProfile;
  updatedAt: number;
};

// Anything older than this triggers a background revalidation.
export const SPACE_METADATA_TTL_MS = 5 * 60 * 1000;

export const spacesStorage = storage.defineItem<Space[]>("local:spaces", {
  fallback: [],
});

export const activeSpaceIdStorage = storage.defineItem<string | null>(
  "local:activeSpaceId",
  { fallback: null },
);

const metadataItemCache = new Map<
  string,
  WxtStorageItem<SpaceMetadata | null, Record<string, unknown>>
>();

export function spaceMetadataStorage(spaceId: string) {
  let item = metadataItemCache.get(spaceId);
  if (!item) {
    item = storage.defineItem<SpaceMetadata | null>(
      `local:spaceMetadata:${spaceId}`,
      { fallback: null },
    );
    metadataItemCache.set(spaceId, item);
  }
  return item;
}

export function normalizeDomain(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "")
    .toLowerCase();
}
