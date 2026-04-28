# バージョン管理

このリポジトリは **jj (Jujutsu)** で管理する。`git` コマンドは使用しない。

## 原則

- VCS 操作はすべて `jj` で行う（`git status` / `git commit` / `git log` などは使わない）
- jj の操作方法は `jj` skill を参照する（重複説明はここに書かない）
- リモート参照は `main@origin` を使う（git の `origin/main` 相当）
- 例外: `gh` CLI（GitHub 操作）と `git cl`（Gerrit 連携）は引き続き使用可

## よく使うマッピング

| やりたいこと | 使うコマンド |
|---|---|
| 状態確認 | `jj status` |
| 履歴確認 | `jj log` |
| 差分確認 | `jj diff --git` |
| 新規作業開始 | `jj new main@origin` |
| コミット作成 | `jj commit -m "..."` |
| 説明変更 | `jj describe -m "..."` |
| 取り消し | `jj undo` |

## 注意

- 新しい作業を始める前に必ず `jj new` を実行する（@ への意図しない混入を防ぐ）
- `jj describe -m` / `jj commit -m` は説明を**上書き**する。既存の footer (`Bug:`, `Change-Id:` など) は失わないよう事前に `jj show --summary` で確認する
- `jj squash`（引数なし）と `jj upload` はユーザー確認なしに実行しない
