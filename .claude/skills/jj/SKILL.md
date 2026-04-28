---
name: jj
description: Reference for jj (Jujutsu) commands and workflows in this repo. Use when running any jj operation beyond `jj status`/`jj log` — describing commits, splitting commits, squashing, rebasing, resolving conflicts, undoing operations, or restoring files. Covers core concepts (working-copy-as-commit, change IDs, first-class conflicts), the CLI cheat-sheet, common workflows, splitting recipes, and history reshaping.
---

# jj (Jujutsu) Version Control

jj is a git-compatible VCS (https://github.com/jj-vcs/jj) used for version control in this repository. Upstream docs: https://docs.jj-vcs.dev/

For new-task workflow rules, see the `jj-new` skill. For commit-message conventions, see `.claude/rules/commit-message.md`.

## General Tips

Most `jj` commands are non-interactive by default. For commands that accept `-i` / `--interactive` (e.g. `jj split -i`, `jj squash -i`), omit the flag for scripted/automated use. Use `-m` with `jj describe` and `jj commit` to set descriptions non-interactively. For multi-line descriptions, pass a single `-m` with embedded newlines (jj only accepts one `-m`).

## Core Concepts

### Change IDs vs Commit IDs

Every commit has two IDs:

- **Change ID** (letters k-z, e.g. `tzntmmzu`): Stable across rewrites. Use these for references. Short unique prefixes work.
- **Commit ID** (hex, e.g. `dd878c92`): Changes on every rewrite. Refers to a specific incarnation.

Always prefer Change IDs over Commit IDs in scripts and documentation.

### The Working Copy Is a Commit

The working copy is a regular commit shown as `@` in `jj log`. **Every `jj` command implicitly snapshots the working copy into `@` before doing anything else.** New files are auto-tracked; deleted files are auto-removed.

This is why mixing unrelated work into a single commit happens easily — see the `jj-new` skill for the prevention pattern.

### First-Class Conflicts

Commits can represent conflicted states. Rebases always succeed — conflicts are recorded in the commit and can be resolved later. Conflicted commits are marked `(conflict)` in `jj log`. Editing a file to remove conflict markers is sufficient — there is no separate "mark resolved" step. Resolving an ancestor conflict auto-rebases descendants, but may introduce new conflicts in them; **always resolve bottom-up** (oldest conflicted commit first).

### Operation Log and Undo

The entire repo is versioned in an operation log:

- `jj undo` — undo the last operation (repeat for multiple undos)
- `jj redo` — undo an undo
- `jj op log` — view operation history
- `jj op restore <OP_ID>` — restore to a specific operation

When you make a mistake, **prefer `jj undo` over complex graph manipulation**.

## CLI Quick Reference

| Goal | Command |
| :--- | :--- |
| Status | `jj status` |
| History | `jj log` |
| Show commit | `jj show [REV]` |
| Show with summary | `jj show --summary` |
| Diff | `jj diff --git` |
| Diff (stat) | `jj diff --stat` |
| Diff (names only) | `jj diff --name-only` |
| Diff at rev | `jj diff --git -r <REV>` |
| Diff from base | `jj diff --git --from main@origin` |
| File list | `jj file list <path>` |
| File at revision | `jj file show -r <REV> <file>` |
| New empty commit on top | `jj new` |
| New on top of REV | `jj new <REV>` |
| Set / change description | `jj describe -m "msg"` |
| Describe + start new empty | `jj commit -m "msg"` |
| Squash @ into parent (DANGEROUS, ask first) | `jj squash` |
| Move changes between commits | `jj squash --from <SRC> --into <DST> [PATHS...]` |
| Split current commit by path | `jj split <PATHS...>` |
| Rebase | `jj rebase -d <DEST> -s <SOURCE>` |
| Abandon a commit | `jj abandon <REV>` |
| Restore file from parent | `jj restore <file>` |
| Restore file from REV | `jj restore --from <REV> <file>` |
| Untrack file | `jj file untrack <file>` |
| Undo last operation | `jj undo` |
| Operation history | `jj op log` |
| Change evolution | `jj evolog -r <REV>` |

> **Always** put options/flags **before** the `--` fileset separator.
> ✅ `jj diff --git -r @- -- path/to/file`
> ❌ `jj diff -r @- -- path/to/file --git`

## Common Workflows

### Starting new work

Use the `jj-new` skill. (Mandatory before any new logical task per `.claude/rules/vcs.md`.)

### Describing the current commit

```bash
jj show --summary  # ALWAYS read existing description first
jj describe -m "feat(scope): subject

body line 1
body line 2"
```

`jj describe -m`, `jj commit -m`, and `jj squash -m` **overwrite** the full description. They drop existing footers (e.g. `Co-Authored-By:`) unless the new message includes them. Always read first.

### Modifying an earlier commit (fixup)

Prefer `jj new` + `jj squash --into` over `jj edit`:

```bash
jj new <REV>                       # child of the target
# ... make fixes ...
jj squash --into <REV>             # fold into target
```

Use `jj edit <REV>` only when you need to navigate back to a commit you just left.

### Reverting files

```bash
jj restore <file>                       # revert file to parent's version
jj restore --from main@origin <file>    # revert to upstream
jj restore --from <REV> <file>          # revert to a specific revision
jj abandon @                            # abandon current working copy commit
```

### Navigating commits

- `jj edit <REV>` — move working copy to an existing commit
- `jj new <REV>` — start new work on top of a commit

## Splitting Commits

Use when changes for two unrelated concerns ended up in the same commit (the typical "I forgot to `jj-new`" recovery).

### Path-based (top-down)

The paths listed go to the **first commit** (parent); remaining changes go to the new child commit:

```bash
jj split <REV> path/to/keep1 path/to/keep2
```

For non-interactive use (no diff editor), pass paths explicitly. **Avoid `jj split -i` in non-interactive shells — it will hang.**

### Same-file split

If both concerns touch the same file, path-based split can't separate them. Workaround: temporarily revert one half in the working copy, run path-based `jj split`, then re-apply the reverted half on top.

### Parallel split (siblings instead of parent/child)

```bash
jj split --parallel <REV> path/to/foo
```

### Validating a split

The total diff must be unchanged:

```bash
jj diff --git --from <ORIGINAL_BASE> --to @   # should match the original commit's diff
```

## History Reshaping

```bash
jj parallelize @--::@                          # 3 linear commits → 3 siblings
jj absorb                                      # auto-distribute working copy to ancestors
jj rebase --source <SRC> --onto <DEST>         # move a commit (and descendants)
jj rebase --source <SRC> --insert-before <X>   # place SRC before X
jj rebase --source <SRC> --insert-after  <X>   # place SRC after X
jj squash --from <SRC> --into <DST>            # move all changes between two commits
jj squash --from <SRC> --into <DST> file.ts    # move specific paths only
jj duplicate -r <REV> --onto <DEST>            # duplicate a commit somewhere else
```

## Conflict Resolution

Conflicts are stored in commits. Resolve bottom-up:

```bash
jj status                                  # shows (conflict) on commits
jj new <conflicted_commit>                 # child to fix in
# ... edit files to remove conflict markers ...
jj squash --into <conflicted_commit>       # fold resolution back
```

Auto-resolve helpers:

```bash
jj resolve --tool :ours <file>
jj resolve --tool :theirs <file>
jj resolve --tool :union <file>
```

## Constraints

- **Always** use `--git` with `jj diff` for git-compatible output.
- **Never** run `jj squash` (no `--into` / `--from` / `--to`) without user confirmation — it silently squashes `@` into its parent.
- **Always** preserve existing footers (e.g. `Co-Authored-By:`) when re-describing a commit; `-m` overwrites the entire description.
- **Always** put flags before the `--` fileset separator.
- **Prefer `jj undo`** over complex graph surgery when you make a mistake.
