# Next.js 16.5.0-canary.52 Public TypeScript Declarations Digest

Extracted from 29 public `next/*` entrypoints and 71 resolved declaration files.

## Public Entrypoints & Exported Symbols

### `next` (1 symbols)
- `export { default } (next)` (`index.d.ts`)

### `next/cache` (33 symbols)
- `export { unstable_cache } (next/cache)` (`cache.d.ts`)
- `export { unstable_noStore } (next/cache)` (`cache.d.ts`)
- `export { io } (next/cache)` (`cache.d.ts`)
- `export { cacheTag } (next/cache)` (`cache.d.ts`)
- `export interface CacheLifeProfiles` (`cache.d.ts`)
- `export function cacheLife(profile: 'default'): void` (`cache.d.ts`) — Cache this `"use cache"` for a timespan defined by the `"default"` profile. This cache may be stale on clients for 5 minutes before checking with the 
- `export function cacheLife(profile: 'seconds'): void` (`cache.d.ts`) — Cache this `"use cache"` for a timespan defined by the `"seconds"` profile. This cache may be stale on clients for 30 seconds before checking with the
- `export function cacheLife(profile: 'minutes'): void` (`cache.d.ts`) — Cache this `"use cache"` for a timespan defined by the `"minutes"` profile. This cache may be stale on clients for 5 minutes before checking with the 
- `export function cacheLife(profile: 'hours'): void` (`cache.d.ts`) — Cache this `"use cache"` for a timespan defined by the `"hours"` profile. This cache may be stale on clients for 5 minutes before checking with the se
- `export function cacheLife(profile: 'days'): void` (`cache.d.ts`) — Cache this `"use cache"` for a timespan defined by the `"days"` profile. This cache may be stale on clients for 5 minutes before checking with the ser
- `export function cacheLife(profile: 'weeks'): void` (`cache.d.ts`) — Cache this `"use cache"` for a timespan defined by the `"weeks"` profile. This cache may be stale on clients for 5 minutes before checking with the se
- `export function cacheLife(profile: 'max'): void` (`cache.d.ts`) — Cache this `"use cache"` for a timespan defined by the `"max"` profile. This cache may be stale on clients for 5 minutes before checking with the serv
- `export function cacheLife( profile: keyof CacheLifeProfiles extends never ? string : never ): void` (`cache.d.ts`) — Cache this `"use cache"` using a custom profile "...". You can define custom profiles in `next.config.ts`.
- `export function cacheLife(profile: { stale?: number revalidate?: number expire?: number }): void` (`cache.d.ts`) — Cache this `"use cache"` using a custom timespan. This is similar to Cache-Control: max-age=`stale`,s-max-age=`revalidate`,stale-while-revalidate=`exp
- `export const unstable_cacheLife: typeof cacheLife` (`cache.d.ts`)
- `export const unstable_cacheTag: typeof cacheTag` (`cache.d.ts`)
- `export { navigation } (next/cache)` (`cache.d.ts`)
- `export { prefetch } (next/cache)` (`cache.d.ts`)
- `type Callback = (...args: any[]) => Promise<any>;` (`dist/server/web/spec-extension/unstable-cache.d.ts`)
- `export declare function unstable_cache<T extends Callback>(cb: T, keyParts?: string[], options?: { revalidate?: number | false; tags?: string[]; }): T;` (`dist/server/web/spec-extension/unstable-cache.d.ts`) — This function allows you to cache the results of expensive operations, like database queries, and reuse them across multiple requests. Read more: Next
- `export type Timestamp = number;` (`dist/server/lib/cache-handlers/types.d.ts`) — A timestamp in milliseconds elapsed since the epoch
- `export interface CacheEntry` (`dist/server/lib/cache-handlers/types.d.ts`)
- `export interface CacheHandler` (`dist/server/lib/cache-handlers/types.d.ts`)
- `type CacheLifeConfig = { expire?: number; };` (`dist/server/web/spec-extension/revalidate.d.ts`)
- `export declare function revalidateTag(tag: string, profile: string | CacheLifeConfig): undefined;` (`dist/server/web/spec-extension/revalidate.d.ts`) — This function allows you to purge cached data on-demand for a specific cache tag. The second argument specifies a `cacheLife` profile (e.g. `"max"`), 
- `export declare function updateTag(tag: string): undefined;` (`dist/server/web/spec-extension/revalidate.d.ts`) — This function allows you to update cached data on-demand for a specific cache tag. This can only be called from within a Server Action to enable read-
- `export declare function refresh(): void;` (`dist/server/web/spec-extension/revalidate.d.ts`) — Refreshes the current route from a Server Action. This clears client cache entries used for back/forward navigation, but keeps other prefetched routes
- `export declare function revalidatePath(originalPath: string, type?: 'layout' | 'page'): undefined;` (`dist/server/web/spec-extension/revalidate.d.ts`) — This function allows you to purge cached data on-demand for a specific path. Read more: Next.js Docs: `revalidatePath`
- `export declare function unstable_noStore(): void;` (`dist/server/web/spec-extension/unstable-no-store.d.ts`) — This function can be used to declaratively opt out of static rendering and indicate a particular component should not be cached. It marks the current 
- `export declare function io(): Promise<void>;` (`dist/server/request/io.d.ts`) — This function allows you to indicate that the code following it performs I/O or accesses dynamic data sources such as `new Date()` or `Math.random()`.
- `export declare function cacheTag(...tags: string[]): void;` (`dist/server/use-cache/cache-tag.d.ts`)
- `export declare function prefetch(): Promise<void>;` (`dist/server/request/cache-stages.d.ts`) — When `partialPrefetching` is enabled, this function allows you to indicate that the subsequent code should be excluded from the shell. It will be defe
- `export declare function navigation(): Promise<void>;` (`dist/server/request/cache-stages.d.ts`) — This function allows you to indicate that the subsequent code should be deferred to the actual navigation instead of rendering during a runtime prefet

### `next/constants` (75 symbols)
- `export { MODERN_BROWSERSLIST_TARGET } (next/constants)` (`dist/shared/lib/constants.d.ts`)
- `export type ValueOf<T> = Required<T>[keyof T];` (`dist/shared/lib/constants.d.ts`)
- `export declare const COMPILER_NAMES: { readonly client: "client"; readonly server: "server"; readonly edgeServer: "edge-server"; };` (`dist/shared/lib/constants.d.ts`)
- `export type CompilerNameValues = ValueOf<typeof COMPILER_NAMES>;` (`dist/shared/lib/constants.d.ts`)
- `export declare const COMPILER_INDEXES: { [compilerKey in CompilerNameValues]: number; };` (`dist/shared/lib/constants.d.ts`)
- `export { UNDERSCORE_NOT_FOUND_ROUTE } (next/constants)` (`dist/shared/lib/constants.d.ts`)
- `export { UNDERSCORE_NOT_FOUND_ROUTE_ENTRY } (next/constants)` (`dist/shared/lib/constants.d.ts`)
- `export { UNDERSCORE_GLOBAL_ERROR_ROUTE } (next/constants)` (`dist/shared/lib/constants.d.ts`)
- `export { UNDERSCORE_GLOBAL_ERROR_ROUTE_ENTRY } (next/constants)` (`dist/shared/lib/constants.d.ts`)
- `export declare const PHASE_EXPORT = "phase-export";` (`dist/shared/lib/constants.d.ts`)
- `export declare const PHASE_ANALYZE = "phase-analyze";` (`dist/shared/lib/constants.d.ts`)
- `export declare const PHASE_PRODUCTION_BUILD = "phase-production-build";` (`dist/shared/lib/constants.d.ts`)
- `export declare const PHASE_PRODUCTION_SERVER = "phase-production-server";` (`dist/shared/lib/constants.d.ts`)
- `export declare const PHASE_DEVELOPMENT_SERVER = "phase-development-server";` (`dist/shared/lib/constants.d.ts`)
- `export declare const PHASE_TEST = "phase-test";` (`dist/shared/lib/constants.d.ts`)
- `export declare const PHASE_INFO = "phase-info";` (`dist/shared/lib/constants.d.ts`)
- `export type PHASE_TYPE = typeof PHASE_INFO | typeof PHASE_TEST | typeof PHASE_EXPORT | typeof PHASE_ANALYZE | typeof PHASE_PRODUCTION_BUILD | typeof PHASE_PRODUCTION_SERVER | typeof PHASE_DEVELOPMENT_SERVER;` (`dist/shared/lib/constants.d.ts`)
- `export declare const PAGES_MANIFEST = "pages-manifest.json";` (`dist/shared/lib/constants.d.ts`)
- `export declare const APP_PATHS_MANIFEST = "app-paths-manifest.json";` (`dist/shared/lib/constants.d.ts`)
- `export declare const APP_PATH_ROUTES_MANIFEST = "app-path-routes-manifest.json";` (`dist/shared/lib/constants.d.ts`)
- `export declare const BUILD_MANIFEST = "build-manifest.json";` (`dist/shared/lib/constants.d.ts`)
- `export declare const FUNCTIONS_CONFIG_MANIFEST = "functions-config-manifest.json";` (`dist/shared/lib/constants.d.ts`)
- `export declare const SUBRESOURCE_INTEGRITY_MANIFEST = "subresource-integrity-manifest";` (`dist/shared/lib/constants.d.ts`)
- `export declare const NEXT_FONT_MANIFEST = "next-font-manifest";` (`dist/shared/lib/constants.d.ts`)
- `export declare const EXPORT_MARKER = "export-marker.json";` (`dist/shared/lib/constants.d.ts`)
- `export declare const EXPORT_DETAIL = "export-detail.json";` (`dist/shared/lib/constants.d.ts`)
- `export declare const PRERENDER_MANIFEST = "prerender-manifest.json";` (`dist/shared/lib/constants.d.ts`)
- `export declare const PREFETCH_HINTS = "prefetch-hints.json";` (`dist/shared/lib/constants.d.ts`)
- `export declare const PREVIEW_PROPS_MANIFEST = "preview-props.json";` (`dist/shared/lib/constants.d.ts`)
- `export declare const ROUTES_MANIFEST = "routes-manifest.json";` (`dist/shared/lib/constants.d.ts`)
- `export declare const IMAGES_MANIFEST = "images-manifest.json";` (`dist/shared/lib/constants.d.ts`)
- `export declare const SERVER_FILES_MANIFEST = "required-server-files";` (`dist/shared/lib/constants.d.ts`)
- `export declare const DEV_CLIENT_PAGES_MANIFEST = "_devPagesManifest.json";` (`dist/shared/lib/constants.d.ts`)
- `export declare const REQUEST_INSIGHTS_DEV_ENDPOINT = "/_next/development/request-insights";` (`dist/shared/lib/constants.d.ts`)
- `export declare const MIDDLEWARE_MANIFEST = "middleware-manifest.json";` (`dist/shared/lib/constants.d.ts`)
- `export declare const TURBOPACK_CLIENT_MIDDLEWARE_MANIFEST = "_clientMiddlewareManifest.js";` (`dist/shared/lib/constants.d.ts`)
- `export declare const TURBOPACK_CLIENT_BUILD_MANIFEST = "client-build-manifest.json";` (`dist/shared/lib/constants.d.ts`)
- `export declare const DEV_CLIENT_MIDDLEWARE_MANIFEST = "_devMiddlewareManifest.json";` (`dist/shared/lib/constants.d.ts`)
- `export declare const REACT_LOADABLE_MANIFEST = "react-loadable-manifest.json";` (`dist/shared/lib/constants.d.ts`)
- `export declare const SERVER_DIRECTORY = "server";` (`dist/shared/lib/constants.d.ts`)
- `export declare const CONFIG_FILES: string[];` (`dist/shared/lib/constants.d.ts`)
- `export declare const BUILD_ID_FILE = "BUILD_ID";` (`dist/shared/lib/constants.d.ts`)
- `export declare const BLOCKED_PAGES: string[];` (`dist/shared/lib/constants.d.ts`)
- `export declare const CLIENT_PUBLIC_FILES_PATH = "public";` (`dist/shared/lib/constants.d.ts`)
- `export declare const CLIENT_STATIC_FILES_PATH = "static";` (`dist/shared/lib/constants.d.ts`)
- _(+30 more declarations in `next/constants`)_

### `next/dist/build/segment-config/app/app-segment-config` (9 symbols)
- `export type Instant = InstantConfig | true | false;` (`dist/build/segment-config/app/app-segment-config.d.ts`)
- `export type Prefetch = 'auto' | 'partial' | 'force-disabled';` (`dist/build/segment-config/app/app-segment-config.d.ts`)
- `export type EnsureStatic = 'auto' | 'shell' | 'prefetch' | 'navigation' | false;` (`dist/build/segment-config/app/app-segment-config.d.ts`)
- `export type InstantConfigForTypeCheckInternal = __GenericInstantConfig | Instant;` (`dist/build/segment-config/app/app-segment-config.d.ts`)
- `type WideInstantSample = { cookies?: InstantSample['cookies']; headers?: Array<string[]>; params?: InstantSample['params']; searchParams?: InstantSample['searchParams']; };` (`dist/build/segment-config/app/app-segment-config.d.ts`)
- `export interface InstantConfig` (`dist/build/segment-config/app/app-segment-config.d.ts`)
- `export type InstantSample = { cookies?: Array<{ name: string; value: string | null; }>; headers?: Array<[string, string | null]>; params?: { [key: string]: string | string[]; }; searchParams?: { [key: string]: string | s` (`dist/build/segment-config/app/app-segment-config.d.ts`)
- `export declare function parseAppSegmentConfig(data: unknown, route: string): AppSegmentConfig;` (`dist/build/segment-config/app/app-segment-config.d.ts`) — Parse the app segment config.
- `export type AppSegmentConfig = { revalidate?: number | false; dynamicParams?: boolean; dynamic?: 'auto' | 'error' | 'force-static' | 'force-dynamic'; fetchCache?: 'auto' | 'default-cache' | 'default-no-store' | 'force-ca` (`dist/build/segment-config/app/app-segment-config.d.ts`) — The configuration for a page.

### `next/dist/build/segment-config/middleware/middleware-config` (10 symbols)
- `export type MiddlewareConfigInput = { matcher?: string | Array<{ locale?: false; has?: RouteHas[]; missing?: RouteHas[]; source: string; } | string>; regions?: string | string[];` (`dist/build/segment-config/middleware/middleware-config.d.ts`)
- `export type RouteHas = { type: 'header' | 'cookie' | 'query'; key: string; value?: string; } | { type: 'host'; key?: undefined; value: string; };` (`dist/lib/load-custom-routes.d.ts`)
- `export type Rewrite = { source: string; destination: string; basePath?: false; locale?: false; has?: RouteHas[]; missing?: RouteHas[]; };` (`dist/lib/load-custom-routes.d.ts`)
- `export type Header = { source: string; basePath?: false; locale?: false; headers: Array<{ key: string; value: string; }>; has?: RouteHas[]; missing?: RouteHas[]; };` (`dist/lib/load-custom-routes.d.ts`)
- `export type Redirect = { source: string; destination: string; basePath?: false; locale?: false; has?: RouteHas[]; missing?: RouteHas[]; priority?: boolean; } & ({ statusCode?: never; permanent: boolean; } | { statusCode:` (`dist/lib/load-custom-routes.d.ts`)
- `export type Middleware = { source: string; locale?: false; has?: RouteHas[]; missing?: RouteHas[]; };` (`dist/lib/load-custom-routes.d.ts`)
- `export declare function normalizeRouteRegex(regex: string): string;` (`dist/lib/load-custom-routes.d.ts`)
- `export type RouteType = 'rewrite' | 'redirect' | 'header';` (`dist/lib/load-custom-routes.d.ts`)
- `export declare function checkCustomRoutes(routes: Redirect[] | Header[] | Rewrite[] | Middleware[], type: RouteType | 'middleware'): void;` (`dist/lib/load-custom-routes.d.ts`)
- `export interface CustomRoutes` (`dist/lib/load-custom-routes.d.ts`)

### `next/dist/lib/load-custom-routes` (7 symbols)
- `export { normalizeConfig } (next/dist/lib/load-custom-routes)` (`dist/server/config.d.ts`)
- `export { DomainLocale } (next/dist/lib/load-custom-routes)` (`dist/server/config.d.ts`)
- `export { NextConfig } (next/dist/lib/load-custom-routes)` (`dist/server/config.d.ts`)
- `export declare function warnOptionHasBeenDeprecated(config: NextConfig, nestedPropertyKey: string, reason: string, silent: boolean): boolean;` (`dist/server/config.d.ts`)
- `export declare function warnOptionHasBeenMovedOutOfExperimental(config: NextConfig, oldExperimentalKey: string, newKey: string, configFileName: string, silent: boolean): NextConfig;` (`dist/server/config.d.ts`)
- `type LoadConfigOptions = { customConfig?: object | null; rawConfig?: boolean; silent?: boolean; reportExperimentalFeatures?: (configuredExperimentalFeatures: ConfiguredExperimentalFeature[]) => void; reactProductionProfi` (`dist/server/config.d.ts`)
- `export type ConfiguredExperimentalFeature = { key: keyof ExperimentalConfig; value: ExperimentalConfig[keyof ExperimentalConfig]; reason?: string; };` (`dist/server/config.d.ts`)

### `next/dist/lib/metadata/types/metadata-interface` (126 symbols)
- `interface Metadata extends DeprecatedMetadataFields` (`dist/lib/metadata/types/metadata-interface.d.ts`) — Metadata interface to describe all the metadata fields that can be set in a document. This interface covers all the metadata fields available in Next.
- `interface ResolvedMetadataWithURLs` (`dist/lib/metadata/types/metadata-interface.d.ts`) — ResolvedMetadataWithURLs represents the fully processed metadata after defaults are applied and relative URLs are composed with `metadataBase`.
- `export type WithStringifiedURLs<T> = T extends URL ? string : T extends object ? { [K in keyof T]: WithStringifiedURLs<T[K]>; } : T;` (`dist/lib/metadata/types/metadata-interface.d.ts`)
- `type ResolvedMetadata = WithStringifiedURLs<ResolvedMetadataWithURLs>;` (`dist/lib/metadata/types/metadata-interface.d.ts`) — ResolvedMetadata represents the fully processed metadata after defaults are applied and relative URLs are composed with `metadataBase`.
- `type RobotsRuleBase = { allow?: string | string[] | undefined; disallow?: string | string[] | undefined; crawlDelay?: number | undefined;` (`dist/lib/metadata/types/metadata-interface.d.ts`)
- `type RobotsFile = { rules: (RobotsRuleBase & { userAgent?: string | string[] | undefined; }) | Array<RobotsRuleBase & { userAgent: string | string[]; }>; sitemap?: string | string[] | undefined; host?: string | undefined` (`dist/lib/metadata/types/metadata-interface.d.ts`)
- `type SitemapFile = Array<{ url: string; lastModified?: string | Date | undefined; changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' | undefined; priority?: number | undefined;` (`dist/lib/metadata/types/metadata-interface.d.ts`)
- `type ResolvingMetadata = Promise<ResolvedMetadata>;` (`dist/lib/metadata/types/metadata-interface.d.ts`)
- `declare namespace MetadataRoute` (`dist/lib/metadata/types/metadata-interface.d.ts`)
- `interface Viewport extends ViewportLayout` (`dist/lib/metadata/types/metadata-interface.d.ts`) — Interface for the viewport configuration. This configuration allows defining properties such as width, initial scale, theme colors, and color scheme.
- `interface ResolvedViewport extends ViewportLayout` (`dist/lib/metadata/types/metadata-interface.d.ts`)
- `type ResolvingViewport = Promise<ResolvedViewport>;` (`dist/lib/metadata/types/metadata-interface.d.ts`)
- `export { Metadata } (next/dist/lib/metadata/types/metadata-interface)` (`dist/lib/metadata/types/metadata-interface.d.ts`)
- `export { ResolvedMetadata } (next/dist/lib/metadata/types/metadata-interface)` (`dist/lib/metadata/types/metadata-interface.d.ts`)
- `export { ResolvedMetadataWithURLs } (next/dist/lib/metadata/types/metadata-interface)` (`dist/lib/metadata/types/metadata-interface.d.ts`)
- `export { ResolvingMetadata } (next/dist/lib/metadata/types/metadata-interface)` (`dist/lib/metadata/types/metadata-interface.d.ts`)
- `export { MetadataRoute } (next/dist/lib/metadata/types/metadata-interface)` (`dist/lib/metadata/types/metadata-interface.d.ts`)
- `export { Viewport } (next/dist/lib/metadata/types/metadata-interface)` (`dist/lib/metadata/types/metadata-interface.d.ts`)
- `export { ResolvingViewport } (next/dist/lib/metadata/types/metadata-interface)` (`dist/lib/metadata/types/metadata-interface.d.ts`)
- `export { ResolvedViewport } (next/dist/lib/metadata/types/metadata-interface)` (`dist/lib/metadata/types/metadata-interface.d.ts`)
- `type LangCode = 'aa' | 'ab' | 'ae' | 'af' | 'ak' | 'am' | 'an' | 'ar' | 'as' | 'av' | 'ay' | 'az' | 'ba' | 'be' | 'bg' | 'bh' | 'bi' | 'bm' | 'bn' | 'bo' | 'br' | 'bs' | 'ca' | 'ce' | 'ch' | 'co' | 'cr' | 'cs' | 'cu' | '` (`dist/lib/metadata/types/alternative-urls-types.d.ts`)
- `type UnmatchedLang = 'x-default';` (`dist/lib/metadata/types/alternative-urls-types.d.ts`)
- `type HrefLang = LangCode | UnmatchedLang;` (`dist/lib/metadata/types/alternative-urls-types.d.ts`)
- `export type Languages<T> = { [s in HrefLang]?: T | undefined; };` (`dist/lib/metadata/types/alternative-urls-types.d.ts`)
- `export type AlternateLinkDescriptor = { title?: string | undefined; url: string | URL; };` (`dist/lib/metadata/types/alternative-urls-types.d.ts`)
- `export type AlternateURLs = { canonical?: null | string | URL | AlternateLinkDescriptor | undefined; languages?: Languages<null | string | URL | AlternateLinkDescriptor[]> | undefined; media?: { [media: string]: null | s` (`dist/lib/metadata/types/alternative-urls-types.d.ts`)
- `export type ResolvedAlternateURLs = { canonical: null | AlternateLinkDescriptor; languages: null | Languages<AlternateLinkDescriptor[]>; media: null | { [media: string]: null | AlternateLinkDescriptor[]; }; types: null |` (`dist/lib/metadata/types/alternative-urls-types.d.ts`)
- `export type AppLinks = { ios?: AppLinksApple | Array<AppLinksApple> | undefined; iphone?: AppLinksApple | Array<AppLinksApple> | undefined; ipad?: AppLinksApple | Array<AppLinksApple> | undefined; android?: AppLinksAndro` (`dist/lib/metadata/types/extra-types.d.ts`)
- `export type ResolvedAppLinks = { ios?: Array<AppLinksApple> | undefined; iphone?: Array<AppLinksApple> | undefined; ipad?: Array<AppLinksApple> | undefined; android?: Array<AppLinksAndroid> | undefined; windows_phone?: A` (`dist/lib/metadata/types/extra-types.d.ts`)
- `export type AppLinksApple = { url: string | URL; app_store_id?: string | number | undefined; app_name?: string | undefined; };` (`dist/lib/metadata/types/extra-types.d.ts`)
- `export type AppLinksAndroid = { package: string; url?: string | URL | undefined; class?: string | undefined; app_name?: string | undefined; };` (`dist/lib/metadata/types/extra-types.d.ts`)
- `export type AppLinksWindows = { url: string | URL; app_id?: string | undefined; app_name?: string | undefined; };` (`dist/lib/metadata/types/extra-types.d.ts`)
- `export type AppLinksWeb = { url: string | URL; should_fallback?: boolean | undefined; };` (`dist/lib/metadata/types/extra-types.d.ts`)
- `export type ItunesApp = { appId: string; appArgument?: string | undefined; };` (`dist/lib/metadata/types/extra-types.d.ts`)
- `export type ViewportLayout = { width?: string | number | undefined; height?: string | number | undefined; initialScale?: number | undefined; minimumScale?: number | undefined; maximumScale?: number | undefined; userScala` (`dist/lib/metadata/types/extra-types.d.ts`)
- `export type AppleWebApp = { capable?: boolean | undefined; title?: string | undefined; startupImage?: AppleImage | Array<AppleImage> | undefined; statusBarStyle?: 'default' | 'black' | 'black-translucent' | undefined;` (`dist/lib/metadata/types/extra-types.d.ts`)
- `export type AppleImage = string | AppleImageDescriptor;` (`dist/lib/metadata/types/extra-types.d.ts`)
- `export type AppleImageDescriptor = { url: string; media?: string | undefined; };` (`dist/lib/metadata/types/extra-types.d.ts`)
- `export type ResolvedAppleWebApp = { capable: boolean; title?: string | null | undefined; startupImage?: AppleImageDescriptor[] | null | undefined; statusBarStyle?: 'default' | 'black' | 'black-translucent' | undefined;` (`dist/lib/metadata/types/extra-types.d.ts`)
- `export type Facebook = FacebookAppId | FacebookAdmins | ResolvedFacebook;` (`dist/lib/metadata/types/extra-types.d.ts`)
- `export type FacebookAppId = { appId: string; admins?: never | undefined; };` (`dist/lib/metadata/types/extra-types.d.ts`)
- `export type FacebookAdmins = { appId?: never | undefined; admins: string | string[]; };` (`dist/lib/metadata/types/extra-types.d.ts`)
- `export type ResolvedFacebook = { appId?: string | undefined; admins?: string[] | undefined; };` (`dist/lib/metadata/types/extra-types.d.ts`)
- `export type Pinterest = PinterestRichPin | ResolvedPinterest;` (`dist/lib/metadata/types/extra-types.d.ts`)
- `export type PinterestRichPin = { richPin: string | boolean; };` (`dist/lib/metadata/types/extra-types.d.ts`)
- _(+81 more declarations in `next/dist/lib/metadata/types/metadata-interface`)_

### `next/dist/shared/lib/image-config` (14 symbols)
- `export declare const VALID_LOADERS: readonly ["default", "imgix", "cloudinary", "akamai", "custom"];` (`dist/shared/lib/image-config.d.ts`)
- `export type LoaderValue = (typeof VALID_LOADERS)[number];` (`dist/shared/lib/image-config.d.ts`)
- `export type ImageLoaderProps = { src: string; width: number; quality?: number; };` (`dist/shared/lib/image-config.d.ts`)
- `export type ImageLoaderPropsWithConfig = ImageLoaderProps & { config: Readonly<ImageConfig>; };` (`dist/shared/lib/image-config.d.ts`)
- `export type LocalPattern = { pathname?: string; search?: string; };` (`dist/shared/lib/image-config.d.ts`)
- `export type RemotePattern = { protocol?: 'http' | 'https'; hostname: string; port?: string;` (`dist/shared/lib/image-config.d.ts`)
- `type ImageFormat = 'image/avif' | 'image/webp';` (`dist/shared/lib/image-config.d.ts`)
- `export type ImageConfigComplete = { deviceSizes: number[]; imageSizes: number[]; loader: LoaderValue; path: string; loaderFile: string; domains: string[]; disableStaticImages: boolean;` (`dist/shared/lib/image-config.d.ts`) — Image configurations
- `export type ImageConfig = Partial<ImageConfigComplete>;` (`dist/shared/lib/image-config.d.ts`)
- `type RequiredImageConfigForRendering = Pick<ImageConfigComplete, 'deviceSizes' | 'imageSizes' | 'loader' | 'path' | 'dangerouslyAllowSVG' | 'unoptimized'>;` (`dist/shared/lib/image-config.d.ts`)
- `export type ImageConfigForRendering = RequiredImageConfigForRendering & Partial<Pick<ImageConfigComplete, 'qualities' | 'domains' | 'remotePatterns' | 'localPatterns'>> & { output?: 'standalone' | 'export'; };` (`dist/shared/lib/image-config.d.ts`)
- `export type PreparedImageConfig = RequiredImageConfigForRendering & { allSizes: number[]; qualities: ImageConfigComplete['qualities']; domains: ImageConfigComplete['domains'] | undefined; remotePatterns: ImageConfigCompl` (`dist/shared/lib/image-config.d.ts`)
- `export declare function prepareImageConfig(envConfig?: ImageConfigForRendering, contextConfig?: ImageConfigComplete): PreparedImageConfig;` (`dist/shared/lib/image-config.d.ts`) — Prepare owned, sorted image options once for each env/context pair. Changed options require new objects because results are cached by identity.
- `export declare const imageConfigDefault: ImageConfigComplete;` (`dist/shared/lib/image-config.d.ts`)

### `next/dynamic` (11 symbols)
- `type ComponentModule<P = {}> = { default: React.ComponentType<P>; };` (`dist/shared/lib/dynamic.d.ts`)
- `export declare type LoaderComponent<P = {}> = Promise<React.ComponentType<P> | ComponentModule<P>>;` (`dist/shared/lib/dynamic.d.ts`)
- `export declare type Loader<P = {}> = (() => LoaderComponent<P>) | LoaderComponent<P>;` (`dist/shared/lib/dynamic.d.ts`)
- `export type LoaderMap = { [module: string]: () => Loader<any>; };` (`dist/shared/lib/dynamic.d.ts`)
- `export type LoadableGeneratedOptions = { webpack?(): any; modules?(): LoaderMap; };` (`dist/shared/lib/dynamic.d.ts`)
- `export type DynamicOptionsLoadingProps = { error?: Error | null; isLoading?: boolean; pastDelay?: boolean; retry?: () => void; timedOut?: boolean; };` (`dist/shared/lib/dynamic.d.ts`)
- `export type DynamicOptions<P = {}> = LoadableGeneratedOptions & { loading?: (loadingProps: DynamicOptionsLoadingProps) => React.ReactNode; loader?: Loader<P> | LoaderMap; loadableGenerated?: LoadableGeneratedOptions;` (`dist/shared/lib/dynamic.d.ts`)
- `export type LoadableOptions<P = {}> = DynamicOptions<P>;` (`dist/shared/lib/dynamic.d.ts`)
- `export type LoadableFn<P = {}> = (opts: LoadableOptions<P>) => React.ComponentType<P>;` (`dist/shared/lib/dynamic.d.ts`)
- `export type LoadableComponent<P = {}> = React.ComponentType<P>;` (`dist/shared/lib/dynamic.d.ts`)
- `export declare function noSSR<P = {}>(LoadableInitializer: LoadableFn<P>, loadableOptions: DynamicOptions<P>): React.ComponentType<P>;` (`dist/shared/lib/dynamic.d.ts`)

### `next/error` (3 symbols)
- `export { catchError } (next/error)` (`error.d.ts`)
- `export { ErrorInfo } (next/error)` (`error.d.ts`)
- `export { default } (next/error)` (`dist/api/error.d.ts`)

### `next/experimental/testing/server` (3 symbols)
- `export { getRedirectUrl } (next/experimental/testing/server)` (`dist/experimental/testing/server/index.d.ts`)
- `export { getRewrittenUrl } (next/experimental/testing/server)` (`dist/experimental/testing/server/index.d.ts`)
- `export { isRewrite } (next/experimental/testing/server)` (`dist/experimental/testing/server/index.d.ts`)

### `next/font` (2 symbols)
- `export type AdjustFontFallback = { fallbackFont: string ascentOverride?: string descentOverride?: string lineGapOverride?: string sizeAdjust?: string }` (`font/index.d.ts`)
- `export type FontLoader = (options: { functionName: string variableName: string data: any[] emitFontFile: ( content: Buffer, ext: string, preload: boolean, isUsingSizeAdjust?: boolean ) => string resolve: (src: string) =>` (`font/index.d.ts`)

### `next/font/google` (1959 symbols)
- `export declare function ABeeZee<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | 'italic' | Array<'normal' | 'italic'>; display?: Display; variable?: T; preload?:` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function ADLaM_Display<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean;` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function AR_One_Sans<T extends CssVariable | undefined = undefined>(options?: { weight?: '400' | '500' | '600' | '700' | 'variable' | Array<'400' | '500' | '600' | '700'>; style?: 'normal' | Array<'normal'` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Abel<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean; fallback?: stri` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Abhaya_Libre<T extends CssVariable | undefined = undefined>(options: { weight: '400' | '500' | '600' | '700' | '800' | Array<'400' | '500' | '600' | '700' | '800'>; style?: 'normal' | Array<'norma` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Aboreto<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean; fallback?: s` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Abril_Fatface<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean;` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Abyssinica_SIL<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean;` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Aclonica<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean; fallback?: ` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Acme<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean; fallback?: stri` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Actor<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean; fallback?: str` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Adamina<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean; fallback?: s` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Advent_Pro<T extends CssVariable | undefined = undefined>(options?: { weight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'variable' | Array<'100' | '200' | '300' | '4` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Afacad<T extends CssVariable | undefined = undefined>(options?: { weight?: '400' | '500' | '600' | '700' | 'variable' | Array<'400' | '500' | '600' | '700'>; style?: 'normal' | 'italic' | Array<'n` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Afacad_Flux<T extends CssVariable | undefined = undefined>(options?: { weight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '1000' | 'variable' | Array<'100' | '200' | ` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Agbalumo<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean; fallback?: ` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Agdasima<T extends CssVariable | undefined = undefined>(options: { weight: '400' | '700' | Array<'400' | '700'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: bool` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Agu_Display<T extends CssVariable | undefined = undefined>(options?: { weight?: '400' | 'variable' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: bo` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Aguafina_Script<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean;` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Akatab<T extends CssVariable | undefined = undefined>(options: { weight: '400' | '500' | '600' | '700' | '800' | '900' | Array<'400' | '500' | '600' | '700' | '800' | '900'>; style?: 'normal' | Ar` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Akaya_Kanadaka<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean;` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Akaya_Telivigala<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean;` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Akronim<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean; fallback?: s` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Akshar<T extends CssVariable | undefined = undefined>(options?: { weight?: '300' | '400' | '500' | '600' | '700' | 'variable' | Array<'300' | '400' | '500' | '600' | '700'>; style?: 'normal' | Arr` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Akt<T extends CssVariable | undefined = undefined>(options?: { weight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'variable' | Array<'100' | '200' | '300' | '400' | '` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Aladin<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean; fallback?: st` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Alan_Sans<T extends CssVariable | undefined = undefined>(options?: { weight?: '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'variable' | Array<'300' | '400' | '500' | '600' | '700' | '80` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Alata<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean; fallback?: str` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Alatsi<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean; fallback?: st` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Albert_Sans<T extends CssVariable | undefined = undefined>(options?: { weight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'variable' | Array<'100' | '200' | '300' | '` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Aldrich<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean; fallback?: s` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Alef<T extends CssVariable | undefined = undefined>(options: { weight: '400' | '700' | Array<'400' | '700'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean;` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Alegreya<T extends CssVariable | undefined = undefined>(options?: { weight?: '400' | '500' | '600' | '700' | '800' | '900' | 'variable' | Array<'400' | '500' | '600' | '700' | '800' | '900'>;` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Alegreya_SC<T extends CssVariable | undefined = undefined>(options: { weight: '400' | '500' | '700' | '800' | '900' | Array<'400' | '500' | '700' | '800' | '900'>; style?: 'normal' | 'italic' | Ar` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Alegreya_Sans<T extends CssVariable | undefined = undefined>(options: { weight: '100' | '300' | '400' | '500' | '700' | '800' | '900' | Array<'100' | '300' | '400' | '500' | '700' | '800' | '900'>` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Alegreya_Sans_SC<T extends CssVariable | undefined = undefined>(options: { weight: '100' | '300' | '400' | '500' | '700' | '800' | '900' | Array<'100' | '300' | '400' | '500' | '700' | '800' | '90` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Aleo<T extends CssVariable | undefined = undefined>(options?: { weight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'variable' | Array<'100' | '200' | '300' | '400' | ` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Alex_Brush<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean; fallback?` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Alexandria<T extends CssVariable | undefined = undefined>(options?: { weight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'variable' | Array<'100' | '200' | '300' | '4` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Alfa_Slab_One<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean;` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Alice<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean; fallback?: str` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Alien_Block<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean;` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Alike<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean; fallback?: str` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Alike_Angular<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean;` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- `export declare function Alkalami<T extends CssVariable | undefined = undefined>(options: { weight: '400' | Array<'400'>; style?: 'normal' | Array<'normal'>; display?: Display; variable?: T; preload?: boolean; fallback?: ` (`dist/compiled/@next/font/dist/google/index.d.ts`)
- _(+1914 more declarations in `next/font/google`)_

### `next/font/local` (2 symbols)
- `export { default } (next/font/local)` (`font/local/index.d.ts`)
- `type LocalFont<T extends CssVariable | undefined = undefined> = { src: string | Array<{ path: string; weight?: string; style?: string; }>; display?: Display; weight?: string; style?: string; adjustFontFallback?: 'Arial' ` (`dist/compiled/@next/font/dist/local/index.d.ts`)

### `next/form` (2 symbols)
- `export { FormProps } (next/form)` (`dist/client/form.d.ts`)
- `declare const Form: import("react").ForwardRefExoticComponent<Omit<{ action: NonNullable<string | ((formData: FormData) => void | Promise<void>) | undefined>; prefetch?: false | null; replace?: boolean; scroll?: boolean;` (`dist/client/form.d.ts`)

### `next/headers` (4 symbols)
- `export declare function cookies(): Promise<ReadonlyRequestCookies>;` (`dist/server/request/cookies.d.ts`)
- `export declare function headers(): Promise<ReadonlyHeaders>;` (`dist/server/request/headers.d.ts`) — This function allows you to read the HTTP incoming request headers in Server Components, Server Actions, Route Handlers and Middleware. Read more: Nex
- `export declare function draftMode(): Promise<DraftMode>;` (`dist/server/request/draft-mode.d.ts`)
- `declare class DraftMode` (`dist/server/request/draft-mode.d.ts`)

### `next/image` (6 symbols)
- `export { default } (next/image)` (`dist/shared/lib/image-external.d.ts`)
- `export { getImageProps } (next/image)` (`dist/shared/lib/image-external.d.ts`)
- `export { ImageProps } (next/image)` (`dist/shared/lib/image-external.d.ts`)
- `export { ImageLoaderProps } (next/image)` (`dist/shared/lib/image-external.d.ts`)
- `export { ImageLoader } (next/image)` (`dist/shared/lib/image-external.d.ts`)
- `export { StaticImageData } (next/image)` (`dist/shared/lib/image-external.d.ts`)

### `next/image-types/global` (9 symbols)
- `declare module '*.png'` (`image-types/global.d.ts`)
- `declare module '*.svg'` (`image-types/global.d.ts`)
- `declare module '*.jpg'` (`image-types/global.d.ts`)
- `declare module '*.jpeg'` (`image-types/global.d.ts`)
- `declare module '*.gif'` (`image-types/global.d.ts`)
- `declare module '*.webp'` (`image-types/global.d.ts`)
- `declare module '*.avif'` (`image-types/global.d.ts`)
- `declare module '*.ico'` (`image-types/global.d.ts`)
- `declare module '*.bmp'` (`image-types/global.d.ts`)

### `next/link` (6 symbols)
- `type Url = string | UrlObject;` (`dist/client/link.d.ts`)
- `type OnNavigateEventHandler = (event: { preventDefault: () => void; }) => void;` (`dist/client/link.d.ts`)
- `type InternalLinkProps = { href: Url; as?: Url; replace?: boolean;` (`dist/client/link.d.ts`)
- `export interface LinkProps<RouteInferType = any> extends InternalLinkProps` (`dist/client/link.d.ts`)
- `declare const Link: React.ForwardRefExoticComponent<Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps<any>> & LinkProps<any> & { children?: React.ReactNode | undefined; } & React.RefAttributes<HTMLAncho` (`dist/client/link.d.ts`) — A React component that extends the HTML `<a>` element to provide prefetching and client-side navigation between routes. It is the primary way to navig
- `export declare const useLinkStatus: () => { pending: boolean; };` (`dist/client/link.d.ts`)

### `next/navigation` (17 symbols)
- `export declare function useSearchParams(): ReadonlyURLSearchParams;` (`dist/client/components/navigation.d.ts`) — A Client Component hook that lets you *read* the current URL's search parameters. Learn more about `URLSearchParams` on MDN Read more: Next.js Docs: `
- `export declare function usePathname(): string;` (`dist/client/components/navigation.d.ts`) — A Client Component hook that lets you read the current URL's pathname. Read more: Next.js Docs: `usePathname`
- `export { ServerInsertedHTMLContext } (next/navigation)` (`dist/client/components/navigation.d.ts`)
- `export { useServerInsertedHTML } (next/navigation)` (`dist/client/components/navigation.d.ts`)
- `export declare function useRouter(): AppRouterInstance;` (`dist/client/components/navigation.d.ts`) — This hook allows you to programmatically change routes inside Client Component. Read more: Next.js Docs: `useRouter`
- `export declare function useParams<T extends Params = Params>(): T;` (`dist/client/components/navigation.d.ts`) — A Client Component hook that lets you read a route's dynamic params filled in by the current URL. Read more: Next.js Docs: `useParams`
- `export declare function useSelectedLayoutSegments(parallelRouteKey?: string): string[];` (`dist/client/components/navigation.d.ts`) — A Client Component hook that lets you read the active route segments **below** the Layout it is called from. Read more: Next.js Docs: `useSelectedLayo
- `export declare function useSelectedLayoutSegment(parallelRouteKey?: string): string | null;` (`dist/client/components/navigation.d.ts`) — A Client Component hook that lets you read the active route segment **one level below** the Layout it is called from. Read more: Next.js Docs: `useSel
- `export { unstable_isUnrecognizedActionError } (next/navigation)` (`dist/client/components/navigation.d.ts`)
- `export { ReadonlyURLSearchParams } (next/navigation)` (`dist/client/components/navigation.d.ts`)
- `export { notFound } (next/navigation)` (`dist/client/components/navigation.d.ts`)
- `export { forbidden } (next/navigation)` (`dist/client/components/navigation.d.ts`)
- `export { unauthorized } (next/navigation)` (`dist/client/components/navigation.d.ts`)
- `export { redirect } (next/navigation)` (`dist/client/components/navigation.d.ts`)
- `export { permanentRedirect } (next/navigation)` (`dist/client/components/navigation.d.ts`)
- `export { RedirectType } (next/navigation)` (`dist/client/components/navigation.d.ts`)
- `export { unstable_rethrow } (next/navigation)` (`dist/client/components/navigation.d.ts`)

### `next/offline` (4 symbols)
- `export { useOffline } (next/offline)` (`offline.d.ts`)
- `export declare function dispatchOfflineChange(isOffline: boolean): void;` (`dist/client/components/use-offline.d.ts`) — Called by the offline module when the offline state changes. Dispatches into React via startTransition + useOptimistic.
- `export declare function OfflineProvider({ children }: { children: React.ReactNode; }): React.JSX.Element;` (`dist/client/components/use-offline.d.ts`)
- `export declare function useOffline(): boolean;` (`dist/client/components/use-offline.d.ts`) — Returns whether the app is currently offline. Returns `false` during SSR and hydration.

### `next/og` (2 symbols)
- `type OgModule = typeof import('next/dist/compiled/@vercel/og');` (`dist/server/og/image-response.d.ts`)
- `export declare class ImageResponse extends Response` (`dist/server/og/image-response.d.ts`) — The ImageResponse class allows you to generate dynamic images using JSX and CSS. This is useful for generating social media images such as Open Graph 

### `next/root-params` (1 symbols)
- `declare module 'next/root-params'` (`root-params.d.ts`)

### `next/script` (5 symbols)
- `export interface ScriptProps extends ScriptHTMLAttributes<HTMLScriptElement>` (`dist/client/script.d.ts`)
- `export type Props = ScriptProps;` (`dist/client/script.d.ts`)
- `export declare function handleClientScriptLoad(props: ScriptProps): void;` (`dist/client/script.d.ts`)
- `export declare function initScriptLoader(scriptLoaderItems: ScriptProps[]): void;` (`dist/client/script.d.ts`)
- `declare function Script(props: ScriptProps): JSX.Element | null;` (`dist/client/script.d.ts`) — Load a third-party scripts in an optimized way. Read more: Next.js Docs: `next/script`

### `next/server` (55 symbols)
- `export { NextFetchEvent } (next/server)` (`server.d.ts`)
- `export { NextRequest } (next/server)` (`server.d.ts`)
- `export { NextResponse } (next/server)` (`server.d.ts`)
- `export { userAgentFromString } (next/server)` (`server.d.ts`)
- `export { userAgent } (next/server)` (`server.d.ts`)
- `export { URLPattern } (next/server)` (`server.d.ts`)
- `export { ImageResponse } (next/server)` (`server.d.ts`)
- `export { ImageResponseOptions } (next/server)` (`server.d.ts`)
- `export { after } (next/server)` (`server.d.ts`)
- `export { connection } (next/server)` (`server.d.ts`)
- `declare const responseSymbol: unique symbol;` (`dist/server/web/spec-extension/fetch-event.d.ts`)
- `declare const passThroughSymbol: unique symbol;` (`dist/server/web/spec-extension/fetch-event.d.ts`)
- `declare const waitUntilSymbol: unique symbol;` (`dist/server/web/spec-extension/fetch-event.d.ts`)
- `declare class FetchEvent` (`dist/server/web/spec-extension/fetch-event.d.ts`)
- `export declare function getWaitUntilPromiseFromEvent(event: FetchEvent): Promise<void> | undefined;` (`dist/server/web/spec-extension/fetch-event.d.ts`)
- `export declare class NextFetchEvent extends FetchEvent` (`dist/server/web/spec-extension/fetch-event.d.ts`)
- `export declare const INTERNALS: unique symbol;` (`dist/server/web/spec-extension/request.d.ts`)
- `export declare class NextRequest extends Request` (`dist/server/web/spec-extension/request.d.ts`) — This class extends the Web `Request` API with additional convenience methods. Read more: Next.js Docs: `NextRequest`
- `export interface RequestInit extends globalThis.RequestInit` (`dist/server/web/spec-extension/request.d.ts`)
- `declare const INTERNALS: unique symbol;` (`dist/server/web/spec-extension/response.d.ts`)
- `export declare class NextResponse<Body = unknown> extends Response` (`dist/server/web/spec-extension/response.d.ts`) — This class extends the Web `Response` API with additional convenience methods. Read more: Next.js Docs: `NextResponse`
- `interface ResponseInit extends globalThis.ResponseInit` (`dist/server/web/spec-extension/response.d.ts`)
- `interface ModifiedRequest` (`dist/server/web/spec-extension/response.d.ts`)
- `interface MiddlewareResponseInit extends globalThis.ResponseInit` (`dist/server/web/spec-extension/response.d.ts`)
- `export { MiddlewareConfig } (next/server)` (`dist/server/web/types.d.ts`)
- `export { ProxyConfig } (next/server)` (`dist/server/web/types.d.ts`)
- `export interface RequestData` (`dist/server/web/types.d.ts`)
- `export type NodejsRequestData = Omit<RequestData, 'body'> & { body?: CloneableBody; };` (`dist/server/web/types.d.ts`)
- `export interface FetchEventResult` (`dist/server/web/types.d.ts`)
- `export type NextMiddlewareResult = NextResponse | Response | null | undefined | void;` (`dist/server/web/types.d.ts`)
- `export type NextMiddleware = (request: NextRequest, event: NextFetchEvent) => NextMiddlewareResult | Promise<NextMiddlewareResult>;` (`dist/server/web/types.d.ts`) — Middleware allows you to run code before a request is completed. Then, based on the incoming request, you can modify the response by rewriting, redire
- `export type NextProxy = NextMiddleware;` (`dist/server/web/types.d.ts`) — Proxy allows you to run code before a request is completed. Then, based on the incoming request, you can modify the response by rewriting, redirecting
- `interface UserAgent` (`dist/server/web/spec-extension/user-agent.d.ts`)
- `export declare function isBot(input: string): boolean;` (`dist/server/web/spec-extension/user-agent.d.ts`)
- `export declare function userAgentFromString(input: string | undefined): UserAgent;` (`dist/server/web/spec-extension/user-agent.d.ts`)
- `export declare function userAgent({ headers }: { headers: Headers; }): UserAgent;` (`dist/server/web/spec-extension/user-agent.d.ts`)
- `type URLPatternInput = URLPatternInit | string;` (`dist/compiled/@edge-runtime/primitives/url.d.ts`)
- `declare class URLPattern` (`dist/compiled/@edge-runtime/primitives/url.d.ts`)
- `interface URLPatternInit` (`dist/compiled/@edge-runtime/primitives/url.d.ts`)
- `interface URLPatternResult` (`dist/compiled/@edge-runtime/primitives/url.d.ts`)
- `interface URLPatternComponentResult` (`dist/compiled/@edge-runtime/primitives/url.d.ts`)
- `declare const _URL: typeof URL` (`dist/compiled/@edge-runtime/primitives/url.d.ts`)
- `declare const _URLSearchParams: typeof URLSearchParams` (`dist/compiled/@edge-runtime/primitives/url.d.ts`)
- `declare class _URLPattern extends URLPattern` (`dist/compiled/@edge-runtime/primitives/url.d.ts`)
- `export { URL } (next/server)` (`dist/compiled/@edge-runtime/primitives/url.d.ts`)
- _(+10 more declarations in `next/server`)_

### `next/types` (43 symbols)
- `export type ServerRuntime = 'nodejs' | 'experimental-edge' | 'edge' | undefined;` (`dist/types.d.ts`)
- `export { NextConfig } (next/types)` (`dist/types.d.ts`)
- `export { NextAdapter } (next/types)` (`dist/types.d.ts`)
- `export { AdapterOutput } (next/types)` (`dist/types.d.ts`)
- `export { Metadata } (next/types)` (`dist/types.d.ts`)
- `export { MetadataRoute } (next/types)` (`dist/types.d.ts`)
- `export { ResolvedMetadata } (next/types)` (`dist/types.d.ts`)
- `export { ResolvingMetadata } (next/types)` (`dist/types.d.ts`)
- `export { Viewport } (next/types)` (`dist/types.d.ts`)
- `export { ResolvingViewport } (next/types)` (`dist/types.d.ts`)
- `export { ResolvedViewport } (next/types)` (`dist/types.d.ts`)
- `export { Instant } (next/types)` (`dist/types.d.ts`)
- `export type ParamMatching<ParamName extends string = string> = Partial<Record<ParamName, ParamMatchingMode>>;` (`dist/types.d.ts`) — Optional contextual typing for parameter matching exports. Use `satisfies ParamMatching` to check modes without widening the object's keys, or provide
- `export { Instrumentation } (next/types)` (`dist/types.d.ts`)
- `export { RouterTransitionType } (next/types)` (`dist/types.d.ts`)
- `export { RouterTransitionPrefetchIntent } (next/types)` (`dist/types.d.ts`)
- `export { RouterTransitionEvent } (next/types)` (`dist/types.d.ts`)
- `export { RouterTransitionStartEvent } (next/types)` (`dist/types.d.ts`)
- `export type Route<RouteInferType = any> = string & {};` (`dist/types.d.ts`) — Stub route type for typedRoutes before `next dev` or `next build` is run
- `declare module 'react'` (`dist/types.d.ts`)
- `export type Redirect = { statusCode: 301 | 302 | 303 | 307 | 308; destination: string; basePath?: false; } | { permanent: boolean; destination: string; basePath?: false; };` (`dist/types.d.ts`)
- `export type NextPage<Props = {}, InitialProps = Props> = NextComponentType<NextPageContext, InitialProps, Props>;` (`dist/types.d.ts`) — `NextPage` type, use it as a guide to create `pages`.
- `export type FileSizeSuffix = `${'k' | 'K' | 'm' | 'M' | 'g' | 'G' | 't' | 'T' | 'p' | 'P'}${'b' | 'B'}`;` (`dist/types.d.ts`)
- `export type SizeLimit = number | `${number}${FileSizeSuffix}`;` (`dist/types.d.ts`)
- `export type ResponseLimit = SizeLimit | boolean;` (`dist/types.d.ts`)
- `export type PageConfig = { api?: { responseLimit?: ResponseLimit; bodyParser?: { sizeLimit?: SizeLimit; } | false;` (`dist/types.d.ts`) — `Config` type, use it for export const config
- `export { NextPageContext } (next/types)` (`dist/types.d.ts`)
- `export { NextComponentType } (next/types)` (`dist/types.d.ts`)
- `export { NextApiResponse } (next/types)` (`dist/types.d.ts`)
- `export { NextApiRequest } (next/types)` (`dist/types.d.ts`)
- `export { NextApiHandler } (next/types)` (`dist/types.d.ts`)
- `export type PreviewData = string | false | object | undefined;` (`dist/types.d.ts`)
- `export type GetStaticPropsContext<Params extends ParsedUrlQuery = ParsedUrlQuery, Preview extends PreviewData = PreviewData> = { params?: Params; preview?: boolean; previewData?: Preview; draftMode?: boolean; locale?: st` (`dist/types.d.ts`) — Context object passed into `getStaticProps`.
- `export type GetStaticPropsResult<Props> = { props: Props; revalidate?: number | boolean; } | { redirect: Redirect; revalidate?: number | boolean; } | { notFound: true; revalidate?: number | boolean; };` (`dist/types.d.ts`) — The return type of `getStaticProps`.
- `export type GetStaticProps<Props extends { [key: string]: any; } = { [key: string]: any; }, Params extends ParsedUrlQuery = ParsedUrlQuery, Preview extends PreviewData = PreviewData> = (context: GetStaticPropsContext<Par` (`dist/types.d.ts`) — Static Site Generation feature for Next.js.
- `export type InferGetStaticPropsType<T extends (args: any) => any> = Extract<Awaited<ReturnType<T>>, { props: any; }>['props'];` (`dist/types.d.ts`)
- `export type GetStaticPathsContext = { locales?: string[]; defaultLocale?: string; };` (`dist/types.d.ts`)
- `export type GetStaticPathsResult<Params extends ParsedUrlQuery = ParsedUrlQuery> = { paths: Array<string | { params: Params; locale?: string; }>; fallback: GetStaticPathsFallback; };` (`dist/types.d.ts`) — The return type of `getStaticPaths`.
- `export type GetStaticPaths<Params extends ParsedUrlQuery = ParsedUrlQuery> = (context: GetStaticPathsContext) => Promise<GetStaticPathsResult<Params>> | GetStaticPathsResult<Params>;` (`dist/types.d.ts`) — Define a list of paths to be statically generated if dynamic routes exist.
- `export type GetServerSidePropsContext<Params extends ParsedUrlQuery = ParsedUrlQuery, Preview extends PreviewData = PreviewData> = { req: IncomingMessage & { cookies: NextApiRequestCookies; }; res: ServerResponse;` (`dist/types.d.ts`) — Context object passed into `getServerSideProps`.
- `export type GetServerSidePropsResult<Props> = { props: Props | Promise<Props>; } | { redirect: Redirect; } | { notFound: true; };` (`dist/types.d.ts`) — The return type of `getServerSideProps`.
- `export type GetServerSideProps<Props extends { [key: string]: any; } = { [key: string]: any; }, Params extends ParsedUrlQuery = ParsedUrlQuery, Preview extends PreviewData = PreviewData> = (context: GetServerSidePropsCon` (`dist/types.d.ts`) — Server-side Rendering feature for Next.js.
- `export type InferGetServerSidePropsType<T extends (args: any) => any> = Awaited<Extract<Awaited<ReturnType<T>>, { props: any; }>['props']>;` (`dist/types.d.ts`)

### `next/types/compiled` (11 symbols)
- `declare module 'next/dist/compiled/next-devtools'` (`types/compiled.d.ts`)
- `declare module 'next/dist/compiled/webpack/webpack'` (`types/compiled.d.ts`)
- `declare module 'next/dist/compiled/superstruct'` (`types/compiled.d.ts`)
- `declare module 'next/dist/compiled/jest-worker'` (`types/compiled.d.ts`)
- `declare module 'next/dist/compiled/amphtml-validator'` (`types/compiled.d.ts`)
- `declare module 'react-server-dom-webpack/server'` (`types/compiled.d.ts`)
- `declare module 'react-server-dom-webpack/static'` (`types/compiled.d.ts`)
- `declare module 'VAR_MODULE_GLOBAL_ERROR'` (`types/compiled.d.ts`)
- `declare module 'VAR_USERLAND'` (`types/compiled.d.ts`)
- `declare module 'VAR_MODULE_DOCUMENT'` (`types/compiled.d.ts`)
- `declare module 'VAR_MODULE_APP'` (`types/compiled.d.ts`)

### `next/types/global` (16 symbols)
- `declare namespace NodeJS` (`types/global.d.ts`)
- `declare module '*.module.css'` (`types/global.d.ts`)
- `declare module '*.module.sass'` (`types/global.d.ts`)
- `declare module '*.module.scss'` (`types/global.d.ts`)
- `declare module '*.css'` (`types/global.d.ts`)
- `declare module '*.sass'` (`types/global.d.ts`)
- `declare module '*.scss'` (`types/global.d.ts`)
- `declare module 'server-only'` (`types/global.d.ts`)
- `declare module 'client-only'` (`types/global.d.ts`)
- `interface TurbopackHotApi` (`types/global.d.ts`)
- `interface ImportMetaGlobOptions` (`types/global.d.ts`)
- `interface ImportMetaEnv` (`types/global.d.ts`)
- `interface ImportMeta` (`types/global.d.ts`)
- `interface Window` (`types/global.d.ts`)
- `interface NextFetchRequestConfig` (`types/global.d.ts`)
- `interface RequestInit` (`types/global.d.ts`)

### `next/web-vitals` (1 symbols)
- `export declare function useReportWebVitals(reportWebVitalsFn: (metric: Metric) => void): void;` (`dist/client/web-vitals.d.ts`)

## Compressed Core Declaration Files

### `index.d.ts` (20 -> 18 lines)
```ts
/// <reference types="./types/global" />
/// <reference types="./types/compiled" />
/// <reference path="./dist/styled-jsx/types/index.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./cache.d.ts" />
/// <reference path="./document.d.ts" />
/// <reference path="./dynamic.d.ts" />
/// <reference path="./error.d.ts" />
/// <reference path="./head.d.ts" />
/// <reference path="./headers.d.ts" />
/// <reference path="./image.d.ts" />
/// <reference path="./link.d.ts" />
/// <reference path="./navigation.d.ts" />
/// <reference path="./router.d.ts" />
/// <reference path="./script.d.ts" />
/// <reference path="./server.d.ts" />
export { default } from './types'
export * from './types'
```

### `cache.d.ts` (169 -> 35 lines)
```ts
export { unstable_cache } from 'next/dist/server/web/spec-extension/unstable-cache'
export type {
  CacheHandler,
  CacheEntry,
} from './dist/server/lib/cache-handlers/types'
export {
  revalidatePath,
  revalidateTag,
  updateTag,
  refresh,
} from 'next/dist/server/web/spec-extension/revalidate'
export { unstable_noStore } from 'next/dist/server/web/spec-extension/unstable-no-store'
export { io } from 'next/dist/server/request/io'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
export { cacheTag }
export interface CacheLifeProfiles {}
export function cacheLife(profile: 'default'): void
export function cacheLife(profile: 'seconds'): void
export function cacheLife(profile: 'minutes'): void
export function cacheLife(profile: 'hours'): void
export function cacheLife(profile: 'days'): void
export function cacheLife(profile: 'weeks'): void
export function cacheLife(profile: 'max'): void
export function cacheLife(
  profile: keyof CacheLifeProfiles extends never ? string : never
): void
export function cacheLife(profile: {
  stale?: number
  revalidate?: number
  expire?: number
}): void
export const unstable_cacheLife: typeof cacheLife
export const unstable_cacheTag: typeof cacheTag
export { navigation } from 'next/dist/server/request/cache-stages'
export { prefetch } from 'next/dist/server/request/cache-stages'
```

### `server.d.ts` (23 -> 20 lines)
```ts
import type { AsyncLocalStorage as NodeAsyncLocalStorage } from 'async_hooks'
declare global {
  var AsyncLocalStorage: typeof NodeAsyncLocalStorage
}
export { NextFetchEvent } from 'next/dist/server/web/spec-extension/fetch-event'
export { NextRequest } from 'next/dist/server/web/spec-extension/request'
export { NextResponse } from 'next/dist/server/web/spec-extension/response'
export {
  NextMiddleware,
  MiddlewareConfig,
  NextProxy,
  ProxyConfig,
} from 'next/dist/server/web/types'
export { userAgentFromString } from 'next/dist/server/web/spec-extension/user-agent'
export { userAgent } from 'next/dist/server/web/spec-extension/user-agent'
export { URLPattern } from 'next/dist/compiled/@edge-runtime/primitives/url'
export { ImageResponse } from 'next/dist/server/web/spec-extension/image-response'
export type { ImageResponseOptions } from 'next/dist/compiled/@vercel/og/types'
export { after } from 'next/dist/server/after'
export { connection } from 'next/dist/server/request/connection'
```

### `navigation.d.ts` (2 -> 1 lines)
```ts
export * from './dist/client/components/navigation'
```

### `headers.d.ts` (4 -> 3 lines)
```ts
export * from './dist/server/request/cookies'
export * from './dist/server/request/headers'
export * from './dist/server/request/draft-mode'
```

### `error.d.ts` (8 -> 5 lines)
```ts
import Error from './dist/api/error'
export * from './dist/api/error'
export default Error
export { catchError } from './dist/api/error'
export type { ErrorInfo } from './dist/api/error'
```

### `offline.d.ts` (2 -> 1 lines)
```ts
export { useOffline } from './dist/client/components/use-offline'
```

### `root-params.d.ts` (4 -> 1 lines)
```ts
declare module 'next/root-params'
```

### `types/global.d.ts` (179 -> 94 lines)
```ts
/// <reference types="node" />
declare namespace NodeJS {
  interface TTY {
    setBlocking(blocking: boolean): void
  }
  interface WriteStream {
    _handle?: TTY
  }
  interface Process {
    readonly browser: boolean
  }
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
  }
}
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}
declare module '*.module.sass' {
  const classes: { readonly [key: string]: string }
  export default classes
}
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}
declare module '*.css' {}
declare module '*.sass' {}
declare module '*.scss' {}
declare module 'server-only' {
}
declare module 'client-only' {
}
interface TurbopackHotApi {
  accept(): void
  accept(cb: () => void): void
  accept(dep: string | string[], cb?: () => void): void
  decline(): void
  decline(dep: string | string[]): void
  dispose(cb: (data: Record<string, unknown>) => void): void
  invalidate(): void
  readonly data: Record<string, unknown>
}
interface ImportMetaGlobOptions {
  eager?: boolean
  import?: string
  query?: string | Record<string, string | boolean>
  base?: string
  caseSensitive?: boolean
}
interface ImportMetaEnv {
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
  readonly BASE_URL: string
  readonly SSR: boolean
}
interface ImportMeta {
  readonly env: ImportMetaEnv
  turbopackHot?: TurbopackHotApi
  glob<M = unknown>(
    pattern: string | string[],
    options: ImportMetaGlobOptions & { eager: true }
  ): Record<string, M>
  glob<M = unknown>(
    pattern: string | string[],
    options?: ImportMetaGlobOptions & { eager?: false | undefined }
  ): Record<string, () => Promise<M>>
  glob<M = unknown>(
    pattern: string | string[],
    options?: ImportMetaGlobOptions
  ): Record<string, M> | Record<string, () => Promise<M>>
}
interface Window {
  __nextHmrInitialVersion?: string
  MSInputMethodContext?: unknown
  __NEXT_HMR_CB?: null | ((message?: string) => void)
  __next_root_layout_missing_tags?: ('html' | 'body')[]
  __NEXT_DEV_INDICATOR_POSITION?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
  __next_instant_test?: 1
}
interface NextFetchRequestConfig {
  revalidate?: number | false
  tags?: string[]
}
interface RequestInit {
  next?: NextFetchRequestConfig | undefined
}
declare var _N_E_STYLE_LOAD: (href: string) => Promise<void>
```

### `types/compiled.d.ts` (75 -> 57 lines)
```ts
declare module 'next/dist/compiled/next-devtools'
declare module 'next/dist/compiled/webpack/webpack' {
  export function init(): void
  export let BasicEvaluatedExpression: any
  export let GraphHelpers: any
  export let sources: any
  export let StringXor: any
  export type LoaderDefinitionFunction<T> = any
  namespace webpack {
    export type Compiler = any
    export type WebpackPluginInstance = any
    export type Compilation = any
    export type Module = any
    export type Stats = any
    export type Template = any
    export type RuntimeModule = any
    export type RuntimeGlobals = any
    export type NormalModule = any
    export type ResolvePluginInstance = any
    export type Configuration = any
    export type ResolveOptions = any
    export type LoaderContext<T> = any
    export type RuleSetUseItem = any
    export type EntryObject = any
    export type Chunk = any
    export type ChunkGroup = any
    export type DefinePlugin = any
    namespace sources {
      export type RawSource = any
    }
  }
  export var webpack: any
}
declare module 'next/dist/compiled/superstruct' {
  export type Struct<T, S> = any
  export type Infer<T = any> = any
  export type Describe<T> = any
}
declare module 'next/dist/compiled/jest-worker' {
  export class Worker {
    constructor(...args: any[])
    end(): any
  }
}
declare module 'next/dist/compiled/amphtml-validator' {
  export type Validator = {
    validateString(html: string): Promise<any>
  }
  export function getInstance(validatorPath: string): Promise<Validator>
  export type ValidationError = any
}
declare module 'react-server-dom-webpack/server'
declare module 'react-server-dom-webpack/static'
declare module 'VAR_MODULE_GLOBAL_ERROR'
declare module 'VAR_USERLAND'
declare module 'VAR_MODULE_DOCUMENT'
declare module 'VAR_MODULE_APP'
```

### `dist/server/request/cookies.d.ts` (3 -> 2 lines)
```ts
import { type ReadonlyRequestCookies } from '../web/spec-extension/adapters/request-cookies';
export declare function cookies(): Promise<ReadonlyRequestCookies>;
```

### `dist/server/request/headers.d.ts` (12 -> 2 lines)
```ts
import { type ReadonlyHeaders } from '../web/spec-extension/adapters/headers';
export declare function headers(): Promise<ReadonlyHeaders>;
```

### `dist/server/request/draft-mode.d.ts` (10 -> 9 lines)
```ts
import type { DraftModeProvider } from '../async-storage/draft-mode-provider';
export declare function draftMode(): Promise<DraftMode>;
declare class DraftMode {
    constructor(provider: null | DraftModeProvider);
    get isEnabled(): boolean;
    enable(): void;
    disable(): void;
}
export {};
```

### `dist/server/request/io.d.ts` (13 -> 1 lines)
```ts
export declare function io(): Promise<void>;
```

### `dist/server/request/connection.d.ts` (7 -> 1 lines)
```ts
export declare function connection(): Promise<void>;
```

### `dist/server/request/cache-stages.d.ts` (33 -> 2 lines)
```ts
export declare function prefetch(): Promise<void>;
export declare function navigation(): Promise<void>;
```

### `dist/server/web/spec-extension/revalidate.d.ts` (45 -> 8 lines)
```ts
type CacheLifeConfig = {
    expire?: number;
};
export declare function revalidateTag(tag: string, profile: string | CacheLifeConfig): undefined;
export declare function updateTag(tag: string): undefined;
export declare function refresh(): void;
export declare function revalidatePath(originalPath: string, type?: 'layout' | 'page'): undefined;
export {};
```

### `dist/server/web/types.d.ts` (66 -> 43 lines)
```ts
import type { ExperimentalConfig, I18NConfig } from '../config-shared';
import type { NextRequest } from './spec-extension/request';
import type { NextFetchEvent } from './spec-extension/fetch-event';
import type { NextResponse } from './spec-extension/response';
import type { CloneableBody } from '../body-streams';
import type { OutgoingHttpHeaders } from 'http';
import type { FetchMetrics } from '../base-http';
import type { RequestMeta } from '../request-meta';
export type { MiddlewareConfigInput as MiddlewareConfig } from '../../build/segment-config/middleware/middleware-config';
export type { MiddlewareConfigInput as ProxyConfig } from '../../build/segment-config/middleware/middleware-config';
export interface RequestData {
    headers: OutgoingHttpHeaders;
    method: string;
    nextConfig?: {
        basePath?: string;
        i18n?: I18NConfig | null;
        trailingSlash?: boolean;
        experimental?: Pick<ExperimentalConfig, 'cacheLife' | 'authInterrupts' | 'clientParamParsingOrigins'>;
    };
    page?: {
        name?: string;
        params?: {
            [key: string]: string | string[] | undefined;
        };
    };
    url: string;
    body?: ReadableStream<Uint8Array>;
    signal: AbortSignal;
    requestMeta?: RequestMeta;
    waitUntil?: (promise: Promise<any>) => void;
}
export type NodejsRequestData = Omit<RequestData, 'body'> & {
    body?: CloneableBody;
};
export interface FetchEventResult {
    response: Response;
    waitUntil: Promise<any>;
    fetchMetrics?: FetchMetrics;
    rewriteLocaleWasInferred?: boolean;
}
export type NextMiddlewareResult = NextResponse | Response | null | undefined | void;
export type NextMiddleware = (request: NextRequest, event: NextFetchEvent) => NextMiddlewareResult | Promise<NextMiddlewareResult>;
export type NextProxy = NextMiddleware;
```

### `dist/build/segment-config/app/app-segment-config.d.ts` (105 -> 54 lines)
```ts
export type Instant = InstantConfig | true | false;
export type Prefetch = 'auto' | 'partial' | 'force-disabled';
export type EnsureStatic = 'auto' | 'shell' | 'prefetch' | 'navigation' | false;
export type InstantConfigForTypeCheckInternal = __GenericInstantConfig | Instant;
interface __GenericInstantConfig {
    level?: string;
    unstable_samples?: Array<WideInstantSample>;
    unstable_from?: string[];
    unstable_disableValidation?: boolean;
    unstable_disableDevValidation?: boolean;
    unstable_disableBuildValidation?: boolean;
}
type WideInstantSample = {
    cookies?: InstantSample['cookies'];
    headers?: Array<string[]>;
    params?: InstantSample['params'];
    searchParams?: InstantSample['searchParams'];
};
export interface InstantConfig {
    level?: 'warning' | 'experimental-error';
    unstable_samples?: Array<InstantSample>;
    unstable_from?: string[];
    unstable_disableValidation?: true;
    unstable_disableDevValidation?: true;
    unstable_disableBuildValidation?: true;
}
export type InstantSample = {
    cookies?: Array<{
        name: string;
        value: string | null;
    }>;
    headers?: Array<[string, string | null]>;
    params?: {
        [key: string]: string | string[];
    };
    searchParams?: {
        [key: string]: string | string[] | null;
    };
};
export declare function parseAppSegmentConfig(data: unknown, route: string): AppSegmentConfig;
export type AppSegmentConfig = {
    revalidate?: number | false;
    dynamicParams?: boolean;
    dynamic?: 'auto' | 'error' | 'force-static' | 'force-dynamic';
    fetchCache?: 'auto' | 'default-cache' | 'default-no-store' | 'force-cache' | 'force-no-store' | 'only-cache' | 'only-no-store';
    instant?: Instant;
    prefetch?: Prefetch;
    ensureStatic?: EnsureStatic;
    unstable_dynamicStaleTime?: number;
    preferredRegion?: string | string[];
    runtime?: 'edge' | 'nodejs';
    maxDuration?: number;
};
export {};
```

### `dist/build/segment-config/middleware/middleware-config.d.ts` (22 -> 11 lines)
```ts
import type { RouteHas } from '../../../lib/load-custom-routes';
export type MiddlewareConfigInput = {
    matcher?: string | Array<{
        locale?: false;
        has?: RouteHas[];
        missing?: RouteHas[];
        source: string;
    } | string>;
    regions?: string | string[];
    unstable_allowDynamic?: string | string[];
};
```

### `dist/lib/metadata/types/metadata-interface.d.ts` (652 -> 134 lines)
```ts
import type { AlternateURLs, Languages, ResolvedAlternateURLs } from './alternative-urls-types';
import type { AppleWebApp, AppLinks, Facebook, FormatDetection, ItunesApp, Pinterest, ResolvedAppleWebApp, ResolvedAppLinks, ResolvedFacebook, ResolvedPinterest, ViewportLayout } from './extra-types';
import type { DeprecatedMetadataFields, AbsoluteTemplateString, Author, ColorSchemeEnum, Icon, Icons, IconURL, ReferrerEnum, ResolvedIcons, ResolvedVerification, Robots, ResolvedRobots, TemplateString, Verification, ThemeColorDescriptor, Videos } from './metadata-types';
import type { Manifest as ManifestFile } from './manifest-types';
import type { OpenGraph, ResolvedOpenGraph } from './opengraph-types';
import type { ResolvedTwitterMetadata, Twitter } from './twitter-types';
interface Metadata extends DeprecatedMetadataFields {
    metadataBase?: null | string | URL | undefined;
    title?: null | string | TemplateString | undefined;
    description?: null | string | undefined;
    applicationName?: null | string | undefined;
    authors?: null | Author | Array<Author> | undefined;
    generator?: null | string | undefined;
    keywords?: null | string | Array<string> | undefined;
    referrer?: null | ReferrerEnum | undefined;
    themeColor?: null | string | ThemeColorDescriptor | ThemeColorDescriptor[] | undefined;
    colorScheme?: null | ColorSchemeEnum | undefined;
    viewport?: null | string | ViewportLayout | undefined;
    creator?: null | string | undefined;
    publisher?: null | string | undefined;
    robots?: null | string | Robots | undefined;
    alternates?: null | AlternateURLs | undefined;
    icons?: null | IconURL | Array<Icon> | Icons | undefined;
    manifest?: null | string | URL | undefined;
    openGraph?: null | OpenGraph | undefined;
    twitter?: null | Twitter | undefined;
    facebook?: null | Facebook | undefined;
    pinterest?: null | Pinterest;
    verification?: Verification | undefined;
    appleWebApp?: null | boolean | AppleWebApp | undefined;
    formatDetection?: null | FormatDetection | undefined;
    itunes?: null | ItunesApp | undefined;
    abstract?: null | string | undefined;
    appLinks?: null | AppLinks | undefined;
    archives?: null | string | Array<string> | undefined;
    assets?: null | string | Array<string> | undefined;
    bookmarks?: null | string | Array<string> | undefined;
    pagination?: {
        previous?: null | string | URL | undefined;
        next?: null | string | URL | undefined;
    };
    category?: null | string | undefined;
    classification?: null | string | undefined;
    other?: {
        [name: string]: string | number | Array<string | number>;
    } | undefined;
}
interface ResolvedMetadataWithURLs {
    metadataBase: string | null | URL;
    title: null | AbsoluteTemplateString;
    description: null | string;
    applicationName: null | string;
    authors: null | Array<Author>;
    generator: null | string;
    keywords: null | Array<string>;
    referrer: null | ReferrerEnum;
    themeColor: null | ThemeColorDescriptor[];
    colorScheme: null | ColorSchemeEnum;
    viewport: null | string;
    creator: null | string;
    publisher: null | string;
    robots: null | ResolvedRobots;
    alternates: null | ResolvedAlternateURLs;
    icons: null | ResolvedIcons;
    openGraph: null | ResolvedOpenGraph;
    manifest: null | string | URL;
    twitter: null | ResolvedTwitterMetadata;
    facebook: null | ResolvedFacebook;
    pinterest: null | ResolvedPinterest;
    verification: null | ResolvedVerification;
    appleWebApp: null | ResolvedAppleWebApp;
    formatDetection: null | FormatDetection;
    itunes: null | ItunesApp;
    abstract: null | string;
    appLinks: null | ResolvedAppLinks;
    archives: null | Array<string>;
    assets: null | Array<string>;
    bookmarks: null | Array<string>;
    pagination: {
        previous: null | string;
        next: null | string;
    };
    category: null | string;
    classification: null | string;
    other: null | {
        [name: string]: string | number | Array<string | number>;
    };
}
export type WithStringifiedURLs<T> = T extends URL ? string : T extends object ? {
    [K in keyof T]: WithStringifiedURLs<T[K]>;
} : T;
type ResolvedMetadata = WithStringifiedURLs<ResolvedMetadataWithURLs>;
type RobotsRuleBase = {
    allow?: string | string[] | undefined;
    disallow?: string | string[] | undefined;
    crawlDelay?: number | undefined;
    other?: Record<string, string | number | Array<string | number>> | undefined;
};
type RobotsFile = {
    rules: (RobotsRuleBase & {
        userAgent?: string | string[] | undefined;
    }) | Array<RobotsRuleBase & {
        userAgent: string | string[];
    }>;
    sitemap?: string | string[] | undefined;
    host?: string | undefined;
};
type SitemapFile = Array<{
    url: string;
    lastModified?: string | Date | undefined;
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' | undefined;
    priority?: number | undefined;
    alternates?: {
        languages?: Languages<string> | undefined;
    } | undefined;
    images?: string[] | undefined;
    videos?: Videos[] | undefined;
}>;
type ResolvingMetadata = Promise<ResolvedMetadata>;
declare namespace MetadataRoute {
    type Robots = RobotsFile;
    type Sitemap = SitemapFile;
    type Manifest = ManifestFile;
}
interface Viewport extends ViewportLayout {
    themeColor?: null | string | ThemeColorDescriptor | ThemeColorDescriptor[] | undefined;
    colorScheme?: null | ColorSchemeEnum | undefined;
}
interface ResolvedViewport extends ViewportLayout {
    themeColor: null | ThemeColorDescriptor[];
    colorScheme: null | ColorSchemeEnum;
}
type ResolvingViewport = Promise<ResolvedViewport>;
export type { Metadata, ResolvedMetadata, ResolvedMetadataWithURLs, ResolvingMetadata, MetadataRoute, Viewport, ResolvingViewport, ResolvedViewport, };
```
