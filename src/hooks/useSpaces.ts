import { useCallback, useEffect, useState } from "react";
import { fetchSpaceProfile } from "@/src/lib/backlog";
import {
  type Space,
  activeSpaceIdStorage,
  normalizeDomain,
  spaceMetadataStorage,
  spacesStorage,
} from "@/src/lib/spaces";

export type AddSpaceInput = {
  domain: string;
  apiKey: string;
  label?: string;
};

export function useSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      spacesStorage.getValue(),
      activeSpaceIdStorage.getValue(),
    ]).then(([s, a]) => {
      if (cancelled) return;
      setSpaces(s);
      setActiveSpaceId(a);
      setLoaded(true);
    });
    const unwatchSpaces = spacesStorage.watch(setSpaces);
    const unwatchActive = activeSpaceIdStorage.watch(setActiveSpaceId);
    return () => {
      cancelled = true;
      unwatchSpaces();
      unwatchActive();
    };
  }, []);

  const addSpace = useCallback(async (input: AddSpaceInput) => {
    const domain = normalizeDomain(input.domain);
    const apiKey = input.apiKey.trim();

    // Authenticate by fetching space + user profile. Throws on bad credentials.
    const fetched = await fetchSpaceProfile({ domain, apiKey });

    const newSpace: Space = {
      id: crypto.randomUUID(),
      domain,
      apiKey,
      label: input.label?.trim() || undefined,
    };

    // Prime the SWR cache so the UI shows fresh data immediately.
    await spaceMetadataStorage(newSpace.id).setValue({
      spaceProfile: fetched.spaceProfile,
      user: fetched.user,
      updatedAt: Date.now(),
    });

    const next = [...(await spacesStorage.getValue()), newSpace];
    await spacesStorage.setValue(next);
    if ((await activeSpaceIdStorage.getValue()) == null) {
      await activeSpaceIdStorage.setValue(newSpace.id);
    }
    return newSpace;
  }, []);

  const removeSpace = useCallback(async (id: string) => {
    const next = (await spacesStorage.getValue()).filter((s) => s.id !== id);
    await spacesStorage.setValue(next);
    await spaceMetadataStorage(id).removeValue();
    const active = await activeSpaceIdStorage.getValue();
    if (active === id) {
      await activeSpaceIdStorage.setValue(next[0]?.id ?? null);
    }
  }, []);

  const setActiveSpace = useCallback(async (id: string | null) => {
    await activeSpaceIdStorage.setValue(id);
  }, []);

  return {
    spaces,
    activeSpaceId,
    loaded,
    addSpace,
    removeSpace,
    setActiveSpace,
  };
}
