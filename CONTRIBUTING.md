# Contributing to AdminKit

If you're reading this, you're awesome! Thank you for helping us make this project great. Here are a few guidelines that will help you along the way.

## Setup

Node 24 is required. The version is pinned in `.nvmrc`.

```sh
nvm use
npm ci
npm run dev
```

`npm run dev` serves the pages on http://localhost:8080 and reloads on changes to `src/`. `npm run build` writes the production build to `dist/` (gitignored); `npm run preview` serves it. `npm ci` also installs the git hooks described below.

## Branches and PRs

- Branch from `main` using a short prefixed name: `feat/<topic>`, `fix/<topic>`, `docs/<topic>`, `chore/<topic>`
- Open the pull request against `main`
- CI must be green before a PR is merged: lint, build and commitlint all run on every PR
- Include **screenshots** or animated GIFs in your pull request for visual changes
- Reference issues and pull requests liberally

## Commits

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): subject`.

- Allowed types come from [`@commitlint/config-conventional`](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional): `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`
- Allowed scopes: `free`, `pro`, `docs`, `web`, `build`, `deps`
- Use the **imperative** mood in the subject ("Add feature" not "Added feature") and keep it under 100 characters

Examples:

```
feat(free): add offcanvas sidebar variant
fix(free): keep dropdown inside viewport on mobile
chore(deps): upgrade bootstrap to 5.3.8
```

[lefthook](https://github.com/evilmartians/lefthook) enforces this locally. The `commit-msg` hook runs commitlint on your message and the `pre-commit` hook runs ESLint and Prettier on staged files. Run `npm run lint` to check the whole repo and `npm run format` to fix formatting.

## Counts

Page, plugin and icon counts are generated, never typed: `npm run stats` updates `src/data/stats.json` and the README table, and `npm run lint` fails while either is stale. When AdminKit PRO's pages, plugins or icons change, and before every release, refresh the PRO snapshot with `npm run stats:sync -- --pro ../adminkit-pro` and commit `src/data/editions/pro.json`.

## Changelog

A PR that changes behaviour adds a line under `Unreleased` in `CHANGELOG.md`. The file follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Pure refactors, formatting and tooling changes that users never notice don't need an entry. Keep each line short, imperative and user-facing, like the released entries ("Add pricing page (/pages-pricing.html)", "Upgrade to Bootstrap v5.3.8"); one line per change a template user would notice, no internal tooling and no explanations. Notable dependency majors get "Upgrade to X vN", the rest "Upgrade dependencies".

## Releasing

Release AdminKit PRO first, so its counts are final, then this repository. A fix is a patch release; new features or names that keep the old ones working are a minor; anything that breaks a page or a name is a major.

1. Branch `chore/release-<version>` from `main`.
2. Run `npm version <version> --no-git-tag-version`, then `npm run stats:sync -- --pro ../adminkit-pro` (it runs `npm run stats` too).
3. In `CHANGELOG.md`, add `## [<version>] - <YYYY-MM-DD>` right under `## [Unreleased]`, so the unreleased lines move into it.
4. Commit as `chore(release): <version>`, open a PR titled `release: AdminKit <version>` and squash-merge it.
5. Tag the merge commit and push the tag: `git tag -a v<version> -m "AdminKit <version>" && git push origin v<version>`. The Release workflow builds `dist/` and attaches `adminkit-v<version>.zip` to a GitHub release; name it `AdminKit <version>` and paste the version's changelog lines as its notes.
6. Publish to npm from the tagged commit: `npm publish` (`prepublishOnly` builds first).
7. In the website repository, refresh the docs previews: `npm run preview:sync -- --free ../adminkit --pro ../adminkit-pro`.
