# Next.js 16.5.0-canary.52 Configuration & Schema Reference

Extracted from `dist/server/config-shared.d.ts`, `dist/shared/lib/image-config.d.ts`, `dist/lib/load-custom-routes.d.ts`, and segment configs.

## Top-Level `NextConfig` Options (67)

| Option | Type | Default | Summary |
| :--- | :--- | :--- | :--- |
| `allowedDevOrigins?` | `string[]` | `undefined` | - |
| `exportPathMap?` | `(defaultMap: ExportPathMap, ctx: { dev: boolean; dir: string; outDir: string \| null; distDir: string; buildId: string; }) => Promise<ExportP` | - | - |
| `i18n?` | `I18NConfig \| null` | `null` | Internationalization configuration |
| `typescript?` | `TypeScriptConfig` | `{ ignoreBuildErrors: false tsconfigPath: undefined }` | - |
| `typedRoutes?` | `boolean` | `false` | Enable type checking for Link and Router.push, etc. This feature requires TypeScript in your project. |
| `headers?` | `() => Promise<Header[]> \| Header[]` | - | Headers allow you to set custom HTTP headers for an incoming request path. |
| `rewrites?` | `() => Promise<Rewrite[] \| { beforeFiles?: Rewrite[]; afterFiles?: Rewrite[]; fallback?: Rewrite[]; }> \| Rewrite[] \| { beforeFiles?: Rewrite[` | - | Rewrites allow you to map an incoming request path to a different destination path. |
| `redirects?` | `() => Promise<Redirect[]> \| Redirect[]` | - | Redirects allow you to redirect an incoming request path to a different destination path. |
| `excludeDefaultMomentLocales?` | `boolean` | `true` | - |
| `webpack?` | `NextJsWebpackConfig \| null` | `null` | Before continuing to add custom webpack configuration to your application make sure Next.js doesn't already support your use-case |
| `trailingSlash?` | `boolean` | `false` | By default Next.js will redirect urls with trailing slashes to their counterpart without a trailing slash. |
| `env?` | `Record<string, string \| undefined>` | `{}` | Next.js comes with built-in support for environment variables |
| `distDir?` | `string` | `'.next'` | Destination directory (defaults to `.next`) |
| `cleanDistDir?` | `boolean` | `true` | The build output directory (defaults to `.next`) is now cleared by default except for the Next.js caches. |
| `assetPrefix?` | `string` | `''` | To set up a CDN, you can set up an asset prefix and configure your CDN's origin to resolve to the domain that Next.js is hosted on. |
| `cacheHandler?` | `string \| undefined` | `process.env.NEXT_CACHE_HANDLER_PATH` | The default cache handler for the Pages and App Router uses the filesystem cache. This requires no configuration, however, you can customize the cache |
| `adapterPath?` | `string` | `process.env.NEXT_ADAPTER_PATH \|\| undefined` | Path to a custom adapter module for deployment platform integration. Can also be set via the `NEXT_ADAPTER_PATH` environment variable. |
| `cacheHandlers?` | `{ default?: string; remote?: string; static?: string; [handlerName: string]: string \| undefined; }` | `{ default: process.env.NEXT_DEFAULT_CACHE_HANDLER_PATH remote: process` | - |
| `cacheMaxMemorySize?` | `number` | `50 * 1024 * 1024` | Configure the in-memory cache size in bytes. Defaults to 50 MB. If `cacheMaxMemorySize: 0`, this disables in-memory caching entirely. |
| `useFileSystemPublicRoutes?` | `boolean` | `true` | By default, `Next` will serve each file in the `pages` folder under a pathname matching the filename. To disable this behavior and prevent routing bas |
| `generateBuildId?` | `() => string \| null \| Promise<string \| null>` | - | - |
| `generateEtags?` | `boolean` | `true` | - |
| `pageExtensions?` | `string[]` | `[ 'tsx' 'ts' 'jsx' 'js' ]` | - |
| `instrumentationClientInject?` | `string[]` | `[]` | Module specifiers that are required for side effects on the client before hydration, in array order, ahead of the user's `instrumentation-client.{ts,j |
| `instrumentationInject?` | `string[]` | `[]` | Module specifiers compiled into the server `instrumentation` slot, ahead of the project's own `instrumentation.{ts,js}` file. Every entry's `register` |
| `compress?` | `boolean` | `true` | - |
| `poweredByHeader?` | `boolean` | `true` | - |
| `images?` | `ImageConfig` | `_imageconfig.imageConfigDefault` | - |
| `devIndicators?` | `false \| { position?: 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'; }` | `{ position: 'bottom-left' }` | Configure indicators in development environment |
| `onDemandEntries?` | `{ maxInactiveAge?: number; pagesBufferLength?: number; }` | `{ maxInactiveAge: 60 * 1000 pagesBufferLength: 5 }` | Next.js exposes some options that give you some control over how the server will dispose or keep in memory built pages in development. |
| `deploymentId?` | `string` | - | A unique identifier for a deployment that will be included in each request's query string or header. |
| `supportsImmutableAssets?` | `boolean` | - | Whether the deployment environment supports immutable assets (assets deployed to `_next/static/immutable` don't need a `?dpl` parameter and can be saf |
| `basePath?` | `string` | `''` | Deploy a Next.js application under a sub-path of a domain |
| `sassOptions?` | `{ implementation?: string; [key: string]: any; }` | `{}` | - |
| `productionBrowserSourceMaps?` | `boolean` | `false` | Enable browser source map generation during the production build |
| `reactCompiler?` | `boolean \| ReactCompilerOptions` | - | Enable https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler. Configuration accepts partial config object of the Compiler. If |
| `reactProductionProfiling?` | `boolean` | `false` | Enable react profiling in production |
| `reactStrictMode?` | `boolean \| null` | `null` | The Next.js runtime is Strict Mode-compliant. |
| `reactMaxHeadersLength?` | `number` | `6000` | The maximum length of the headers that are emitted by React and added to the response. |
| `httpAgentOptions?` | `{ keepAlive?: boolean; }` | `{ keepAlive: true }` | Next.js enables HTTP Keep-Alive by default. You may want to disable HTTP Keep-Alive for certain `fetch()` calls or globally. |
| `staticPageGenerationTimeout?` | `number` | `60` | Timeout after waiting to generate static pages in seconds |
| `crossOrigin?` | `'anonymous' \| 'use-credentials'` | - | Add `"crossorigin"` attribute to generated `<script>` elements generated by `<Head />` or `<NextScript />` components |
| `compiler?` | `{ reactRemoveProperties?: boolean \| { properties?: string[]; }; relay?: { src: string; artifactDirectory?: string; language?: 'typescript' \|` | `{}` | Optionally enable compiler transforms |
| `output?` | `'standalone' \| 'export'` | `!!process.env.NEXT_PRIVATE_STANDALONE ? 'standalone' : undefined` | The type of build output. |
| `transpilePackages?` | `string[]` | - | Automatically transpile and bundle dependencies from local packages (like monorepos) or from external dependencies (`node_modules`). This replaces the |
| `turbopack?` | `TurbopackOptions` | - | Options for Turbopack. Temporarily also available as `experimental.turbo` for compatibility. |
| `skipMiddlewareUrlNormalize?` | `boolean` | - | [DEPRECATED: Use `skipProxyUrlNormalize` instead.] |
| `skipProxyUrlNormalize?` | `boolean` | - | - |
| `skipTrailingSlashRedirect?` | `boolean` | - | - |
| `modularizeImports?` | `Record<string, { transform: string \| Record<string, string>; preventFullImport?: boolean; skipDefaultConversion?: boolean; }>` | `undefined` | - |
| `logging?` | `LoggingConfig \| false` | `{ serverFunctions: true }` | Logging configuration. Set to `false` to disable logging. |
| `enablePrerenderSourceMaps?` | `boolean` | `true` | Enables source maps while generating static pages. Helps with errors during the prerender phase in `next build`. Defaults to `true`. Set to `false` to |
| `cacheComponents?` | `boolean` | `false` | When enabled, routes can combine a prerendered shell with dynamic content streamed into it, rather than being either fully static or fully dynamic. Yo |
| `partialPrefetching?` | `boolean` | - | Opts the whole app into Partial Prefetching: `<Link prefetch={true}>` prefetches only the static parts of a route, never its dynamic data. When `true` |
| `cacheLife?` | `{ [profile: string]: { stale?: number; revalidate?: number; expire?: number; }; }` | `{ default: { stale: undefined revalidate: 60 * 15 expire: _constants.I` | - |
| `expireTime?` | `number` | `process.env.NEXT_PRIVATE_CDN_CONSUMED_SWR_CACHE_CONTROL ? undefined : ` | period (in seconds) where the server allow to serve stale cache |
| `agentRules?` | `boolean` | `true` | When `next dev` runs, Next.js creates or updates the managed agent-rules block in `AGENTS.md` at the project root so coding agents read version-matche |
| `deprecated?` | `DeprecatedConfig` | `{}` | Options for deprecated features that are still available for backwards compatibility. |
| `experimental?` | `ExperimentalConfig` | `{ agentUpgrade: 'security' agentFeedback: false coldCacheBadge: false ` | Enable experimental features. Note that all experimental features are subject to breaking changes in the future. |
| `bundlePagesRouterDependencies?` | `boolean` | `false` | Enables the bundling of node_modules packages (externals) for pages server-side bundles. |
| `serverExternalPackages?` | `string[]` | - | A list of packages that should be treated as external in the server build. |
| `outputFileTracingRoot?` | `string` | `''` | This is the repo root usually and only files above this directory are traced and included. |
| `outputFileTracingExcludes?` | `Record<string, string[]>` | - | This allows manually excluding traced files if too many are included incorrectly on a per-page basis. |
| `outputFileTracingIncludes?` | `Record<string, string[]>` | - | This allows manually including traced files if some were not detected on a per-page basis. |
| `outputHashSalt?` | `string` | - | A string that is incorporated into content-addressed output filenames (chunks, assets) for both Webpack and Turbopack. Changing this value forces all |
| `watchOptions?` | `{ pollIntervalMs?: number; }` | - | - |
| `htmlLimitedBots?` | `RegExp` | `undefined` | User Agent of bots that can handle streaming metadata. Besides the default behavior, Next.js act differently on serving metadata to bots based on thei |

## `ExperimentalConfig` Options (175)

| Option | Type | Default | Summary |
| :--- | :--- | :--- | :--- |
| `goRoutes?` | `boolean` | - | Native Go App Router handlers. Turbopack and self-hosted next start only. |
| `agentUpgrade?` | `'security' \| 'latest' \| 'experimental-future' \| false` | `'security'` | Nudge coding agents about security upgrades, stable releases, or Future Defaults. `next dev` manages upgrade instructions in AGENTS.md using this poli |
| `agentFeedback?` | `boolean` | `false` | Adds managed instructions to AGENTS.md that let AI coding agents prepare anonymized Next.js feedback for user review. Written by `next dev` when enabl |
| `turbopackAdditionalRoots?` | `Record<string, { path: string; ignoreIfMissing?: boolean; }>` | - | Additional filesystem roots that symlinked dependencies may resolve into. Relative paths are resolved from the current working directory. Root names m |
| `turbopackDetectGlobalVirtualStore?` | `boolean` | `false` | Detect pnpm's global virtual store and add it as an additional root. Requires pnpm 11 or later. |
| `outputHashSalt?` | `string` | - | [DEPRECATED: Use the top-level `outputHashSalt` option instead.] |
| `coldCacheBadge?` | `boolean` | `false` | Shows a persistent "Cold cache" badge in the dev overlay after a load that filled an empty cache while streaming. Off by default while the badge's UI/ |
| `collapseAdapterRoutes?` | `boolean` | `true` | Whether a build may serve several dynamic routes from one entry in the route table that it passes to an adapter. Several routes of an app can differ o |
| `useSkewCookie?` | `boolean` | `false` | - |
| `cacheHandlers?` | `NextConfig['cacheHandlers']` | - | [DEPRECATED: use top-level `cacheHandlers` instead] |
| `multiZoneDraftMode?` | `boolean` | `false` | - |
| `appNavFailHandling?` | `boolean` | `false` | - |
| `parallelRouteMetadata?` | `boolean` | `false` | - |
| `prerenderEarlyExit?` | `boolean` | `true` | - |
| `linkNoTouchStart?` | `boolean` | `false` | - |
| `caseSensitiveRoutes?` | `boolean` | `false` | - |
| `clientParamParsingOrigins?` | `string[]` | `undefined` | The origins that are allowed to write the rewritten headers when performing a non-relative rewrite. When undefined, no non-relative rewrites will get |
| `cachedNavigations?` | `boolean` | `false` | Caches subsets of a route, seeded from actual navigations, so subsequent navigations to the same or similar pages can be served instantly. Requires Ca |
| `dynamicOnHover?` | `boolean` | `false` | - |
| `reactBrowserBailout?` | `boolean` | `true` | Uses ReactDOM's browser rendering primitive for supported client-rendering bailouts instead of Next.js' internal bailout error. |
| `useOffline?` | `boolean` | `false` | - |
| `optimisticRouting?` | `boolean` | `true` | - |
| `concurrentRouterQueue?` | `boolean` | `false` | Replaces the client router's sequential action queue with a rewritten concurrent implementation. The implementations are swapped at the module level b |
| `instrumentationClientRouterTransitionEvents?` | `boolean` | `false` | - |
| `varyParams?` | `boolean` | `true` | - |
| `prefetchInlining?` | `boolean \| { maxSize?: number; maxBundleSize?: number; }` | `true` | - |
| `preloadEntriesOnStart?` | `boolean` | `true` | - |
| `clientRouterFilter?` | `boolean` | `true` | - |
| `clientRouterFilterRedirects?` | `boolean` | `false` | - |
| `staleTimes?` | `{ dynamic?: number; static?: number; }` | `{ dynamic: 0 static: 300 }` | This config can be used to override the cache behavior for the client router. These values indicate the time, in seconds, that the cache should be con |
| `cacheLife?` | `NextConfig['cacheLife']` | - | [DEPRECATED: use top-level `cacheLife` instead] |
| `clientRouterFilterAllowedRate?` | `number` | - | - |
| `externalMiddlewareRewritesResolve?` | `boolean` | - | [DEPRECATED: Use `externalProxyRewritesResolve` instead.] |
| `externalProxyRewritesResolve?` | `boolean` | - | - |
| `exposeTestingApiInProductionBuild?` | `boolean` | - | Exposes the Instant Navigation Testing API in production builds. This API is always available in development mode. The testing API allows e2e tests to |
| `requestInsights?` | `boolean` | `false` | Show Request Insights in the dev tools indicator. Request Insights records the local framework spans needed to explain App Router request, render, fet |
| `extensionAlias?` | `Record<string, any>` | - | - |
| `allowedRevalidateHeaderKeys?` | `string[]` | - | - |
| `fetchCacheKeyPrefix?` | `string` | `''` | - |
| `imgOptConcurrency?` | `number \| null` | `null` | - |
| `imgOptOperationCache?` | `boolean \| null` | `null` | - |
| `imgOptTimeoutInSeconds?` | `number` | `7` | - |
| `imgOptMaxInputPixels?` | `number` | `268402689` | - |
| `imgOptSequentialRead?` | `boolean \| null` | `null` | - |
| `imgOptMozjpeg?` | `boolean` | `true` | - |
| `optimisticClientCache?` | `boolean` | `true` | - |
| `expireTime?` | `number` | - | [DEPRECATED: use config.expireTime instead] |
| `middlewarePrefetch?` | `'strict' \| 'flexible'` | - | [DEPRECATED: Use `proxyPrefetch` instead.] |
| `proxyPrefetch?` | `'strict' \| 'flexible'` | `'flexible'` | - |
| `manualClientBasePath?` | `boolean` | `false` | - |
| `cssChunking?` | `CssChunkingConfig` | `true` | CSS Chunking strategy. Defaults to `true` (loose mode), which guesses dependencies between CSS files to keep ordering of them. when this leads to many |
| `devMemoryThresholdRestart?` | `boolean` | `true` | Controls whether the development server automatically restarts when its heap usage exceeds the memory threshold. Defaults to `true`. |
| `disablePostcssPresetEnv?` | `boolean` | `undefined` | - |
| `cpus?` | `number` | `Math.max(1, (Number(process.env.CIRCLE_NODE_TOTAL) \|\| _os.default.avai` | - |
| `memoryBasedWorkersCount?` | `boolean` | `false` | - |
| `proxyTimeout?` | `number` | `undefined` | - |
| `isrFlushToDisk?` | `boolean` | `true` | - |
| `workerThreads?` | `boolean` | `false` | - |
| `optimizeCss?` | `boolean \| Record<string, unknown>` | `false` | - |
| `nextScriptWorkers?` | `boolean` | `false` | - |
| `scrollRestoration?` | `boolean` | `false` | - |
| `externalDir?` | `boolean` | `false` | - |
| `disableOptimizedLoading?` | `boolean` | `false` | - |
| `gzipSize?` | `boolean` | `true` | [DEPRECATED: A no-op as of Next 16, size metrics were removed from the build output.] |
| `craCompat?` | `boolean` | `false` | - |
| `esmExternals?` | `boolean \| 'loose'` | `true` | - |
| `fullySpecified?` | `boolean` | `false` | - |
| `urlImports?` | `NonNullable<webpack.Configuration['experiments']>['buildHttp']` | `undefined` | - |
| `swcTraceProfiling?` | `boolean` | `false` | - |
| `forceSwcTransforms?` | `boolean` | `false` | - |
| `swcPlugins?` | `Array<[string, Record<string, unknown>]>` | `undefined` | - |
| `swcEnvOptions?` | `{ mode?: 'usage' \| 'entry'; coreJs?: string; skip?: string[]; include?: string[]; exclude?: string[]; shippedProposals?: boolean; forceAllTr` | - | Additional options for SWC's preset-env (`env` configuration). These are merged into the `env` block that Next.js passes to SWC, alongside the browser |
| `largePageDataBytes?` | `number` | `128 * 1000` | - |
| `fallbackNodePolyfills?` | `false` | - | If set to `false`, webpack won't fall back to polyfill Node.js modules in the browser Full list of old polyfills is accessible here: webpack/webpack#M |
| `sri?` | `{ algorithm?: SubresourceIntegrityAlgorithm; }` | - | - |
| `webVitalsAttribution?` | `Array<(typeof WEB_VITALS)[number]>` | - | - |
| `optimizePackageImports?` | `string[]` | - | Automatically apply the "modularizeImports" optimization to imports of the specified packages. |
| `optimizeServerReact?` | `boolean` | `true` | Optimize React APIs for server builds. |
| `strictRouteTypes?` | `boolean` | `false` | Type-checks props and return values of pages. Requires literal values for segment config (e.g. `export const dynamic = 'force-static' as const`). |
| `useTypeScriptCli?` | `boolean` | `true` | Runs the project-local TypeScript CLI instead of using TypeScript's programmatic API for build-time type checking and config loading. |
| `transitionIndicator?` | `boolean` | `false` | Displays an indicator when a React Transition has no other indicator rendered. This includes displaying an indicator on client-side navigations. |
| `gestureTransition?` | `boolean` | `false` | Enables experimental gesture transition APIs for optimistic client navigations. Requires experimental React. |
| `prepareNavigation?` | `boolean` | `false` | Enables `router.experimental_prepare()`, which starts a navigation without committing it, so its data can be requested ahead of time (e.g. on `pointer |
| `turbopackMemoryEviction?` | `false \| 'full' \| 'auto'` | - | Controls Turbopack's memory eviction strategy for development sessions Only effective in dev sessions where `experimental.turbopackFileSystemCacheForD |
| `turbopackGc?` | `boolean \| { minProgressMs?: number; rootTtlMs?: number; }` | - | Enables Turbopack's garbage collector, which deletes unreachable tasks from the persistent cache and from memory. interrupt. Defaults to 100ms. Defaul |
| `turbopackPluginRuntimeStrategy?` | `'workerThreads' \| 'childProcesses' \| 'forceWorkerThreads'` | `'childProcesses'` | Selects the backend used by Turbopack for Node.js evaluation, e.g. webpack loaders, Babel, or PostCSS. This defaults to `'childProcesses'`, which crea |
| `turbopackMinify?` | `boolean \| { server?: boolean; client?: boolean; edge?: boolean; }` | - | Enable minification. Defaults to true in build mode and false in dev mode. Pass an object to configure each environment separately, e.g. `{ server: fa |
| `turbopackImportTypeBytes?` | `boolean` | - | Enable support for `with {type: "bytes"}` for ESM imports. |
| `turbopackScopeHoisting?` | `boolean` | - | Enable scope hoisting. Defaults to true in build mode. Always disabled in development mode. |
| `turbopackMinifyBeforeChunking?` | `boolean` | - | Minify each module separately instead of each finished chunk, so minification runs in parallel and is cached per module. The trade-off is slightly wor |
| `turbopackSharedRuntime?` | `boolean` | `true` | Share the browser runtime across routes in a single `runtime.js` asset and inline the per-route chunk-group bootstrap into the HTML, dropping the per- |
| `turbopackChunking?` | `{ clusters?: RegExp[][]; firstPageLoadPriority?: number; priorityRoutes?: RegExp[]; priorityBoost?: number; requestCost?: number; minChunkSi` | - | (`next --turbopack` only) These options change the assumptions Turbopack makes when making chunk merging decisions and the raw size thresholds it uses |
| `turbopackWorkerAssetPrefix?` | `string` | - | (`next --turbopack` only) A custom URL prefix for Web Worker URLs produced by `new Worker(new URL(..., import.meta.url))` — both the entrypoint URL an |
| `turbopackClientSideNestedAsyncChunking?` | `boolean` | - | Enable nested async chunking for client side assets. Defaults to true in build mode and false in dev mode. This optimization computes all possible pat |
| `turbopackServerSideNestedAsyncChunking?` | `boolean` | - | Enable nested async chunking for server side assets. Defaults to false in dev and build mode. This optimization computes all possible paths through dy |
| `turbopackLazyDynamicImports?` | `boolean` | - | Compile client dynamic import targets when they are first used in development. Defaults to `false`. |
| `turbopackLazyDynamicImportsSSR?` | `boolean` | - | Compile SSR dynamic import targets when they are first reached during server rendering in development. Defaults to `false`. |
| `turbopackFileSystemCacheForDev?` | `boolean` | `true` | Enable filesystem cache for the turbopack dev server. Defaults to `true`. |
| `turbopackFileSystemCacheForBuild?` | `boolean` | `true` | Enable filesystem cache for the turbopack build. Defaults to `true`. |
| `turbopackSeedCacheFromWorktree?` | `boolean` | - | When running inside a git worktree, warm-start this worktree's Turbopack filesystem cache by seeding it from the main checkout's cache if the worktree |
| `turbopackStaleOutputMaxAge?` | `number` | `7 * 24 * 60 * 60 * 1000` | The maximum age, in milliseconds, of Turbopack development output kept between dev server sessions. Defaults to one week. |
| `turbopackSourceMaps?` | `boolean` | - | Enable source maps. Defaults to true. |
| `turbopackInputSourceMaps?` | `boolean` | - | Enable extraction of source maps from input files. Defaults to true. |
| `turbopackModuleFragments?` | `boolean` | - | Currently in active development. This splits modules into fragments and chunks only import the used fragments of the modules. |
| `turbopackRemoveUnusedImports?` | `boolean` | - | Enable removing unused imports for turbopack dev server and build. |
| `turbopackRemoveUnusedExports?` | `boolean` | - | Enable removing unused exports for turbopack dev server and build. |
| `turbopackInferModuleSideEffects?` | `boolean` | `true` | Enable local analysis to infer side effect free modules. When enabled, Turbopack will analyze module code to determine if it has side effects. This ca |
| `turbopackCjsTreeShaking?` | `boolean` | - | Enable tree shaking of unused exports from analyzable CommonJS modules in Turbopack. Defaults to `false` |
| `turbopackMangleExportNames?` | `boolean` | `undefined` | Shorten ("mangle") the export names modules expose to each other in Turbopack, to reduce bundle size. Only affects the keys used to link modules toget |
| `turbopackMangleViaMaterializedNamespaceObject?` | `boolean` | - | Materialize namespace objects behind a facade so their local export keys can still be mangled. This can interfere with code that patches modules, sinc |
| `turbopackCjsScopeHoisting?` | `boolean` | - | Enable scope hoisting of static CommonJS modules. Defaults to `false` |
| `turbopackCrossModuleConstants?` | `boolean` | - | Enable cross-module constant inlining in Turbopack. Constants exported from other modules are inlined at their use sites, which enables dead code elim |
| `turbopackUseBuiltinBabel?` | `boolean` | - | Set this to `false` to disable the automatic configuration of the babel loader when a Babel configuration file is present. This option is enabled by d |
| `turbopackUseBuiltinSass?` | `boolean` | - | Set this to `false` to disable the automatic configuration of the sass loader. The sass loader configuration is enabled by default. |
| `turbopackLocalPostcssConfig?` | `boolean` | - | Enable per-directory PostCSS config resolution for Turbopack. When enabled, Turbopack searches for `postcss.config.js` starting from the CSS file's pa |
| `turbopackModuleIds?` | `'named' \| 'deterministic'` | - | The module ID strategy to use for Turbopack. If not set, the default is `'named'` for development and `'deterministic'` for production. |
| `turbopackServerFastRefresh?` | `boolean` | `true` | Enable server-side Fast Refresh (Hot Module Replacement) during development with Turbopack. When set to `false`, server-side HMR is disabled and a ful |
| `mdxRs?` | `boolean \| { development?: boolean; jsx?: boolean; jsxRuntime?: string; jsxImportSource?: string; providerImportSource?: string; mdxType?: 'g` | - | For use with `@next/mdx`. Compile MDX files using the new Rust compiler. |
| `typedRoutes?` | `boolean` | - | [DEPRECATED: Use `typedRoutes` instead — this feature is now stable.] Enable type checking for Link and Router.push, etc. |
| `typedEnv?` | `boolean` | `false` | Enable type-checking and autocompletion for environment variables. |
| `parallelServerCompiles?` | `boolean` | `false` | Runs the compilations for server and edge in parallel instead of in serial. This will make builds faster if there is enough server and edge functions |
| `parallelServerBuildTraces?` | `boolean` | `false` | Runs the logic to collect build traces for the server routes in parallel with other work during the compilation. This will increase the speed of the b |
| `webpackBuildWorker?` | `boolean` | `undefined` | Run the Webpack build in a separate process to optimize memory usage during build. Valid values are: |
| `webpackMemoryOptimizations?` | `boolean` | `false` | Enables optimizations to reduce memory usage in Webpack. This reduces the max size of the heap but may increase compile times slightly. Valid values a |
| `clientTraceMetadata?` | `string[]` | `undefined` | The array of the meta tags to the client injected by tracing propagation data. |
| `ppr?` | `boolean \| 'incremental'` | `false` | [DEPRECATED: This configuration option has been merged into `cacheComponents`.] The Partial Prerendering feature is still available via `cacheComponents`. |
| `taint?` | `boolean` | - | Enables experimental taint APIs in React. Using this feature will enable the `react@experimental` for the `app` directory. |
| `blockingSSR?` | `boolean` | - | Enables blocking server-side rendering for the `app` directory: React emits a `<link rel="expect">` tag that holds the browser's first paint until the |
| `hydrationChangeEvent?` | `boolean` | `false` | Opts the `app` directory into React's experimental release channel (`react@experimental`), which ships React's internal `enableHydrationChangeEvent` f |
| `externalBrowserRuntime?` | `boolean` | - | Streams React's instruction set for the `app` directory as data instead of as inline `<script>` tags. React emits `<template data-rci="" …>` elements, |
| `removeUncaughtErrorAndRejectionListeners?` | `boolean` | `false` | Uninstalls all "unhandledRejection" and "uncaughtException" listeners from the global process so that we can override the behavior, which in some runt |
| `validateRSCRequestHeaders?` | `boolean` | `true` | During an RSC request, validates that the request headers match the cache-busting search parameter sent by the client. |
| `serverActions?` | `{ bodySizeLimit?: SizeLimit; allowedOrigins?: string[]; }` | - | - |
| `maxPostponedStateSize?` | `SizeLimit` | `'100 MB'` | Allows adjusting the maximum size of the postponed state body for PPR resume requests. This includes the Resume Data Cache (RDC) which may grow large |
| `disableResumeDataCacheCompression?` | `boolean` | `false` | Disables compression of the Resume Data Cache (RDC) when persisting postponed state. |
| `serverMinification?` | `boolean` | `true` | enables the minification of server code. Under Turbopack this is overridden by `experimental.turbopackMinify` when that option specifies a `server` va |
| `serverSourceMaps?` | `boolean` | - | Enables source maps generation for the server production bundle. |
| `useWasmBinary?` | `boolean` | - | - |
| `useLightningcss?` | `boolean` | - | Use lightningcss instead of postcss-loader |
| `lightningCssFeatures?` | `LightningCssFeatures` | - | Configure which CSS features lightningcss should always transpile (include) or never transpile (exclude), regardless of browser targets. Requires `use |
| `testProxy?` | `boolean` | - | Enables `fetch` requests to be proxied to the experimental test proxy server |
| `defaultTestRunner?` | `SupportedTestRunners` | - | Set a default test runner to be used by `next experimental-test`. |
| `allowDevelopmentBuild?` | `true` | `undefined` | Allow NODE_ENV=development even for `next build`. |
| `bundlePagesExternals?` | `boolean` | - | [DEPRECATED: use `config.bundlePagesRouterDependencies` instead] |
| `serverComponentsExternalPackages?` | `string[]` | - | [DEPRECATED: use `config.serverExternalPackages` instead] |
| `reactDebugChannel?` | `boolean` | `true` | When enabled, in dev mode, Next.js will send React's debug info through the WebSocket connection, instead of including it in the main RSC payload. |
| `cacheComponents?` | `boolean` | - | [DEPRECATED: use top-level `cacheComponents` instead] |
| `instantInsights?` | `{ validationLevel?: ValidationLevel; }` | - | Configuration for instant navigation validation. |
| `devValidationWorker?` | `boolean` | `true` | Runs development Cache Components validation on a worker thread rather than the main thread, keeping the dev server's event loop responsive during rap |
| `staticGenerationRetryCount?` | `number` | `undefined` | The number of times to retry static generation (per page) before giving up. |
| `staticGenerationMaxConcurrency?` | `number` | `8` | The amount of pages to export per worker during static generation. |
| `staticGenerationMinPagesPerWorker?` | `number` | `25` | The minimum number of pages to be chunked into each export worker. |
| `serverComponentsHmrCache?` | `boolean` | `true` | Allows previously fetched data to be re-used when editing server components. |
| `serverComponentsHmrCancellation?` | `boolean` | `false` | Cancels the render and validation work for a Server Components HMR refresh once a newer refresh supersedes it. Development only. |
| `inlineCss?` | `boolean` | `false` | Render <style> tags inline in the HTML for imported CSS assets. Supports app-router in production mode only. |
| `authInterrupts?` | `boolean` | `false` | This config allows you to enable the experimental navigation API `forbidden` and `unauthorized`. |
| `useCacheTimeout?` | `number` | - | Seconds before a `'use cache'` fill is considered stalled. Defaults to 90% of `staticPageGenerationTimeout`. In prerender it's clamped to that ceiling |
| `useCache?` | `boolean` | `undefined` | [DEPRECATED: use top-level `cacheComponents` instead] Enables the use of the `"use cache"` directive. |
| `durableUseCacheEntries?` | `boolean` | - | Enables durable `"use cache"` remote cache entries across deployments. Only implemented for Turbopack. |
| `useCacheStaticRootParamTracking?` | `boolean` | `false` | Collects root param dependencies for `'use cache'` in Turbopack production builds. Defaults to `false`. When disabled, the server-reference manifest o |
| `slowModuleDetection?` | `{ buildTimeThresholdMs: number; }` | `undefined` | Enables detection and reporting of slow modules during development builds. Enabling this may impact build performance to ensure accurate measurements. |
| `globalNotFound?` | `boolean` | `false` | Enables using the global-not-found.js file in the app directory |
| `explicitParallelRouteChildren?` | `boolean` | `true` | Only includes `children` in a parallel route layout when an ordinary route branch declares content for it. Set this to `false` to temporarily restore |
| `turbopackRustReactCompiler?` | `boolean` | - | Requires `reactCompiler` to be enabled. |
| `browserDebugInfoInTerminal?` | `boolean \| 'error' \| 'warn' \| 'verbose' \| { level?: 'error' \| 'warn' \| 'verbose'; depthLimit?: number; edgeLimit?: number; showSourceLocation` | `'warn'` | [DEPRECATED: Use `logging.browserToTerminal` instead.] Enable debug information to be forwarded from browser to dev server stdout/stderr. |
| `middlewareClientMaxBodySize?` | `SizeLimit` | - | [DEPRECATED: Use `proxyClientMaxBodySize` instead.] Body size limit for request bodies with middleware configured. Defaults to 10MB. Can be specified as a number (bytes) or string (e.g. '5mb'). |
| `proxyClientMaxBodySize?` | `SizeLimit` | `10485760` | Body size limit for request bodies with proxy configured. Defaults to 10MB. Can be specified as a number (bytes) or string (e.g. '5mb'). |
| `mcpServer?` | `boolean` | `true` | Enable the Model Context Protocol (MCP) server for AI-assisted development. When enabled, Next.js will expose an MCP server at `/_next/mcp` that provi |
| `exposeRuntimeErrorsToHMR?` | `boolean` | `false` | Report runtime errors and their catching boundary over the development HMR socket. |
| `hideLogsAfterAbort?` | `boolean` | `false` | Hide logs that occur after a render has already aborted. This can help reduce noise in the console when dealing with aborted renders. |
| `runtimeServerDeploymentId?` | `boolean` | `false` | Whether `process.env.NEXT_DEPLOYMENT_ID` is available at runtime in the server (and `next build` doesn't need to embed the deployment ID value into th |
| `supportsImmutableAssets?` | `boolean` | - | [DEPRECATED: Use the top-level `supportsImmutableAssets` option instead.] |
| `deferredEntries?` | `string[]` | - | An array of paths in app or pages directories that should wait to be processed until all other entries have been processed. This is useful for deferri |
| `onBeforeDeferredEntries?` | `() => Promise<void>` | - | An async function that is called and awaited before processing deferred entries. This callback runs after all non-deferred entries have been compiled. |
| `reportSystemEnvInlining?` | `'error' \| 'warn'` | - | Whether to report inlined system environment variables as warnings or errors. Only supported for Turbopack. |

## `ImageConfigComplete` Options (21)

Next.js 16 breaking defaults: `minimumCacheTTL = 14400` (4h), `qualities = [75]` (unsupported `?q=` returns 400), `imageSizes` omits `16`, `maximumRedirects = 3`, query-string local images require `localPatterns.search`, local IPs blocked unless `dangerouslyAllowLocalIP: true`.

| Option | Type | Default | Summary |
| :--- | :--- | :--- | :--- |
| `deviceSizes` | `number[]` | `[ 640 750 828 1080 1200 1920 2048 3840 ]` | - |
| `imageSizes` | `number[]` | `[ 32 48 64 96 128 256 384 ]` | - |
| `loader` | `LoaderValue` | `'default'` | - |
| `path` | `string` | `'/_next/image'` | - |
| `loaderFile` | `string` | `''` | - |
| `domains` | `string[]` | - | [DEPRECATED: Use `remotePatterns` instead.] |
| `disableStaticImages` | `boolean` | `false` | - |
| `minimumCacheTTL` | `number` | `14400` | - |
| `formats` | `ImageFormat[]` | `[ 'image/webp' ]` | - |
| `maximumDiskCacheSize` | `number \| undefined` | `undefined` | - |
| `maximumRedirects` | `number` | `3` | - |
| `maximumResponseBody` | `number` | `50000000` | - |
| `dangerouslyAllowLocalIP` | `boolean` | `false` | - |
| `dangerouslyAllowSVG` | `boolean` | `false` | - |
| `contentSecurityPolicy` | `string` | `'script-src 'none'; frame-src 'none'; sandbox;'` | - |
| `contentDispositionType` | `'inline' \| 'attachment'` | `'attachment'` | - |
| `remotePatterns` | `Array<URL \| RemotePattern>` | `[]` | - |
| `localPatterns` | `LocalPattern[] \| undefined` | `undefined` | - |
| `qualities` | `number[] \| undefined` | `[ 75 ]` | - |
| `unoptimized` | `boolean` | `false` | - |
| `customCacheHandler` | `boolean` | `false` | When true, the `cacheHandler` configured in next.config.js will also be used for caching optimized images. When false, images use the default filesyst |

## Routing Execution Order & `rewrites` / `redirects` / `headers`

1. `headers` (`next.config.ts`)
2. `redirects` (`next.config.ts`)
3. `proxy.ts` (`NextProxy` / `ProxyConfig`, Node.js runtime only)
4. `rewrites.beforeFiles` (evaluated before `public/`, `_next/static/`, and page files — ideal for `has: [{ type: 'host', value: '...' }]` host rewrites)
5. Filesystem routes (`public/`, `_next/static/`, static pages)
6. `rewrites.afterFiles` (evaluated before dynamic routes)
7. Dynamic routes (`/blog/[slug]`)
8. `rewrites.fallback` (evaluated before 404)

```ts
import type { NextConfig } from '../server/config';
export type RouteHas = {
    type: 'header' | 'cookie' | 'query';
    key: string;
    value?: string;
} | {
    type: 'host';
    key?: undefined;
    value: string;
};
export type Rewrite = {
    source: string;
    destination: string;
    basePath?: false;
    locale?: false;
    has?: RouteHas[];
    missing?: RouteHas[];
};
export type Header = {
    source: string;
    basePath?: false;
    locale?: false;
    headers: Array<{
        key: string;
        value: string;
    }>;
    has?: RouteHas[];
    missing?: RouteHas[];
};
export type Redirect = {
    source: string;
    destination: string;
    basePath?: false;
    locale?: false;
    has?: RouteHas[];
    missing?: RouteHas[];
    priority?: boolean;
} & ({
    statusCode?: never;
    permanent: boolean;
} | {
    statusCode: number;
    permanent?: never;
});
export type Middleware = {
    source: string;
    locale?: false;
    has?: RouteHas[];
    missing?: RouteHas[];
};
export declare function normalizeRouteRegex(regex: string): string;
export type RouteType = 'rewrite' | 'redirect' | 'header';
export declare function checkCustomRoutes(routes: Redirect[] | Header[] | Rewrite[] | Middleware[], type: RouteType | 'middleware'): void;
export interface CustomRoutes {
    headers: Header[];
    onMatchHeaders: Header[];
    rewrites: {
        fallback: Rewrite[];
        afterFiles: Rewrite[];
        beforeFiles: Rewrite[];
    };
    redirects: Redirect[];
    originalRedirects?: Redirect[];
}
export default function loadCustomRoutes(config: NextConfig): Promise<CustomRoutes>;
```

## App Route Segment Config (`AppSegmentConfig`, 11)

Note: `cacheComponents: true` rejects legacy segment exports `dynamic`, `revalidate`, `fetchCache`, and `runtime`.

| Option | Type | Default | Summary |
| :--- | :--- | :--- | :--- |
| `revalidate?` | `number \| false` | - | The revalidation period for the page in seconds, or false to disable ISR. |
| `dynamicParams?` | `boolean` | - | Whether params not generated by `generateStaticParams` can be rendered. This option is not available when Cache Components is enabled. |
| `dynamic?` | `'auto' \| 'error' \| 'force-static' \| 'force-dynamic'` | - | The dynamic behavior of the page. |
| `fetchCache?` | `'auto' \| 'default-cache' \| 'default-no-store' \| 'force-cache' \| 'force-no-store' \| 'only-cache' \| 'only-no-store'` | - | The caching behavior of the page. |
| `instant?` | `Instant` | - | How this segment should be prefetched. |
| `prefetch?` | `Prefetch` | - | Controls prefetching for this segment. prefetched, not dynamic ones. When a static prefetch is insufficient, the segment may be prefetched with a runt |
| `ensureStatic?` | `EnsureStatic` | - | Controls which rendering phases require static output for this segment. |
| `unstable_dynamicStaleTime?` | `number` | - | The stale time for dynamic responses in seconds. Controls how long the client-side router cache retains dynamic page data. Pages only — not allowed in |
| `preferredRegion?` | `string \| string[]` | - | The preferred region for the page. |
| `runtime?` | `'edge' \| 'nodejs'` | - | The runtime to use for the page. |
| `maxDuration?` | `number` | - | The maximum duration for the page in seconds. |

## Proxy Segment Config (`ProxyConfig`, 3)

| Option | Type | Default | Summary |
| :--- | :--- | :--- | :--- |
| `matcher?` | `string \| Array<{ locale?: false; has?: RouteHas[]; missing?: RouteHas[]; source: string; } \| string>` | - | The matcher for the middleware. |
| `regions?` | `string \| string[]` | - | The regions that the middleware should run in. |
| `unstable_allowDynamic?` | `string \| string[]` | - | A glob, or an array of globs, ignoring dynamic code evaluation for specific files. The globs are relative to your application root folder. |

## Built-in `cacheLife` Profiles (`defaultConfig.cacheLife`)

| Profile | `stale` | `revalidate` | `expire` |
| :--- | :--- | :--- | :--- |
| `default` | `undefined` | `number` | `number` |
| `seconds` | `number` | `number` | `number` |
| `minutes` | `number` | `number` | `number` |
| `hours` | `number` | `number` | `number` |
| `days` | `number` | `number` | `number` |
| `weeks` | `number` | `number` | `number` |
| `max` | `number` | `number` | `number` |
