# バージョン管理

このリポジトリは **jj (Jujutsu)** で管理する。`git` コマンドは使わない（例外: GitHub 操作の `gh` CLI のみ可）。

## プロジェクト方針

このリポジトリは **個人開発プロジェクト**。Pull Request は必須ではなく、`main` への直接 push を許容する。

- 並行作業は `jj workspace add ../<name>` で別ワークスペースを切って進める（git の worktree 相当）
- 作業の取り込み = `jj bookmark set main -r @` → `jj git push --bookmark main`（push 自体はユーザー確認のうえ実行）
- PR が必要なケース（外部レビューを受けたい、CI を経由したい等）はユーザーが明示的に指示する

## 必ず守るルール

- 新しいタスクの**最初のファイル編集の前に** `jj-new` skill を invoke する。判定に迷ったら invoke (default to action)。
- リモート参照は `main@origin`（git の `origin/main` 相当）。
- 以下はユーザー確認なしに実行しない:
  - `jj squash`（引数なしの形）— 暗黙に working copy を親に潰す
  - push 系・強制的な履歴書き換え（`main` への push を含む）

## 詳細はスキル参照

- `jj-new` skill — 新タスク開始時の手順
- `jj` skill — コマンドリファレンス、split / squash / rebase / conflict 解決などの詳細手順

ここに重複した手順は書かない（更新コストとズレの温床になるため）。
