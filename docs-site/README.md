# KatanaKit - Documentation Site

## Overview

This is a complete documentation site for KatanaKit, built with Astro and the Startlight theme.

## Features

- **Astro** - Fast, static site generator
- **Startlight Theme** - Modern, responsive design system
- **TypeScript** - Fully typed source code
- **Comprehensive Documentation** - Changelog, Guides, Architecture, Roadmap, Security

## Structure

```
docs-site/
├── astro.config.mjs          # Astro configuration
├── package.json             # Project dependencies and scripts
├── src/
│   ├── index.astro          # Main Astro entry point
│   └── ...                  # Astro components
└── docs/                    # Existing documentation content
    ├── CHANGELOG.md         # Release notes
    ├── README.md            # Project overview
    ├── API-Reference.md     # API documentation
    ├── Architecture.md      # Architecture guide
    ├── Getting-Started.md   # Quick start guide
    ├── Roadmap.md           # Project roadmap
    └── SECURITY.md          # Security guidelines
```

## Installation

```bash
cd docs-site
npm install
```

## Building

```bash
# Development mode (hot reload)
npm run docs:dev

# Production build
npm run docs:build
```

## Access

- Local: `http://localhost:3000`
- Deployed: `https://senseikatana.github.io/katanakit-js`

## Themes

- **Startlight** - Modern, responsive design system
- **Lotus** - Alternative theme option

## Documentation Sections

1. **Changelog** - Release history (v2.2.1)
2. **Getting Started** - Quick start guide
3. **Architecture** - Hexagonal architecture details
4. **Roadmap** - Future plans
5. **Security** - Security best practices
6. **API Reference** - Complete API documentation

## License

MIT
