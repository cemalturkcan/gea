# Running Playwright Tests

**CRITICAL**: This is a monorepo. `npx playwright` resolves from the workspace root (`gea/node_modules/playwright`), NOT from the example directory you `cd` into. Running `cd examples/music-player && npx playwright test` will discover ALL spec files across the entire repo instead of just the example's tests.

**Always use the `--config` flag to the central config and `--project` to select a specific example:**

```bash
# Run a specific example's tests
npx playwright test --config=tests/e2e/playwright.config.ts --project=chat

# Run all e2e tests
npx playwright test --config=tests/e2e/playwright.config.ts

# WRONG - discovers all spec files in the repo
cd examples/chat && npx playwright test
```

## Project structure

- Example apps live in `examples/` at the repo root
- E2E test specs live in `tests/e2e/*.spec.ts`
- Central config: `tests/e2e/playwright.config.ts`
- Ports: 5291-5307 (see config for mapping)
