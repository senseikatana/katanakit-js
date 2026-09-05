# API Reference

Comprehensive API documentation for KatanaKit services.

## Services Overview

| Service | Description |
|---------|-------------|
| `FetchApiManager` | Manages HTTP requests with `useInit`, `useGet`, `usePost`, `usePut`, `useDelete` |
| `LoggerService` | Structured logging with `useLog`, `useError`, `useClear`, `useTable` |
| `StorageService` | Local storage management with `useGetStorage`, `useSetStorage`, `useRemoveStorage` |
| `DomService` | DOM manipulation and interaction with `useQuerySelector`, `useAddClass`, `useSetText` |
| `ReactiveService` | Reactive primitives with `useCreateSignal`, `useCreateEffect`, `useCreateMemo` |
| `FormatterService` | Formatting utilities with `useFormatNumber`, `useFormatCurrency`, `useJsonStringify` |
| `ConverterService` | Unit conversion with `useToCelsius`, `useToFahrenheit`, `useToMiles`, `useToKilos` |
| `ConverterService` | Date/time utilities with `useFormat`, `useNow`, `useAddDays`, `useIsBefore` |
| `GeometryUtils` | Geometric calculations with `useArea`, `usePerimeter`, `useVolume` |
| `TimingService` | Time-based operations with `useDelay`, `useSetTimeout`, `useInterval`, `useDebounce` |
| `DataUtils` | General data processing with `useUnique`, `useGroupBy`, `useDeepClone` |
| `SystemUtils` | Utility functions with `useSleep`, `useRetry`, `useRound` |
| `ViewportService` | Viewport detection and management with `useGetViewport`, `useFullscreen`, `useVisibleWidth` |
| `SensorsUtils` | Device sensor integration with `useGetGeolocation`, `useGetMediaStream`, `useVibrate` |
| `ObserverService` | Event observation with `useCreate`, `useObserve`, `useObserveAll`, `useDisconnect` |
| `LazyLoaderService` | Lazy loading for images with `useInit`, `useStop`, `useStopAll` |
| `WorkerService` | Background task management with `useRun`, `useCreatePool`, `useRunPool`, `useTerminate` |
| `ThemeService` | Theme management with `useInitTheme`, `useSetThemeMode`, `useToggleTheme` |
| `AstroService` | Astro-specific helpers with `useGetStaticPaths`, `usePathsFrom`, `useGeneratePagination` |
| `RssService` | RSS feed generation with `useGenerateRss`, `useRssLinkTag`, `useCreateRssEndpoint` |
| `SeoService` | SEO metadata generation with `useGenerateMetaTags`, `useTitle`, `useRssHeadLink` |

## Core Services

### HTTP Client

```ts
import { useInit, useGet, usePost, usePut, useDelete } from "katanakit-js";

useInit({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: {
      pokemonById: "/pokemon/:id/",
      pokemons: "/pokemons/",
    },
  },
});

// Fetch data
const response = await useGet("pokeapi", "pokemonById", { params: { id: 25 } });

// POST request
await usePost("pokeapi", "pokemons", { name: "charmander" });
```

### Logging

```ts
import { useLog, useError, useClear } from "katanakit-js";

// Info level
useLog("info", "Processing request", { userId: 123 });

// Error level
useError("error", "Failed to fetch data", { code: 500 });
```

### Storage

```ts
import { useGetStorage, useSetStorage, useRemoveStorage } from "katanakit-js";

// Get storage
const theme = useGetStorage<string>("theme");

// Set storage
await useSetStorage("theme", "dark");
```

### DOM

```ts
import { useQuerySelector, useAddClass, useSetText } from "katanakit-js";

// Select element
const item = useQuerySelector("#item");

// Add class
useAddClass(item, "active");

// Set text
useSetText(item, "Updated content");
```

## Available Commands

