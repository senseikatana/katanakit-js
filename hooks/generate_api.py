"""Generate the TypeDoc API reference before MkDocs collects the files.

Runs `bunx typedoc` only when `content/docs/api/index.md` is missing, so a fresh
checkout (or CI) builds the full API reference without extra package scripts.
Requires the root devDependencies to be installed (`bun install`).
"""

import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
API_INDEX = ROOT / "content" / "docs" / "api" / "index.md"


def on_config(config):
    if API_INDEX.exists():
        return config

    bunx = shutil.which("bunx")
    bun = shutil.which("bun")

    if bunx:
        command = [bunx, "typedoc"]
    elif bun:
        command = [bun, "x", "typedoc"]
    else:
        raise RuntimeError(
            "bun/bunx not found — install Bun to generate the TypeDoc API reference."
        )

    subprocess.run(command, cwd=ROOT, check=True)
    return config
