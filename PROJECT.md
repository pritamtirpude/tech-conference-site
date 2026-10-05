<!-- intent-skills:start -->

## Skill Loading

Use the repository’s installed Intent. If it is unavailable, report the missing dependency instead of downloading a replacement.
Before editing files for a substantial task:

- Run `pnpm exec intent list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `pnpm exec intent load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.

<!-- intent-skills:end -->

# Project Context — tech-conference-site

Tech conference site as a pnpm + Turborepo monorepo: a TanStack Start (React) frontend deployed on Vercel, plus a Sanity Studio (CMS).

## Monorepo layout

```
apps/
  frontend/   TanStack Start app (package name `frontend`) — everything under "Layout" below is relative to this folder
  studio/     Sanity Studio (package name `studio`, dev on port 3333) — see "Sanity Studio"
packages/
  sanity/     `@repo/sanity` — Sanity code shared by frontend + studio
turbo.json    task pipeline: build, dev, preview, lint, typecheck
```

- Root `package.json` holds only workspace tooling: `turbo`, `prettier` (+ shared `prettier.config.js`), `@tanstack/intent` and its `intent.skills` allowlist, `pnpm.onlyBuiltDependencies` (pnpm only honours this at the root).
- Each app owns its own ESLint config, tsconfig and runtime deps.
- **`@repo/sanity` is an internal package with no build step**: `exports` points at `./src/index.ts`, and each consumer's bundler (Vite in both apps) compiles it. Consumers depend on it with `"@repo/sanity": "workspace:^"` (both apps already do). Only its `typecheck` script exists, and Turbo runs it before the apps' typecheck (`^typecheck`). Keep it to genuinely shared code — schema definitions, generated types, GROQ queries, shared constants — not app-specific code.
- After adding a new workspace package, run a plain `pnpm install` from the root; `pnpm --filter x add` doesn't create the new package's own `node_modules`.
- Run app-scoped commands with a filter: `pnpm --filter frontend <script>` / `pnpm --filter frontend add <pkg>`. Root-level dev deps need `pnpm add -D -w <pkg>`.

## How this project was created

```bash
# Scaffold (run inside this folder; --target-dir . and --non-interactive were added
# so the app lands here instead of ./my-tanstack-app)
npx @tanstack/cli@latest create my-tanstack-app --agent --package-manager pnpm --tailwind --deployment vercel --toolchain eslint --add-ons tanstack-query --target-dir . --non-interactive

# Follow-up
pnpm install
pnpm generate-routes
npx @tanstack/intent@latest install   # needs package.json "intent.skills" allowlist (see below)
npx @tanstack/intent@latest list
pnpm add -D -w @tanstack/intent      # so `pnpm exec intent ...` works locally

# Later: converted to a monorepo — app moved to apps/frontend, then at the root:
pnpm add -D -w turbo
pnpm install
```

## Stack

| Concern         | Choice                                                               |
| --------------- | -------------------------------------------------------------------- |
| Framework       | TanStack Start (`@tanstack/react-start`), React 19                   |
| Routing         | TanStack Router, file-based (`src/routes`, `routeTree.gen.ts`)       |
| Data            | TanStack Query + `@tanstack/react-router-ssr-query` SSR dehydrate    |
| Styling         | Tailwind CSS v4 (`@tailwindcss/vite`)                                |
| Toolchain       | ESLint (`@tanstack/eslint-config`) + Prettier                        |
| Package manager | pnpm 9 workspaces (`apps/*`, `packages/*`)                           |
| Monorepo tasks  | Turborepo 2 (`turbo.json`)                                           |
| CMS             | Sanity Studio v6 in `apps/studio` (project `2ucm6pnj`, `production`) |
| Deployment      | Vercel via Nitro (`nitro/vite` plugin + `vercel.json`)               |
| Agent skills    | TanStack Intent (`pnpm exec intent list` / `load`)                   |

## Layout (`apps/frontend`)

- `src/router.tsx` — `getRouter()` creates the router with `{ queryClient }` context and wires SSR query integration.
- `src/integrations/tanstack-query/` — QueryClient factory + devtools panel.
- `src/routes/__root.tsx` — document shell (`HeadContent`, `Scripts`), Header/Footer, devtools.
- `src/routes/demo/tanstack-query.tsx` — client-side `useQuery` demo (from scaffold).
- `src/routes/demo/schedule.tsx` — **Start + Router + Query together**: `createServerFn` → `queryOptions` → loader `ensureQueryData` → `useSuspenseQuery`. Use this as the pattern for real data.
- `src/routeTree.gen.ts` — generated; never edit by hand.

## Scripts

From the root (run through turbo across all apps): `pnpm dev` (frontend on port 3000) · `pnpm build` · `pnpm preview` · `pnpm lint` · `pnpm typecheck`.
Root-only (prettier over the whole repo): `pnpm format` · `pnpm check`.
Frontend-only: `pnpm --filter frontend generate-routes` · `pnpm --filter frontend lint:fix`.

