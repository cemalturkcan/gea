# Changesets Required for All Package Changes

**CRITICAL**: When committing changes that affect any publishable package, you MUST create a changeset file (`.changeset/<descriptive-name>.md`) as part of the commit workflow.

## Packages in this monorepo

- `@geajs/core` — core runtime (packages/gea)
- `@geajs/vite-plugin` — compiler/Vite plugin (packages/vite-plugin-gea)
- `@geajs/ui` — UI component library (packages/gea-ui)
- `@geajs/mobile` — mobile support (packages/gea-mobile)
- `create-gea` — project scaffolding CLI (packages/create-gea)
- `gea-tools` — internal tooling, ignored by changesets (packages/gea-tools)

`@geajs/core` and `@geajs/vite-plugin` are **linked** — version bumps are coordinated.

## Format

```markdown
---
"@geajs/core": patch
"@geajs/vite-plugin": patch
---

### @geajs/vite-plugin (patch)

- **Feature/fix name**: Description

### @geajs/core (patch)

- **Feature/fix name**: Description
```

## Rules

- Create the changeset BEFORE or WITH the commits, never after being reminded
- Include ALL affected packages in the changeset frontmatter
- Bump levels: `patch` for fixes/perf, `minor` for new features, `major` for breaking changes
- Group descriptions by package with `###` headers
- Look at existing `.changeset/*.md` files for style reference
- If the user says "changeset" in their request, that is a **separate deliverable** — do not skip it
