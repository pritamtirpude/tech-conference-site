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

TanStack Start (React) app for a tech conference site, deployed on Vercel.

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
```

## Stack

| Concern         | Choice                                                             |
| --------------- | ------------------------------------------------------------------ |
| Framework       | TanStack Start (`@tanstack/react-start`), React 19                 |
| Routing         | TanStack Router, file-based (`src/routes`, `routeTree.gen.ts`)     |
| Data            | TanStack Query + `@tanstack/react-router-ssr-query` SSR dehydrate  |
| Styling         | Tailwind CSS v4 (`@tailwindcss/vite`)                              |
| Toolchain       | ESLint (`@tanstack/eslint-config`) + Prettier                      |
| Package manager | pnpm                                                               |
| Deployment      | Vercel via Nitro (`nitro/vite` plugin + `vercel.json`)             |
| Agent skills    | TanStack Intent (`pnpm exec intent list` / `load`)                 |

## Layout

- `src/router.tsx` — `getRouter()` creates the router with `{ queryClient }` context and wires SSR query integration.
- `src/integrations/tanstack-query/` — QueryClient factory + devtools panel.
- `src/routes/__root.tsx` — document shell (`HeadContent`, `Scripts`), Header/Footer, devtools.
- `src/routes/demo/tanstack-query.tsx` — client-side `useQuery` demo (from scaffold).
- `src/routes/demo/schedule.tsx` — **Start + Router + Query together**: `createServerFn` → `queryOptions` → loader `ensureQueryData` → `useSuspenseQuery`. Use this as the pattern for real data.
- `src/routeTree.gen.ts` — generated; never edit by hand.

## Scripts

`pnpm dev` (port 3000) · `pnpm build` · `pnpm preview` · `pnpm lint` · `pnpm format` · `pnpm check` · `pnpm generate-routes`

## Environment variables

None required yet. When adding them:
- Secrets: read via `process.env.X` **only inside `createServerFn` / server routes** (loaders are isomorphic).
- Client-exposed values must be prefixed `VITE_` and read via `import.meta.env.VITE_X`.
- Local: `.env` / `.env.local` (git-ignored). Vercel: Project Settings → Environment Variables.

## Deployment (Vercel)

- Import the Git repo in Vercel; `vercel.json` sets `framework: "tanstack-start"`. Build command `pnpm build`, Nitro auto-selects the Vercel preset in Vercel's build environment.
- Or CLI: `npm i -g vercel && vercel` (then `vercel --prod`).
- Locally `pnpm build` emits a Node server in `.output/` (`node .output/server/index.mjs`).

## Key decisions

- Kept the standard CLI scaffold (header/about/demos, Tailwind) rather than `--blank`, because the requested command includes `--tailwind` and the Query add-on demo; `--blank` would strip Tailwind/devtools.
- Server-only work goes through `createServerFn`; data is fetched through TanStack Query `queryOptions` so loaders and components share one cache key.

## Known gotchas

- **pnpm 9 vs generated `pnpm-workspace.yaml`**: CLI writes pnpm 10+ `allowBuilds`, and pnpm 9 errors with "packages field missing or empty". Fixed by adding `packages: ['.']`. Side effect: `pnpm add` needs `-w`. If you upgrade to pnpm 10+, you can drop the `packages` entry.
- **Intent install is interactive by default**: it refuses to run until `package.json` → `intent.skills` lists allowed skill sources. The allowlist was added manually; use `pnpm exec intent install --review` to change it.
- Peer warning: `@tanstack/eslint-config` pulls `@eslint/js@10` which wants eslint 10; eslint 9 works fine for now.
- `unrs-resolver` build script is ignored by pnpm; harmless unless eslint import resolution misbehaves (then add it to `onlyBuiltDependencies` and `pnpm rebuild`).
- Rolldown "use client" directive warnings during build are expected and harmless.

## Next steps

- Replace demo content with real pages: schedule, speakers (`/speakers/$speakerId`), venue, tickets.
- Move server functions into `*.functions.ts` files once there are several (per Start server-functions skill).
- Add a data source (CMS/DB) behind `createServerFn`; add env vars accordingly.
- Connect the repo to Vercel and set production env vars.