Turbo caches `build`/`lint`/`typecheck` in `.turbo/` (git-ignored). `build` declares `env: ["VITE_*", "SANITY_STUDIO_*"]` because Turbo 2 runs tasks in strict env mode — **any new env var a build reads must be added to `turbo.json`** or it is filtered out (and won't bust the cache).

## Sanity Studio

Scaffolded with the `clean` template (no sample data):

```bash
npx sanity@latest login   # once per machine; init fails with "No valid authentication credentials" otherwise
npx create-sanity@latest --project 2ucm6pnj --dataset production --template clean   --output-path apps/studio --typescript --package-manager pnpm --no-git --no-install -y
pnpm install              # from the root
```

- Then: package renamed to `studio`; added `lint` (`eslint .`) and `typecheck` (`tsc --noEmit`) scripts and the `@repo/sanity` dependency.
- **Seed data**: `apps/studio/seed/` holds the challenge's `data.json` + speaker avatars. `pnpm --filter studio import-data -- --dry-run` previews; without `--dry-run` it uploads avatars and writes all documents in one transaction via `scripts/import-starter-data.ts` (`sanity exec --with-user-token`, so it uses your `sanity login`). Idempotent (deterministic IDs like `speaker-sp_0`, `createOrReplace`), but it **overwrites Studio edits** to those documents. It pads times to `HH:mm` and generates speaker slugs.
- `pnpm --filter studio dev` → http://localhost:3333 (no clash with the frontend's 3000). `sanity build` → `apps/studio/dist/` (already in turbo outputs).
- `projectId`/`dataset` are hard-coded in `sanity.config.ts` and `sanity.cli.ts` (they're public identifiers, not secrets). Studio env vars must be prefixed `SANITY_STUDIO_`.
- The studio has its own toolchain versions, separate from the frontend: ESLint 10 + `@sanity/eslint-config-studio`, TypeScript 5.x, and a `prettier` key in its `package.json` (`printWidth: 100`, `bracketSpacing: false`) that overrides the root Prettier config for studio files.

## Environment variables

None required yet. When adding them:

- Secrets: read via `process.env.X` **only inside `createServerFn` / server routes** (loaders are isomorphic).
- Client-exposed values must be prefixed `VITE_` and read via `import.meta.env.VITE_X`.
- Local: `apps/<app>/.env` / `.env.local` (git-ignored; per app, not at the root). Vercel: Project Settings → Environment Variables.

## Deployment (Vercel)

- Import the Git repo in Vercel and set **Root Directory = `apps/frontend`** (Vercel detects the pnpm workspace + Turborepo and installs from the repo root). `apps/frontend/vercel.json` sets `framework: "tanstack-start"`. Nitro auto-selects the Vercel preset in Vercel's build environment (`VERCEL*` vars are in turbo `passThroughEnv` for that reason).
- Sanity Studio is deployed separately (`sanity deploy` to `*.sanity.studio`, or a second Vercel project with Root Directory `apps/studio`).
- Or CLI: `npm i -g vercel && vercel` (then `vercel --prod`).
- Locally `pnpm build` emits a Node server in `apps/frontend/.output/` (`node .output/server/index.mjs`).

## Key decisions

- Kept the standard CLI scaffold (header/about/demos, Tailwind) rather than `--blank`, because the requested command includes `--tailwind` and the Query add-on demo; `--blank` would strip Tailwind/devtools.
- Server-only work goes through `createServerFn`; data is fetched through TanStack Query `queryOptions` so loaders and components share one cache key.

## Known gotchas

- **pnpm 9 vs `allowBuilds`**: `pnpm-workspace.yaml` still has the pnpm 10+ `allowBuilds` key from the scaffold; pnpm 9 ignores it and uses root `package.json` → `pnpm.onlyBuiltDependencies`. Keep both in sync until you upgrade pnpm (then also bump `packageManager`, which Turbo requires).
- **`pnpm add -w` only links the root**: after moving packages around, run a plain `pnpm install` so every workspace gets its `node_modules`.
- **Intent install is interactive by default**: it refuses to run until `package.json` → `intent.skills` lists allowed skill sources. The allowlist was added manually; use `pnpm exec intent install --review` to change it.
- **Intent writes to AGENTS.md**: re-running `intent install` inserts its `intent-skills` block into AGENTS.md (which holds the mentor-persona guide). The block's canonical copy lives at the top of this file; remove the duplicate from AGENTS.md if it reappears.
- Peer warning: `@tanstack/eslint-config` pulls `@eslint/js@10` which wants eslint 10; eslint 9 works fine for now.
- `unrs-resolver` build script is ignored by pnpm; harmless unless eslint import resolution misbehaves (then add it to `onlyBuiltDependencies` and `pnpm rebuild`).
- Rolldown "use client" directive warnings during build are expected and harmless.

## Next steps

- Replace demo content with real pages: schedule, speakers (`/speakers/$speakerId`), venue, tickets.
- Move server functions into `*.functions.ts` files once there are several (per Start server-functions skill).
- Define content schemas (speakers, sessions, …), then query Sanity from the frontend behind `createServerFn`; add env vars to the app's `.env` and to `turbo.json`.
- Connect the repo to Vercel and set production env vars.
