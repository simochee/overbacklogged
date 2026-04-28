import { useCallback, useEffect, useRef, useState } from "react";
import { fetchSpaceProfile } from "@/src/lib/backlog";
import {
  SPACE_METADATA_TTL_MS,
  type Space,
  type SpaceMetadata,
  spaceMetadataStorage,
} from "@/src/lib/spaces";

export type UseSpaceMetadataResult = {
  data: SpaceMetadata | null;
  error: Error | null;
  isValidating: boolean;
  /** Force a revalidation regardless of TTL. */
  revalidate: () => Promise<void>;
};

export function useSpaceMetadata(space: Space | null): UseSpaceMetadataResult {
  const [data, setData] = useState<SpaceMetadata | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Hold the latest space in a ref so revalidate() always sees fresh credentials
  // without forcing the caller to recreate the callback on every render.
  const spaceRef = useRef<Space | null>(space);
  spaceRef.current = space;

  const revalidate = useCallback(async () => {
    const current = spaceRef.current;
    if (!current) return;
    setIsValidating(true);
    setError(null);
    try {
      const fetched = await fetchSpaceProfile(current);
      const next: SpaceMetadata = {
        spaceProfile: fetched.spaceProfile,
        user: fetched.user,
        updatedAt: Date.now(),
      };
      // setValue triggers watch() so React state updates via the watcher path.
      await spaceMetadataStorage(current.id).setValue(next);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsValidating(false);
    }
  }, []);

  useEffect(() => {
    if (!space) {
      setData(null);
      setError(null);
      return;
    }
    let cancelled = false;
    const item = spaceMetadataStorage(space.id);

    item.getValue().then((cached) => {
      if (cancelled) return;
      setData(cached);
      const isFresh =
        cached != null && Date.now() - cached.updatedAt < SPACE_METADATA_TTL_MS;
      if (!isFresh) revalidate();
    });

    const unwatch = item.watch((value) => {
      setData(value);
    });

    return () => {
      cancelled = true;
      unwatch();
    };
  }, [space?.id, space?.domain, space?.apiKey, revalidate]);

  return { data, error, isValidating, revalidate };
}
