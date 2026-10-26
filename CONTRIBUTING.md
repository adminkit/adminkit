# Contributing to AdminKit

If you're reading this, you're awesome! Thank you for helping us make this project great. Here are a few guidelines that will help you along the way.

## Setup

Node 24 is required. The version is pinned in `.nvmrc`.

```sh
nvm use
npm ci
npm start
```

`npm start` serves `static/` on http://localhost:8080 and rebuilds `src/` on change. `npm run build` creates a production build in `dist/` and copies it into `static/`. `npm ci` also installs the git hooks described below.

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

## Changelog

A PR that changes behaviour adds a line under `Unreleased` in `CHANGELOG.md`. The file follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Pure refactors, formatting and tooling changes that users never notice don't need an entry.
