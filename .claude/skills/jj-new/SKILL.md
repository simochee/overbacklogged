---
name: jj-new
description: Trigger BEFORE the first file edit of any new logical task — when starting a new feature, beginning a bug fix, switching to an unrelated change, beginning a refactor, or when the previous commit description is "done" and you are about to work on something different. Advances @ to a new empty commit so the previous commit stays clean. Skip only when not in a jj repo, when @ already has no description, or when the work directly continues the previous commit's concern (e.g. fixing a bug in code you just wrote there). When unsure, invoke.
---

# jj-new

新しい作業を始める前に `@` を空コミットに進めて、前タスクのコミットに変更が混ざるのを防ぐよ〜！

## When to invoke

**MUST invoke before the first file edit (Write/Edit/NotebookEdit) of any new task.**

- 新しい機能の実装を始めるとき
- バグ修正を始めるとき
- リファクタや別関心事の作業に切り替えるとき
- ユーザーが明示的に「新しいタスク」を指示してきたとき

判断に迷ったら **default to invoking** (副作用は空コミット 1 個分だけ、低コスト)。`/clear` やセッション境界を「新タスク」の判定材料にしない — 同じ会話の続きでも別タスクの可能性があるし、`/clear` 後に同じタスクを続けることもあるから。

## When to skip

- カレントディレクトリが jj リポジトリじゃない (`jj root` が失敗する)
- `@` が既に空コミット (description が空)
- 現在の作業が直前のコミットの**直接の継続** (例: たった今書いたコードのバグ修正、同じ機能のテスト追加など)

## Procedure

1. **Check context** — まず現状を確認
   ```bash
   jj root >/dev/null 2>&1 || { echo "not in jj repo, skipping"; exit 0; }
   jj log -r '@-::@' --limit 2
   jj status
   ```

2. **Decide** — 上の出力から skip 判定
   - `@` の description が空 → skip
   - jj リポじゃない → skip
   - それ以外 → 進める

3. **Run** — `jj new` を実行
   ```bash
   jj new
   ```

4. **Acknowledge in transcript** — 何をしたか（しなかったか）を必ず一言伝える
   - 実行した場合: 「`jj new` で `@` を空コミットに進めたよ。前タスクの `<commit description>` は確定したから、ここから新タスクで作業するね！」
   - skip した場合: 「`@` は既に空（or jj 管理外）だから skip。そのまま進めて OK！」

   この **acknowledgement が監査ログ** になる。silent に実行しない。

## Why this exists

jj は **暗黙スナップショット** をするモデル。任意の `jj` コマンド実行時に working copy が `@` に取り込まれる。だから `@` のコミットメッセージが既に確定（前タスクの内容）してても、新しい編集をするとそのコミットに混ざる。前タスクと新タスクを別コミットに分けたいなら、編集を始める**前**に `@` を新しい空コミットに進める必要がある。

このスキルは `.claude/rules/vcs.md` の「新しい作業を始める前に必ず `jj new` を実行する」ルールを具体的なアクションとして実行可能にしたもの。

## Failure modes

- 既に `@` を進めずに編集を始めてしまった場合 → `jj split` で後から分離可能 (jj skill 参照)
- 同じファイルに前タスクと新タスクの変更が混ざった場合 → `jj split -i` でインタラクティブ split
