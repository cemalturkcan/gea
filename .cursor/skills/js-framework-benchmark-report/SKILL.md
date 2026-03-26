name: js-framework-benchmark-report
description: Use when the user asks to run js-framework-benchmark, update the benchmark report, refresh webdriver-ts-results, regenerate the HTML results page, run all frameworks for this repo, or compare Gea against other configured frameworks.
---

# JS Framework Benchmark Report

## Use This Workflow

In this repo, "all frameworks" means the frameworks configured in `benchmark-report.config.json`, not the full upstream js-framework-benchmark matrix.

Do not run the full upstream matrix unless the user explicitly says they want the upstream/full/every-framework benchmark.

Do not run bare `npm run results` in `js-framework-benchmark` for this project unless the user explicitly wants the full upstream matrix.

Use the repo-local wrapper instead:

```bash
node scripts/update-js-framework-benchmark-report.mjs
```

That script:

1. Reads the curated framework list from `benchmark-report.config.json`
2. Regenerates `webdriver-ts-results/src/results.ts` with framework filtering
3. Rebuilds `webdriver-ts-results/dist`

## Interpretation Rules

- User says "run all frameworks", "benchmark all frameworks", or similar for this repo:
  run only the configured framework set from `benchmark-report.config.json`
- User says "full upstream matrix", "every framework in js-framework-benchmark", or explicitly asks for the upstream benchmark:
  use the upstream workflow instead of the repo-local curated workflow
- If the wording is ambiguous, prefer the configured repo-local framework set
- After rebuilding the report, provide the local URL:
  `http://localhost:8080/webdriver-ts-results/dist/index.html`

For the normal shared HTML report, do not pass any `--framework` overrides.

If you pass `--framework keyed/gea` or any other narrowed list, the rebuilt report will only show that subset. That is only correct for an explicitly requested one-off filtered report, not for the default comparison view.

## Default Framework Set

The default report is intentionally limited to the frameworks this project compares most often:

- `keyed/vanillajs`
- `keyed/gea`
- `keyed/solid`
- `keyed/vue`
- `keyed/react-hooks`

Edit `benchmark-report.config.json` if the preferred comparison set changes.

## Common Commands

Refresh the filtered HTML report from existing raw result files:

```bash
node scripts/update-js-framework-benchmark-report.mjs
```

This is the safe default. Use this whenever the user says "update the report", "refresh the HTML", or wants the normal comparison screen back.

Run the configured framework set for this repo, then rebuild the shared report:

```bash
node scripts/update-js-framework-benchmark-report.mjs --run --rebuild
```

Use this when the user asks to "run all frameworks" in this repo. This means all configured frameworks, not the full upstream matrix.

Run selected benchmarks first, then rebuild the filtered report:

```bash
node scripts/update-js-framework-benchmark-report.mjs \
  --run \
  --rebuild \
  --framework keyed/gea \
  --benchmark 03_update10th1k_x16 \
  --benchmark 09_clear1k_x8
```

Important: the command above intentionally rebuilds a one-off report containing only `keyed/gea` and the selected benchmark rows. If the user wants to keep the normal multi-framework report, rerun this immediately afterward:

```bash
node scripts/update-js-framework-benchmark-report.mjs
```

Override the framework set for a one-off report:

```bash
node scripts/update-js-framework-benchmark-report.mjs \
  --framework keyed/vanillajs \
  --framework keyed/sonnet \
  --framework keyed/gea \
  --framework keyed/solid \
  --framework keyed/vue \
  --framework keyed/react-hooks
```

## Notes

- The wrapper expects the sibling checkout at `../js-framework-benchmark`.
- The benchmark server must be running when regenerating the report because `createResultJS` queries the `/ls` endpoint.
- Benchmark filtering is optional. If you omit `--benchmark`, the report includes all available benchmark categories for the selected frameworks.
- The report update is file-safe: the generator writes `results.ts` atomically before the UI build runs.
- Default behavior for this repo: no explicit `--framework` flags when rebuilding the report UI. Let `benchmark-report.config.json` supply the curated framework set unless the user explicitly asks for a narrowed report.
- After a successful rebuild, tell the user the report URL: `http://localhost:8080/webdriver-ts-results/dist/index.html`
