#!/usr/bin/env bash
set -euo pipefail

# Snapshots the current docs-site content into a versioned subdirectory for
# starlight-versions multi-version support.
#
# Usage: bash .github/scripts/archive-docs-version.sh <version>
# Example: bash .github/scripts/archive-docs-version.sh 2.3.0
#
# The script:
#   1. Copies current docs (excluding existing version dirs) into docs-site/src/content/docs/<version>/
#   2. Updates docs-site/src/config/versions.config.ts with the new entry

VERSION="${1:?Usage: archive-docs-version.sh <version>}"

# Strip leading "v" if present (v2.3.0 -> 2.3.0)
VERSION="${VERSION#v}"

DOCS_DIR="docs-site/src/content/docs"
VERSION_DIR="${DOCS_DIR}/${VERSION}"

if [[ -d "$VERSION_DIR" ]]; then
  echo "Version directory ${VERSION_DIR} already exists — skipping archive."
  exit 0
fi

echo "Archiving current docs as version ${VERSION}..."

# Create the version directory
mkdir -p "$VERSION_DIR"

# Copy top-level .md files
for f in "${DOCS_DIR}"/*.md; do
  [[ -f "$f" ]] && cp "$f" "${VERSION_DIR}/"
done

# Copy subdirectories (guides/, api/, etc.) but NOT version dirs
for dir in "${DOCS_DIR}"/*/; do
  [[ ! -d "$dir" ]] && continue
  dir_name="$(basename "$dir")"
  # Skip numeric version directories (e.g., 2.3.0/, 1.0.0/)
  if [[ "$dir_name" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    continue
  fi
  cp -r "$dir" "${VERSION_DIR}/${dir_name}"
done

# Update versions.config.ts (TypeScript with typed array)
VERSIONS_FILE="docs-site/src/config/versions.config.ts"

# Add version to the array if not already present
if ! grep -q "slug: '${VERSION}'" "$VERSIONS_FILE"; then
  # Insert new version entry before the closing bracket
  sed -i "s|export const versions: readonly VersionEntry\[\] = \[|export const versions: readonly VersionEntry[] = [\n\t{ slug: '${VERSION}', label: 'v${VERSION}' },|" "$VERSIONS_FILE"
  echo "Added v${VERSION} to versions.config.ts"
fi

echo "✅ Docs archived as version ${VERSION}"
