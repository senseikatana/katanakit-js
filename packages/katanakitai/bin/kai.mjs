#!/usr/bin/env node
/**
 * Thin launcher for katanakitAI. The real CLI lives in `katanakit-js`
 * (`katanakit-js/adapters/cli`), so `kai`, `katanakitai`, `npx katanakitai`
 * and `bunx katanakitai` all run the exact same code path.
 */
import { runCli } from "katanakit-js/adapters/cli";

await runCli();
