# コミットメッセージ規約

このリポジトリは **Conventional Commits** に従う。コミットは `jj commit -m` または `jj describe -m` で記述する（VCS ルールは `vcs.md` を参照）。

## 形式

```
<type>(<scope>): <subject>

<body（任意）>

<footer（任意）>
```

- `<type>`: 必須。下表から選ぶ
- `<scope>`: 任意。影響範囲を1語で（例: `popup`, `background`, `storybook`, `ci`）
- `<subject>`: 必須。**命令形・現在形**、小文字始まり、末尾にピリオドを付けない、50文字以内目安
- `<body>`: 「なぜ」変更したかを書く。「何を」はコードを見れば分かるので不要
- 日本語可。ただし type と scope は英小文字

## type の選び方

| type | 用途 | 例 |
|---|---|---|
| `feat` | **エンドユーザーから見える新機能の追加** | 新しい画面追加、新しいコマンド追加 |
| `fix` | バグ修正 | クラッシュ修正、誤動作の訂正 |
| `refactor` | 動作を変えない内部改善 | 関数分割、変数リネーム、型整理 |
| `perf` | パフォーマンス改善 | アルゴリズム最適化 |
| `style` | フォーマット・空白・セミコロン等 | prettier 適用 |
| `test` | テストの追加・修正のみ | 新規テストケース、テスト修正 |
| `docs` | ドキュメントのみ | README、コメント |
| `build` | ビルドシステム・依存関係 | 依存追加、tsconfig 変更 |
| `ci` | CI 設定 | GitHub Actions、workflow |
| `chore` | 上記以外の雑務 | リネーム、設定整理、リリース作業 |

## `feat` を乱用しない

`feat` は **エンドユーザー視点で「新しくできるようになったこと」** がある場合のみ使う。以下は `feat` ではない:

| ケース | 正しい type |
|---|---|
| 内部関数を分割した | `refactor` |
| 既存機能の見た目だけ調整した | `style` または `refactor` |
| 依存ライブラリを追加した（機能は未公開） | `build` |
| テストを追加した | `test` |
| Storybook のストーリーを追加した | `docs` または `chore`（用途による） |
| 設定ファイルを追加・変更した | `chore` または `build` |
| ツール導入（lint, formatter 等） | `build` または `chore` |
| 既存機能の改善（新しい挙動が増えていない） | `refactor` または `fix` |

判断に迷ったら「**この変更でユーザーが新しく何かできるようになったか？**」を自問する。Yes → `feat`、No → 別の type。

## ベストプラクティス

- **1コミット1目的**: 関係ない変更は分ける（`jj split` を活用）
- **subject は要約に徹する**: 詳細は body に書く
- **breaking change は `!` を付ける**: `feat!: ...` または footer に `BREAKING CHANGE: ...`
- **revert は `revert: <元のコミットの subject>`** とする
- **WIP/wip コミットは残さない**: 統合前に `jj squash` でまとめる

## 良い例

```
feat(popup): add keyboard shortcut to toggle dark mode
fix(background): prevent duplicate event listener registration
refactor(storage): extract serialization into dedicated module
build: add @types/chrome to devDependencies
ci: pin actions/checkout to v4
chore: rename project from foo to overbacklogged
```

## 悪い例

```
feat: refactor utils                    # 機能追加ではないので feat 違反
update                                  # 何をしたか分からない
fix: bug                                # 具体性なし
feat: add prettier config               # ユーザーから見えない → build か chore
Feat(Popup): Added new button.          # 大文字始まり・過去形・末尾ピリオド NG
```
