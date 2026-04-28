import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { useSpaces } from "@/src/hooks/useSpaces";

export const Route = createFileRoute("/spaces")({
  component: SpacesPage,
});

function SpacesPage() {
  const {
    spaces,
    activeSpaceId,
    loaded,
    addSpace,
    removeSpace,
    setActiveSpace,
  } = useSpaces();
  const [domain, setDomain] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!domain.trim()) {
      setError("ドメインを入力してね！");
      return;
    }
    if (!apiKey.trim()) {
      setError("API キーを入力してね！");
      return;
    }
    setSubmitting(true);
    try {
      await addSpace({ domain, apiKey, label });
      setDomain("");
      setApiKey("");
      setLabel("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Spaces</h1>
        <p className="mt-1 text-sm text-gray-600">
          Backlog のスペースを登録して、アクティブなスペースを切り替えられるよ！
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-lg border border-gray-200 p-4"
      >
        <h2 className="text-lg font-semibold">スペースを追加</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">ドメイン</span>
            <input
              className="rounded border border-gray-300 px-2 py-1.5"
              placeholder="example.backlog.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">表示名 (任意)</span>
            <input
              className="rounded border border-gray-300 px-2 py-1.5"
              placeholder="Team A"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              autoComplete="off"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">API キー</span>
          <input
            type="password"
            className="rounded border border-gray-300 px-2 py-1.5 font-mono"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          追加する
        </button>
      </form>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">登録済みスペース</h2>
        {!loaded ? (
          <p className="text-sm text-gray-500">読み込み中...</p>
        ) : spaces.length === 0 ? (
          <p className="text-sm text-gray-500">
            まだスペースが登録されていないよ。
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200">
            {spaces.map((space) => {
              const isActive = space.id === activeSpaceId;
              return (
                <li
                  key={space.id}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <input
                    type="radio"
                    name="active-space"
                    checked={isActive}
                    onChange={() => setActiveSpace(space.id)}
                    aria-label={`${space.domain} をアクティブにする`}
                    className="size-4"
                  />
                  <div className="min-w-0 flex-1 text-sm">
                    <div className="flex items-center gap-2 font-medium">
                      <span className="truncate">
                        {space.label ?? space.domain}
                      </span>
                      {isActive && (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-700">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-gray-500">
                      {space.domain}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSpace(space.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    削除
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </section>
  );
}
