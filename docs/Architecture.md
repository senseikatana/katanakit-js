# Architecture

## Hexagonal Architecture

KatanaKit follows a hexagonal (ports and adapters) architecture that separates concerns into distinct layers:

### Layers

1. **Core Layer** (`core/services/`) – Pure business logic with no external dependencies
2. **Infrastructure Layer** (`infrastructure/`) – Framework-specific adapters (Astro, Nuxt, Express, Vue)
3. **Adapters** (`adapters/`) – Bridge KatanaKit Safe Results to framework-specific APIs
4. **Configuration** (`config/`) – Site configuration, SEO, and metadata
5. **Prisma Layer** (`prisma/`) – Database contracts and ORM models

### Ports and Adapters

Each service defines **ports** (interfaces) that can be implemented by different **adapters**:

- **HTTP Port** – `useGet`, `usePost`, `usePut`, `useDelete`
- **Logging Port** – `useLog`, `useError`, `useClear`
- **Storage Port** – `useGetStorage`, `useSetStorage`, `useRemoveStorage`
- **DOM Port** – `useQuerySelector`, `useAddClass`, `useSetText`
- **Reactive Port** – `useCreateSignal`, `useCreateEffect`, `useCreateMemo`
- **Formatting Port** – `useFormatNumber`, `useFormatCurrency`, `useJsonStringify`
- **Conversion Port** – `useToCelsius`, `useToFahrenheit`, `useToMiles`, `useToKilos`
- **Geometry Port** – `useArea`, `usePerimeter`, `useVolume`
- **Timing Port** – `useDelay`, `useSetTimeout`, `useInterval`, `useDebounce`
- **Data Port** – `useUnique`, `useGroupBy`, `useDeepClone`
- **Utility Ports** – `useSleep`, `useRetry`, `useRound`
- **Viewport Port** – `useGetViewport`, `useFullscreen`, `useVisibleWidth`
- **Sensor Port** – `useGetGeolocation`, `useGetMediaStream`, `useVibrate`
- **Observer Port** – `useCreate`, `useObserve`, `useObserveAll`, `useDisconnect`
- **Lazy Load Port** – `useInit`, `useStop`, `useStopAll`
- **Worker Port** – `useRun`, `useCreatePool`, `useRunPool`, `useTerminate`
- **Theme Port** – `useInitTheme`, `useSetThemeMode`, `useToggleTheme`
- **Astro Port** – `useGetStaticPaths`, `usePathsFrom`, `useGeneratePagination`
- **RSS Port** – `useGenerateRss`, `useRssLinkTag`, `useCreateRssEndpoint`
- **SEO Port** – `useGenerateMetaTags`, `useTitle`, `useRssHeadLink`

### Benefits

- **Testability** – Each layer can be tested independently
- **Flexibility** – Swap adapters without changing core logic
- **Maintainability** – Clear separation of concerns
- **Framework Independence** – Works with Astro, Nuxt, Express, Vue, or vanilla JS

## Component Flow

```
[Client] → [Adapter] → [Service] → [Database]
                    ↓
              [Configuration]
```

1. **Client** – Components call KatanaKit composables
2. **Adapter** – Converts KatanaKit’s Safe Results to framework-specific responses
3. **Service** – Business logic executed in the core layer
4. **Database** – Data persistence via Prisma ORM

## Data Flow Example

```
1. User interacts with UI component
2. Component calls useGet("api", "users")
3. Adapter (Astro/Nuxt/Express/Vue) receives the request
4. Service layer processes the request
5. Core logic executes (e.g., fetch from API)
6. Result is transformed by the adapter
7. UI updates with the data
```

## Configuration Flow

1. `siteConfig` is loaded from `src/config/site.config.ts`
2. SEO metadata is extracted from the config
3. RSS endpoints are generated from the config
4. Layout templates consume the config for navigation and metadata

## Scalability

- **Horizontal scaling** – Multiple instances can share the same configuration
- **Caching** – Storage layer supports caching strategies
- **Background jobs** – Worker pool handles long-running tasks
- **Observability** – Logging and error tracking integrated throughout

## Security Considerations

- All HTTP requests go through the `useGet` composable which enforces validation
- Sensitive data is never logged
- Input sanitization occurs at the adapter layer
- Role-based access controlled via the `SiteConfig`
