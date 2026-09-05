#!/usr/bin/env bash
set -euo pipefail

# Snapshots the current docs as a versioned release using Docusaurus native
# versioning (docusaurus docs:version).
#
# Usage: bash .github/scripts/archive-docs-version.sh <version>
# Example: bash .github/scripts/archive-docs-version.sh 2.3.0
#
# The script:
#   1. Strips leading "v" from the version tag if present
#   2. Runs `yarn docusaurus docs:version <version>` in docs-site/
#   3. This creates versioned_docs/<version>/ and versioned_sidebars/<version>-sidebars.json

VERSION="${1:?Usage: archive-docs-version.sh <version>}"

# Strip leading "v" if present (v2.3.0 -> 2.3.0)
VERSION="${VERSION#v}"

echo "Archiving current docs as version ${VERSION}..."

cd docs-site
yarn docusaurus docs:version "${VERSION}"

echo "✅ Docs archived as version ${VERSION}"
