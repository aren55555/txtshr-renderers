# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install       # Install dependencies
bun run build     # Build all renderers to dist/
bun run dev       # Build in watch mode
```

There is no test runner or linter configured.

## Architecture

**txtshr-renderers** is a renderer plugin library for the txtshr text-sharing platform. Renderers are served as self-contained ESM bundles via jsDelivr CDN directly from the GitHub repo tree.

### Renderer interface

Each renderer in `src/` exports a single function typed against `RemoteRenderer` from the `txtshr-renderer` devDependency:

```typescript
import type { RemoteRenderer } from "txtshr-renderer";
export const render: RemoteRenderer["render"] = (el, text) => { ... };
```

The txtshr viewer dynamically loads a renderer and calls `render(element, rawText)`.

### Build output

Vite bundles each `src/*.ts` file into a corresponding `dist/*.js` ESM bundle. Bundles are **fully self-contained** (all deps inlined) with **stable filenames** (no content hashes) so CDN URLs remain predictable:

```
https://cdn.jsdelivr.net/gh/aren55555/txtshr-renderers@<version>/dist/<name>.js
```

### Critical: dist/ is committed to git

jsDelivr serves files directly from the GitHub repo tree. Built artifacts in `dist/` **must be committed**. After any source change, rebuild and commit both the source and the dist output together.

### Adding a new renderer

1. Create `src/<name>.ts` exporting a `render(el, text)` function
2. Add a new entry in `vite.config.ts` under `lib.entry`
3. Run `bun run build` — this produces `dist/<name>.js`
4. Commit both source and dist files

### Mermaid CDN exception

The mermaid renderer is the only one that does **not** fully self-contain its dependency. It lazy-loads `mermaid@11` from jsDelivr at runtime to avoid a prohibitive bundle size. All other renderers inline their dependencies via Vite.

### Styling conventions

Inject CSS via a `<style>` tag guarded by a sentinel `id` check so styles are only inserted once per page. Namespace all rules under a `.txtshr-<name>` class to avoid bleeding into the host page (see `.txtshr-md` in `markdown.ts`).

### Error display pattern

Renderers surface errors as a `<p>` with inline style `color:#f87171;font-size:0.875rem;`. Both `jpeg.ts` and `mermaid.ts` use a local `error(msg)` / `errorEl(msg)` helper for this.