| Command | Description |
|---------|-------------|
| `useInit` | Initialize API clients and services |
| `useGet` | Make GET requests |
| `usePost` | Make POST requests |
| `usePut` | Make PUT requests |
| `useDelete` | Make DELETE requests |
| `useLog` | Log messages with severity level |
| `useError` | Report errors with context |
| `useSetStorage` | Store data in local storage |
| `useGetStorage` | Retrieve data from local storage |
| `useAddClass` | Add CSS classes dynamically |
| `useSetText` | Set text content of elements |
| `useFormatNumber` | Format numbers (currency, percentage, etc.) |
| `useFormatCurrency` | Format currency values |
| `useJsonStringify` | Serialize objects to JSON |
| `useToCelsius` | Convert temperature to Celsius |
| `useToFahrenheit` | Convert temperature to Fahrenheit |
| `useToMiles` | Convert distance to miles |
| `useToKilos` | Convert weight to kilograms |
| `useArea` | Calculate area of geometric shapes |
| `usePerimeter` | Calculate perimeter of shapes |
| `useVolume` | Calculate volume of 3D shapes |
| `useDelay` | Introduce delay before execution |
| `useSetTimeout` | Set a timer |
| `useInterval` | Repeat interval-based operations |
| `useDebounce` | Debounce rapid updates |
| `useThrottle` | Throttle frequent updates |
| `useRepeat` | Repeat operations repeatedly |
| `useRace` | Race multiple operations |
| `useRound` | Round numbers to specified precision |
| `useGenerateRss` | Generate RSS feeds |
| `useGenerateMetaTags` | Create SEO meta tags |
| `useGetStaticPaths` | Generate static page paths for Astro |
| `useCreateRssEndpoint` | Create RSS endpoints from config |
| `useCreateRssEndpointFromConfig` | Build RSS from site config |
| `useHeadTags` | Generate head tags for SEO |
| `useSetThemeMode` | Toggle light/dark theme |
| `useToggleTheme` | Toggle between themes |
| `useRun` | Start background workers |
| `useCreatePool` | Create worker pools |
| `useRunPool` | Execute tasks in worker pools |
| `useTerminate` | Terminate worker processes |
| `useGetViewport` | Get viewport dimensions |
| `useFullscreen` | Handle fullscreen events |
| `useSetText` | Set text content of elements |
| `useAddClass` | Add CSS classes dynamically |
| `useQuerySelector` | Select elements by selector |
| `useCreateSignal` | Create reactive signals |
| `useCreateEffect` | Create effect-based computations |
| `useCreateMemo` | Create memoized computations |
| `useCreateToggle` | Create toggle switches |
| `useCreateStorageSignal` | Create storage state signals |
| `useCreateDebouncedSignal` | Create debounced signals |
| `useCreateBatch` | Create batched operations |
| `useUnwrap` | Extract data from Nuxt responses |
| `useSafeResponse` | Safely unwrap Nuxt responses |
| `useEventResponse` | Handle event responses |

## Configuration

### Site Configuration

```ts
import { SiteConfig } from "katanakit-js";

export const siteConfig: SiteConfig = {
  site: "https://example.com",
  title: "Empresa Plana Dashboard",
  description: "Main dashboard for company operations",
  lang: "es",
  author: "Juan Pérez",
  ogImage: "/og-default.png",
  twitter: {
    handle: "twitter",
    profile: "https://twitter.com/company",
  },
  rss: {
    enabled: true,
    path: "/rss.xml",
    limit: 20,
  },
  seo: {
    noIndex: false,
    canonical: true,
    openGraph: true,
    twitterCard: true,
    jsonLd: true,
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Operaciones", href: "/operaciones" },
  ],
};
```

## Testing

Tests are organized in `tests/` with 60 tests across 8 files covering:
- HTTP client
- Logger
- Storage
- DOM
- Reactive services
- Formatters
- Converters
- Utilities

Run tests with:
```bash
npm test
```

## Deployment

Build for production with:
```bash
npm run build
```

Deploy the built assets to your hosting provider.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Support

- [KatanaKit GitHub Issues](https://github.com/senseikatana/katanakit-js/issues)
- [KatanaKit Documentation](https://senseikatana.github.io/katanakit-js)
- [Astro Template Starter](https://github.com/prosefly/astro-template-lotus-starter)
