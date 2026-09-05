# Dashboard Empresa Plana

A modern, framework-agnostic dashboard built with Astro and KatanaKit.

## Overview

This project is a responsive dashboard designed for enterprise dashboards, leveraging the KatanaKit service toolkit. It provides a robust foundation for building data-driven interfaces with support for multiple frameworks (Astro, Nuxt, Vue) and a clean, modular architecture.

## Features

- **Framework Agnostic** – Built with Astro, supporting Vue, Nuxt, and Express adapters
- **KatanaKit Integration** – Uses the powerful `useKatanaFetch` composable for safe data fetching
- **Hexagonal Architecture** – Clean separation of concerns with core services, infrastructure adapters, and configuration
- **Site Configuration & SEO** – Centralized `SiteConfig` for metadata, RSS, and SEO optimization
- **Multiple Adapters** – Ready-to-use adapters for Astro, Nuxt, and Express
- **Testing** – Comprehensive Vitest suite (60 tests across 8 files)
- **Modern Tooling** – Pure ESM imports, automatic type safety, and zero runtime dependencies beyond core

## Project Structure

```
katanakit-js/
├── src/
│   ├── index.ts                 # Main barrel (public API)
│   ├── types/                   # Shared types and contracts
│   ├── core/
│   │   └── services/            # Pure business logic services
│   ├── infrastructure/
│   │   ├── dom/                 # DOM-related utilities
│   │   ├── storage/             # Local storage management
│   │   ├── viewport/            # Viewport detection
│   │   ├── sensors/             # Device sensor integration
│   │   ├── observer/            # Observer pattern implementations
│   │   └── worker/              # Worker pool management
│   ├── adapters/
│   │   ├── astro/               # Astro integration
│   │   ├── nuxt/               # Nuxt integration
│   │   ├── express/             # Express reference adapter
│   │   └── vue/                # Vue 3 composable
│   ├── config/
│   │   └── site.config.ts      # Site configuration and SEO
│   └── prisma/                 # Prisma ORM schema
├── tests/                       # Vitest test suite
├── docs/                        # Documentation
├── examples/                    # Runnable demos
└── package.json                 # Package manifest
```

## Quick Start

### Prerequisites

- Node.js >= 22.18.0
- TypeScript 7+ (strict mode recommended)
- Bun (optional, for faster development)

### Installation

```bash
npm install
```

### Setup

```bash
# Copy the site configuration
cp src/config/site.config.ts ./site.config.ts

# Initialize the project
npm run build
```

### Running the Application

```bash
# Development mode (Hot Module Replacement)
npm run dev

# Production build
npm run build
```

## Documentation

- [Getting Started](docs/Getting-Started.md)
- [Architecture](docs/Architecture.md)
- [API Reference](docs/API-Reference.md)
- [Roadmap](docs/Roadmap.md)
- [Security](docs/SECURITY.md)

## Adapting to Your Needs

### Framework-Specific Usage

#### Astro

```ts
import { useInit, useGet, usePost } from "katanakit-js";

useInit({
  api: {
    baseUri: "https://api.example.com",
    endpoints: {
      users: "/users/",
      orders: "/orders/",
    },
  },
});

const users = await useGet("api", "users");
```

#### Nuxt

```ts
import { useInit, useGet } from "katanakit-js/adapters/nuxt";

useInit({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: { pokemonById: "/pokemon/:id/" },
  },
});

const pokemon = await useGet("pokeapi", "pokemonById", { params: { id: 25 } });
```

#### Express

```ts
import { ServerExpress } from "katanakit-js/adapters/express";

ServerExpress.getInstance().useStart();
```

## Resources

- [KatanaKit Documentation](https://senseikatana.github.io/katanakit-js)
- [Astro Template Starter](https://github.com/prosefly/astro-template-lotus-starter)
- [KatanaKit GitHub](https://github.com/senseikatana/katanakit-js)

## License

MIT
