# Next.js 16.5.0-canary.52 Bundled Documentation Digest

Compacted from 479 markdown files in `node_modules/next/dist/docs/` (302 App Router, 168 Pages Router, 8 Architecture/Community).

## `01-app/01-getting-started` (19 docs)

### `01-app/01-getting-started/01-installation.md` — Installation
- Learn how to create a new Next.js application with the `create-next-app` CLI, and set up TypeScript, ESLint, and Module Path Aliases.
- Sections: Quick start · System requirements · Supported browsers · Create with the CLI · Manual installation · Create the app directory · Create the pages directory · Create the public folder (optional)
- Create a new Next.js app and run it locally.
- 1. Create a new Next.js app named `my-app`
- Example: `pnpm create next-app@latest my-app --yes cd my-app pnpm dev`

### `01-app/01-getting-started/02-project-structure.md` — Project structure and organization
- Learn the folder and file conventions in Next.js, and how to organize your project.
- Sections: Folder and file conventions · Top-level folders · Top-level files · Routing Files · Nested routes · Dynamic routes · Route groups and private folders · Parallel and Intercepted Routes
- This page provides an overview of **all** the folder and file conventions in Next.js, and recommendations for organizing your project.
- Top-level folders are used to organize your application's code and static assets.

### `01-app/01-getting-started/03-layouts-and-pages.md` — Layouts and Pages
- Learn how to create your first pages and layouts, and link between them with the Link component.
- Sections: Creating a page · Creating a layout · Creating a nested route · Nesting layouts · Creating a dynamic segment · Rendering with search params · What to use and when · Linking between pages
- Next.js uses **file-system based routing**, meaning you can use folders and files to define routes. This page will guide you through how to create layouts and pages, and link betwe
- A **page** is UI that is rendered on a specific route. To create a page, add a `page` file inside the `app` directory and default export a React component. For example, to create a
- Example: `export default function Page() { return <h1>Hello Next.js!</h1> }`

### `01-app/01-getting-started/04-linking-and-navigating.md` — Linking and Navigating
- Learn how the built-in navigation optimizations work, including prefetching, prerendering, and client-side navigation, and how to optimize navigation for dynamic routes and slow networks.
- Sections: How navigation works · Server Rendering · Prefetching · Streaming · Client-side transitions · What can make transitions slow? · Dynamic routes without loading.tsx · Dynamic segments without generateStaticParams
- In Next.js, routes are rendered on the server by default. This often means the client has to wait for a server response before a new route can be shown. Next.js comes with built-in
- This guide explains how navigation works in Next.js and how you can optimize it for dynamic routes and slow networks.
- Example: `export default function Loading() { // Add fallback UI that will be shown while the route is loading. return <LoadingSkeleton /> }`

### `01-app/01-getting-started/05-server-and-client-components.md` — Server and Client Components
- Learn how you can use React Server and Client Components to render parts of your application on the server or the client.
- Sections: When to use Server and Client Components? · How do Server and Client Components work in Next.js? · On the server · On the client (first load) · Subsequent Navigations · Using Client Components · Reducing JS bundle size · Passing data from Server to Client Components
- By default, layouts and pages are [Server Components](https://react.dev/reference/rsc/server-components), which lets you fetch data and render parts of your UI on the server, optio
- This page explains how Server and Client Components work in Next.js and when to use them, with examples of how to compose them together in your application.
- Example: `'use client' import { useState } from 'react' export default function LikeButton({ likes }: { likes: number }) { // ... }`

### `01-app/01-getting-started/06-fetching-data.md` — Fetching Data
- Learn how to fetch data and stream content that depends on data.
- Sections: Fetching data · Server Components · Streaming · Client Components · Sequential data fetching · Parallel data fetching · Reusing data with React.cache · Preloading data
- This page will walk you through how you can fetch data in Server and Client Components, and how to stream components that depend on uncached data.
- You can fetch data in Server Components using any asynchronous I/O, such as:
- Example: `export default function Loading() { // Define the Loading UI here return <div>Loading...</div> }`

### `01-app/01-getting-started/07-mutating-data.md` — Mutating Data
- Learn how to mutate data using Server Functions and Server Actions in Next.js.
- Sections: What are Server Functions? · Creating Server Functions · Server Components · Client Components · Passing actions as props · Invoking Server Functions · Forms · Event Handlers
- You can mutate data in Next.js using [React Server Functions](https://react.dev/reference/rsc/server-functions). This page will go through how you can create and invoke Server Func
- A **Server Function** is an asynchronous function that runs on the server. You can call them from the client through a network request, which is why they must be asynchronous.
- Example: `export default function Page() { // Server Action async function createPost(formData: FormData) { 'use server' // ... } return <></> }`

### `01-app/01-getting-started/08-caching.md` — Caching
- Learn how to cache data and UI in Next.js
- Sections: Enabling Cache Components · Usage · Data-level caching · UI-level caching · Streaming uncached data · Working with runtime APIs · Passing runtime values to cached functions · Static, cached, and streaming
- This page covers caching with Cache Components, enabled by setting `cacheComponents: true` in your `next.config.ts` file. If you're not using Cache Components, see the Caching and 
- Caching is a technique for storing the result of data fetching and other computations so that future requests for the same data can be served faster, without doing the work again.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { cacheComponents: true, partialPrefetching: true, } export default nextConfig`

### `01-app/01-getting-started/09-revalidating.md` — Revalidating
- Learn how to revalidate cached data using time-based and on-demand strategies.
- Sections: cacheLife · cacheTag · revalidateTag · updateTag · revalidatePath · What should I cache?
- This page covers revalidation with Cache Components, enabled by setting `cacheComponents: true` in your `next.config.ts` file. If you're not using Cache Components, see the Caching
- Revalidation is the process of updating cached data. It lets you keep serving fast, cached responses while ensuring content stays fresh. There are two strategies:
- Example: `import { cacheLife } from 'next/cache' export async function getProducts() { 'use cache' cacheLife('hours') return db.query('SELECT * FROM products') }`

### `01-app/01-getting-started/10-error-handling.md` — Error Handling
- Learn how to display expected errors and handle uncaught exceptions.
- Sections: Handling expected errors · Server Functions · Server Components · Not found · Handling uncaught exceptions · Nested error boundaries · Global errors
- Errors can be divided into two categories: expected errors and uncaught exceptions. This page will walk you through how you can handle these errors in your Next.js application.
- Expected errors are those that can occur during the normal operation of the application, such as those from server-side form validation or failed requests. These errors should be h
- Example: `export default async function Page() { const res = await fetch(`https://...`) const data = await res.json() if (!res.ok) { return 'There was an error.' } return`

### `01-app/01-getting-started/11-css.md` — CSS
- Learn about the different ways to add CSS to your application, including Tailwind CSS, CSS Modules, Global CSS, and more.
- Sections: Tailwind CSS · CSS Modules · Global CSS · External stylesheets · Import styles from node_modules · Ordering and Merging · Recommendations · Development vs Production
- Next.js provides several ways to style your application using CSS, including:
- - External Stylesheets
- Example: `pnpm add -D tailwindcss @tailwindcss/postcss`

### `01-app/01-getting-started/12-images.md` — Image Optimization
- Learn how to optimize images in Next.js
- Sections: Local images · Images without static imports · Remote images
- The Next.js `<Image>` component extends the HTML `<img>` element to provide:
- - **Size optimization:** Automatically serving correctly sized images for each device, using modern image formats like WebP.
- Example: `import Image from 'next/image' export default function Page() { return ( ) }`

### `01-app/01-getting-started/13-fonts.md` — Font Optimization
- Learn how to optimize fonts in Next.js
- Sections: Google fonts · Local fonts
- The `next/font` module automatically optimizes your fonts and removes external network requests for improved privacy and performance.
- It includes **built-in self-hosting** for any font file. This means you can optimally load web fonts with no layout shift.

### `01-app/01-getting-started/14-metadata-and-og-images.md` — Metadata and OG images
- Learn how to add metadata to your pages and create dynamic OG images.
- Sections: Default fields · Static metadata · Generated metadata · Streaming metadata · Memoizing data requests · File-based metadata · Favicons · Static Open Graph images
- The Metadata APIs can be used to define your application metadata for improved SEO and web shareability and include:
- 1. The static `metadata` object
- Example: `import type { Metadata } from 'next' export const metadata: Metadata = { title: 'My Blog', description: '...', } export default function Layout() {}`

### `01-app/01-getting-started/15-route-handlers.md` — Route Handlers
- Create custom request handlers with Next.js Route Handlers using the Web Request and Response APIs.
- Sections: Route Handlers · Convention · Supported HTTP Methods · Extended NextRequest and NextResponse APIs · Caching · Special Route Handlers · Route Resolution · Route Context Helper
- Route Handlers allow you to create custom request handlers for a given route using the Web [Request](https://developer.mozilla.org/docs/Web/API/Request) and [Response](https://deve
- **Good to know**: Route Handlers are only available inside the `app` directory. They are the equivalent of API Routes inside the `pages` directory meaning you **do not** need to us
- Example: `export async function GET(request: Request) {}`

### `01-app/01-getting-started/16-proxy.md` — Proxy
- Use Next.js Proxy to rewrite, redirect, modify headers, or respond directly before a request completes.
- Sections: Proxy · Use cases · Limitations · Convention
- **Good to know**: Starting with Next.js 16, Middleware is now called Proxy to better reflect its purpose. The functionality remains the same.
- Proxy allows you to run code before a request is completed. Then, based on the incoming request, you can modify the response by rewriting, redirecting, modifying the request or res

### `01-app/01-getting-started/17-deploying.md` — Deploying
- Learn how to deploy your Next.js application.
- Sections: Node.js server · Templates · Docker · Templates · Static export · Templates · Adapters · Verified Adapters
- Next.js can be deployed as a Node.js server, Docker container, static export, or adapted to run on different platforms.
- Next.js can be deployed to any provider that supports Node.js. Ensure your `package.json` has the `"build"` and `"start"` scripts:
- Example: `{ "scripts": { "dev": "next dev", "build": "next build", "start": "next start" } }`

### `01-app/01-getting-started/18-upgrading.md` — Upgrading
- Learn how to upgrade your Next.js application to the latest version or canary.
- Sections: Latest version · Canary version · Features available in canary
- To update to the latest version of Next.js, you can use the `upgrade` command:
- Versions before Next.js 16.1.0 do not support the `upgrade` command and need to use a separate package instead:
- Example: `pnpm next upgrade`

### `01-app/01-getting-started/index.md` — Getting Started
- Learn how to create full-stack web applications with the Next.js App Router.
- Sections: Pre-requisite knowledge · Next Steps
- Welcome to the Next.js documentation!
- This **Getting Started** section will help you create your first Next.js app and learn the core features you'll use in every project.

## `01-app/02-guides` (82 docs)

### `01-app/02-guides/adopting-partial-prefetching.md` — Adopting Partial Prefetching
- Learn how to enable Partial Prefetching and what changes for `<Link>`.
- Sections: Use the adoption skill (recommended) · Or adopt by hand · Enable Partial Prefetching · What changes for <Link> · Migrate existing full prefetches · Verify prefetched UI with tests · Static or cached content · Uncached content
- Partial Prefetching changes what a `<Link>` downloads for a Cache Components route. With Partial Prefetching enabled, a `<Link>` prefetches the route's App Shell: its static conten
- To prefetch more than the App Shell, a link can opt into per-link prefetching with `<Link prefetch={true}>`. The prefetch can then resolve cached URL-specific content that depends 
- Example: `npx skills add vercel/next.js --skill next-partial-prefetching-adoption`

### `01-app/02-guides/ai-agents.md` — How Next.js supports AI coding agents
- Learn how Next.js helps AI coding agents use current framework guidance, inspect applications, verify changes, and report issues.
- Sections: Version-matched documentation · Managed documentation instructions · Version support · Docs over the network · Automatic agent feedback · Agent-guided upgrades · Runtime visibility · Built-in guidance for errors
- AI coding agents may rely on training data that predates the Next.js version installed in a project. To help agents use current APIs and verify their work, Next.js provides and eva
- For more background, read about the AI tooling introduced in [Next.js 16.2](/blog/next-16-2-ai) and [Next.js 16.3](/blog/next-16-3-ai-improvements).
- History: v16.4.0: `next-bundle-optimizer` skill added.
- Example: `npx @next/codemod@canary agents-md`

### `01-app/02-guides/analytics.md` — How to add analytics to your Next.js application
- Measure and track page performance using Next.js Speed Insights
- Sections: Client Instrumentation · Build Your Own · Web Vitals · Custom Metrics · Sending results to external systems
- Next.js has built-in support for measuring and reporting performance metrics. You can either use the `useReportWebVitals` hook to manage reporting yourself, or alternatively, Verce
- For more advanced analytics and monitoring needs, Next.js provides a `instrumentation-client.js|ts` file that runs before your application's frontend code starts executing. This is
- Example: `import { useReportWebVitals } from 'next/web-vitals' function MyApp({ Component, pageProps }) { useReportWebVitals((metric) => { console.log(metric) }) return <`

### `01-app/02-guides/authentication-with-cache-components.md` — How to implement authentication with Cache Components
- Learn how to read the user session, show authenticated UI without slowing down the page, and cache data derived from the session when Cache Components is enabled.
- Sections: Prerequisites · Migrating an existing app · Step 1: Read the current user · Step 2: Show the user without blocking the page · Step 3: Share the user across components · Step 4: Cache session-derived data · Step 5: Update session-derived data · Step 6: Make authenticated navigations instant
- With Cache Components enabled, a session read happens at request time, so it can't be prerendered into the static shell. Authenticated UI streams in behind a `<Suspense>` boundary 
- The examples use [iron-session](https://github.com/vvo/iron-session) for encrypted cookie sessions, but the patterns apply to any session or authentication library. For a complete,
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { cacheComponents: true, } export default nextConfig`

### `01-app/02-guides/authentication.md` — How to implement authentication in Next.js
- Learn how to implement authentication in your Next.js application.
- Sections: Authentication · Sign-up and login functionality · Session Management · Stateless Sessions · Database Sessions · Authorization · Optimistic checks with Proxy (Optional) · Creating a Data Access Layer (DAL)
- Understanding authentication is crucial for protecting your application's data. This page will guide you through what React and Next.js features to use to implement auth.
- Before starting, it helps to break down the process into three concepts:
- Example: `export async function signup(formData: FormData) {}`

### `01-app/02-guides/backend-for-frontend.md` — How to use Next.js as a backend for your frontend
- Learn how to use Next.js as a backend framework
- Sections: Public Endpoints · Content types · Content negotiation · Consuming request payloads · Manipulating data · Proxying to a backend · NextRequest and NextResponse · Webhooks and callback URLs
- Next.js supports the "Backend for Frontend" pattern. This lets you create public endpoints to handle HTTP requests and return any content type—not just HTML. You can also access da
- If you are starting a new project, using `create-next-app` with the `--api` flag automatically includes an example `route.ts` in your new project's `app/` folder, demonstrating how
- Example: `pnpm create next-app --api`

### `01-app/02-guides/building.md` — Building your application
- Learn what happens when you run next build and how to read the build output.
- Sections: What next build does · Reading the build output · Without Cache Components · With Cache Components · Other route entries · Prerender validation · Debug prerender errors · Build specific routes
- Running `next build` compiles your application for production, prerenders eligible routes, and prints a route table showing how each route is served.
- When you run `next build`, the build moves through these phases:
- Example: `pnpm build`

### `01-app/02-guides/caching-without-cache-components.md` — Caching and Revalidating (Previous Model)
- Learn how to cache and revalidate data using fetch options, unstable_cache, and route segment configs for projects not using Cache Components.
- Sections: Caching fetch requests · unstable_cache for non-fetch functions · Route segment config · Time-based revalidation · Route segment config revalidate · On-demand revalidation · Tagging cached data · revalidateTag
- This guide assumes you are **not** using Cache Components which was introduced in version 16 under the `cacheComponents` flag.
- By default, `fetch` requests are not cached. You can cache individual requests by setting the `cache` option to `'force-cache'`.
- Example: `export default async function Page() { const data = await fetch('https://...', { cache: 'force-cache' }) }`

### `01-app/02-guides/cdn-caching.md` — Using a CDN with Next.js
- Learn how CDN caching works with Next.js, including what works today, cache variability, and the direction toward pathname-based cache keying.
- Sections: What Works Today · Cache-Control headers · Static assets · Static prefetches (PPR-enabled routes) · Where CDN Caching Is Challenging · Handling Headers at the CDN · What you can safely ignore · What you must preserve
- Next.js sets standard `Cache-Control` headers that CDNs can use to cache responses at the edge. This page covers what works today, where CDN caching is challenging, and the directi
- Next.js sets `Cache-Control` headers based on the rendering strategy of each route:

### `01-app/02-guides/ci-build-caching.md` — How to configure Continuous Integration (CI) build caching
- Learn how to configure CI to cache Next.js builds
- Sections: Vercel · CircleCI · Travis CI · GitLab CI · Netlify CI · AWS CodeBuild · GitHub Actions · Bitbucket Pipelines
- To improve build performance, Next.js saves a cache to `.next/cache` that is shared between builds.
- To take advantage of this cache in Continuous Integration (CI) environments, your CI workflow will need to be configured to correctly persist the cache between builds.

### `01-app/02-guides/client-side-data-fetching/index.md` — Client-side data fetching
- Fetch data in Client Components with a data-fetching library, optionally provide initial data from a Server Component, and coordinate server and client caches.
- Sections: Choose a client fetching pattern · Cache server data with Cache Components (optional) · Coordinate mutations · Apply these patterns with SWR or TanStack Query
- Many apps can provide responsive interactions without a client data-fetching library. If a Client Component only needs to read server data once, pass it a Promise and unwrap it wit
- This avoids adding a library for data that never revalidates on the client. See Building interactive apps for patterns using Server Functions, transitions, optimistic UI, and pendi

### `01-app/02-guides/client-side-data-fetching/swr.md` — How to fetch client-side data with SWR
- Fetch client-side data with SWR, optionally provide initial data from a Server Component, and coordinate server and client caches.
- Sections: Fetch data on the client · Use Suspense for client data · Provide initial data from a Server Component · Cache server-provided data with Cache Components · Coordinate server and client caches after mutations
- Use [SWR](https://swr.vercel.app) to fetch data in Client Components, provide initial data from Server Components, and coordinate browser mutations with cached server data. See Cli
- SWR can fetch entirely in the browser when the initial view can wait for a browser request after hydration. Choose an inline or Suspense loading state based on where the loading UI
- Example: `export const productCache = { key: (id: string) => `/api/products/${id}`, }`

### `01-app/02-guides/client-side-data-fetching/tanstack-query.md` — How to fetch client-side data with TanStack Query
- Fetch client-side data with TanStack Query, optionally provide initial data from a Server Component, and coordinate server and client caches.
- Sections: Set up the provider · Fetch data on the client · Use Suspense for client data · Provide initial data from a Server Component · Cache server-provided data with Cache Components · Coordinate server and client caches after mutations · Build a prerenderable hydration state
- Use [TanStack Query](https://tanstack.com/query) to fetch data in Client Components, provide initial data from Server Components, and coordinate browser mutations with cached serve
- Wrap the routes that use TanStack Query in a `QueryClientProvider`. Create a new query client for each server render and reuse one query client in the browser:
- Example: `import { Providers } from './providers' export default function Layout({ children }: LayoutProps<'/products'>) { return <Providers>{children}</Providers> }`

### `01-app/02-guides/content-security-policy.md` — How to set a Content Security Policy (CSP) for your Next.js application
- Learn how to set a Content Security Policy (CSP) for your Next.js application.
- Sections: Nonces · Why use a nonce? · Adding a nonce with Proxy · How nonces work in Next.js · Forcing dynamic rendering · Reading the nonce · Static vs Dynamic Rendering with CSP · Dynamic Rendering Requirement
- [Content Security Policy (CSP)](https://developer.mozilla.org/docs/Web/HTTP/CSP) is important to guard your Next.js application against various security threats such as cross-site 
- By using CSP, developers can specify which origins are permissible for content sources, scripts, stylesheets, images, fonts, objects, media (audio, video), iframes, and more.
- History: v14.0.0: Experimental SRI support added for hash-based CSP; v13.4.20: Recommended for proper nonce handling and CSP header parsing.
- Example: `import { connection } from 'next/server' export default async function Page() { // wait for an incoming request to render this page await connection() // Your p`

### `01-app/02-guides/css-in-js.md` — How to use CSS-in-JS libraries
- Use CSS-in-JS libraries with Next.js
- Sections: Configuring CSS-in-JS in app · styled-jsx · Styled Components · Disabling JavaScript
- **Warning:** Using CSS-in-JS with newer React features like Server Components and Streaming requires library authors to support the latest version of React, including [concurrent r
- The following libraries are supported in Client Components in the `app` directory (alphabetical):
- Example: `import StyledJsxRegistry from './registry' export default function RootLayout({ children }) { return ( <html> <body> <StyledJsxRegistry>{children}</StyledJsxReg`

### `01-app/02-guides/custom-server.md` — How to set up a custom server in Next.js
- Start a Next.js app programmatically using a custom server.
- Sections: Disabling file-system routing
- Next.js includes its own server with `next start` by default. If you have an existing backend, you can still use it with Next.js (this is not a custom server). A custom Next.js ser
- - Before deciding to use a custom server, keep in mind that it should only be used when the integrated router of Next.js can't meet your app requirements.
- Example: `{ "scripts": { "dev": "node server.js", "build": "next build", "start": "NODE_ENV=production node server.js" } }`

### `01-app/02-guides/custom-webpack.md` — How to use a custom webpack version in Next.js
- Use your application's webpack installation with Next.js instead of the bundled version.
- By default, `--webpack` uses the webpack version bundled with Next.js. To use webpack installed in your application instead, install webpack in your application and pass `--custom-
- **Use a custom webpack version at your own risk.** Next.js does not validate the installed webpack version, and compatibility with other versions is not guaranteed. The examples us
- Example: `pnpm add -D webpack@^5.98.0 pnpm next dev --custom-webpack pnpm next build --custom-webpack`

### `01-app/02-guides/data-security.md` — How to think about data security in Next.js
- Learn the built-in data security features in Next.js and learn best practices for protecting your application's data.
- Sections: Data fetching approaches · External HTTP APIs · Data Access Layer · Component-level data access · Reading data · Passing data from server to client · Tainting · Preventing client-side execution of server-only code
- [React Server Components](https://react.dev/reference/rsc/server-components) improve performance and simplify data fetching, but also shift where and how data is accessed, changing
- This guide will help you understand how to think about data security in Next.js and how to implement best practices.
- Example: `module.exports = { experimental: { taint: true, }, }`

### `01-app/02-guides/debugging.md` — How to use debugging tools with Next.js
- Learn how to debug your Next.js application with VS Code, Chrome DevTools, or Firefox DevTools.
- Sections: Debugging with VS Code · Using the Debugger in Jetbrains WebStorm · Debugging with Browser DevTools · Client-side code · React Developer Tools · Server-side code · Inspect Server Errors with Browser DevTools · Debugging on Windows
- This documentation explains how you can debug your Next.js frontend and backend code with full source maps support using the [VS Code debugger](https://code.visualstudio.com/docs/e
- Any debugger that can attach to Node.js can also be used to debug a Next.js application. You can find more details in the Node.js [Debugging Guide](https://nodejs.org/learn/getting
- Example: `pnpm dev --inspect`

### `01-app/02-guides/deploying-to-platforms.md` — Deploying Next.js to different platforms
- Understand which Next.js features require specific platform capabilities and how to choose the right deployment target.
- Sections: Minimum Requirements · Functional Fidelity vs. Performance Fidelity · Feature Support Matrix · CDN Infrastructure Compatibility · Adapters · Verified Adapters · A Note on Infrastructure Requirements
- Next.js treats static and dynamic content as a spectrum at the component level. Different features in this model require different platform capabilities. This page helps you unders
- To run Next.js, your platform needs **a Node.js server**. That's it.

### `01-app/02-guides/draft-mode.md` — How to preview content with Draft Mode in Next.js
- Bypass Next.js caching for a request so editors can preview unpublished content from a headless CMS.
- Sections: What Draft Mode does · What this guide covers · Step 1: Create a Route Handler · Step 2: Access the Route Handler from your headless CMS · Step 3: Preview the draft content · Step 4: Show a preview indicator · Draft Mode with Cache Components · When your CMS uses a separate draft endpoint
- **Draft Mode** lets editors see how draft or in-progress content will render on your site, without waiting for revalidation. While an editor is in Draft Mode, cached or pre-rendere
- Your data-fetching code does not need to change if your CMS serves draft and published content from the same URL. Otherwise, see When your CMS uses a separate draft endpoint.
- Example: `import { draftMode } from 'next/headers' export async function GET(request: Request) { const draft = await draftMode() draft.enable() return new Response('Draft`

### `01-app/02-guides/environment-variables.md` — How to use environment variables in Next.js
- Learn to add and access environment variables in your Next.js application.
- Sections: Loading Environment Variables · Loading Environment Variables with @next/env · Referencing Other Variables · Bundling Environment Variables for the Browser · Runtime Environment Variables · Test Environment Variables · Environment Variable Load Order · Good to know
- Next.js comes with built-in support for environment variables, which allows you to do the following:
- - Use `.env` to load environment variables
- History: v9.4.0: Support `.env` and `NEXT_PUBLIC_` introduced.
- Example: `export async function getStaticProps() { const db = await myDB.connect({ host: process.env.DB_HOST, username: process.env.DB_USER, password: process.env.DB_PASS`

### `01-app/02-guides/forms.md` — How to create forms with Server Actions
- Learn how to create forms in Next.js with React Server Actions.
- Sections: How it works · Passing additional arguments · Form validation · Validation errors · Pending states · Optimistic updates · Nested form elements · Programmatic form submission
- React Server Actions are [Server Functions](https://react.dev/reference/rsc/server-functions) that execute on the server. They can be called in Server and Client Components to hand
- Always verify authentication and authorization inside each Server Action, even if the form is only rendered on an authenticated page. See the Data Security guide for more details.
- Example: `'use server' export async function updateUser(userId: string, formData: FormData) {}`

### `01-app/02-guides/how-revalidation-works.md` — How revalidation works in Next.js
- A deep dive into how Next.js revalidates cached content, including the tag system, cache consistency, and multi-instance coordination.
- Sections: The Revalidation Model · What Gets Revalidated · What happens if they get out of sync · Tag System Architecture · Explicit tags · Soft tags · Multi-Instance Considerations · Implementation Patterns for Platforms
- The Caching page covers how to use `use cache`, `cacheTag`, and `cacheLife`. This page explains **how revalidation works internally**, for platform engineers and advanced users who
- Most routes in Next.js can be revalidated on demand. This includes App Router routes and Pages Router routes that produce ISR/prerender cache entries. Pages Router routes that are 

### `01-app/02-guides/incremental-static-regeneration-cache-components.md` — Incremental Static Regeneration with Cache Components
- Learn how to prerender a subset of dynamic routes, serve App Shells for the rest, and upgrade them after the first visit.
- Sections: Prepare your routes · At build time · At runtime · Wait for complete static output · What the upgrade produces · Choosing what to prerender · Coming from the Pages Router · Next steps
- Incremental Static Regeneration (ISR) with `cacheComponents` and Partial Prefetching gives every route an instant first visit, even for URLs that weren't included in the build.
- During build, Partial Prerendering splits each render into two parts:
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { cacheComponents: true, partialPrefetching: true, } export default nextConfig`

### `01-app/02-guides/incremental-static-regeneration.md` — How to implement Incremental Static Regeneration (ISR)
- Learn how to create or update static pages at runtime with Incremental Static Regeneration.
- Sections: Reference · Route segment config · Functions · Functions · Time-based revalidation · On-demand revalidation with revalidatePath · On-demand revalidation with revalidateTag · On-demand validation with res.revalidate()
- - [Next.js Commerce](https://vercel.com/templates/next.js/nextjs-commerce)
- - [On-Demand ISR](https://on-demand-isr.vercel.app)
- History: v14.1.0: Custom `cacheHandler` is stable.; v13.0.0: App Router is introduced.; v12.2.0: Pages Router: On-Demand ISR is stable; v12.0.0: Pages Router: [Bot-aware ISR fallback](/blog/next-12#bot-aware-isr-fallback) added.
- Example: `'use server' import { revalidatePath } from 'next/cache' export async function createPost() { // Invalidate the cache for the /posts route revalidatePath('/post`

### `01-app/02-guides/index.md` — Guides
- Learn how to implement common patterns and real-world use cases using Next.js

### `01-app/02-guides/instant-navigation.md` — Ensuring instant navigations
- Learn how to structure your app to prefetch and prerender more content, providing instant page loads and client navigations.
- Sections: What "instant" means · Quick start · The tools · Build the static shell · Prefetch URL data for a link · Validate instant navigation · Test it in CI · Inspect loading states
- This guide walks through understanding instant navigations, writing a route that navigates instantly, visualizing what's in the initial UI, and locking the behavior in with end-to-
- A navigation is **instant** when the browser can start rendering the new page the moment the user clicks, with static, cached, and fallback content showing up right away, while the
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { cacheComponents: true, partialPrefetching: true, } export default nextConfig`

### `01-app/02-guides/instrumentation.md` — How to set up instrumentation
- Learn how to use instrumentation to run code at server startup in your Next.js app
- Sections: Convention · Importing files with side effects · Importing runtime-specific code
- Instrumentation is the process of using code to integrate monitoring and logging tools into your application. This allows you to track the performance and behavior of your applicat
- To set up instrumentation, create `instrumentation.ts|js` file in the **root directory** of your project (or inside the `src` folder if using one).
- Example: `import { registerOTel } from '@vercel/otel' export function register() { registerOTel('next-app') }`

### `01-app/02-guides/interactive-apps.md` — Building interactive apps
- Learn how to build responsive interactions with Server Functions, transitions, optimistic UI, and pending feedback.
- Sections: Step 1: Stream slow data with Suspense · Step 2: Respond instantly to a toggle · Step 3: Filter with pending feedback · Step 4: Add comments with instant feedback · Step 5: Move cards between columns · Step 6: Manage form lifecycle · Step 7: Signal pending deletion to a parent · Step 8: Make repeat navigation instant
- When a user interaction requires server-side work, the result is not available immediately. Network requests take an unknown amount of time to complete and may succeed or fail. Whi
- This guide adds responsive feedback to a task management app called _Taskboard_. Each step handles a different kind of pending work, from streaming slow reads to confirming mutatio
- Example: `export async function TaskDetail({ id }) { const task = await getTask(id) return <TaskHeader task={task} /> }`

### `01-app/02-guides/internationalization.md` — Internationalization
- Add support for multiple languages with internationalized routing and localized content.
- Sections: Terminology · Routing Overview · Localization · Sharing the locale across your app · Static Rendering · Resources
- Next.js enables you to configure the routing and rendering of content to support multiple languages. Making your site adaptive to different locales includes translated content (loc
- - **Locale:** An identifier for a set of language and formatting preferences. This usually includes the preferred language of the user and possibly their geographic region.
- Example: `// You now have access to the current locale // e.g. /en-US/products -> `lang` is "en-US" export default async function Page({ params }: PageProps<'/[lang]'>) {`

### `01-app/02-guides/json-ld.md` — How to implement JSON-LD in your Next.js application
- Learn how to add JSON-LD to your Next.js application to describe your content to search engines and AI.
- [JSON-LD](https://json-ld.org/) is a format for structured data that can be used by search engines and AI to help them understand the structure of the page beyond pure content. For
- Our current recommendation for JSON-LD is to render structured data as a `<script>` tag in your `layout.js` or `page.js` components.

### `01-app/02-guides/keeping-pages-static.md` — Keeping pages static
- Keep selected route output static as your app changes.
- Sections: Decide what should stay static · Step 1: Load a static App Shell · Step 2: Prefetch static product details · Step 3: Prerender the buying guides · Next steps
- Before Cache Components, route segment configs such as `dynamic = 'force-static'`, `dynamic = 'force-dynamic'`, and `dynamic = 'error'` selected a rendering mode for an entire rout
- This flexibility is useful for routes that need personalization. Use `ensureStatic` when some or all of a route must avoid request-time server rendering for predictable performance
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { cacheComponents: true, partialPrefetching: true, } export default nextConfig`

### `01-app/02-guides/lazy-loading.md` — How to lazy load Client Components and libraries
- Lazy load imported libraries and React Components to improve your application's loading performance.
- Sections: next/dynamic · Importing Client Components · Skipping SSR · Importing Server Components · Loading External Libraries · Adding a custom loading component · Importing Named Exports · Magic Comments
- [Lazy loading](https://developer.mozilla.org/docs/Web/Performance/Lazy_loading) in Next.js helps improve the initial loading performance of an application by decreasing the amount 
- It allows you to defer loading of **Client Components** and imported libraries, and only include them in the client bundle when they're needed. For example, you might want to defer
- Example: `const ComponentC = dynamic(() => import('../components/C'), { ssr: false })`

### `01-app/02-guides/local-development.md` — How to optimize your local development environment
- Learn how to optimize your local development environment with Next.js.
- Sections: Local dev vs. production · System configuration · 1. Check your computer's antivirus · 2. Avoid common Docker pitfalls · 3. (Windows) Use Dev Drive or WSL 2 · Improving application development performance · 1. Update Next.js and use Turbopack · 2. Check your imports
- Next.js is designed to provide a great developer experience. As your application grows, you might notice slower compilation times during local development. This guide will help you
- The development process with `next dev` is different than `next build` and `next start`.
- Example: `pnpm add next@latest pnpm dev # Turbopack is used by default`

### `01-app/02-guides/mcp.md` — Connecting coding agents to the Next.js MCP server
- Learn how to give coding agents access to your running Next.js app through the built-in MCP endpoint.
- Sections: Getting started · Capabilities · Runtime tools · Development workflow · Error detection and diagnosis · Concepts and best practices · How it works · Troubleshooting
- The [Model Context Protocol (MCP)](https://modelcontextprotocol.io) is an open standard that lets AI agents and coding assistants interact with your applications through one shared
- In Next.js 16 and later, the development server exposes an MCP endpoint at `/_next/mcp`. It gives coding agents the running app's view of errors, routes, logs, and compilation issu
- Example: `npx add-mcp next-devtools-mcp@latest`

### `01-app/02-guides/mdx.md` — How to use markdown and MDX in Next.js
- Learn how to configure MDX and use it in your Next.js apps.
- Sections: Install dependencies · Configure next.config.mjs · Handling .md files · Add an mdx-components.tsx file · Rendering MDX · Using file based routing · Using imports · Using dynamic imports
- [Markdown](https://daringfireball.net/projects/markdown/syntax) is a lightweight markup language used to format text. It allows you to write using plain text syntax and convert it 
- [MDX](https://mdxjs.com/) is a superset of markdown that lets you write [JSX](https://react.dev/learn/writing-markup-with-jsx) directly in your markdown files. It is a powerful way
- Example: `pnpm add @next/mdx @mdx-js/loader @mdx-js/react @types/mdx`

### `01-app/02-guides/memory-usage.md` — How to optimize memory usage
- Optimize memory used by your application in development and production.
- Sections: Reduce number of dependencies · Try experimental.webpackMemoryOptimizations · Run next build with --experimental-debug-memory-usage · Record a heap profile · Analyze a snapshot of the heap · Webpack build worker · Disable Webpack cache · Disable static analysis
- As applications grow and become more feature rich, they can demand more resources when developing locally or creating production builds.
- Let's explore some strategies and techniques to optimize memory and address common memory issues in Next.js.
- Example: `node --heap-prof node_modules/next/dist/bin/next build`

### `01-app/02-guides/migrating-to-cache-components.md` — Migrating to Cache Components
- Learn how to migrate from route segment configs to Cache Components in Next.js.
- Sections: Use the adoption skill (recommended) · Or migrate by hand · Enable Cache Components · Opting out of validation · Adopting incrementally · Following validation · dynamic = "force-dynamic" · dynamic = "force-static"
- When Cache Components is enabled, route segment configs like `dynamic`, `revalidate`, and `fetchCache` are replaced by `use cache` and `cacheLife`.
- The migration is driven by **instant navigation validation**. With Cache Components enabled, Next.js validates in development whether navigating into each route renders instantly, 
- Example: `npx skills add vercel/next.js --skill next-cache-components-adoption`

### `01-app/02-guides/migrating/app-router-migration.md` — How to migrate from Pages to the App Router
- Learn how to upgrade your existing Next.js application from the Pages Router to the App Router.
- Sections: Upgrading · Node.js Version · Next.js Version · ESLint Version · Next Steps · Upgrading New Features · Component · <Link> Component
- This guide will help you:
- - Update your Next.js application from version 12 to version 13
- Example: `pnpm add next@latest react@latest react-dom@latest`

### `01-app/02-guides/migrating/from-create-react-app.md` — How to migrate from Create React App to Next.js
- Learn how to migrate your existing React application from Create React App to Next.js.
- Sections: Why Switch? · Slow initial page loading time · No automatic code splitting · Network waterfalls · Fast and intentional loading states · Choose the data fetching strategy · Proxy · Built-in Optimizations
- This guide will help you migrate an existing Create React App (CRA) site to Next.js.
- There are several reasons why you might want to switch from Create React App to Next.js:
- Example: `pnpm add next@latest`

### `01-app/02-guides/migrating/from-vite.md` — How to migrate from Vite to Next.js
- Learn how to migrate your existing React application from Vite to Next.js.
- Sections: Why Switch? · Slow initial page loading time · No automatic code splitting · Network waterfalls · Fast and intentional loading states · Choose the data fetching strategy · Proxy · Built-in Optimizations
- This guide will help you migrate an existing Vite application to Next.js.
- There are several reasons why you might want to switch from Vite to Next.js:
- Example: `pnpm add next@latest`

### `01-app/02-guides/migrating/index.md` — Migrating
- Learn how to migrate from popular frameworks to Next.js

### `01-app/02-guides/multi-tenant.md` — How to build multi-tenant apps in Next.js
- Learn how to build multi-tenant apps with the App Router.
- If you are looking to build a single Next.js application that serves multiple tenants, we have [built an example](https://vercel.com/templates/next.js/platforms-starter-kit) showin

### `01-app/02-guides/multi-zones.md` — How to build micro-frontends using multi-zones and Next.js
- Learn how to build micro-frontends using Next.js Multi-Zones to deploy multiple Next.js apps under a single domain.
- Sections: How to define a zone · How to route requests to the right zone · Routing requests using proxy · Linking between zones · Sharing code · Server Actions
- - [With Zones](https://github.com/vercel/next.js/tree/canary/examples/with-zones)
- Multi-Zones are an approach to micro-frontends that separate a large application on a domain into smaller Next.js applications that each serve a set of paths. This is useful when t
- Example: `/** @type {import('next').NextConfig} */ const nextConfig = { assetPrefix: '/blog-static', }`

### `01-app/02-guides/offline-support.md` — Handling connectivity drops [experimental]
- How a Next.js app can recover when the network drops mid-fetch or mid-Server Action, and how to communicate that state to the user.
- Sections: Enable offline detection and see the default behavior · Report connectivity inside the Suspense fallback · Retry Server Actions after the network returns · Testing · Without Cache Components · Next steps
- Network failures during a soft navigation, a data fetch, or a mutation throw errors in the client. Without explicit handling, the UI either breaks or you have to build a fallback U
- With `experimental.useOffline` enabled, a failed navigation, RSC data fetch, prefetch, or Server Action no longer throws when the network is down. Next.js keeps it pending and retr
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { cacheComponents: true, partialPrefetching: true, experimental: { useOffline: true, }, } `

### `01-app/02-guides/open-telemetry.md` — How to set up instrumentation with OpenTelemetry
- Learn how to instrument your Next.js app with OpenTelemetry.
- Sections: Getting Started · Using @vercel/otel · Manual OpenTelemetry configuration · Testing your instrumentation · Deployment · Using OpenTelemetry Collector · Custom Exporters · Custom Spans
- Observability is crucial for understanding and optimizing the behavior and performance of your Next.js app.
- As applications become more complex, it becomes increasingly difficult to identify and diagnose issues that may arise. By leveraging observability tools, such as logging and metric
- Example: `pnpm add @vercel/otel @opentelemetry/sdk-logs @opentelemetry/api-logs @opentelemetry/instrumentation`

### `01-app/02-guides/optimizing-prefetching.md` — Optimizing prefetching
- Resolve per-link URL data, include session data in the App Shell, or defer expensive work to a later navigation stage.
- Sections: Use the optimizer skill (recommended) · Resolve URL data at prefetch time · Include session data in the shell · Extract and pass · "use cache: private" · Defer work to a later stage · Keep expensive session data out of the App Shell · Wait for the navigation
- Prefetching downloads a route's JavaScript, CSS, and RSC payload before the user navigates to it, so the router can render the next route without waiting for a round trip. The Pref
- With Cache Components and Partial Prefetching, Next.js loads server-rendered output in stages, before and during a client navigation. These are the route's navigation stages:
- Example: `npx skills add vercel/next.js --skill next-partial-prefetching-optimizer`

### `01-app/02-guides/optimizing-the-static-shell.md` — Optimizing the static shell
- Learn how to use Cache Components to keep layouts, navigation, and useful loading states available while request-time content streams.
- Sections: Use the optimizer skill (recommended) · Prerequisites · Patterns · Keep static UI in the shell · Stream request-time work · Cache reusable work · Follow validation as you refactor · Step 1: Move URL-dependent work behind Suspense
- Cache Components can prerender a static shell while request-time content streams in. The shell can keep the route's layout, navigation, headings, and focused loading states visible
- Apps written before Cache Components often await request data near the top of a layout or page. With Cache Components enabled, those routes may already have a small static shell, s
- Example: `npx skills add vercel/next.js --skill next-cache-components-optimizer`

### `01-app/02-guides/package-bundling.md` — Optimizing package bundling
- Learn how to analyze and optimize your application's server and client bundles with the Next.js Bundle Analyzer for Turbopack, and the `@next/bundle-analyzer` plugin for Webpack.
- Sections: Next.js Bundle Analyzer · Step 1: Run the Turbopack Bundle Analyzer · Step 2: Filter and inspect modules · Step 3: Trace modules with import chains · Step 4: Write output to disk for sharing or diffing · Export analysis data · Give your AI agent access to the bundle analyzer · @next/bundle-analyzer for Webpack
- Bundling is the process of combining your application code and its dependencies into optimized output files for the client and server. Smaller bundles load faster, reduce JavaScrip
- Next.js automatically optimizes bundles by code splitting, tree-shaking, and other techniques. However, there are some cases where you may need to optimize your bundles manually.
- History: v16.4.0: Add `next analyze export` and the `next-bundle-optimizer` skill.
- Example: `npx next analyze`

### `01-app/02-guides/ppr-platform-guide.md` — Implementing Partial Prerendering on your platform
- A guide for platform engineers on implementing PPR support, from basic origin rendering to optimized CDN integration.
- Sections: How PPR Works · Build time · Request time · Storing PPR Artifacts · Origin-Only Implementation · CDN Shell + Origin Compute · The Resume Protocol · CDN-to-origin
- Partial Prerendering (PPR) combines static and dynamic rendering in a single route. At build time, Next.js generates a static HTML shell and a `postponedState` blob for each PPR-en
- This page explains how platforms can implement PPR support at different levels of sophistication.

### `01-app/02-guides/prefetching.md` — Prefetching
- Learn how to configure prefetching in Next.js
- Sections: How does prefetching work? · What Next.js prefetches automatically · Prefetching static vs. dynamic routes · Automatic prefetch · Prefetch scheduling · Client cache · Partial Prefetching · Controlling prefetching
- Prefetching makes navigating between routes feel instant. By default, Next.js prefetches routes based on the links in your application code.
- This guide explains how prefetching works, what Next.js prefetches for you, and how to control it:
- Example: `import Link from 'next/link' export default function NavLink() { return <Link href="/about">About</Link> }`

### `01-app/02-guides/preserving-ui-state.md` — How Next.js preserves UI state with Activity
- Learn how React's Activity component preserves UI state across navigations in Next.js and how to control what resets.
- Sections: Choosing what to preserve · Expandable UI (dropdowns, accordions, panels) · Dialog and initialization logic · Forms, inputs, and state · State and authentication · Global styles · The :has selector · Testing
- **Good to know:** This guide assumes Cache Components is enabled. Enable it by setting `cacheComponents: true` in your Next config file.
- Before Cache Components, preserving page-level state across navigations required workarounds like hoisting state to a shared layout or using an external store. With Cache Component
- Example: `useLayoutEffect(() => { const dialog = dialogRef.current return () => dialog?.close() }, [])`

### `01-app/02-guides/preventing-flash-before-hydration.md` — How to prevent flash before hydration
- Learn how to prevent a flash of unstyled content (FOUC) by correcting server-rendered HTML, such as a dark mode theme, before the browser paints.
- Sections: Dates and formatting · The problem · Fixing it with an inline script · Understanding suppressHydrationWarning · Extracting a reusable component · Themes · Storing the theme in a cookie · Syncing with React state
- User preferences, browser settings, and client-side storage aren't available during server rendering. The server emits a reasonable default, but any UI that depends on client-only 
- Some common approaches to this problem:
- Example: `'use client' export function EventDate({ date }: { date: string }) { return <p>{new Date(date).toLocaleDateString()}</p> }`

### `01-app/02-guides/production-checklist.md` — How to optimize your Next.js application for production
- Recommendations to ensure the best performance and user experience before taking your Next.js application to production.
- Sections: Automatic optimizations · During development · Routing and rendering · Data fetching and caching · UI and accessibility · Security · Metadata and SEO · Type safety
- Before taking your Next.js application to production, there are some optimizations and patterns you should consider implementing for the best user experience, performance, and secu
- This page provides best practices that you can use as a reference when building your application and before going to production, as well as the automatic Next.js optimizations you 

### `01-app/02-guides/progressive-web-apps.md` — How to build a Progressive Web Application (PWA) with Next.js
- Learn how to build a Progressive Web Application (PWA) with Next.js.
- Sections: Creating a PWA with Next.js · 1. Creating the Web App Manifest · 2. Implementing Web Push Notifications · 3. Implementing Server Actions · 4. Generating VAPID Keys · 5. Creating a Service Worker · 6. Adding to Home Screen · 7. Testing Locally
- Progressive Web Applications (PWAs) offer the reach and accessibility of web applications combined with the features and user experience of native mobile apps. With Next.js, you ca
- - Deploy updates instantly without waiting for app store approval
- Example: `pnpm add -g web-push`

### `01-app/02-guides/public-static-pages.md` — Building public pages
- Learn how to build public, "static" pages that share data across users, such as landing pages, list pages (products, blogs, etc.), marketing and news sites.
- Sections: Step 1: Add a simple header · Step 2: Add the product list · Cache components · Step 3: Add a dynamic promotion banner · Partial prerendering · Next steps
- Public pages show the same content to every user. Common examples include landing pages, marketing pages, and product pages.
- Since data is shared, these kind of pages can be prerendered ahead of time and reused. This leads to faster page loads and lower server costs.
- Example: `// Static component function Header() { return <h1>Shop</h1> } export default async function Page() { return ( <> <Header /> </> ) }`

### `01-app/02-guides/redirecting.md` — How to handle redirects in Next.js
- Learn the different ways to handle redirects in Next.js.
- Sections: redirect function · permanentRedirect function · useRouter() hook · redirects in next.config.js · NextResponse.redirect in Proxy · Managing redirects at scale (advanced) · 1. Creating and storing a redirect map · 2. Optimizing data lookup performance
- There are a few ways you can handle redirects in Next.js. This page will go through each available option, use cases, and how to manage large numbers of redirects.
- The `redirect` function allows you to redirect the user to another URL. You can call `redirect` in Server Components, Route Handlers, and Server Functions.
- Example: `import { useRouter } from 'next/router' export default function Page() { const router = useRouter() return ( <button type="button" onClick={() => router.push('/`

### `01-app/02-guides/rendering-philosophy.md` — Next.js Rendering Philosophy
- Learn how Next.js treats static and dynamic rendering as a spectrum at the component level, and what this means for deployment.
- Sections: Static and Dynamic as a Spectrum · What This Enables · The Trade-Off · Build-time prerendering · Route-level boundaries · Component-level boundaries · Infrastructure Implications · Portability and Fidelity
- Most web frameworks draw a hard line between static and dynamic at the route level. A page is either prerendered at build time or server-rendered at request time. This model is sim
- Next.js takes a different approach: **the boundary between static and dynamic is at the component level, not the route level.** A single page can have a static shell that loads ins

### `01-app/02-guides/sass.md` — How to use Sass
- Style your Next.js application using Sass.
- Sections: Customizing Sass Options · Sass Variables
- Next.js has built-in support for integrating with Sass after the package is installed using both the `.scss` and `.sass` extensions. You can use component-level Sass via CSS Module
- First, install [`sass`](https://github.com/sass/sass):
- Example: `pnpm add -D sass`

### `01-app/02-guides/scripts.md` — How to load and optimize scripts
- Optimize 3rd party scripts with the built-in Script component.
- Sections: Layout Scripts · Application Scripts · Strategy · Offloading Scripts To A Web Worker (experimental) · Inline Scripts · Executing Additional Code · Additional Attributes
- To load a third-party script for multiple routes, import `next/script` and include the script directly in your layout component:
- The third-party script is fetched when the folder route (e.g. `dashboard/page.js`) or any nested route (e.g. `dashboard/settings/page.js`) is accessed by the user. Next.js will ens
- Example: `import Script from 'next/script' export default function DashboardLayout({ children }) { return ( <> <section>{children}</section> <Script src="https://example.`

### `01-app/02-guides/self-hosting.md` — How to self-host your Next.js application
- Learn how to self-host your Next.js application on a Node.js server, Docker image, or static HTML files (static exports).
- Sections: Reverse Proxy · Image Optimization · Proxy · Environment Variables · Caching and ISR · Automatic Caching · Static Assets · Configuring Caching
- When deploying your Next.js app, you may want to configure how different features are handled based on your infrastructure.
- **🎥 Watch:** Learn more about self-hosting Next.js → [YouTube (45 minutes)](https://www.youtube.com/watch?v=sIVL4JMqRfc).
- Example: `module.exports = { cacheHandler: require.resolve('./cache-handler.js'), cacheMaxMemorySize: 0, // disable default in-memory caching }`

### `01-app/02-guides/server-actions.md` — Server Actions and Mutations
- How Server Actions work in Next.js, including the single-roundtrip response model, sequential dispatch, security, and caching integration.
- Sections: Sequential dispatch on the client · A single response carries data and UI · Security · Choosing a cache update · Configuration · Deployment considerations
- A **Server Action** is a [React Server Function](https://react.dev/reference/rsc/server-functions) invoked through React's action mechanisms, such as `<form action>`, `<button form
- You create one by adding the `'use server'` directive, then invoke it from a form, or from an event handler or `useEffect` wrapped in `startTransition`. For the basics of creating 
- Example: `/** @type {import('next').NextConfig} */ module.exports = { experimental: { serverActions: { allowedOrigins: ['my-proxy.com', '*.my-proxy.com'], bodySizeLimit: `

### `01-app/02-guides/server-and-client-boundary.md` — The Server and Client Boundary
- Learn where Server and Client Components run in the App Router and how the boundary between them works.
- Sections: Rendering environments · How data enters the tree · State and interactivity · Crossing the boundary
- React Server Components (RSC) split a component tree between server and client module graphs. This boundary determines where component code runs and whether that code ships to the 
- Before RSC, React components followed what RSC now calls the Client Component model. React could render these components to HTML on the server, but the same code also shipped to th
- Example: `'use client' export default function Hello() { console.log('Hello rendered') // on a direct visit: server, then browser return <p>Hello</p> }`

### `01-app/02-guides/single-page-applications.md` — How to build single-page applications with Next.js
- Next.js fully supports building Single-Page Applications (SPAs).
- Sections: What is a Single-Page Application? · Why use Next.js for SPAs? · Build common SPA patterns · Using React's use within a Context Provider · Rendering components only in the browser · Shallow routing on the client · Mutating data with Server Actions · Static export (optional)
- Build Single-Page Applications (SPAs) with client-side navigation and data fetching. Next.js supports client and server patterns in the same app, and existing SPAs can migrate with
- The definition of a SPA varies. We'll define a "strict SPA" as:
- Example: `'use client' import { use } from 'react' import { useUser } from './user-provider' export function Profile() { const userPromise = useUser() const user = use(us`

### `01-app/02-guides/static-exports.md` — How to create a static export of your Next.js application
- Next.js enables starting as a static site or Single-Page Application (SPA), then later optionally upgrading to use features that require a server.
- Sections: Configuration · Supported Features · Server Components · Client Components · Supported Features · Image Optimization · Route Handlers · Browser APIs
- Next.js enables starting as a static site or Single-Page Application (SPA), then later optionally upgrading to use features that require a server.
- When running `next build`, Next.js generates an HTML file per route. By breaking a strict SPA into individual HTML files, Next.js can avoid loading unnecessary JavaScript code on t
- History: v14.0.0: `next export` has been removed in favor of `"output": "export"`; v13.4.0: App Router (Stable) adds enhanced static export support, including using React Server Components and Route Handlers.; v13.3.0: `next export` is deprecated and replaced with `"output": "export"`
- Example: `export default async function Page() { // This fetch will run on the server during `next build` const res = await fetch('https://api.example.com/...') const dat`

### `01-app/02-guides/streaming.md` — Streaming
- Learn how streaming works in Next.js and how to use it to progressively render UI as data becomes available.
- Sections: What is streaming? · How the App Router delivers a page · The HTML stream · The component payload · The static shell · Page-level streaming with loading.js · Granular streaming with <Suspense> · Parallel streaming with sibling boundaries
- In traditional server-side rendering, the server produces the full HTML document before sending anything. A single slow database query or API call can block the entire page. Stream
- This is especially impactful for pages that combine fast static content (headers, navigation, layout) with slower dynamic content (personalized data, analytics, recommendations). T
- Example: `<Suspense fallback={<p>Loading products...</p>}> {params.then(({ category }) => ( <ProductGrid category={category} /> ))} </Suspense>`

### `01-app/02-guides/tailwind-v3-css.md` — How to install Tailwind CSS v3 in your Next.js application
- Style your Next.js Application using Tailwind CSS v3 for broader browser support.
- Sections: Installing Tailwind v3 · Configuring Tailwind v3 · Using classes · Usage with Turbopack
- This guide will walk you through how to install [Tailwind CSS v3](https://v3.tailwindcss.com/) in your Next.js application.
- **Good to know:** For the latest Tailwind 4 setup, see the Tailwind CSS setup instructions.
- Example: `pnpm add -D tailwindcss@^3 postcss autoprefixer npx tailwindcss init -p`

### `01-app/02-guides/testing/cypress.md` — How to set up Cypress with Next.js
- Learn how to set up Cypress with Next.js for End-to-End (E2E) and Component Testing.
- Sections: Quickstart · Manual setup · Creating your first Cypress E2E test · Testing routes preserved by Cache Components · Running E2E Tests · Creating your first Cypress component test · Running Component Tests · Continuous Integration (CI)
- [Cypress](https://www.cypress.io/) is a test runner used for **End-to-End (E2E)** and **Component Testing**. This page will show you how to set up Cypress with Next.js and write yo
- - Cypress versions below 13.6.3 do not support [TypeScript version 5](https://github.com/cypress-io/cypress/issues/27731) with `moduleResolution:"bundler"`. However, this issue has
- Example: `pnpm create next-app --example with-cypress with-cypress-app`

### `01-app/02-guides/testing/index.md` — Testing
- Learn how to set up Next.js with four commonly used testing tools — Cypress, Playwright, Vitest, and Jest.
- Sections: Types of tests · Async Server Components · Guides
- In React and Next.js, there are a few different types of tests you can write, each with its own purpose and use cases. This page provides an overview of types and commonly used too
- - **Unit Testing** involves testing individual units (or blocks of code) in isolation. In React, a unit can be a single function, hook, or component.

### `01-app/02-guides/testing/jest.md` — How to set up Jest with Next.js
- Learn how to set up Jest with Next.js for Unit Testing and Snapshot Testing.
- Sections: Quickstart · Manual setup · Setting up Jest (with Babel) · Handling stylesheets and image imports · Handling Fonts · Optional: Handling Absolute Imports and Module Path Aliases · Optional: Extend Jest with custom matchers · Add a test script to package.json
- Jest and React Testing Library are frequently used together for **Unit Testing** and **Snapshot Testing**. This guide will show you how to set up Jest with Next.js and write your f
- **Good to know:** Since `async` Server Components are new to the React ecosystem, Jest currently does not support them. While you can still run **unit tests** for synchronous Serve
- Example: `pnpm create next-app --example with-jest with-jest-app`

### `01-app/02-guides/testing/playwright.md` — How to set up Playwright with Next.js
- Learn how to set up Playwright with Next.js for End-to-End (E2E) Testing.
- Sections: Quickstart · Manual setup · Creating your first Playwright E2E test · Testing instant navigations · Testing routes preserved by Cache Components · Running your Playwright tests · Running Playwright on Continuous Integration (CI)
- Playwright is a testing framework that lets you automate Chromium, Firefox, and WebKit with a single API. You can use it to write **End-to-End (E2E)** testing. This guide will show
- The fastest way to get started is to use `create-next-app` with the [with-playwright example](https://github.com/vercel/next.js/tree/canary/examples/with-playwright). This will cre
- Example: `pnpm create next-app --example with-playwright with-playwright-app`

### `01-app/02-guides/testing/vitest.md` — How to set up Vitest with Next.js
- Learn how to set up Vitest with Next.js for Unit Testing.
- Sections: Quickstart · Manual Setup · Creating your first Vitest Unit Test · Running your tests · Additional Resources
- Vitest and React Testing Library are frequently used together for **Unit Testing**. This guide will show you how to set up Vitest with Next.js and write your first tests.
- **Good to know:** Since `async` Server Components are new to the React ecosystem, Vitest currently does not support them. While you can still run **unit tests** for synchronous Ser
- Example: `pnpm create next-app --example with-vitest with-vitest-app`

### `01-app/02-guides/third-party-libraries.md` — How to optimize third-party libraries
- Optimize the performance of third-party libraries in your application with the `@next/third-parties` package.
- Sections: Getting Started · Google Third-Parties · Google Tag Manager · Google Analytics · Google Maps Embed · YouTube Embed
- **`@next/third-parties`** is a library that provides a collection of components and utilities that improve the performance and developer experience of loading popular third-party l
- All third-party integrations provided by `@next/third-parties` have been optimized for performance and ease of use.
- Example: `pnpm add @next/third-parties@latest next@latest`

### `01-app/02-guides/upgrading/agent-upgrade.md` — Upgrade with a coding agent [experimental]
- Use a coding agent to upgrade and verify a Next.js app.
- Sections: Start an upgrade · Choose a policy · Adopt future defaults · What the command does · Choose how to run the agent · Configure upgrade reminders
- Use `next upgrade --agent` to have a coding agent upgrade and verify your app. The command determines the target version from the configured policy, prepares the relevant migration
- The command supports App Router and Pages Router projects. Without `--agent`, `next upgrade` runs the interactive codemod workflow instead.
- Example: `npx next@canary upgrade --agent=latest`

### `01-app/02-guides/upgrading/codemods.md` — Codemods
- Use codemods to upgrade your Next.js codebase when new features are released.
- Sections: Usage · Upgrade · Options · Codemods · 16.3 · 16.0 · 15.0 · 14.0
- Codemods are transformations that run on your codebase programmatically. This allows a large number of changes to be programmatically applied without having to manually go through 
- Next.js provides Codemod transformations to help upgrade your Next.js codebase when an API is updated or deprecated.
- Example: `npx @next/codemod <transform> <path>`

### `01-app/02-guides/upgrading/index.md` — Upgrade Guides
- Learn how to upgrade to the latest versions of Next.js.
- Learn how to upgrade Next.js, with a coding agent or by following a version-specific guide:

### `01-app/02-guides/upgrading/version-14.md` — How to upgrade to version 14
- Upgrade your Next.js Application from Version 13 to 14.
- Sections: Upgrading from 13 to 14 · v14 Summary · Review migration checklist
- To update to Next.js version 14, run the following command using your preferred package manager:
- **Good to know:** If you are using TypeScript, ensure you also upgrade `@types/react` and `@types/react-dom` to their latest versions.
- Example: `npm i next@next-14 react@18 react-dom@18 && npm i eslint-config-next@next-14 -D`

### `01-app/02-guides/upgrading/version-15.md` — How to upgrade to version 15
- Upgrade your Next.js Application from Version 14 to 15.
- Sections: Upgrading from 14 to 15 · React 19 · Async Request APIs (Breaking change) · cookies · headers · draftMode · params & searchParams · runtime configuration (Breaking change)
- To update to Next.js version 15, you can use the `upgrade` codemod:
- If you prefer to do it manually, ensure that you're installing the latest Next & React versions:
- Example: `pnpm dlx @next/codemod@canary upgrade latest`

### `01-app/02-guides/upgrading/version-16.md` — How to upgrade to version 16
- Upgrade your Next.js Application from Version 15 to 16.
- Sections: Use a coding agent (recommended) · Or upgrade manually · Set up AI agent docs · Using the codemod · Install packages manually · Node.js runtime and browser support · Turbopack by default · Opting out of Turbopack
- Run the latest upgrade CLI from your app's directory:
- The CLI prepares the Next.js 16 migration guides and codemod command for the agent, then asks it to apply the changes and verify the app. See Upgrade with a coding agent for detail
- Example: `npx next@canary upgrade --agent=latest`

### `01-app/02-guides/videos.md` — How to use and optimize videos
- Recommendations and best practices for optimizing videos in your Next.js application.
- Sections: Using <video> and <iframe> · <video> · Common <video> tag attributes · Video best practices · <iframe> · Common <iframe> tag attributes · Choosing a video embedding method · Embedding externally hosted videos
- This page outlines how to use videos with Next.js applications, showing how to store and display video files without affecting performance.
- Videos can be embedded on the page using the HTML **`<video>`** tag for direct video files and **`<iframe>`** for external platform-hosted videos.
- Example: `export default function Page() { return ( <iframe src="https://www.youtube.com/embed/19g66ezsKAg" allowFullScreen /> ) }`

### `01-app/02-guides/view-transitions.md` — Designing view transitions
- Learn how to use view transitions to communicate meaning during navigation, loading, and content changes in a Next.js app.
- Sections: Add view transitions with an agent · Step 1: Morph a thumbnail into a hero image · Step 2: Animate loading states with Suspense reveals · Step 3: Add directional motion for navigation · Step 4: Crossfade content within the same route · Next steps
- In web apps, route changes replace the entire page at once. One set of elements disappears, another appears, with no visual connection between them. A user selects a photo thumbnai
- Apps that need these transitions typically rely on complex animation libraries that manage mount/unmount lifecycles, track element positions across routes, and coordinate timing ma
- Example: `npx skills add vercel-labs/agent-skills --skill vercel-react-view-transitions`

## `01-app/03-api-reference` (199 docs)

### `01-app/03-api-reference/01-directives/index.md` — Directives
- Learn how React and Next.js directives define client entry points, Server Functions, and cached output.
- Sections: Where to place a directive · What each directive requires · Placement decides what you cache
- Directives are string literals that tell the compiler and bundler how to treat the code around them. On their own, directives look like plain strings, but Next.js and React read th
- The `'use cache'` directive also has `'use cache: remote'` and `'use cache: private'` variants. Configure custom cache handlers to control where cached entries are stored.
- Example: `// File-level: applies to every export 'use cache' export async function getUser(id: string) { return { id } }`

### `01-app/03-api-reference/01-directives/use-cache-private.md` — use cache: private
- Learn how to use the "use cache: private" directive to cache functions that access runtime request APIs.
- Sections: Usage · Basic example · Configuring the client stale time · Request APIs allowed in private caches
- The `'use cache: private'` directive allows functions to access runtime request APIs like `cookies()`, `headers()`, and `searchParams` within a cached scope. In production, matchin
- The client router can keep the rendered output in browser memory for the `stale` time configured with `cacheLife`. This client-side cache does not persist across page reloads.
- History: v16.0.0: `"use cache: private"` is enabled with the Cache Components feature.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { cacheComponents: true, } export default nextConfig`

### `01-app/03-api-reference/01-directives/use-cache-remote.md` — use cache: remote
- Learn how to use the "use cache: remote" directive for persistent, shared caching using remote cache handlers.
- Sections: Usage · When to avoid remote caching · When remote caching makes sense · How use cache: remote differs from use cache and use cache: private · Persistence across deploys · Caching with runtime data · Cache key considerations · Nesting rules
- While the `use cache` directive is sufficient for most application needs, you might notice that cached operations are re-running more often than expected, or that your upstream ser
- - Cache entries being evicted to make room for new ones
- History: v16.0.0: `"use cache: remote"` is enabled with the Cache Components feature.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { cacheComponents: true, } export default nextConfig`

### `01-app/03-api-reference/01-directives/use-cache.md` — use cache
- Learn how to use the "use cache" directive to cache data in your Next.js application.
- Sections: Usage · How use cache works · Cache keys · Cache output · Serialization · Supported types · Unsupported types · Pass-through (non-serializable arguments)
- The `use cache` directive allows you to mark a route, React component, or a function as cacheable. It can be used at the top of a file to indicate that all exports in the file shou
- - To use cookies or headers, read them outside cached scopes and pass values as arguments. This is the preferred pattern.
- History: v16.0.0: `"use cache"` stabilized and is enabled with the Cache Components feature.; v15.0.0: `"use cache"` is introduced as an experimental feature.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { cacheComponents: true, } export default nextConfig`

### `01-app/03-api-reference/01-directives/use-client.md` — use client
- Learn how to use the use client directive to render a component on the client.
- Sections: Usage · Nesting Client Components within Server Components · Reference
- The `'use client'` directive declares an entry point for the components to be rendered on the **client side** and should be used when creating interactive user interfaces (UI) that
- You do not need to add the `'use client'` directive to every file that contains Client Components. You only need to add it to the files whose components you want to render directly
- Example: `'use client' export default function Counter({ onClick /* ❌ Function is not serializable */, }) { return ( <div> <button onClick={onClick}>Increment</button> </`

### `01-app/03-api-reference/01-directives/use-server.md` — use server
- Learn how to use the use server directive to execute code on the server.
- Sections: Using use server at the top of a file · Using Server Functions in a Client Component · Using use server inline · Security considerations · Authentication and authorization · Return values · Reference
- The `use server` directive designates a function or file to be executed on the **server side**. It can be used at the top of a file to indicate that all functions in the file are s
- For Next.js-specific Server Action behaviors (response model, security, configuration, deployment), see Server Actions and Mutations.
- Example: `'use client' import { fetchUsers } from '../actions' export default function MyButton() { return <button onClick={() => fetchUsers()}>Fetch Users</button> }`

### `01-app/03-api-reference/02-components/font.md` — Font Module
- Optimizing loading web fonts with the built-in `next/font` loaders.
- Sections: Reference · src · weight · style · subsets · axes · display · preload
- `next/font` automatically optimizes your fonts (including custom fonts) and removes external network requests for improved privacy and performance.
- It includes **built-in automatic self-hosting** for any font file. This means you can optimally load web fonts with no [layout shift](https://web.dev/articles/cls).
- Example: `import localFont from 'next/font/local' export const myFont = localFont({ src: './my-font.woff2', declarations: [{ prop: 'font-family', value: 'myFont' }], })`

### `01-app/03-api-reference/02-components/form.md` — Form Component
- Learn how to use the `<Form>` component to handle form submissions and search params updates with client-side navigation.
- Sections: Reference · action (string) Props · action (function) Props · Caveats · Search form that leads to a search result page · Mutations with Server Actions
- The `<Form>` component extends the HTML `<form>` element to provide **prefetching** of loading UI, **client-side navigation** on submission, and **progressive enhancement**.
- It's useful for forms that update URL search params as it reduces the boilerplate code needed to achieve the above.
- Example: `import Form from 'next/form' export default function Page() { return ( <Form action="/search"> <input name="query" /> <button type="submit">Submit</button> </Fo`

### `01-app/03-api-reference/02-components/image.md` — Image Component
- Optimize Images in your Next.js Application using the built-in `next/image` Component.
- Sections: Reference · Props · Other Props · Deprecated props · Configuration options · Deprecated configuration options · Functions · getImageProps
- The Next.js Image component extends the HTML `<img>` element for automatic image optimization.
- **Good to know**: If you are using a version of Next.js prior to 13, you'll want to use the next/legacy/image documentation since the component was renamed.
- History: v16.1.7: `maximumDiskCacheSize` configuration added.; v16.1.2: `maximumResponseBody` configuration added.; v16.0.0: `qualities` default configuration changed to `[75]`, `preload` prop added, `priority` prop deprecated, `dangerouslyAllow; v15.3.0: `remotePatterns` added support for array of `URL` objects.
- Example: `import Image from 'next/image' export default function Page() { return ( ) }`

### `01-app/03-api-reference/02-components/index.md` — Components
- API Reference for Next.js built-in components.

### `01-app/03-api-reference/02-components/link.md` — Link Component
- Enable fast client-side navigation with the built-in `next/link` component.
- Sections: Reference · href (required) · replace · scroll · prefetch · shallow · locale · as
- `<Link>` is a React component that extends the HTML `<a>` element to provide prefetching and client-side navigation between routes. It is the primary way to navigate between routes
- The following props can be passed to the `<Link>` component:
- History: v16.2.0: Add `transitionTypes` prop.; v15.4.0: Add `auto` as an alias to the default `prefetch` behavior.; v15.3.0: Add `onNavigate` API; v13.0.0: No longer requires a child `<a>` tag. A codemod is provided to automatically update your codebase.
- Example: `import Link from 'next/link' export default function Page() { return <Link href="/dashboard">Dashboard</Link> }`

### `01-app/03-api-reference/02-components/script.md` — Script Component
- Optimize third-party scripts in your Next.js application using the built-in `next/script` Component.
- Sections: Props · Required Props · src · Optional Props · strategy · beforeInteractive · afterInteractive · lazyOnload
- This API reference will help you understand how to use props available for the Script Component. For features and usage, please see the Optimizing Scripts page.
- Here's a summary of the props available for the Script Component:
- History: v13.0.0: `beforeInteractive` and `afterInteractive` is modified to support `app`.; v12.2.4: `onReady` prop added.; v12.2.2: Allow `next/script` with `beforeInteractive` to be placed in `_document`.; v11.0.0: `next/script` introduced.
- Example: `import Script from 'next/script' export default function Dashboard() { return ( <> <Script src="https://example.com/script.js" /> </> ) }`

### `01-app/03-api-reference/03-file-conventions/01-metadata/app-icons.md` — favicon, icon, and apple-icon
- API Reference for the Favicon, Icon and Apple Icon file conventions.
- Sections: Image files (.ico, .jpg, .png) · favicon · icon · apple-icon · Generate icons using code (.js, .ts, .tsx) · Props · Returns · Config exports
- The `favicon`, `icon`, or `apple-icon` file conventions allow you to set icons for your application.
- They are useful for adding app icons that appear in places like web browser tabs, phone home screens, and search engine results.
- History: v16.0.0: `params` is now a promise that resolves to an object; v13.3.0: `favicon` `icon` and `apple-icon` introduced
- Example: `export default async function Icon({ params, }: { params: Promise<{ slug: string }> }) { const { slug } = await params // ... }`

### `01-app/03-api-reference/03-file-conventions/01-metadata/index.md` — Metadata Files API Reference
- API documentation for the metadata file conventions.
- This section of the docs covers **Metadata file conventions**. File-based metadata can be defined by adding special metadata files to route segments.
- Each file convention can be defined using a static file (e.g. `opengraph-image.jpg`), or a dynamic variant that uses code to generate the file (e.g. `opengraph-image.js`).

### `01-app/03-api-reference/03-file-conventions/01-metadata/manifest.md` — manifest.json
- API Reference for manifest.json file.
- Sections: Static Manifest file · Generate a Manifest file · Manifest Object
- Add or generate a `manifest.(json|webmanifest)` file that matches the [Web Manifest Specification](https://developer.mozilla.org/docs/Web/Manifest) in the **root** of `app` directo
- Add a `manifest.js` or `manifest.ts` file that returns a `Manifest` object.
- Example: `{ "name": "My Next.js Application", "short_name": "Next.js App", "description": "An application built with Next.js", "start_url": "/" // ... }`

### `01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md` — opengraph-image and twitter-image
- API Reference for the Open Graph Image and Twitter Image file conventions.
- Sections: Precedence with metadata exports · Image files (.jpg, .png, .gif) · opengraph-image · twitter-image · opengraph-image.alt.txt · twitter-image.alt.txt · Generate images using code (.js, .ts, .tsx) · Props
- The `opengraph-image` and `twitter-image` file conventions allow you to set Open Graph and Twitter images for a route segment.
- They are useful for setting the images that appear on social networks and messaging apps when a user shares a link to your site.
- History: v16.0.0: `params` is now a promise that resolves to an object; v13.3.0: `opengraph-image` and `twitter-image` introduced.
- Example: `export default async function Image({ params, }: { params: Promise<{ slug: string }> }) { const { slug } = await params // ... }`

### `01-app/03-api-reference/03-file-conventions/01-metadata/robots.md` — robots.txt
- API Reference for robots.txt file.
- Sections: Static robots.txt · Generate a Robots file · Customizing specific user agents · Non-standard directives · Robots object
- Add or generate a `robots.txt` file that matches the [Robots Exclusion Standard](https://en.wikipedia.org/wiki/Robots.txt#Standard) in the **root** of `app` directory to tell searc
- Add a `robots.js` or `robots.ts` file that returns a `Robots` object.
- History: v16.3.0: Added `other` field for non-standard per-agent directives.; v13.3.0: `robots` introduced.
- Example: `export default function robots() { return { rules: { userAgent: '*', allow: '/', disallow: '/private/', }, sitemap: 'https://acme.com/sitemap.xml', } }`

### `01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md` — sitemap.xml
- API Reference for the sitemap.xml file.
- Sections: Sitemap files (.xml) · Generating a sitemap using code (.js, .ts) · Image Sitemaps · Video Sitemaps · Generate a localized Sitemap · Generating multiple sitemaps · Returns
- `sitemap.(xml|js|ts)` is a special file that matches the [Sitemaps XML format](https://www.sitemaps.org/protocol.html) to help search engine crawlers index your site more efficient
- For smaller applications, you can create a `sitemap.xml` file and place it in the root of your `app` directory.
- History: v16.0.0: `id` is now a promise that resolves to a `string`.; v14.2.0: Add localizations support.; v13.4.14: Add `changeFrequency` and `priority` attributes to sitemaps.; v13.3.0: `sitemap` introduced.

### `01-app/03-api-reference/03-file-conventions/02-route-segment-config/dynamicParams.md` — dynamicParams
- API reference for the dynamicParams route segment config option.
- Sections: With Cache Components
- The `dynamicParams` option allows you to control what happens when a dynamic segment is visited that was not generated with generateStaticParams.
- - **`true`** (default): Dynamic route segments not included in `generateStaticParams` are generated at request time.
- Example: `export const dynamicParams = true // true | false`

### `01-app/03-api-reference/03-file-conventions/02-route-segment-config/ensureStatic.md` — ensureStatic
- Require selected route output to remain static instead of rendering per request with the ensureStatic route segment config.
- Sections: Reference · 'shell' · 'prefetch' · 'navigation' · false · How ensureStatic differs from instant · Combining levels across layouts and pages · TypeScript
- The `ensureStatic` route segment config requires selected route output to be static instead of rendered per request. Export it from a page or layout to enforce this requirement for
- Use it so later changes cannot add request-time server rendering to a navigation stage that must stay static. See Keeping pages static for a worked example of each level.
- History: v16.4.0: `ensureStatic` introduced.
- Example: `export const ensureStatic = 'navigation' export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }`

### `01-app/03-api-reference/03-file-conventions/02-route-segment-config/index.md` — Route Segment Config
- Learn about how to configure options for Next.js route segments.
- The Route Segment Config options allow you to configure the behavior of a Page, Layout, or Route Handler by directly exporting the following variables:
- With Cache Components enabled, pages and layouts also support the following option:
- History: v16.0.0: `dynamic`, `dynamicParams`, `revalidate`, and `fetchCache` removed when Cache Components is enabled. See Caching and Rev; v16.0.0: `export const experimental_ppr = true` removed. A codemod is available.; v15.0.0-RC: `export const runtime = "experimental-edge"` deprecated. A codemod is available.

### `01-app/03-api-reference/03-file-conventions/02-route-segment-config/instant.md` — instant
- Configure instant navigation validation for a route segment.
- Sections: Reference · level · Disabling instant · Disabling static shell validation · How validation works · How instant differs from ensureStatic · Configuring validation defaults · Inspecting loading states
- The `instant` route segment config controls how Next.js validates whether a navigation into this segment would produce an instant UI.
- Next.js uses prefetching to preload navigations for all in-app links on the current page. However, client-side data fetching or partially prerendered results from the server can le
- History: v16.3.0: `instant` export stabilized, replacing `unstable_instant` (Cache Components only).
- Example: `export const instant = true export default function Page() { return <div>...</div> }`

### `01-app/03-api-reference/03-file-conventions/02-route-segment-config/maxDuration.md` — maxDuration
- API reference for the maxDuration route segment config option.
- Sections: Server Actions
- The `maxDuration` option allows you to set the maximum execution time (in seconds) for server-side logic in a route segment. Deployment platforms can use `maxDuration` from the Nex
- If using Server Actions, set the `maxDuration` at the page level to change the default timeout of all Server Actions used on the page.
- History: v13.4.10: `maxDuration` introduced.
- Example: `export const maxDuration = 5`

### `01-app/03-api-reference/03-file-conventions/02-route-segment-config/preferredRegion.md` — preferredRegion (deprecated)
- API reference for the preferredRegion route segment config option.
- Sections: Vercel
- **Deprecated:** The `preferredRegion` route segment config is deprecated. Remove the `preferredRegion` export from your route files. See the deprecation message for details.
- The `preferredRegion` option allows you to specify the preferred deployment region for a route segment. This value is passed to your deployment platform.
- Example: `export const preferredRegion = // string || string[]`

### `01-app/03-api-reference/03-file-conventions/02-route-segment-config/prefetch.md` — prefetch
- Configure how a route segment is prefetched during client navigation.
- Sections: Options · 'partial' · 'force-disabled' · Relationship with the <Link prefetch> prop · TypeScript
- The `prefetch` route segment config controls how a segment is prefetched during client-side navigation. By default, the framework manages the strategy based on the app's `partialPr
- - The `prefetch` export only works when `cacheComponents` is enabled.
- History: v16.3.0: `prefetch` export stabilized, replacing `unstable_prefetch` (Cache Components only).
- Example: `export const prefetch = 'partial' export default function Page() { return <div>...</div> }`

### `01-app/03-api-reference/03-file-conventions/02-route-segment-config/runtime.md` — runtime
- API reference for the runtime route segment config option.
- The `runtime` option allows you to select the JavaScript runtime used for rendering your route.
- - **`'nodejs'`** (default)
- Example: `export const runtime = 'nodejs' // 'nodejs'`

### `01-app/03-api-reference/03-file-conventions/default.md` — default.js
- API Reference for the default.js file.
- Sections: Reference · params (optional)
- The `default.js` file is used to render a fallback within Parallel Routes when Next.js cannot recover a slot's active state after a full-page load.
- During soft navigation, Next.js keeps track of the active _state_ (subpage) for each slot. However, for hard navigations (full-page load), Next.js cannot recover the active state. 
- Example: `import { notFound } from 'next/navigation' export default function Default() { notFound() }`

### `01-app/03-api-reference/03-file-conventions/dynamic-routes.md` — Dynamic Route Segments
- Use Dynamic Segments to read URL path params and generate routes from dynamic data.
- Sections: Convention · In Client Components · Catch-all Segments · Optional Catch-all Segments · TypeScript · Behavior · With Cache Components · With generateStaticParams
- A URL path is a sequence of path segments. In the App Router, a segment may be **static** (a literal value matched exactly) or **dynamic** (a placeholder that captures a value from
- **Good to know**: Dynamic Segments are often referred to as path params, route params, or URL params.
- Example: `export default async function Page({ params, }: { params: Promise<{ slug: string }> }) { const { slug } = await params return <div>My Post: {slug}</div> }`

### `01-app/03-api-reference/03-file-conventions/error.md` — error.js
- API reference for the error.js special file.
- Sections: Reference · Props · Global Error · Graceful error recovery with a custom error boundary
- An **error** file allows you to handle unexpected runtime errors and display fallback UI.
- `error.js` wraps a route segment and its nested children in a [React Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary). 
- History: v16.3.0: `retry` prop became stable.; v16.2.0: `unstable_retry` prop added.; v15.2.0: Also display `global-error` in development.; v13.1.0: `global-error` introduced.

### `01-app/03-api-reference/03-file-conventions/forbidden.md` — forbidden.js [experimental]
- API reference for the forbidden.js special file.
- Sections: Reference · Props
- The **forbidden** file renders UI when the `forbidden` function is invoked.
- Before streaming starts, Next.js returns a `403` status code. After streaming starts, the status code remains `200` and the forbidden UI renders in the response. Next.js injects a 
- History: v15.1.0: `forbidden.js` introduced.

### `01-app/03-api-reference/03-file-conventions/index.md` — File-system conventions
- API Reference for Next.js file-system conventions.

### `01-app/03-api-reference/03-file-conventions/instrumentation-client.md` — instrumentation-client.js
- Learn how to add client-side instrumentation to track and monitor your Next.js application's frontend performance.
- Sections: Usage · Router navigation tracking · Performance considerations · Execution timing · See also · Error tracking · Analytics tracking · Performance monitoring
- The `instrumentation-client.js|ts` file allows you to add monitoring, analytics code, and other side-effects that run before your application becomes interactive. This is useful fo
- To use it, place the file in the **root** of your application or inside a `src` folder.
- History: v16.3.0: Experimental router transition start event introduced; v15.3: `instrumentation-client` introduced
- Example: `export function onRouterTransitionStart( url: string, navigationType: 'push' | 'replace' | 'traverse' ) { console.log(url, navigationType) }`

### `01-app/03-api-reference/03-file-conventions/instrumentation.md` — instrumentation.js
- API reference for the instrumentation.js file.
- Sections: Exports · register (optional) · onRequestError (optional) · Specifying the runtime
- The `instrumentation.js|ts` file is used to integrate observability tools into your application, allowing you to track the performance and behavior, and to debug issues in producti
- To use it, place the file in the **root** of your application or inside a `src` folder if using one.
- History: v15.0.0: `onRequestError` introduced, `instrumentation` stable; v14.0.4: Turbopack support for `instrumentation`; v13.2.0: `instrumentation` introduced as an experimental feature
- Example: `import { registerOTel } from '@vercel/otel' export function register() { registerOTel('next-app') }`

### `01-app/03-api-reference/03-file-conventions/intercepting-routes.md` — Intercepting Routes
- Use intercepting routes to load a new route within the current layout while masking the browser URL, useful for advanced routing patterns such as modals.
- Sections: Convention · Modals
- Intercepting routes allows you to load a route from another part of your application within the current layout. This routing paradigm can be useful when you want to display the con
- For example, when clicking on a photo in a feed, you can display the photo in a modal, overlaying the feed. In this case, Next.js intercepts the `/photo/123` route, masks the URL, 

### `01-app/03-api-reference/03-file-conventions/layout.md` — layout.js
- API reference for the layout.js file.
- Sections: Reference · Props · Layout Props Helper · Root Layout · Caveats · Request Object · Query params · Pathname
- The `layout` file is used to define a layout in your Next.js application.
- In the component hierarchy, `layout.js` is the outermost component in a route segment. It wraps `template.js`, `error.js`, `loading.js`, `not-found.js`, and `page.js`.
- History: v15.0.0-RC: `params` is now a promise. A codemod is available.; v13.0.0: `layout` introduced.
- Example: `export default function DashboardLayout({ children, }: { children: React.ReactNode }) { return <section>{children}</section> }`

### `01-app/03-api-reference/03-file-conventions/loading.md` — loading.js
- API reference for the loading.js file.
- Sections: Reference · Parameters · Behavior · Navigation · Instant Loading States · SEO · Status codes · Browser limits
- The special file `loading.js` helps you create meaningful Loading UI with [React Suspense](https://react.dev/reference/react/Suspense). With this convention, you can show an instan
- Inside the `loading.js` file, you can add any light-weight loading UI. You may find it helpful to use the [React Developer Tools](https://react.dev/learn/react-developer-tools) to 
- History: v13.0.0: `loading` introduced.
- Example: `export default function Loading() { // Or a custom loading skeleton component return <p>Loading...</p> }`

### `01-app/03-api-reference/03-file-conventions/mdx-components.md` — mdx-components.js
- API reference for the mdx-components.js file.
- Sections: Exports · useMDXComponents function
- The `mdx-components.js|tsx` file is **required** to use `@next/mdx` with App Router and will not work without it. Additionally, you can use it to customize styles.
- Use the file `mdx-components.tsx` (or `.js`) in the root of your project to define MDX Components. For example, at the same level as `pages` or `app`, or inside `src` if applicable
- History: v13.1.2: MDX Components added
- Example: `import type { MDXComponents } from 'mdx/types' const components: MDXComponents = {} export function useMDXComponents(): MDXComponents { return components }`

### `01-app/03-api-reference/03-file-conventions/middleware.md` — middleware.js [draft]
- API reference for the middleware.js file (deprecated, renamed to proxy.js).
- The `middleware.js` file convention has been **deprecated** in Next.js 16 and renamed to `proxy.js`.
- All functionality remains the same — only the file and export names have changed. See the Migration to Proxy section for details on how to migrate.
- Example: `npx @next/codemod@canary middleware-to-proxy .`

### `01-app/03-api-reference/03-file-conventions/not-found.md` — not-found.js
- API reference for the not-found.js file.
- Sections: not-found.js · global-not-found.js (experimental) · Reference · Props · Data Fetching · Metadata
- Next.js provides two conventions to handle not found cases:
- - **`not-found.js`**: Used when you call the `notFound` function in a route segment.
- History: v15.4.0: `global-not-found.js` introduced (experimental).; v13.3.0: Root `app/not-found` handles global unmatched URLs.; v13.0.0: `not-found` introduced.
- Example: `import Link from 'next/link' export default function NotFound() { return ( <div> <h2>Not Found</h2> <p>Could not find requested resource</p> <Link href="/">Retu`

### `01-app/03-api-reference/03-file-conventions/page.md` — page.js
- API reference for the page.js file.
- Sections: Good to know · Reference · Props · Page Props Helper · Displaying content based on params · Handling filtering with searchParams · Reading searchParams and params in Client Components
- The `page` file allows you to define UI that is **unique** to a route. You can create a page by default exporting a component from the file:
- - The `.js`, `.jsx`, or `.tsx` file extensions can be used for `page`.
- History: v15.0.0-RC: `params` and `searchParams` are now promises. A codemod is available.; v13.0.0: `page` introduced.
- Example: `export default function Page({ params, searchParams, }: { params: Promise<{ slug: string }> searchParams: Promise<{ [key: string]: string | string[] | undefined`

### `01-app/03-api-reference/03-file-conventions/parallel-routes.md` — Parallel Routes
- Simultaneously render one or more pages in the same view that can be navigated independently. A pattern for highly dynamic applications.
- Sections: Convention · Slots · default.js · Behavior · With useSelectedLayoutSegment(s) · Conditional Routes · Tab Groups · Modals
- Parallel Routes allows you to simultaneously or conditionally render one or more pages within the same layout. They are useful for highly dynamic sections of an app, such as dashbo
- For example, considering a dashboard, you can use parallel routes to simultaneously render the `team` and `analytics` pages:
- Example: `export default function Layout({ children, team, analytics }) { return ( <> {children} {team} {analytics} </> ) }`

### `01-app/03-api-reference/03-file-conventions/proxy.md` — proxy.js
- API reference for the proxy.js file.
- Sections: Exports · Proxy function · Config object (optional) · Matcher · Params · request · event · NextProxy type
- **Note**: The `middleware` file convention is deprecated and has been renamed to `proxy`. See Migration to Proxy for more details.
- The `proxy.js|ts` file is used to write Proxy and run code on the server before a request is completed. Then, based on the incoming request, you can modify the response by rewritin
- History: v16.0.0: Middleware is deprecated and renamed to Proxy. Proxy defaults to the Node.js runtime; v15.5.0: Middleware can now use the Node.js runtime (stable); v15.2.0: Middleware can now use the Node.js runtime (experimental); v13.1.0: Advanced Middleware flags added
- Example: `// Example of default export export default function proxy(request) { // Proxy logic }`

### `01-app/03-api-reference/03-file-conventions/public-folder.md` — public Folder
- Next.js allows you to serve static files, like images, in the public directory. You can learn how it works here.
- Sections: Caching · Robots, Favicons, and others
- Next.js can serve static files, like images, under a folder called `public` in the root directory. Files inside `public` can then be referenced by your code starting from the base 
- For example, the file `public/avatars/me.png` can be viewed by visiting the `/avatars/me.png` path. The code to display that image might look like:
- Example: `Cache-Control: public, max-age=0`

### `01-app/03-api-reference/03-file-conventions/route-go.md` — route.go [experimental]
- API reference for building experimental Go API endpoints with the route.go file convention.
- Sections: Setup · Reference · HTTP Methods · Parameters · ParamValues · Handler Convention · Development and Errors · Cookies
- `route.go` defines a Go Route Handler (API endpoint) in the App Router using Go's `net/http` request and response APIs.
- - Go Route Handlers require `experimental.goRoutes` and Turbopack. Webpack is unsupported.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { goRoutes: true }, } export default nextConfig`

### `01-app/03-api-reference/03-file-conventions/route-groups.md` — Route Groups
- Route Groups can be used to partition your Next.js application into different sections.
- Sections: Convention · Use cases · Caveats
- Route Groups are a folder convention that let you organize routes by category or team.
- A route group can be created by wrapping a folder's name in parenthesis: `(folderName)`.

### `01-app/03-api-reference/03-file-conventions/route.md` — route.js
- API reference for the route.js special file.
- Sections: Reference · HTTP Methods · Parameters · Route Context Helper · Cookies · Headers · Revalidating Cached Data · Redirects
- Route Handlers allow you to create custom request handlers for a given route using the Web [Request](https://developer.mozilla.org/docs/Web/API/Request) and [Response](https://deve
- A **route** file allows you to create custom request handlers for a given route. The following [HTTP methods](https://developer.mozilla.org/docs/Web/HTTP/Methods) are supported: `G
- History: v15.0.0-RC: `context.params` is now a promise. A codemod is available; v15.0.0-RC: The default caching for `GET` handlers was changed from static to dynamic; v13.2.0: Route Handlers are introduced.
- Example: `export async function GET() { return Response.json({ message: 'Hello World' }) }`

### `01-app/03-api-reference/03-file-conventions/src-folder.md` — src Folder
- Save pages under the `src` folder as an alternative to the root `pages` directory.
- As an alternative to having the special Next.js `app` or `pages` directories in the root of your project, Next.js also supports the common pattern of placing application code under
- This separates application code from project configuration files which mostly live in the root of a project, which is preferred by some individuals and teams.

### `01-app/03-api-reference/03-file-conventions/template.md` — template.js
- API Reference for the template.js file.
- Sections: Convention · Props · children (required) · Behavior · Templates during navigation and remounting
- A **template** file is similar to a layout in that it wraps a layout or page. Unlike layouts that persist across routes and maintain state, templates are given a unique key, meanin
- They are useful when you need to:
- History: v13.0.0: `template` introduced.
- Example: `export default function Template({ children }: { children: React.ReactNode }) { return <div>{children}</div> }`

### `01-app/03-api-reference/03-file-conventions/unauthorized.md` — unauthorized.js [experimental]
- API reference for the unauthorized.js special file.
- Sections: Reference · Props · Displaying login UI to unauthenticated users
- The **unauthorized** file renders UI when the `unauthorized` function is invoked.
- Before streaming starts, Next.js returns a `401` status code. After streaming starts, the status code remains `200` and the unauthorized UI renders in the response. Next.js injects
- History: v15.1.0: `unauthorized.js` introduced.

### `01-app/03-api-reference/04-functions/after.md` — after
- API Reference for the after function.
- Sections: Reference · Parameters · Duration · Good to know · With request APIs · Platform Support
- `after` allows you to schedule work to be executed after a response (or prerender) is finished. This is useful for tasks and other side effects that should not block the response, 
- It can be used in Server Components (including `generateMetadata`), Server Functions, Route Handlers, and Proxy.
- History: v15.1.0: `after` became stable.; v15.0.0-rc: `unstable_after` introduced.
- Example: `const RequestContext = globalThis[Symbol.for('@next/request-context')] const contextValue = RequestContext?.get() const waitUntil = contextValue?.waitUntil`

### `01-app/03-api-reference/04-functions/cacheLife.md` — cacheLife
- Learn how to use the cacheLife function to set the cache expiration time for a cached function or component.
- Sections: Usage · Basic setup · Using preset profiles · Reference · Cache profile properties · Preset cache profiles · Overriding the default cache profiles · Custom cache profiles
- The `cacheLife` function is used to set the cache lifetime of a function or component. It should be used alongside the `use cache` directive, and within the scope of the function o
- To use `cacheLife`, first enable the `cacheComponents` flag in your `next.config.js` file:
- History: v16.0.0: `cacheLife` stabilized. `unstable_cacheLife` deprecated.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { cacheComponents: true, } export default nextConfig`

### `01-app/03-api-reference/04-functions/cacheTag.md` — cacheTag
- Learn how to use the cacheTag function to manage cache invalidation in your Next.js application.
- Sections: Usage · Good to know · Tagging components or functions · Creating tags from external data · Invalidating tagged cache
- The `cacheTag` function allows you to tag cached data for on-demand invalidation. By associating tags with cache entries, you can selectively purge or revalidate specific cache ent
- To use `cacheTag`, enable the `cacheComponents` flag in your `next.config.js` file:
- History: v16.0.0: `cacheTag` stabilized. `unstable_cacheTag` deprecated.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { cacheComponents: true, } export default nextConfig`

### `01-app/03-api-reference/04-functions/catchError.md` — catchError
- API Reference for the catchError function.
- Sections: Reference · Parameters · Returns · Basic usage · Recovering from errors · Server-rendered error fallback
- The `catchError` function creates a component that wraps its children in an error boundary. It provides a programmatic alternative to the `error.js` file convention, enabling compo
- Compared to a custom React error boundary, `catchError` is designed to work with Next.js out of the box:
- History: v16.3.0: `catchError` became stable.; v16.2.0: `unstable_catchError` introduced.
- Example: `const ErrorWrapper = catchError(fallback)`

### `01-app/03-api-reference/04-functions/connection.md` — connection
- API Reference for the connection function.
- Sections: Synchronous database drivers · Reference · Type · Parameters · Returns · Good to know
- The `connection()` function allows you to indicate rendering should wait for an incoming user request before continuing.
- It's useful when a component doesn't use Request-time APIs like `cookies` or `headers`, but still needs to produce different output per request, such as `Math.random()` or `new Dat
- History: v15.0.0: `connection` stabilized.; v15.0.0-RC: `connection` introduced.
- Example: `function connection(): Promise<void>`

### `01-app/03-api-reference/04-functions/cookies.md` — cookies
- API Reference for the cookies function.
- Sections: Reference · Methods · Options · Good to know · Understanding Cookie Behavior in Server Components · Understanding Cookie Behavior in Server Functions · Getting a cookie · Getting all cookies
- `cookies` is an **async** function that allows you to read the HTTP incoming request cookies in Server Components, and read/write outgoing request cookies in Server Functions or Ro
- The following methods are available:
- History: v15.0.0-RC: `cookies` is now an async function. A codemod is available.; v13.0.0: `cookies` introduced.
- Example: `import { cookies } from 'next/headers' export default async function Page() { const cookieStore = await cookies() const theme = cookieStore.get('theme') return `

### `01-app/03-api-reference/04-functions/draft-mode.md` — draftMode
- API Reference for the draftMode function.
- Sections: Reference · Good to know · Enabling Draft Mode · Disabling Draft Mode · Checking if Draft Mode is enabled
- `draftMode` is an **async** function allows you to enable and disable Draft Mode, as well as check if Draft Mode is enabled in a Server Component.
- The following methods and properties are available:
- History: v15.0.0-RC: `draftMode` is now an async function. A codemod is available.; v13.4.0: `draftMode` introduced.
- Example: `import { draftMode } from 'next/headers' export default async function Page() { const { isEnabled } = await draftMode() }`

### `01-app/03-api-reference/04-functions/fetch.md` — fetch
- API reference for the extended fetch function.
- Sections: fetch(url, options) · options.cache · options.next.revalidate · options.next.tags · Memoization · Troubleshooting · Fetch default auto no cache and cache: 'no-store' not showing fresh data in development · Hard refresh and caching in development
- Next.js extends the [Web `fetch()` API](https://developer.mozilla.org/docs/Web/API/Fetch_API) to allow each request on the server to set its own persistent caching and revalidation
- In the browser, the `cache` option indicates how a fetch request will interact with the _browser's_ HTTP cache. With this extension, `cache` indicates how a _server-side_ fetch req
- History: v13.0.0: `fetch` introduced.
- Example: `fetch(`https://...`, { cache: 'force-cache' | 'no-store' })`

### `01-app/03-api-reference/04-functions/forbidden.md` — forbidden [experimental]
- API Reference for the forbidden function.
- Sections: Good to know · Calling forbidden() after streaming has started · Role-based route protection · Mutations with Server Actions
- The `forbidden` function throws an error that renders the forbidden UI. It's useful for handling authorization errors in your application. You can customize the UI using the `forbi
- Invoking `forbidden()` throws a `NEXT_HTTP_ERROR_FALLBACK;403` error and terminates rendering of the route segment where it was thrown. Next.js also injects a `<meta name="robots" 
- History: v15.1.0: `forbidden` introduced.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { authInterrupts: true, }, } export default nextConfig`

### `01-app/03-api-reference/04-functions/generate-image-metadata.md` — generateImageMetadata
- Learn how to generate multiple images in a single Metadata API special file.
- Sections: Parameters · Returns · Image generation function props
- You can use `generateImageMetadata` to generate different versions of one image or return multiple images for one route segment. This is useful for when you want to avoid hard-codi
- `generateImageMetadata` function accepts the following parameters:
- History: v16.0.0: `id` passed to the Image generation function is now a promise that resolves to `string` or `number`; v16.0.0: `params` passed to the Image generation function is now a promise that resolves to an object; v13.3.0: `generateImageMetadata` introduced.
- Example: `export function generateImageMetadata({ params, }: { params: { slug: string } }) { // ... }`

### `01-app/03-api-reference/04-functions/generate-metadata.md` — generateMetadata
- Learn how to add Metadata to your Next.js application for improved search engine optimization (SEO) and web shareability.
- Sections: The metadata object · generateMetadata function · Why generateMetadata is Server Component only · Reference · Parameters · Returns · Metadata Fields · title
- You can use the `metadata` object or the `generateMetadata` function to define metadata.
- To define static metadata, export a `Metadata` object from a `layout.js` or `page.js` file.
- History: v15.2.0: Introduced streaming support to `generateMetadata`.; v14.0.0: `viewport`, `themeColor`, and `colorScheme` deprecated in favor of the `viewport` configuration.; v13.2.0: `metadata` and `generateMetadata` introduced.
- Example: `import type { Metadata } from 'next' export const metadata: Metadata = { title: '...', description: '...', } export default function Page() {}`

### `01-app/03-api-reference/04-functions/generate-sitemaps.md` — generateSitemaps
- Learn how to use the generateSitemaps function to create multiple sitemaps for your application.
- Sections: Returns · URLs
- You can use the `generateSitemaps` function to generate multiple sitemaps for your application.
- The `generateSitemaps` returns an array of objects with an `id` property.
- History: v16.0.0: The `id` values returned from `generateSitemaps` are now passed as a promise that resolves to a `string` to the sitemap ; v15.0.0: `generateSitemaps` now generates consistent URLs between development and production; v13.3.2: `generateSitemaps` introduced. In development, you can view the generated sitemap on `/.../sitemap.xml/[id]`. For exampl

### `01-app/03-api-reference/04-functions/generate-static-params.md` — generateStaticParams
- API reference for the generateStaticParams function.
- Sections: Parameters · Returns · Single Dynamic Segment · Multiple Dynamic Segments · Catch-all Dynamic Segment · Prerendering · With Route Handlers · Route Handlers with Cache Components
- The `generateStaticParams` function can be used in combination with dynamic route segments to **statically generate** routes at build time instead of on-demand at request time.
- `generateStaticParams` can be used with:
- History: v13.0.0: `generateStaticParams` introduced.
- Example: `export async function generateStaticParams() { const posts = await fetch('https://.../posts').then((res) => res.json()) return posts.map((post) => ({ slug: post`

### `01-app/03-api-reference/04-functions/generate-viewport.md` — generateViewport
- API Reference for the generateViewport function.
- Sections: The viewport object · generateViewport function · Viewport Fields · themeColor · width, initialScale, maximumScale and userScalable · viewportFit · colorScheme · With Cache Components
- You can customize the initial viewport of the page with the static `viewport` object or the dynamic `generateViewport` function.
- - The `viewport` object and `generateViewport` function exports are **only supported in Server Components**.
- History: v14.0.0: `viewport` and `generateViewport` introduced.
- Example: `import type { Viewport } from 'next' export const viewport: Viewport = { themeColor: 'black', } export default function Page() {}`

### `01-app/03-api-reference/04-functions/headers.md` — headers
- API reference for the headers function.
- Sections: Reference · Parameters · Returns · Good to know · Using the Authorization header
- `headers` is an **async** function that allows you to **read** the HTTP incoming request headers from a Server Component.
- `headers` does not take any parameters.
- History: v15.0.0-RC: `headers` is now an async function. A codemod is available.; v13.0.0: `headers` introduced.
- Example: `import { headers } from 'next/headers' export default async function Page() { const headersList = await headers() const userAgent = headersList.get('user-agent'`

### `01-app/03-api-reference/04-functions/image-optimizer-transform.md` — next/experimental/image-optimizer-transform [experimental]
- API Reference for the next/experimental/image-optimizer-transform module, the standalone sharp-based image resizing and format conversion pipeline behind Next.js Image Optimization.
- Sections: Reference · imageOptimizerTransform · getMaxAge · getSharp · ImageError · Good to know · Optimizing a fetched image · Configuring sharp with getSharp
- The `next/experimental/image-optimizer-transform` module exposes the transformation step of Next.js Image Optimization as a standalone Node.js module with a small dependency graph,
- Validates an upstream image, optimizes it with sharp, and returns the result with caching metadata.
- Example: `async function imageOptimizerTransform( imageUpstream: ImageUpstream, paramsResult: ImageOptimizerTransformParams, opts?: ImageOptimizerTransformOptions ): Prom`

### `01-app/03-api-reference/04-functions/image-response.md` — ImageResponse
- API Reference for the ImageResponse constructor.
- Sections: Reference · Parameters · Supported HTML and CSS features · Behavior · Route Handlers · File-based Metadata · Custom fonts
- The `ImageResponse` constructor allows you to generate dynamic images using JSX and CSS. This is useful for generating social media images such as Open Graph images, Twitter cards,
- The following parameters are available for `ImageResponse`:
- History: v14.0.0: `ImageResponse` moved from `next/server` to `next/og`; v13.3.0: `ImageResponse` can be imported from `next/server`.; v13.0.0: `ImageResponse` introduced via `@vercel/og` package.

### `01-app/03-api-reference/04-functions/index.md` — Functions
- API Reference for Next.js Functions and Hooks.

### `01-app/03-api-reference/04-functions/io.md` — io
- API Reference for the io function.
- Sections: Usage · When you don't need io() · Synchronous IO after request data · How io() differs from connection() · Reference · Type · Parameters · Returns
- When Cache Components is enabled, Next.js needs you to decide whether to capture a synchronous value like `new Date()` or `Math.random()` once and reuse it for every visitor, or pr
- To capture the value in the static shell, wrap it in `"use cache"`. To keep it out of the static shell, use `await io()`, which suspends during prerendering.
- History: v16.3.0: `io` added.
- Example: `'use client' import { use } from 'react' import { io } from 'next/cache' export function CurrentTime() { use(io()) return <div>{Date.now()}</div> }`

### `01-app/03-api-reference/04-functions/navigation.md` — navigation
- Defer runtime work until the user navigates with the navigation function.
- Sections: Usage · How navigation() differs from connection() · When to use it · Keeping a route's prefetch static · Good to know · Reference · Type · Parameters
- Calling `await navigation()` keeps runtime work below it out of the App Shell and per-link prefetches. The work runs when the user navigates, while the fallback of the nearest [`<S
- Use `navigation()` for reusable content that is expensive to generate and should wait until navigation. Static prerenders still include the content in their output, so it can appea
- History: v16.4.0: `navigation` introduced, replacing the `unstable_navigation` name used in earlier canary releases.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { cacheComponents: true, partialPrefetching: true, } export default nextConfig`

### `01-app/03-api-reference/04-functions/next-request.md` — NextRequest
- API Reference for NextRequest.
- Sections: cookies · set(name, value) · get(name) · getAll() · delete(name) · has(name) · clear() · nextUrl
- NextRequest extends the [Web Request API](https://developer.mozilla.org/docs/Web/API/Request) with additional convenience methods.
- Read or mutate the [`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie) header of the request.
- History: v15.0.0: `ip` and `geo` removed.
- Example: `// Given incoming request /home // Set a cookie to hide the banner // request will have a `Set-Cookie:show-banner=false;path=/home` header request.cookies.set('`

### `01-app/03-api-reference/04-functions/next-response.md` — NextResponse
- API Reference for NextResponse.
- Sections: cookies · set(name, value) · get(name) · getAll() · has(name) · delete(name) · json() · redirect()
- NextResponse extends the [Web Response API](https://developer.mozilla.org/docs/Web/API/Response) with additional convenience methods.
- Read or mutate the [`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie) header of the response.
- Example: `// Given incoming request /home let response = NextResponse.next() // { name: 'show-banner', value: 'false', Path: '/home' } response.cookies.get('show-banner')`

### `01-app/03-api-reference/04-functions/next-root-params.md` — next/root-params
- API Reference for the next/root-params module that provides access to root-level route parameters.
- Sections: Root parameters and generateStaticParams · Reading root parameters in a nested generateStaticParams · Root parameters and other route parameters · Accessing root parameters in shared code · Behavior with caching directives · Multiple root layouts · Catch-all and optional catch-all segments · Returns
- The `next/root-params` module provides getter functions for accessing root-level parameters in **Server Components**. Each root parameter is exported as an async function that reso
- The export names are generated from your dynamic segment folder names. For example, if your root layout is inside `app/[locale]`, you import `locale` from `next/root-params`.
- History: v16.3.0: `next/root-params` introduced.
- Example: `import { lang } from 'next/root-params' export default async function RootLayout(props: LayoutProps<'/[lang]'>) { return ( <html lang={await lang()}> <body>{pro`

### `01-app/03-api-reference/04-functions/not-found.md` — notFound
- API Reference for the notFound function.
- Sections: Good to know · Calling notFound() after streaming has started · Serving a 404 from a Route Handler
- The `notFound` function throws an error that renders the not-found UI. It's useful for handling missing resources in your application. You can customize the UI using the `not-found
- Invoking `notFound()` throws a `NEXT_HTTP_ERROR_FALLBACK;404` error and terminates rendering of the route segment where it was thrown. Next.js also injects a `<meta name="robots" c
- History: v13.0.0: `notFound` introduced.
- Example: `// fetchUser resolves to a user object, or undefined const user = await fetchUser(id) if (!user) { notFound() } // user is defined here return <Profile user={us`

### `01-app/03-api-reference/04-functions/permanentRedirect.md` — permanentRedirect
- API Reference for the permanentRedirect function.
- Sections: Parameters · Returns · Behavior
- The `permanentRedirect` function allows you to redirect the user to another URL. `permanentRedirect` can be used in Server Components, Client Components, Route Handlers, and Server
- When used in a streaming context, this will insert a meta tag to emit the redirect on the client side. In a Server Action, `permanentRedirect` performs a client-side navigation whe
- Example: `permanentRedirect(path, type)`

### `01-app/03-api-reference/04-functions/prefetch.md` — prefetch
- Defer runtime work until a per-link prefetch or navigation with the prefetch function.
- Sections: Usage · How prefetch() differs from connection() · When to use it · Keeping the App Shell static · Good to know · Reference · Type · Parameters
- Calling `await prefetch()` keeps runtime work below it out of the route's App Shell. The work can run during a per-link prefetch or navigation, while the fallback of the nearest [`
- Use `prefetch()` for content that the App Shell would otherwise render but that is expensive to generate. Static prerenders still include the content in their output.
- History: v16.4.0: `prefetch` introduced, replacing the `unstable_prefetch` name used in earlier canary releases.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { cacheComponents: true, partialPrefetching: true, } export default nextConfig`

### `01-app/03-api-reference/04-functions/redirect.md` — redirect
- API Reference for the redirect function.
- Sections: Reference · Parameters · Returns · Behavior · Server Component · Client Component · FAQ · Why does redirect use 307 and 308?
- The `redirect` function allows you to redirect the user to another URL. `redirect` can be used while rendering in Server and Client Components, Route Handlers, and Server Functions
- When used in a streaming context, this will insert a meta tag to emit the redirect on the client side. In a Server Action, `redirect` performs a client-side navigation when JavaScr
- History: v13.0.0: `redirect` introduced.
- Example: `redirect(path, type)`

### `01-app/03-api-reference/04-functions/refresh.md` — refresh
- API Reference for the refresh function.
- Sections: Usage · Client cache behavior · Parameters · Returns · Error when used outside Server Actions
- `refresh` reruns dynamic work for the current route from a Server Action without invalidating server-side cached data.
- `refresh` can **only** be called from Server Actions. Use `router.refresh()` in Client Components. It cannot be used in Route Handlers or other contexts.
- Example: `refresh(): void;`

### `01-app/03-api-reference/04-functions/revalidatePath.md` — revalidatePath
- API Reference for the revalidatePath function.
- Sections: Usage · Parameters · Returns · What can be invalidated · Using revalidatePath with rewrites · Relationship with revalidateTag and updateTag · Building revalidation utilities · Revalidating a specific path
- `revalidatePath` allows you to invalidate cached data on-demand for a specific path.
- `revalidatePath` can be called in Server Functions and Route Handlers.
- Example: `revalidatePath(path: string, type?: 'page' | 'layout'): void;`

### `01-app/03-api-reference/04-functions/revalidateTag.md` — revalidateTag
- API Reference for the revalidateTag function.
- Sections: Usage · Revalidation Behavior · Client cache behavior · Parameters · Returns · Relationship with revalidatePath · Server Action · Route Handler
- `revalidateTag` allows you to invalidate cached data on-demand for a specific cache tag.
- This function is ideal for content where a slight delay in updates is acceptable, such as blog posts, product catalogs, or documentation. With the recommended `max` profile, users 
- Example: `revalidateTag(tag: string, profile: string | { expire?: number }): void;`

### `01-app/03-api-reference/04-functions/unauthorized.md` — unauthorized [experimental]
- API Reference for the unauthorized function.
- Sections: Good to know · Calling unauthorized() after streaming has started · Displaying login UI to unauthenticated users · Mutations with Server Actions · Fetching data with Route Handlers
- The `unauthorized` function throws an error that renders the unauthorized UI. It's useful for handling authentication errors when a request is not signed in. You can customize the 
- Invoking `unauthorized()` throws a `NEXT_HTTP_ERROR_FALLBACK;401` error and terminates rendering of the route segment where it was thrown. Next.js also injects a `<meta name="robot
- History: v15.1.0: `unauthorized` introduced.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { authInterrupts: true, }, } export default nextConfig`

### `01-app/03-api-reference/04-functions/unstable_cache.md` — unstable_cache
- API Reference for the unstable_cache function.
- Sections: Unsupported operations · Parameters · Returns
- For most use cases, `use cache` replaces this API in Next.js 16. We recommend opting into Cache Components and migrating to the `use cache` directive.
- Continue using `unstable_cache` for non-`fetch` data that must persist across deployments. Cached entries from `use cache` and `use cache: remote` do not carry over to a new deploy
- History: v14.0.0: `unstable_cache` introduced.
- Example: `const data = unstable_cache(fetchData, keyParts, options)()`

### `01-app/03-api-reference/04-functions/unstable_noStore.md` — unstable_noStore [legacy]
- API Reference for the unstable_noStore function.
- Sections: Usage
- **In version 15, we recommend using `connection` instead of `unstable_noStore`.**
- `unstable_noStore` can be used to declaratively opt out of prerendering and indicate a particular component should not be cached.
- History: v15.0.0: `unstable_noStore` deprecated for `connection`.; v14.0.0: `unstable_noStore` introduced.
- Example: `import { unstable_noStore as noStore } from 'next/cache'; export default async function ServerComponent() { noStore(); const result = await db.query(...); ... }`

### `01-app/03-api-reference/04-functions/unstable_rethrow.md` — unstable_rethrow [unstable]
- API Reference for the unstable_rethrow function.
- `unstable_rethrow` can be used to avoid catching internal errors thrown by Next.js when attempting to handle errors thrown in your application code.
- For example, calling the `notFound` function will throw an internal Next.js error and render the `not-found.js` component. However, if used inside the `try` block of a `try/catch` 

### `01-app/03-api-reference/04-functions/updateTag.md` — updateTag
- API Reference for the updateTag function.
- Sections: Usage · Client cache behavior · Parameters · Returns · Differences from revalidateTag · Server Action with Read-Your-Own-Writes · Error when used outside Server Actions · When to use updateTag
- `updateTag` allows you to update cached data on-demand for a specific cache tag from within Server Actions.
- This function is designed for **read-your-own-writes** scenarios, where a user makes a change (like creating a post), and the UI immediately shows the change, rather than stale dat
- Example: `updateTag(tag: string): void;`

### `01-app/03-api-reference/04-functions/use-link-status.md` — useLinkStatus
- API Reference for the useLinkStatus hook.
- Sections: You might not need useLinkStatus · Parameters · Returns · Inline link hint · Gracefully handling fast navigation
- The `useLinkStatus` hook lets you track the **pending** state of a `<Link>`. Use it for subtle, inline feedback, for example a shimmer effect over the clicked link, while navigatio
- `useLinkStatus` is useful when:
- History: v15.3.0: `useLinkStatus` introduced.
- Example: `const { pending } = useLinkStatus()`

### `01-app/03-api-reference/04-functions/use-offline.md` — useOffline [experimental]
- API Reference for the useOffline hook.
- Sections: Parameters · Returns · Show an offline banner · Offline-aware Suspense fallback
- The `useOffline` hook returns a boolean indicating whether the app is currently offline. Use it to render connectivity-aware UI, such as a banner when the user loses their network 
- The hook is one piece of a larger feature. Enabling the `experimental.useOffline` config option turns on offline connectivity detection and automatic retry of blocked navigation, p
- History: v16.x.0: `useOffline` hook introduced.
- Example: `module.exports = { experimental: { useOffline: true, }, }`

### `01-app/03-api-reference/04-functions/use-params.md` — useParams
- API Reference for the useParams hook.
- Sections: Parameters · Returns · Behavior · Cache Components
- `useParams` is a **Client Component** hook that lets you read a route's dynamic params filled in by the current URL.
- `useParams` does not take any parameters.
- History: v13.3.0: `useParams` introduced.
- Example: `const params = useParams()`

### `01-app/03-api-reference/04-functions/use-pathname.md` — usePathname
- API Reference for the usePathname hook.
- Sections: Parameters · Returns · Behavior · Cache Components · Do something in response to a route change · Avoid hydration mismatch with rewrites
- `usePathname` is a **Client Component** hook that lets you read the current URL's **pathname**.
- `usePathname` intentionally requires using a Client Component. It's important to note Client Components are not a de-optimization. They are an integral part of the Server Component
- Example: `'use client' import { usePathname } from 'next/navigation' export default function ExampleClientComponent() { const pathname = usePathname() return <p>Current p`

### `01-app/03-api-reference/04-functions/use-report-web-vitals.md` — useReportWebVitals
- Measure Core Web Vitals (LCP, CLS, INP) plus FCP and TTFB, and report them to any analytics provider with the `useReportWebVitals` hook.
- Sections: useReportWebVitals · Web Vitals · Custom Metrics · Sending results to external systems
- The `useReportWebVitals` hook allows you to report [Core Web Vitals](https://web.dev/vitals/), and can be used in combination with your analytics service.
- New functions passed to `useReportWebVitals` are called with the available metrics up to that point. To prevent reporting duplicated data, ensure that the callback function referen
- Example: `'use client' import { useReportWebVitals } from 'next/web-vitals' const logWebVitals = (metric) => { console.log(metric) } export function WebVitals() { useRepo`

### `01-app/03-api-reference/04-functions/use-router.md` — useRouter
- API reference for the useRouter hook.
- Sections: useRouter() · router.push() · router.replace() · router.refresh() · router.prefetch() · router.back() · router.forward() · router.bfcacheId
- The `useRouter` hook allows you to programmatically change routes inside Client Components.
- **Recommendation:** Use the `<Link>` component for navigation unless you have a specific requirement for using `useRouter`.
- History: v16.5.0: `kind` option for `router.prefetch` introduced.; v15.4.0: Optional `onInvalidate` callback for `router.prefetch` introduced; v13.0.0: `useRouter` from `next/navigation` introduced.
- Example: `router.push(href: string, { scroll: boolean transitionTypes: string[] })`

### `01-app/03-api-reference/04-functions/use-search-params.md` — useSearchParams
- API Reference for the useSearchParams hook.
- Sections: Parameters · Returns · Behavior · Prerendering · Dynamic Rendering · Server Components · Updating searchParams
- `useSearchParams` is a **Client Component** hook that lets you read the current URL's **query string**.
- `useSearchParams` returns a **read-only** version of the [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) interface.
- History: v13.0.0: `useSearchParams` introduced.
- Example: `const searchParams = useSearchParams()`

### `01-app/03-api-reference/04-functions/use-selected-layout-segment.md` — useSelectedLayoutSegment
- API Reference for the useSelectedLayoutSegment hook.
- Sections: Parameters · Returns · Behavior · Cache Components · Creating an active link component
- `useSelectedLayoutSegment` is a **Client Component** hook that lets you read the active route segment **one level below** the Layout it is called from.
- It is useful for navigation UI, such as tabs inside a parent layout that change style depending on the active child segment.
- History: v13.0.0: `useSelectedLayoutSegment` introduced.
- Example: `'use client' import { useSelectedLayoutSegment } from 'next/navigation' export default function ExampleClientComponent() { const segment = useSelectedLayoutSegm`

### `01-app/03-api-reference/04-functions/use-selected-layout-segments.md` — useSelectedLayoutSegments
- API Reference for the useSelectedLayoutSegments hook.
- Sections: Parameters · Returns · Behavior · Cache Components
- `useSelectedLayoutSegments` is a **Client Component** hook that lets you read the active route segments **below** the Layout it is called from.
- It is useful for creating UI in parent Layouts that need knowledge of active child segments such as breadcrumbs.
- History: v13.0.0: `useSelectedLayoutSegments` introduced.
- Example: `const segments = useSelectedLayoutSegments(parallelRouteKey?: string)`

### `01-app/03-api-reference/04-functions/use-server-inserted-html.md` — useServerInsertedHTML
- API Reference for the useServerInsertedHTML hook.
- Sections: Parameters · Returns · Behavior · The callback runs once per flush · Prefer other options for inline scripts
- The `useServerInsertedHTML` hook lets a **Client Component** inject markup into the HTML document Next.js generates, from anywhere in the tree. It works in the App Router only and 
- The nodes you return are rendered separately from your page, and inserted into the HTML as Next.js generates it. The hook exists for CSS-in-JS style registries, which collect the r
- Example: `useServerInsertedHTML(callback: () => React.ReactNode)`

### `01-app/03-api-reference/04-functions/userAgent.md` — userAgent
- The userAgent helper extends the Web Request API with additional properties and methods to interact with the user agent object from the request.
- Sections: isBot · browser · device · engine · os · cpu
- The `userAgent` helper extends the [Web Request API](https://developer.mozilla.org/docs/Web/API/Request) with additional properties and methods to interact with the user agent obje
- A boolean indicating whether the request comes from a known bot.

### `01-app/03-api-reference/05-config/01-next-config-js/adapterPath.md` — adapterPath
- Configure a custom adapter for Next.js to hook into the build process.
- Sections: Configuration · Adapters · Creating an Adapter · API Reference · Testing Adapters · Routing with @next/routing · Implementing PPR in an Adapter · Runtime Integration
- Next.js provides a built-in adapters API. It allows deployment platforms or build systems to integrate with the Next.js build process.
- For a full reference implementation, see the [`nextjs/adapter-vercel`](https://github.com/nextjs/adapter-vercel) adapter.
- History: v16.2.0: `adapterPath` stabilized and moved from `experimental.adapterPath` to the top-level `adapterPath` option.
- Example: `/** @type {import('next').NextConfig} */ const nextConfig = { adapterPath: require.resolve('./my-adapter.js'), } module.exports = nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/agentFeedback.md` — agentFeedback [experimental]
- Enable a review flow for Next.js issue reports prepared by AI coding agents.
- Sections: Generated agent instructions · Review and send agent feedback · Disable agent feedback
- The `experimental.agentFeedback` option controls whether `next dev` creates and updates instructions that let AI coding agents prepare Next.js issue reports for your review. It is 
- New apps created with the recommended `create-next-app` settings enable agent feedback in the generated Next.js config. For other apps, set the option manually:
- History: v16.5.0: With feedback and telemetry enabled outside CI, `next dev` synchronizes the managed block on every startup.; v16.4.0: `experimental.agentFeedback` configuration option added.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { agentFeedback: true, }, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/agentRules.md` — agentRules
- Configure whether Next.js creates instructions for AI coding agents.
- Sections: Generated agent instructions · Disable agent rules
- The `agentRules` option controls whether `next dev` creates and updates version-matched documentation instructions for AI coding agents. It is enabled by default.
- Set `agentRules` to `false` to disable this behavior:
- History: v16.5.0: `next dev` synchronizes the managed block on every startup.; v16.4.0: Setting `agentRules` to `false` removes an existing managed block on `next dev`.; v16.3.0: `agentRules` configuration option added.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { agentRules: false, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/agentUpgrade.md` — agentUpgrade [experimental]
- Configure coding agent upgrades and reminders.
- Sections: Reminder behavior
- The `experimental.agentUpgrade` option selects the default policy for `next upgrade --agent` and controls upgrade reminders during `next dev` and `next build`. It uses the `securit
- The option accepts these values:
- History: v16.5.0: `next dev` synchronizes the managed upgrade block on every startup.; v16.4.0: `experimental.agentUpgrade` configuration option added.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { agentUpgrade: 'latest', }, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/allowedDevOrigins.md` — allowedDevOrigins
- Use `allowedDevOrigins` to configure additional origins that can request the dev server.
- Next.js blocks cross-origin requests to dev-only assets and endpoints during development by default to prevent unauthorized access.
- To configure a Next.js application to allow requests from origins other than the hostname the server was initialized with (`localhost` by default), use the `allowedDevOrigins` conf
- Example: `module.exports = { allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'], }`

### `01-app/03-api-reference/05-config/01-next-config-js/appDir.md` — appDir [legacy]
- Enable the App Router to use layouts, streaming, and more.
- **Good to know**: This option is **no longer** needed as of Next.js 13.4. The App Router is now stable.
- The App Router (`app` directory) enables support for layouts, Server Components, streaming, and colocated data fetching.

### `01-app/03-api-reference/05-config/01-next-config-js/assetPrefix.md` — assetPrefix
- Learn how to use the assetPrefix config option to configure your CDN.
- Sections: Set up a CDN
- **Attention**: Deploying to Vercel automatically configures a global CDN for your Next.js project.
- You do not need to manually set up an Asset Prefix.

### `01-app/03-api-reference/05-config/01-next-config-js/authInterrupts.md` — authInterrupts [canary]
- Learn how to enable the experimental `authInterrupts` configuration option to use `forbidden` and `unauthorized`.
- The `authInterrupts` configuration option allows you to use `forbidden` and `unauthorized` APIs in your application. While these functions are experimental, you must enable the `au
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { authInterrupts: true, }, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/basePath.md` — basePath
- Use `basePath` to deploy a Next.js application under a sub-path of a domain.
- Sections: Links · Images
- To deploy a Next.js application under a sub-path of a domain you can use the `basePath` config option.
- `basePath` allows you to set a path prefix for the application. For example, to use `/docs` instead of `''` (an empty string, the default), open `next.config.js` and add the `baseP
- Example: `module.exports = { basePath: '/docs', }`

### `01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md` — cacheComponents
- Learn how to enable the cacheComponents flag in Next.js.
- Sections: Usage · Navigation with Activity
- Cache Components enables component and function-level caching using the `use cache` directive. Data fetching is dynamic by default, and you choose what to cache at the page, compon
- To enable the `cacheComponents` flag, set it to `true` in your `next.config.ts` file, together with `partialPrefetching`:
- History: 16.0.0: `cacheComponents` stabilized and moved from `experimental.cacheComponents` to the top-level `cacheComponents` option. Th
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { cacheComponents: true, partialPrefetching: true, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/cacheHandlers.md` — cacheHandlers
- Configure custom cache handlers for use cache directives in Next.js.
- Sections: When to use custom cache handlers · Usage · Handler types · CacheEntry Type · The entry value stream · API Reference · set() · get()
- The `cacheHandlers` configuration allows you to define custom cache storage implementations for `'use cache'` and `'use cache: remote'`. This enables you to store cached components
- **Most applications don't need custom cache handlers.** The default in-memory cache works well in the typical use case.
- History: v16.0.0: `cacheHandlers` stabilized and moved from `experimental.cacheHandlers` to the top-level `cacheHandlers` option.
- Example: `module.exports = { cacheHandlers: { default: require.resolve('./cache-handlers/default-handler.js'), remote: require.resolve('./cache-handlers/remote-handler.js`

### `01-app/03-api-reference/05-config/01-next-config-js/cacheLife.md` — cacheLife
- Learn how to set up cacheLife configurations in Next.js.
- Sections: Usage · Reference
- The `cacheLife` option allows you to define **custom cache profiles** when using the `cacheLife` function inside components or functions, and within the scope of the `use cache` di
- To define a profile, enable the `cacheComponents` flag and add the cache profile in the `cacheLife` object in the `next.config.js` file. For example, a `blog` profile:
- History: v16.0.0: `cacheLife` stabilized and moved from `experimental.cacheLife` to the top-level `cacheLife` option.
- Example: `module.exports = { cacheComponents: true, cacheLife: { blog: { stale: 3600, // 1 hour revalidate: 900, // 15 minutes expire: 86400, // 1 day }, }, }`

### `01-app/03-api-reference/05-config/01-next-config-js/cacheMaxMemorySize.md` — cacheMaxMemorySize
- Configure the size of the in-memory cache that Next.js keeps in each server instance.
- `cacheMaxMemorySize` sets the size, in bytes, of the in-memory cache each Next.js server instance keeps. It defaults to 50 MB.
- The option sizes two separate caches:
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { cacheMaxMemorySize: 50 * 1024 * 1024, // 50 MB, the default } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/compress.md` — compress
- Next.js provides gzip compression to compress rendered content and static files, it only works with the server target. Learn more about it here.
- Sections: Disabling compression
- By default, Next.js uses `gzip` to compress rendered content and static files when using `next start` or a custom server. This is an optimization for applications that do not have 
- You can check if compression is enabled and which algorithm is used by looking at the [`Accept-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)
- Example: `module.exports = { compress: false, }`

### `01-app/03-api-reference/05-config/01-next-config-js/crossOrigin.md` — crossOrigin
- Use the `crossOrigin` option to add a crossOrigin attribute to the `script` tags generated by `next/script`.
- Sections: Options
- Use the `crossOrigin` option to add a [`crossOrigin` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) to all `<script>` tags generated by the `n
- - `'anonymous'`: Adds [`crossOrigin="anonymous"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin#anonymous) attribute.
- Example: `module.exports = { crossOrigin: 'anonymous', }`

### `01-app/03-api-reference/05-config/01-next-config-js/cssChunking.md` — cssChunking [experimental]
- Use the `cssChunking` option to control how CSS files are chunked in your Next.js application.
- Sections: Options · Choosing a strategy · Debugging what a route actually uses · Balancing requests and grouping · How graph decides what to merge
- CSS Chunking is a strategy used to improve the performance of your web application by splitting and re-ordering CSS files into chunks. This lets a route load close to only the CSS 
- You can control how CSS files are chunked using the `experimental.cssChunking` option in your `next.config.js` file:
- Example: `import type { NextConfig } from 'next' const nextConfig = { experimental: { cssChunking: true, // default }, } satisfies NextConfig export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/deploymentId.md` — deploymentId
- Configure a deployment identifier used for version skew protection and cache busting.
- Sections: How it works · Use cases · Rolling deployments · Multi-server environments · Related
- The `deploymentId` option allows you to set an identifier for your deployment. This identifier is used for version skew protection and cache busting during rolling deployments.
- You can also set the deployment ID using the `NEXT_DEPLOYMENT_ID` environment variable:
- History: v16.2.0: Pages Router detects version skew from the response header rather than the build ID, and the build ID is constant when `; v14.1.4: `deploymentId` stabilized as top-level config option.; v13.4.10: `experimental.deploymentId` introduced.
- Example: `module.exports = { deploymentId: 'my-deployment-id', }`

### `01-app/03-api-reference/05-config/01-next-config-js/devIndicators.md` — devIndicators
- Configuration options for the on-screen indicator that gives context about the current route you're viewing during development.
- Sections: Troubleshooting · Indicator not marking a route as static
- `devIndicators` allows you to configure the on-screen indicator that gives context about the current route you're viewing during development.
- Open `next.config.ts` and set `position` to choose where the indicator renders. The default is `bottom-left`.
- History: v16.0.0: `appIsrStatus`, `buildActivity`, and `buildActivityPosition` options have been removed.; v15.2.0: Improved on-screen indicator with new `position` option. `appIsrStatus`, `buildActivity`, and `buildActivityPosition` op; v15.0.0: Static on-screen indicator added with `appIsrStatus` option.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { devIndicators: { position: 'bottom-right', // 'bottom-left' | 'bottom-right' | 'top-left`

### `01-app/03-api-reference/05-config/01-next-config-js/distDir.md` — distDir
- Set a custom build directory to use instead of the default .next directory.
- You can specify a name to use for a custom build directory to use instead of `.next`.
- Open `next.config.js` and add the `distDir` config:
- Example: `module.exports = { distDir: 'build', }`

### `01-app/03-api-reference/05-config/01-next-config-js/enablePrerenderSourceMaps.md` — enablePrerenderSourceMaps
- Enable source maps for errors during prerendering in next build.
- Sections: Reference
- The `enablePrerenderSourceMaps` option lets Node.js use existing source maps during the prerender phase of `next build`. When source maps are available, error stack traces point to
- This option does not generate source maps. Webpack does not generate server source maps by default. To generate them when investigating prerender errors, use `next build --debug-pr
- History: v16.3.0: The default changed to `true`, regardless of whether `cacheComponents` is enabled.; v16.0.0: `enablePrerenderSourceMaps` moved from `experimental.enablePrerenderSourceMaps` to the top-level `enablePrerenderSourceM
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { enablePrerenderSourceMaps: false, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/env.md` — env [legacy]
- Learn to add and access environment variables in your Next.js application at build time.
- Since the release of [Next.js 9.4](https://nextjs.org/blog/next-9-4) we now have a more intuitive and ergonomic experience for adding environment variables. Give it a try!
- Since the release of [Next.js 9.4](https://nextjs.org/blog/next-9-4) we now have a more intuitive and ergonomic experience for adding environment variables. Give it a try!
- Example: `module.exports = { env: { customKey: 'my-value', }, }`

### `01-app/03-api-reference/05-config/01-next-config-js/expireTime.md` — expireTime
- Customize stale-while-revalidate expire time for ISR enabled pages.
- You can specify a custom `stale-while-revalidate` expire time for CDNs to consume in the `Cache-Control` header for ISR enabled pages.
- Open `next.config.js` and add the `expireTime` config:
- Example: `module.exports = { // one hour in seconds expireTime: 3600, }`

### `01-app/03-api-reference/05-config/01-next-config-js/exportPathMap.md` — exportPathMap [legacy]
- Customize the pages that will be exported as HTML files when using `next export`.
- Sections: Adding a trailing slash · Customizing the output directory
- This feature is exclusive to `next export` and currently **deprecated** in favor of `getStaticPaths` with `pages` or `generateStaticParams` with `app`.
- `exportPathMap` allows you to specify a mapping of request paths to page destinations, to be used during export. Paths defined in `exportPathMap` will also be available when using 
- Example: `module.exports = { trailingSlash: true, }`

### `01-app/03-api-reference/05-config/01-next-config-js/exposeTestingApiInProductionBuild.md` — exposeTestingApiInProductionBuild [experimental]
- Expose the Instant Navigation testing API in production builds for end-to-end tests.
- Sections: Reference
- Use `experimental.exposeTestingApiInProductionBuild` to include the Instant Navigation testing API in a production build. The `instant()` helper from `@next/playwright` uses this A
- Enable the option only for a dedicated test build:
- History: v16.2.0: `experimental.exposeTestingApiInProductionBuild` introduced.
- Example: `EXPOSE_TESTING_API=1 pnpm build EXPOSE_TESTING_API=1 pnpm start`

### `01-app/03-api-reference/05-config/01-next-config-js/generateBuildId.md` — generateBuildId
- Configure the build id, which is used to identify the current build in which your application is being served.
- Next.js generates an ID during `next build` to identify which version of your application is being served. The same build should be used and boot up multiple containers.
- If you are rebuilding for each stage of your environment, you will need to generate a consistent build ID to use between containers. Use the `generateBuildId` command in `next.conf
- Example: `module.exports = { generateBuildId: async () => { // This could be anything, using the latest git hash return process.env.GIT_HASH }, }`

### `01-app/03-api-reference/05-config/01-next-config-js/generateEtags.md` — generateEtags
- Next.js will generate etags for every page by default. Learn more about how to disable etag generation here.
- Next.js will generate [etags](https://en.wikipedia.org/wiki/HTTP_ETag) for every page by default. You may want to disable etag generation for HTML pages depending on your cache str
- Open `next.config.js` and disable the `generateEtags` option:
- Example: `module.exports = { generateEtags: false, }`

### `01-app/03-api-reference/05-config/01-next-config-js/headers.md` — headers
- Add custom HTTP headers to your Next.js app.
- Sections: Header Overriding Behavior · Path Matching · Wildcard Path Matching · Regex Path Matching · Header, Cookie, and Query Matching · Headers with basePath support · Headers with i18n support · Cache-Control
- Headers allow you to set custom HTTP headers on the response to an incoming request on a given path.
- To set custom HTTP headers you can use the `headers` key in `next.config.js`:
- History: v13.3.0: `missing` added.; v10.2.0: `has` added.; v9.5.0: Headers added.
- Example: `export default function handler(req, res) { res.setHeader('Cache-Control', 's-maxage=86400') res.status(200).json({ message: 'Hello from Next.js!' }) }`

### `01-app/03-api-reference/05-config/01-next-config-js/htmlLimitedBots.md` — htmlLimitedBots
- Specify a list of user agents that should receive blocking metadata.
- Sections: Default list · Disabling
- The `htmlLimitedBots` config allows you to specify a list of user agents that should receive blocking metadata instead of streaming metadata.
- Next.js includes a default list of HTML limited bots, including:
- History: 15.2.0: `htmlLimitedBots` option introduced.
- Example: `import type { NextConfig } from 'next' const config: NextConfig = { htmlLimitedBots: /MySpecialBot|MyAnotherSpecialBot|SimpleCrawler/, } export default config`

### `01-app/03-api-reference/05-config/01-next-config-js/httpAgentOptions.md` — httpAgentOptions
- Next.js will automatically use HTTP Keep-Alive by default. Learn more about how to disable HTTP Keep-Alive here.
- In Node.js versions prior to 18, Next.js automatically polyfills `fetch()` with undici and enables [HTTP Keep-Alive](https://developer.mozilla.org/docs/Web/HTTP/Headers/Keep-Alive)
- To disable HTTP Keep-Alive for all `fetch()` calls on the server-side, open `next.config.js` and add the `httpAgentOptions` config:
- Example: `module.exports = { httpAgentOptions: { keepAlive: false, }, }`

### `01-app/03-api-reference/05-config/01-next-config-js/images.md` — images
- Custom configuration for the next/image loader
- Sections: Example Loader Configuration · Akamai · AWS CloudFront · Cloudinary · Cloudflare · Contentful · Fastly · Gumlet
- If you want to use a cloud provider to optimize images instead of using the Next.js built-in Image Optimization API, you can configure `next.config.js` with the following:
- This `loaderFile` must point to a file relative to the root of your Next.js application. The file must export a default function that returns a string, for example:
- Example: `module.exports = { images: { loader: 'custom', loaderFile: './my/image/loader.js', }, }`

### `01-app/03-api-reference/05-config/01-next-config-js/incrementalCacheHandlerPath.md` — Custom Next.js Cache Handler
- Configure the Next.js cache used for storing and revalidating data to use any external service like Redis, Memcached, or others.
- Sections: API Reference · get() · set() · revalidateTag() · resetRequestCache() · Image Optimization Caching · Platform Support
- You can configure the Next.js cache location if you want to persist cached pages and data to durable storage, or share the cache across multiple containers or instances of your Nex
- **Good to know**: The `cacheHandler` (singular) configuration is specifically used by Next.js for server cache operations such as storing and revalidating ISR, route handler respon
- History: v16.2.0: `cacheHandler` support for image optimization caching.; v14.1.0: Renamed to `cacheHandler` and became stable.; v13.4.0: `incrementalCacheHandlerPath` support for `revalidateTag`.; v13.4.0: `incrementalCacheHandlerPath` support for standalone output.
- Example: `module.exports = { cacheHandler: require.resolve('./cache-handler.js'), cacheMaxMemorySize: 0, // disable default in-memory caching }`

### `01-app/03-api-reference/05-config/01-next-config-js/index.md` — next.config.js
- Learn how to configure your application with next.config.js.
- Sections: ECMAScript Modules · Configuration as a Function · Async Configuration · Phase · TypeScript · Unit Testing (experimental)
- Next.js can be configured through a `next.config.js` file in the root of your project directory (for example, by `package.json`) with a default export.
- `next.config.js` is a regular Node.js module, not a JSON file. It gets used by the Next.js server and build phases, and it's not included in the browser build.
- Example: `// @ts-check /** @type {import('next').NextConfig} */ const nextConfig = { /* config options here */ } module.exports = nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/inlineCss.md` — inlineCss [experimental]
- Enable inline CSS support.
- Sections: Usage · Trade-Offs · When Inline CSS Helps · When External CSS is Better
- Experimental support for inlining CSS in the `<head>`. When this flag is enabled, all places where we normally generate a `<link>` tag will instead have a generated `<style>` tag.
- - **Enable** if you use atomic CSS (like Tailwind) and want to optimize first-load performance for new visitors
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { inlineCss: true, }, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/instrumentationClientInject.md` — instrumentationClientInject
- Inject additional client-side instrumentation modules before the user's `instrumentation-client.{js,ts}` file.
- Sections: Execution order · Router navigation hook
- `instrumentationClientInject` is a list of modules that are imported on the client for their side effects before the user's `instrumentation-client.{js,ts}` file runs, ahead of Rea
- This option is primarily intended for **`next.config.js` plugins** (for example, wrappers like `withSentry` or `withAnalytics` that extend a project's config). It lets such a plugi
- History: v16.3.0: `instrumentationClientInject` introduced
- Example: `/** @type {import('next').NextConfig} */ module.exports = { instrumentationClientInject: [ 'my-analytics-package', './lib/sentry-client.js', ], }`

### `01-app/03-api-reference/05-config/01-next-config-js/logging.md` — logging
- Configure logging behavior in the terminal when running Next.js in development mode, including fetch logging, incoming requests, and forwarding browser console logs to the terminal.
- Sections: Options · Fetching · Server Functions · Incoming Requests · Browser Console Logs · Disabling Logging
- You can configure the logging level and whether the full URL is logged to the console when running Next.js in development mode.
- Any `fetch` requests that are restored from the Server Components HMR cache are not logged by default. However, this can be enabled by setting `logging.fetches.hmrRefreshes` to `tr
- History: v16.2.0: `browserToTerminal` added (moved from `experimental.browserDebugInfoInTerminal`); v15.4.0: `experimental.browserDebugInfoInTerminal` introduced; v15.2.0: `incomingRequests` added; v15.0.0: `logging: false` option added, `fetches.hmrRefreshes` added for App Router
- Example: `module.exports = { logging: { fetches: { fullUrl: true, }, }, }`

### `01-app/03-api-reference/05-config/01-next-config-js/mdxRs.md` — mdxRs [experimental]
- Use the new Rust compiler to compile MDX files in the App Router.
- For experimental use with `@next/mdx`. Compiles MDX files using the new Rust compiler.

### `01-app/03-api-reference/05-config/01-next-config-js/onDemandEntries.md` — onDemandEntries
- Configure how Next.js will dispose and keep in memory pages created in development.
- Next.js exposes some options that give you some control over how the server will dispose or keep in memory built pages in development.
- To change the defaults, open `next.config.js` and add the `onDemandEntries` config:

### `01-app/03-api-reference/05-config/01-next-config-js/optimizePackageImports.md` — optimizePackageImports [experimental]
- API Reference for optimizePackageImports Next.js Config Option
- Some packages can export hundreds or thousands of modules, which can cause performance issues in development and production.
- Adding a package to `experimental.optimizePackageImports` will only load the modules you are actually using, while still giving you the convenience of writing import statements wit
- Example: `module.exports = { experimental: { optimizePackageImports: ['package-name'], }, }`

### `01-app/03-api-reference/05-config/01-next-config-js/output.md` — output
- Next.js automatically traces which files are needed by each page to allow for easy deployment of your application. Learn how it works here.
- Sections: How it Works · Turbopack NFT extensions · Automatically Copying Traced Files · Environment variable files · Caveats
- During a build, Next.js will automatically trace each page and its dependencies to determine all of the files that are needed for deploying a production version of your application
- This feature helps reduce the size of deployments drastically. Previously, when deploying with Docker you would need to have all files from your package's `dependencies` installed 
- Example: `module.exports = { output: 'standalone', }`

### `01-app/03-api-reference/05-config/01-next-config-js/outputHashSalt.md` — outputHashSalt
- Learn how to incorporate a custom salt string into content-addressed output filenames.
- `outputHashSalt` is an option that incorporates a configurable salt string into every content-addressed output filename (chunks, assets). Changing this value forces all output hash
- To configure the output hash salt, set `outputHashSalt` in `next.config.js`:
- History: 16.3.0: `outputHashSalt` was added.
- Example: `/** @type {import('next').NextConfig} */ const nextConfig = { outputHashSalt: 'my-deployment-salt', } module.exports = nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/pageExtensions.md` — pageExtensions
- Extend the default page extensions used by Next.js when resolving pages in the Pages Router.
- Sections: Including non-page files in the pages directory
- By default, Next.js accepts files with the following extensions: `.tsx`, `.ts`, `.jsx`, `.js`. This can be modified to allow other extensions like markdown (`.md`, `.mdx`).
- You can extend the default Page extensions (`.tsx`, `.ts`, `.jsx`, `.js`) used by Next.js. Inside `next.config.js`, add the `pageExtensions` config:
- Example: `const withMDX = require('@next/mdx')() /** @type {import('next').NextConfig} */ const nextConfig = { pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'], } `

### `01-app/03-api-reference/05-config/01-next-config-js/partialPrefetching.md` — partialPrefetching
- Configure the default link prefetch behavior to fetch only the static parts of each route.
- Sections: Usage · Reference · How prefetches resolve · Per-segment overrides
- `partialPrefetching` enables Partial Prefetching at the app level. The framework prefetches the static parts of each route by default; set `prefetch={true}` on individual links to 
- `partialPrefetching` requires `cacheComponents`. Without it, `next dev` and `next build` throw at config validation.
- History: 16.3.0: `partialPrefetching` introduced. Requires `cacheComponents` to be enabled.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { cacheComponents: true, partialPrefetching: true, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/poweredByHeader.md` — poweredByHeader
- Next.js will add the `x-powered-by` header by default. Learn to opt-out of it here.
- By default Next.js will add the `x-powered-by` header. To opt-out of it, open `next.config.js` and disable the `poweredByHeader` config:
- Example: `module.exports = { poweredByHeader: false, }`

### `01-app/03-api-reference/05-config/01-next-config-js/prefetchInlining.md` — prefetchInlining [experimental]
- Override how the App Router bundles small prefetch responses together.
- Sections: Usage · Reference
- When the App Router prefetches a route, it can bundle small segment responses into a single response instead of requesting each one separately. This reduces the number of prefetch 
- The `experimental.prefetchInlining` option lets you override this behavior or disable inlining while debugging navigation issues or measuring request volume. For most applications,
- History: 16.3.0: `experimental.prefetchInlining` enabled by default.; 16.2.0: `experimental.prefetchInlining` added.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { prefetchInlining: false, }, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/productionBrowserSourceMaps.md` — productionBrowserSourceMaps
- Enables browser source map generation during the production build.
- Source Maps are enabled by default during development. During production builds, they are disabled to prevent you leaking your source on the client, unless you specifically opt-in 
- Next.js provides a configuration flag you can use to enable browser source map generation during the production build:
- Example: `module.exports = { productionBrowserSourceMaps: true, }`

### `01-app/03-api-reference/05-config/01-next-config-js/proxyClientMaxBodySize.md` — proxyClientMaxBodySize [experimental]
- Configure the maximum request body size when using proxy.
- Sections: Options · String format (recommended) · Number format · Behavior · Good to know
- When proxy is used, Next.js automatically clones the request body and buffers it in memory to enable multiple reads - both in proxy and the underlying route handler. To prevent exc
- By default, the maximum body size is **10MB**. If a request body exceeds this limit, the body will only be buffered up to the limit, and a warning will be logged indicating which r
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { proxyClientMaxBodySize: '1mb', }, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/reactCompiler.md` — reactCompiler
- Enable the React Compiler to automatically optimize component rendering.
- Sections: How It Works · Annotations · Existing memoization guarantees
- Next.js includes support for the [React Compiler](https://react.dev/learn/react-compiler/introduction), a tool designed to improve performance by automatically optimizing component
- Next.js includes a custom performance optimization written in SWC that makes the React Compiler more efficient. Instead of running the compiler on every file, Next.js analyzes your
- History: v16.0.0: `reactCompiler` stabilized and moved from `experimental.reactCompiler` to the top-level `reactCompiler` option.
- Example: `pnpm add -D babel-plugin-react-compiler`

### `01-app/03-api-reference/05-config/01-next-config-js/reactMaxHeadersLength.md` — reactMaxHeadersLength
- The maximum length of the headers that are emitted by React and added to the response.
- During prerendering, React can emit headers that can be added to the response. These can be used to improve performance by allowing the browser to preload resources like fonts, scr
- **Good to know**: This option is only available in App Router.
- Example: `module.exports = { reactMaxHeadersLength: 1000, }`

### `01-app/03-api-reference/05-config/01-next-config-js/reactStrictMode.md` — reactStrictMode
- The complete Next.js runtime is now Strict Mode-compliant, learn how to opt-in
- **Good to know**: Since Next.js 13.5.1, Strict Mode is `true` by default with `app` router, so the above configuration is only necessary for `pages`. You can still disable Strict M
- **Suggested**: We strongly suggest you enable Strict Mode in your Next.js application to better prepare your application for the future of React.
- Example: `module.exports = { reactStrictMode: true, }`

### `01-app/03-api-reference/05-config/01-next-config-js/redirects.md` — redirects
- Add redirects to your Next.js app.
- Sections: Path Matching · Wildcard Path Matching · Regex Path Matching · Header, Cookie, and Query Matching · Redirects with basePath support · Redirects with i18n support · Other Redirects
- Redirects allow you to redirect an incoming request path to a different destination path.
- To use redirects you can use the `redirects` key in `next.config.js`:
- History: v13.3.0: `missing` added.; v10.2.0: `has` added.; v9.5.0: `redirects` added.
- Example: `module.exports = { redirects() { return [ { source: '/about', destination: '/', permanent: true, }, ] }, }`

### `01-app/03-api-reference/05-config/01-next-config-js/rewrites.md` — rewrites
- Add rewrites to your Next.js app.
- Sections: Rewrite parameters · Path Matching · Wildcard Path Matching · Regex Path Matching · Header, Cookie, and Query Matching · Rewriting to an external URL · Incremental adoption of Next.js · Rewrites with basePath support
- Rewrites allow you to map an incoming request path to a different destination path.
- Rewrites act as a URL proxy and mask the destination path, making it appear the user hasn't changed their location on the site. In contrast, redirects will reroute to a new page an
- History: v13.3.0: `missing` added.; v10.2.0: `has` added.; v9.5.0: Headers added.
- Example: `module.exports = { rewrites() { return [ { source: '/about', destination: '/', }, ] }, }`

### `01-app/03-api-reference/05-config/01-next-config-js/sassOptions.md` — sassOptions
- Configure Sass options.
- `sassOptions` allow you to configure the Sass compiler.
- - `sassOptions` are not typed outside of `implementation` because Next.js does not maintain the other possible properties.

### `01-app/03-api-reference/05-config/01-next-config-js/serverActions.md` — serverActions
- Configure Server Actions behavior in your Next.js application.
- Sections: allowedOrigins · Host matching · Reverse proxies and development tunnels · bodySizeLimit · Enabling Server Actions (v13)
- Options for configuring Server Actions behavior in your Next.js application. For how Server Actions work, including the security boundary these options tune, see the Server Actions
- `experimental.serverActions.allowedOrigins` is a list of additional trusted hosts from which Server Actions can be invoked.
- Example: `/** @type {import('next').NextConfig} */ module.exports = { experimental: { serverActions: { allowedOrigins: ['my-proxy.com', '*.my-proxy.com'], }, }, }`

### `01-app/03-api-reference/05-config/01-next-config-js/serverComponentsHmrCache.md` — serverComponentsHmrCache [experimental]
- Configure whether fetch responses in Server Components are cached across HMR refresh requests.
- The experimental `serverComponentsHmrCache` option allows you to cache `fetch` responses in Server Components across Hot Module Replacement (HMR) refreshes in local development. Th
- By default, the HMR cache applies to all `fetch` requests, including those with the `cache: 'no-store'` option. This means uncached requests will not show fresh data between HMR re
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { serverComponentsHmrCache: false, // defaults to true }, } export default`

### `01-app/03-api-reference/05-config/01-next-config-js/serverExternalPackages.md` — serverExternalPackages
- Opt-out specific dependencies from the Server Components bundling and use native Node.js `require`.
- Dependencies used inside Server Components and Route Handlers will automatically be bundled by Next.js.
- If a dependency is using Node.js specific features, you can choose to opt-out specific dependencies from the Server Components bundling and use native Node.js `require`.
- Example: `/** @type {import('next').NextConfig} */ const nextConfig = { serverExternalPackages: ['@acme/ui'], } module.exports = nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/skipProxyUrlNormalize.md` — skipProxyUrlNormalize
- Let Proxy see the original request instead of Next.js's normalized version. Formerly skipMiddlewareUrlNormalize.
- Sections: Reference · Deprecated alias · Good to know · Reading the URL as the client sent it
- Enabling `skipProxyUrlNormalize` lets Proxy see the original request instead of Next.js's normalized version. This includes internal URLs, query parameters, and headers used during
- **Most projects don't need this option.** It is one of the advanced Proxy flags, meant for specific routing cases and debugging.
- History: v16.0.0: Renamed from `skipMiddlewareUrlNormalize` to `skipProxyUrlNormalize`.; v13.1.0: `skipMiddlewareUrlNormalize` added.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { skipProxyUrlNormalize: true, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/skipTrailingSlashRedirect.md` — skipTrailingSlashRedirect
- Disable the automatic trailing slash redirects so you can handle trailing slashes yourself in Proxy.
- Sections: Reference · Paths that contain a dot · Good to know · Handling trailing slashes in Proxy
- Enabling `skipTrailingSlashRedirect` turns off the automatic redirects that add or remove a trailing slash. You handle any redirecting you still want in Proxy.
- **Most projects don't need this option.** It is one of the advanced Proxy flags, meant for specific routing cases and debugging.
- History: v13.1.0: `skipTrailingSlashRedirect` added.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { skipTrailingSlashRedirect: true, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/staleTimes.md` — staleTimes [experimental]
- Learn how to override the invalidation time of the client cache.
- `staleTimes` is an experimental feature that enables caching of page segments in the Client Cache.
- You can enable this experimental feature and provide custom revalidation times by setting the experimental `staleTimes` flag:
- History: v15.0.0: The `dynamic` `staleTimes` default changed from 30s to 0s.; v14.2.0: Experimental `staleTimes` introduced.
- Example: `/** @type {import('next').NextConfig} */ const nextConfig = { experimental: { staleTimes: { dynamic: 30, static: 180, }, }, } module.exports = nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/staticGeneration.md` — staticGeneration* [experimental]
- Learn how to configure static generation in your Next.js application.
- Sections: Config Options
- The `staticGeneration*` options allow you to configure the Static Generation process for advanced use cases.
- The following options are available:
- Example: `const nextConfig = { experimental: { staticGenerationRetryCount: 1, staticGenerationMaxConcurrency: 8, staticGenerationMinPagesPerWorker: 25, }, } module.export`

### `01-app/03-api-reference/05-config/01-next-config-js/supportsImmutableAssets.md` — supportsImmutableAssets
- Configure support for immutable static assets
- **Attention**: This option is primarily intended for adapter authors.
- App developers should only set it when troubleshooting adapter-specific issues.
- History: v16.3.0: Added support for immutable static assets.
- Example: `/** @type {import('next').NextConfig} */ const nextConfig = { supportsImmutableAssets: false, } module.exports = nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/taint.md` — taint [experimental]
- Enable tainting Objects and Values.
- Sections: Usage · Caveats · Tainting an object reference · Tainting a unique value
- The `taint` option enables support for experimental React APIs for tainting objects and values. This feature helps prevent sensitive data from being accidentally passed to the clie
- - [`experimental_taintObjectReference`](https://react.dev/reference/react/experimental_taintObjectReference) taint objects references.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { taint: true, }, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/trailingSlash.md` — trailingSlash
- Configure Next.js pages to resolve with or without a trailing slash.
- By default Next.js will redirect URLs with trailing slashes to their counterpart without a trailing slash. For example `/about/` will redirect to `/about`. You can configure this b
- Open `next.config.js` and add the `trailingSlash` config:
- History: v9.5.0: `trailingSlash` added.
- Example: `module.exports = { trailingSlash: true, }`

### `01-app/03-api-reference/05-config/01-next-config-js/transpilePackages.md` — transpilePackages
- Transpile and bundle dependencies from monorepo workspace packages or `node_modules` libraries that ship TypeScript, JSX, or modern syntax.
- Sections: When you need it
- Use `transpilePackages` to compile and bundle a dependency instead of treating it as untouched runtime code. Values are package names, including scoped names like `@scope/pkg`. Pat
- This replaces the `next-transpile-modules` package.
- History: v13.0.0: `transpilePackages` added.
- Example: `/** @type {import('next').NextConfig} */ const nextConfig = { transpilePackages: ['package-name', '@scope/pkg'], } module.exports = nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/turbopack.md` — turbopack
- Configure Next.js with Turbopack-specific options
- Sections: Reference · Options · Supported loaders · Root directory · Additional roots (experimental) · Configuring webpack loaders · Advanced webpack loader conditions · Module types
- The `turbopack` option lets you customize Turbopack to transform different files and change how modules are resolved.
- **Good to know**: The `turbopack` option was previously named `experimental.turbo` in Next.js versions 13.0.0 to 15.2.x, an option which still works as an alias, but new configurat
- History: 16.5.0: `experimental.turbopackDetectGlobalVirtualStore` was added; 16.4.0: `experimental.turbopackAdditionalRoots` was added; 16.2.0: `turbopackLoader` import attributes were added.; 16.2.0: `turbopack.rules.*.type` was added.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { turbopack: { // ... }, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/turbopackChunking.md` — turbopackChunking [experimental]
- Configure how Turbopack splits your client-side and server-side JavaScript into chunks in production.
- Sections: Size Thresholds · Server Chunks · Component Chunks · Heuristics
- `experimental.turbopackChunking` lets you configure Turbopack's production JavaScript
- chunker. These options allow you to change the assumptions the chunker makes about user
- Example: `/** @type {import('next').NextConfig} */ const nextConfig = { experimental: { turbopackChunking: { minServerChunkSize: 10000, maxMergeServerChunkSize: 200000, }`

### `01-app/03-api-reference/05-config/01-next-config-js/turbopackFileSystemCache.md` — Turbopack FileSystem Caching
- Learn how to enable and configure FileSystem Caching for Turbopack builds
- Sections: Usage · Options · Build environments
- Turbopack FileSystem Cache enables Turbopack to reduce work across `next dev` or `next build` commands. When enabled, Turbopack will save and restore data under the `.next` directo
- Two options control the cache, one for `next dev` and one for `next build`. Both are enabled by default:
- History: v16.3.0: FileSystem caching is enabled by default for builds; v16.1.0: FileSystem caching is enabled by default for development; v16.0.0: Beta release with separate flags for build and dev; v15.5.0: Persistent caching released as experimental on canary releases
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { turbopackFileSystemCacheForDev: true, turbopackFileSystemCacheForBuild: `

### `01-app/03-api-reference/05-config/01-next-config-js/turbopackGc.md` — turbopackGc [experimental]
- Configure Turbopack to remove unreachable work from memory and the persistent cache.
- Sections: Reference · Options
- The `experimental.turbopackGc` option controls garbage collection for Turbopack's in-memory and persistent caches. Garbage collection is enabled by default. To disable it, set the 
- `turbopackGc` defaults to `true` and accepts a boolean or an object:
- History: v16.5.0: `experimental.turbopackGc` is enabled by default.; v16.4.0: `experimental.turbopackGc` configuration option added.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { turbopackGc: false, }, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/turbopackIgnoreIssue.md` — turbopack.ignoreIssue
- Suppress specific Turbopack errors and warnings from the CLI output and error overlay.
- Sections: Usage · Options · path · title · description · Suppressing warnings for optional dependencies · Combining multiple rules
- The `turbopack.ignoreIssue` option allows you to filter out specific Turbopack errors and warnings so they do not appear in the CLI output or the error overlay. This is useful for 
- This option is only available when using Turbopack (`next dev --turbopack`).
- History: v16.2.0: `turbopack.ignoreIssue` introduced.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { turbopack: { ignoreIssue: [ { path: '**/vendor/**', }, ], }, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/turbopackLazyDynamicImports.md` — turbopackLazyDynamicImports [experimental]
- Compile client-side dynamic imports when they are first requested during development.
- Sections: How it works
- The `experimental.turbopackLazyDynamicImports` option defers compiling client-side dynamic `import()` targets until the browser first requests them during `next dev`.
- With `turbopackLazyDynamicImports` enabled, Turbopack waits to compile the target of a client-side dynamic `import()` until the browser requests its chunk. Code that the applicatio
- History: v16.4.0: `experimental.turbopackLazyDynamicImports` configuration option added.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { turbopackLazyDynamicImports: true, }, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/turbopackLazyDynamicImportsSSR.md` — turbopackLazyDynamicImportsSSR [experimental]
- Compile dynamic imports when server rendering first reaches them during development.
- Sections: How it works
- The `experimental.turbopackLazyDynamicImportsSSR` option defers compiling dynamic imports until server rendering first reaches them during `next dev`.
- Client Components can use [`lazy`](https://react.dev/reference/react/lazy) to load a component dynamically. With `turbopackLazyDynamicImportsSSR` enabled, Turbopack compiles the im
- History: v16.4.0: `experimental.turbopackLazyDynamicImportsSSR` configuration option added.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { turbopackLazyDynamicImportsSSR: true, }, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/turbopackLocalPostcssConfig.md` — turbopackLocalPostcssConfig
- Enable per-directory PostCSS config resolution in Turbopack so that the config closest to each CSS file takes precedence over the project root config.
- Sections: Usage · Behavior
- The `turbopackLocalPostcssConfig` option changes how Turbopack resolves `postcss.config.js` files. When enabled, Turbopack searches for the config starting from the CSS file's own 
- This option is only relevant when using Turbopack (`next dev` or `next build`).
- History: v16.3.0: `turbopackLocalPostcssConfig` introduced.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { turbopackLocalPostcssConfig: true, }, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/turbopackMemoryEviction.md` — Turbopack Memory Eviction
- Learn how to control Turbopack's memory eviction strategy for the persistent cache.
- Sections: Usage · Version Changes
- `turbopackMemoryEviction` controls whether Turbopack reclaims memory while the persistent (FileSystem) cache is enabled. After Turbopack writes a snapshot of its cache to disk, it 
- Currently there are three options
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { turbopackMemoryEviction: 'auto', }, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/turbopackPluginRuntimeStrategy.md` — turbopackPluginRuntimeStrategy [experimental]
- Choose how Turbopack runs Node.js evaluation for webpack loaders, Babel, and PostCSS.
- Sections: Reference · Node.js compatibility
- The `experimental.turbopackPluginRuntimeStrategy` option chooses whether Turbopack runs Node.js evaluation in child processes or worker threads.
- This runtime executes Node.js-based tools, including webpack loaders, Babel, and PostCSS.
- History: v16.4.0: `experimental.turbopackPluginRuntimeStrategy` configuration option added.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { turbopackPluginRuntimeStrategy: 'workerThreads', }, } export default nex`

### `01-app/03-api-reference/05-config/01-next-config-js/turbopackRustReactCompiler.md` — turbopackRustReactCompiler [experimental]
- Use the native Rust port of the React Compiler with Turbopack instead of the Babel transform.
- Sections: Good to know
- The `experimental.turbopackRustReactCompiler` option enables the native Rust version of the React Compiler, running it directly inside Turbopack as native code instead of through N
- This option is released as experimental to gather feedback before it becomes the default.
- History: v16.3.0: Introduced the experimental `turbopackRustReactCompiler` option for the native Rust React Compiler.

### `01-app/03-api-reference/05-config/01-next-config-js/typedRoutes.md` — typedRoutes
- Enable support for statically typed links.
- **Note**: This option has been marked as stable, so you should use `typedRoutes` instead of `experimental.typedRoutes`.
- Support for statically typed links. This feature requires using TypeScript in your project.
- Example: `/** @type {import('next').NextConfig} */ const nextConfig = { typedRoutes: true, } module.exports = nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/typescript.md` — typescript
- Configure how Next.js handles TypeScript errors during production builds and specify a custom tsconfig file.
- Sections: Options · ignoreBuildErrors · tsconfigPath
- Configure TypeScript behavior with the `typescript` option in `next.config.js`:
- Next.js fails your **production build** (`next build`) when TypeScript errors are present in your project.
- Example: `module.exports = { typescript: { ignoreBuildErrors: false, tsconfigPath: 'tsconfig.json', }, }`

### `01-app/03-api-reference/05-config/01-next-config-js/urlImports.md` — urlImports [experimental]
- Configure Next.js to allow importing modules from external URLs.
- Sections: Security Model · Lockfile · Skypack · Static Image Imports · URLs in CSS · Asset Imports
- URL imports are an experimental feature that allows you to import modules directly from external servers (instead of from the local disk).
- **Warning**: Only use domains that you trust to download and execute on your machine. Please exercise discretion, and caution until the feature is flagged as stable.
- Example: `module.exports = { experimental: { urlImports: ['https://example.com/assets/', 'https://cdn.skypack.dev'], }, }`

### `01-app/03-api-reference/05-config/01-next-config-js/useLightningcss.md` — useLightningcss [experimental]
- Enable experimental support for Lightning CSS.
- Sections: lightningCssFeatures · Options · Available features
- Experimental support for using [Lightning CSS](https://lightningcss.dev) with webpack. Lightning CSS is a fast CSS transformer and minifier, written in Rust.
- If this option is not set, Next.js on webpack uses [PostCSS](https://postcss.org/) with [`postcss-preset-env`](https://www.npmjs.com/package/postcss-preset-env) by default.
- History: 16.2.0: `lightningCssFeatures` added.; 15.1.0: Support for `useSwcCss` was removed from Turbopack.; 14.2.0: Turbopack's default CSS processor was changed from `@swc/css` to Lightning CSS. `useLightningcss` became ignored on Turb
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { useLightningcss: false, // default, ignored on Turbopack }, } export def`

### `01-app/03-api-reference/05-config/01-next-config-js/useOffline.md` — useOffline [experimental]
- Learn how to enable the experimental `useOffline` configuration option to detect connectivity and retry failed requests automatically.
- Sections: How retry works · The connectivity check · Backoff · Giving up · Retry of framework requests · Traffic at reconnection
- The `useOffline` configuration option enables offline connectivity detection and automatic retry of failed navigation, prefetch, and Server Action requests. When enabled, it also e
- When enabled, Next.js will:
- History: v16.x.0: `experimental.useOffline` configuration option introduced.
- Example: `import type { NextConfig } from 'next' const nextConfig: NextConfig = { experimental: { useOffline: true, }, } export default nextConfig`

### `01-app/03-api-reference/05-config/01-next-config-js/useTypeScriptCli.md` — useTypeScriptCli [experimental]
- Run the project-local TypeScript CLI for type checking during production builds.
- Sections: Behavior
- By default, `next build` runs the project-local `tsc` command instead of loading the TypeScript JavaScript compiler API. This supports TypeScript 6 and enables [TypeScript 7](https
- Install TypeScript 7 in your project:
- Example: `pnpm add -D typescript@^7`

### `01-app/03-api-reference/05-config/01-next-config-js/webpack.md` — Custom Webpack Config
- Learn how to customize the webpack config used by Next.js
- **Good to know**: changes to webpack config are not covered by semver so proceed at your own risk
- Before continuing to add custom webpack configuration to your application make sure Next.js doesn't already support your use-case:
- Example: `module.exports = { webpack: ( config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack } ) => { // Important: return the modified config return co`

### `01-app/03-api-reference/05-config/01-next-config-js/webVitalsAttribution.md` — webVitalsAttribution [experimental]
- Learn how to use the webVitalsAttribution option to pinpoint the source of Web Vitals issues.
- When debugging issues related to Web Vitals, it is often helpful if we can pinpoint the source of the problem.
- For example, in the case of Cumulative Layout Shift (CLS), we might want to know the first element that shifted when the single largest layout shift occurred.
- Example: `module.exports = { experimental: { webVitalsAttribution: ['CLS', 'LCP'], }, }`

### `01-app/03-api-reference/05-config/02-typescript.md` — TypeScript
- Next.js provides a TypeScript-first development experience for building your React application.
- Sections: Using TypeScript 7 · IDE Plugin · End-to-End Type Safety · Route-Aware Type Helpers · next-env.d.ts · Type Checking Next.js Configuration Files · Using Node.js Native TypeScript Resolver for next.config.ts · Statically Typed Links
- Next.js comes with built-in TypeScript, automatically installing the necessary packages and configuring the proper settings when you create a new project with `create-next-app`.
- To add TypeScript to an existing project, rename a file to `.ts` / `.tsx`. Run `next dev` and `next build` to automatically install the necessary dependencies and add a `tsconfig.j
- Example: `pnpm add -D typescript@^7`

### `01-app/03-api-reference/05-config/03-eslint.md` — ESLint Plugin
- Learn how to use and configure the ESLint plugin to catch common issues and problems in a Next.js application.
- Sections: Setup ESLint · Reference · Rules · Specifying a root directory within a monorepo · Disabling rules · With Core Web Vitals · With TypeScript · With Prettier
- Next.js provides an ESLint configuration package, [`eslint-config-next`](https://www.npmjs.com/package/eslint-config-next), that makes it easy to catch common issues in your applic
- The package provides two main configurations:
- Example: `{ "devDependencies": { "@typescript/native": "npm:typescript@7.0.2", "typescript": "npm:@typescript/typescript6@6.0.2" } }`

### `01-app/03-api-reference/05-config/index.md` — Configuration
- Learn how to configure Next.js applications.

### `01-app/03-api-reference/06-cli/create-next-app.md` — create-next-app
- Create Next.js apps using one command with the create-next-app CLI.
- Sections: Reference · With the default template · Linter Options · With an official Next.js example · With any public GitHub example
- The `create-next-app` CLI allow you to create a new Next.js application using the default template or an [example](https://github.com/vercel/next.js/tree/canary/examples) from a pu
- The following options are available:
- Example: `pnpm create next-app [project-name] [options]`

### `01-app/03-api-reference/06-cli/index.md` — CLI
- API Reference for the Next.js Command Line Interface (CLI) tools.
- Next.js comes with **two** Command Line Interface (CLI) tools:
- - **`create-next-app`**: Quickly create a new Next.js application using the default template or an [example](https://github.com/vercel/next.js/tree/canary/examples) from a public G

### `01-app/03-api-reference/06-cli/next.md` — next CLI
- Learn how to run and build your application with the Next.js CLI.
- Sections: Reference · Commands · next dev options · next build options · next start options · next info options · next telemetry options · next typegen options
- The Next.js CLI allows you to develop, build, start your application, and more.
- **Good to know**: With `npm run`, use `--` before CLI flags so npm forwards them to `next`. This is not required for `pnpm`, `yarn`, or `bun`.
- Example: `pnpm next [command] [options]`

### `01-app/03-api-reference/07-adapters/01-configuration.md` — Configuration
- Configure `adapterPath` or `NEXT_ADAPTER_PATH` to use a custom deployment adapter.
- To use an adapter, specify the path to your adapter module in `adapterPath`:
- Alternatively `NEXT_ADAPTER_PATH` can be set to enable zero-config usage in deployment platforms.
- Example: `/** @type {import('next').NextConfig} */ const nextConfig = { adapterPath: require.resolve('./my-adapter.js'), } module.exports = nextConfig`

### `01-app/03-api-reference/07-adapters/02-creating-an-adapter.md` — Creating an Adapter
- Create an adapter module that implements the `NextAdapter` interface.
- Sections: Basic Adapter Structure
- An adapter is a module that exports an object implementing the `NextAdapter` interface.
- The interface can be imported from the `next` package:

### `01-app/03-api-reference/07-adapters/03-api-reference.md` — API Reference
- Reference for `modifyConfig` and `onBuildComplete` in the `NextAdapter` interface.
- Sections: async modifyConfig(config, context) · async onBuildComplete(context)
- Called for any CLI command that loads the `next.config.js` file to allow modification of the configuration.
- - `config`: The complete Next.js configuration object

### `01-app/03-api-reference/07-adapters/04-testing-adapters.md` — Testing Adapters
- Validate adapters with the Next.js compatibility test harness and custom lifecycle scripts.
- Sections: Reporting results to nextjs.org · Custom deploy script contract · Custom logs script contract · Custom cleanup script contract
- Next.js provides a test harness for validating adapters. Running the end-to-end tests for deployment.
- Example GitHub Actions workflow:
- Example: `#!/usr/bin/env bash set -euo pipefail if [ -f ".adapter-build.log" ]; then cat ".adapter-build.log" fi if [ -f ".adapter-server.log" ]; then echo "=== .adapter-`

### `01-app/03-api-reference/07-adapters/05-routing-with-next-routing.md` — Routing with @next/routing
- Use `@next/routing` to apply Next.js route matching behavior in adapters.
- You can use [`@next/routing`](https://www.npmjs.com/package/@next/routing) to reproduce Next.js route matching behavior with data from `onBuildComplete`.
- `resolveRoutes()` returns:

### `01-app/03-api-reference/07-adapters/06-implementing-ppr-in-an-adapter.md` — Implementing PPR in an Adapter
- Implement Partial Prerendering support in an adapter using fallback output and cache hooks.
- Sections: 1. Seed shell + postponed state at build time · 2. Runtime flow: serve cached shell and resume in background · 3. Update cache with requestMeta.onCacheEntryV2
- For partially prerendered app routes, `onBuildComplete` gives you the data needed to seed and resume PPR:
- - `outputs.prerenders[].fallback.filePath`: path to the generated fallback shell (for example HTML)

### `01-app/03-api-reference/07-adapters/07-runtime-integration.md` — Runtime Integration
- Understand how build-time adapters and runtime cache interfaces work together.
- Sections: Handler Context · PPR Chain Headers
- The Deployment Adapter API is a **build-time** interface. It tells your platform what was built and how to route requests. **Runtime** behavior (request handling, streaming, cachin
- Together, the adapter and cache interfaces form the complete platform integration surface:

### `01-app/03-api-reference/07-adapters/08-invoking-entrypoints.md` — Invoking Entrypoints
- Invoke JavaScript build handlers and experimental Go HTTP server entrypoints.
- Sections: Node.js runtime (runtime: 'nodejs') · Edge runtime (runtime: 'edge') (deprecated) · Go runtime (runtime: 'go')
- Node.js and Edge entrypoints use a `handler(..., ctx)` interface, with runtime-specific request/response types. Experimental Go entrypoints are compiled HTTP servers.
- Node.js entrypoints use the following interface:
- Example: `const entry = await globalThis._ENTRIES[output.edgeRuntime.entryKey] const handler = entry[output.edgeRuntime.handlerExport] await handler(request, ctx)`

### `01-app/03-api-reference/07-adapters/09-output-types.md` — Output Types
- Reference for all build output types exposed to adapters.
- Sections: Pages (outputs.pages) · API Routes (outputs.pagesApi) · App Pages (outputs.appPages) · App Routes (outputs.appRoutes) · Prerenders (outputs.prerenders) · Prerender classification · Static Files (outputs.staticFiles) · Middleware (outputs.middleware)
- The `outputs` object contains arrays of build output types:
- - `outputs.pages`: React pages from the `pages/` directory

### `01-app/03-api-reference/07-adapters/10-routing-information.md` — Routing Information
- Reference for routing phases and route fields exposed in `onBuildComplete`.
- Sections: routing.beforeMiddleware · routing.middlewareMatchers · routing.beforeFiles · routing.afterFiles · routing.dynamicRoutes · routing.onMatch · routing.fallback · Common Route Fields
- The `routing` object in `onBuildComplete` provides complete routing information with processed patterns ready for deployment:
- Routes applied before middleware execution. These include generated header and redirect behavior.

### `01-app/03-api-reference/07-adapters/11-use-cases.md` — Use Cases
- Common patterns and examples for deployment adapter implementations.
- Common use cases for adapters include:
- - **Deployment Platform Integration**: Automatically configure build outputs for specific hosting platforms

### `01-app/03-api-reference/07-adapters/12-immutable-static-assets.md` — Supporting Immutable Static Assets
- Support immutable static assets in an adapter
- Sections: Adapter Implementation
- See `config.supportsImmutableAssets` for end-user-facing information about this feature.
- When `config.supportsImmutableAssets` is enabled, Next.js outputs immutable content-addressed static assets under the public path `/_next/static/immutable/*`. This prefix can be us

### `01-app/03-api-reference/07-adapters/index.md` — Adapters
- Build deployment adapters for Next.js platforms and infrastructure.
- Use this section to build and validate deployment adapters that integrate with the Next.js build and runtime model.

### `01-app/03-api-reference/07-edge.md` — Edge Runtime
- API Reference for the Edge Runtime.
- Sections: Caveats · Reference · Network APIs · Encoding APIs · Stream APIs · Crypto APIs · Web Standard APIs · Next.js Specific Polyfills
- Next.js has two server runtimes you can use in your application:
- - The **Node.js Runtime** (default), which has access to all Node.js APIs and is used for rendering your application.

### `01-app/03-api-reference/08-turbopack.md` — Turbopack
- Turbopack is an incremental bundler optimized for JavaScript and TypeScript, written in Rust, and built into Next.js.
- Sections: Why Turbopack? · Supported platforms · Getting started · Using Webpack instead · Supported features · Language features · Framework and React features · CSS and styling
- Turbopack is an **incremental bundler** optimized for JavaScript and TypeScript, written in Rust, and built into **Next.js**. You can use Turbopack with both the Pages and App Rout
- We built Turbopack to push the performance of Next.js, including:
- Example: `next dev --webpack next build --webpack`

### `01-app/03-api-reference/index.md` — API Reference
- Next.js API Reference for the App Router.

## `01-app/04-glossary.md` (1 docs)

### `01-app/04-glossary.md` — Next.js Glossary
- A glossary of common terms used in Next.js.
- Sections: App Router · App Shell · Build time · Cache Components · Catch-all Segments · Client Bundles · Client Component · Client-side navigation
- This glossary defines common terms used throughout the Next.js documentation, including terms related to routing, rendering, and caching.
- The Next.js router introduced in version 13, built on top of React Server Components. It uses file-system based routing and supports layouts, nested routing, loading states, error 

## `01-app/index.md` (1 docs)

### `01-app/index.md` — App Router
- The App Router is a file-system based router that uses React's latest features such as Server Components, Suspense, Server Functions, and more.
- The **App Router** is a file-system based router that uses React's latest features such as [Server Components](https://react.dev/reference/rsc/server-components), [Suspense](https:

## `02-pages/01-getting-started` (7 docs)

### `02-pages/01-getting-started/01-installation.md` — Create a new Next.js application
- How to create a new Next.js application with `create-next-app`. Set up TypeScript, ESLint,and configure your `next.config.js` file.

### `02-pages/01-getting-started/02-project-structure.md` — Project Structure and Organization
- Learn about the folder and file conventions in a Next.js project, and how to organize your project.

### `02-pages/01-getting-started/04-images.md` — Image Optimization
- Optimize your images with the built-in `next/image` component.

### `02-pages/01-getting-started/05-fonts.md` — How to use fonts
- Learn how to use fonts in Next.js

### `02-pages/01-getting-started/06-css.md` — How to use CSS in your application
- Learn about the different ways to add CSS to your application, including CSS Modules, Global CSS, Tailwind CSS, and more.

### `02-pages/01-getting-started/11-deploying.md` — How to deploy your Next.js application
- Learn how to deploy your Next.js application.

### `02-pages/01-getting-started/index.md` — Getting Started - Pages Router
- Learn how to create full-stack web applications with Next.js with the Pages Router.

## `02-pages/02-guides` (50 docs)

### `02-pages/02-guides/analytics.md` — How to set up analytics
- Measure and track page performance using Next.js

### `02-pages/02-guides/authentication.md` — How to implement authentication in Next.js
- Learn how to implement authentication in Next.js, covering best practices, securing routes, authorization techniques, and session management.

### `02-pages/02-guides/babel.md` — How to configure Babel in Next.js
- Extend the babel preset added by Next.js with your own configs.
- Sections: Adding Presets and Plugins · Customizing Presets and Plugins
- - [Customizing babel configuration](https://github.com/vercel/next.js/tree/canary/examples/with-custom-babel-config)
- Next.js includes the `next/babel` preset to your app, which includes everything needed to compile React applications and server-side code. But if you want to extend the default Bab
- Example: `{ "presets": ["next/babel"], "plugins": [] }`

### `02-pages/02-guides/ci-build-caching.md` — How to configure Continuous Integration (CI) build caching
- Learn how to configure CI to cache Next.js builds

### `02-pages/02-guides/content-security-policy.md` — How to set a Content Security Policy (CSP) for your Next.js application
- Learn how to set a Content Security Policy (CSP) for your Next.js application.

### `02-pages/02-guides/css-in-js.md` — How to use CSS-in-JS libraries
- Use CSS-in-JS libraries with Next.js

### `02-pages/02-guides/custom-server.md` — How to set up a custom server in Next.js
- Start a Next.js app programmatically using a custom server.

### `02-pages/02-guides/custom-webpack.md` — How to use a custom webpack version in Next.js
- Use your application's webpack installation with Next.js instead of the bundled version.

### `02-pages/02-guides/debugging.md` — How to use debugging tools with Next.js
- Learn how to debug your Next.js application with VS Code or Chrome DevTools.

### `02-pages/02-guides/draft-mode.md` — How to preview content with Draft Mode in Next.js
- Next.js has draft mode to toggle between static and dynamic pages. You can learn how it works with Pages Router.
- Sections: Step 1: Create and access the API route · Securely accessing it from your Headless CMS · Step 2: Update getStaticProps · Fetch draft data · More Details · Clear the Draft Mode cookie · Works with getServerSideProps · Works with API Routes
- In the Pages documentation and the Data Fetching documentation, we talked about how to prerender a page at build time (**Static Generation**) using `getStaticProps` and `getStaticP
- Static Generation is useful when your pages fetch data from a headless CMS. However, it’s not ideal when you’re writing a draft on your headless CMS and want to view the draft imme
- Example: `export default function handler(req, res) { // ... res.setDraftMode({ enable: true }) // ... }`

### `02-pages/02-guides/environment-variables.md` — How to use environment variables in Next.js
- Learn to add and access environment variables in your Next.js application.

### `02-pages/02-guides/forms.md` — How to create forms with API Routes
- Learn how to handle form submissions and data mutations with Next.js.
- Sections: Server Forms · Form validation · Error handling · Displaying loading state · Redirecting
- Forms enable you to create and update data in web applications. Next.js provides a powerful way to handle data mutations using **API Routes**. This guide will walk you through how 
- To handle form submissions on the server, create an API endpoint that securely mutates data.
- Example: `export default function handler(req, res) { const data = req.body // call your database, etc. // const id = await createItem(data) // ... res.status(200).json({`

### `02-pages/02-guides/incremental-static-regeneration.md` — How to implement Incremental Static Regeneration (ISR)
- Learn how to create or update static pages at runtime with Incremental Static Regeneration.

### `02-pages/02-guides/index.md` — Guides
- Learn how to implement common UI patterns and use cases using Next.js

### `02-pages/02-guides/instrumentation.md` — How to set up instrumentation
- Learn how to use instrumentation to run code at server startup in your Next.js app

### `02-pages/02-guides/internationalization.md` — How to implement internationalization in Next.js
- Next.js has built-in support for internationalized routing and language detection. Learn more here.
- Sections: Getting started · Locale Strategies · Sub-path Routing · Domain Routing · Automatic Locale Detection · Prefixing the Default Locale · Disabling Automatic Locale Detection · Accessing the locale information
- - [i18n routing](https://github.com/vercel/next.js/tree/canary/examples/i18n-routing-pages)
- Next.js has built-in support for internationalized ([i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization#Naming)) routing since `v10.0.0`. You can provide a l
- Example: `module.exports = { i18n: { locales: ['en-US', 'fr', 'nl-NL'], defaultLocale: 'en-US', }, }`

### `02-pages/02-guides/lazy-loading.md` — How to lazy load Client Components and libraries
- Lazy load imported libraries and React Components to improve your application's overall loading performance.

### `02-pages/02-guides/mdx.md` — How to use markdown and MDX in Next.js
- Learn how to configure MDX to write JSX in your markdown files.

### `02-pages/02-guides/migrating/app-router-migration.md` — How to migrate from Pages to the App Router
- Learn how to upgrade your existing Next.js application from the Pages Router to the App Router.

### `02-pages/02-guides/migrating/from-create-react-app.md` — How to migrate from Create React App to Next.js
- Learn how to migrate your existing React application from Create React App to Next.js.

### `02-pages/02-guides/migrating/from-vite.md` — How to migrate from Vite to Next.js
- Learn how to migrate your existing React application from Vite to Next.js.

### `02-pages/02-guides/migrating/index.md` — Migrating
- Learn how to migrate from popular frameworks to Next.js

### `02-pages/02-guides/multi-zones.md` — How to build micro-frontends using multi-zones and Next.js
- Learn how to build micro-frontends using Next.js Multi-Zones to deploy multiple Next.js apps under a single domain.

### `02-pages/02-guides/open-telemetry.md` — How to instrument your Next.js app with OpenTelemetry
- Learn how to instrument your Next.js app with OpenTelemetry.

### `02-pages/02-guides/package-bundling.md` — How to optimize package bundling
- Learn how to optimize your application's server and client bundles.

### `02-pages/02-guides/post-css.md` — How to configure PostCSS in Next.js
- Extend the PostCSS config and plugins added by Next.js with your own.
- Sections: Default Behavior · Customizing Target Browsers · CSS Modules · Customizing Plugins
- Next.js compiles CSS for its built-in CSS support using PostCSS.
- Out of the box, with no configuration, Next.js compiles CSS with the following transformations:
- Example: `{ "browserslist": [">0.3%", "not dead", "not op_mini all"] }`

### `02-pages/02-guides/preview-mode.md` — How to preview content with Preview Mode in Next.js [legacy]
- Next.js has the preview mode for statically generated pages. You can learn how it works here.
- Sections: Step 1: Create and access a preview API route · Securely accessing it from your Headless CMS · Step 2: Update getStaticProps · Fetch preview data · More Details · Specify the Preview Mode duration · Clear the Preview Mode cookies · previewData size limits
- **Note**: This feature is superseded by Draft Mode.
- - [Agility CMS Example](https://github.com/vercel/next.js/tree/canary/examples/cms-agilitycms) ([Demo](https://next-blog-agilitycms.vercel.app/))
- Example: `export default function handler(req, res) { // ... res.setPreviewData({}) // ... }`

### `02-pages/02-guides/production-checklist.md` — How to optimize your Next.js application for production
- Recommendations to ensure the best performance and user experience before taking your Next.js application to production.

### `02-pages/02-guides/redirecting.md` — How to handle redirects in Next.js
- Learn the different ways to handle redirects in Next.js.

### `02-pages/02-guides/sass.md` — How to use Sass in Next.js
- Learn how to use Sass in your Next.js application.

### `02-pages/02-guides/scripts.md` — How to load and optimize scripts
- Optimize 3rd party scripts with the built-in Script component.

### `02-pages/02-guides/self-hosting.md` — How to self-host your Next.js application
- Learn how to self-host your Next.js application on a Node.js server, Docker image, or static HTML files (static exports).

### `02-pages/02-guides/static-exports.md` — How to create a static export of your Next.js application
- Next.js enables starting as a static site or Single-Page Application (SPA), then later optionally upgrading to use features that require a server.

### `02-pages/02-guides/tailwind-v3-css.md` — Tailwind CSS
- Style your Next.js Application using Tailwind CSS.

### `02-pages/02-guides/testing/cypress.md` — How to set up Cypress with Next.js
- Learn how to set up Next.js with Cypress for End-to-End (E2E) and Component Testing.

### `02-pages/02-guides/testing/index.md` — Testing
- Learn how to set up Next.js with three commonly used testing tools — Cypress, Playwright, Vitest, and Jest.

### `02-pages/02-guides/testing/jest.md` — How to set up Jest with Next.js
- Learn how to set up Next.js with Jest for Unit Testing.

### `02-pages/02-guides/testing/playwright.md` — How to set up Playwright with Next.js
- Learn how to set up Next.js with Playwright for End-to-End (E2E) and Integration testing.

### `02-pages/02-guides/testing/vitest.md` — How to set up Vitest with Next.js
- Learn how to set up Next.js with Vitest and React Testing Library - two popular unit testing libraries.

### `02-pages/02-guides/third-party-libraries.md` — How to optimize third-party libraries
- Optimize the performance of third-party libraries in your application with the `@next/third-parties` package.

### `02-pages/02-guides/upgrading/codemods.md` — Codemods
- Use codemods to upgrade your Next.js codebase when new features are released.

### `02-pages/02-guides/upgrading/index.md` — Upgrading
- Learn how to upgrade to the latest versions of Next.js.
- To have a coding agent perform and verify an upgrade, run `npx next@canary upgrade --agent=latest`. See Upgrade with a coding agent for details. To upgrade manually, follow a versi

### `02-pages/02-guides/upgrading/version-10.md` — How to upgrade to version 10
- Upgrade your Next.js Application from Version 9 to Version 10.
- There were no breaking changes between versions 9 and 10.
- To upgrade to version 10, run the following command:
- Example: `npm i next@10`

### `02-pages/02-guides/upgrading/version-11.md` — How to upgrade to version 11
- Upgrade your Next.js Application from Version 10 to Version 11.
- Sections: Webpack 5 · Cleaning the distDir is now a default · PORT is now supported for next dev and next start · next.config.js customization to import images · Remove super.componentDidCatch() from pages/_app.js · Remove Container from pages/_app.js · Remove props.url usage from page components · Remove unsized property on next/image
- To upgrade to version 11, run the following command:
- **Good to know:** If you are using TypeScript, ensure you also upgrade `@types/react` and `@types/react-dom` to their corresponding versions.
- Example: `npm i next@11 react@17 react-dom@17`

### `02-pages/02-guides/upgrading/version-12.md` — How to upgrade to version 12
- Upgrade your Next.js Application from Version 11 to Version 12.
- Sections: Upgrading to 12.2 · Upgrading to 12.0
- To upgrade to version 12, run the following command:
- **Good to know:** If you are using TypeScript, ensure you also upgrade `@types/react` and `@types/react-dom` to their corresponding versions.
- Example: `npm i next@12 react@17 react-dom@17 eslint-config-next@12`

### `02-pages/02-guides/upgrading/version-13.md` — How to upgrade to version 13
- Upgrade your Next.js Application from Version 12 to 13.
- Sections: Upgrading from 12 to 13 · v13 Summary · Migrating shared features · Component · <Link> Component · <Script> Component · Font Optimization
- To update to Next.js version 13, run the following command using your preferred package manager:
- **Good to know:** If you are using TypeScript, ensure you also upgrade `@types/react` and `@types/react-dom` to their latest versions.
- Example: `npm i next@13 react@latest react-dom@latest eslint-config-next@13`

### `02-pages/02-guides/upgrading/version-14.md` — How to upgrade to version 14
- Upgrade your Next.js Application from Version 13 to 14.

### `02-pages/02-guides/upgrading/version-15.md` — How to upgrade to version 15
- Upgrade your Next.js Application from Version 14 to 15.

### `02-pages/02-guides/upgrading/version-16.md` — How to upgrade to version 16
- Upgrade your Next.js Application from Version 15 to 16.

### `02-pages/02-guides/upgrading/version-9.md` — How to upgrade to version 9
- Upgrade your Next.js Application from Version 8 to Version 9.
- Sections: Check your Custom App File (pages/_app.js) · Breaking Changes · @zeit/next-typescript is no longer necessary · The config key is now an export on a page · next/dynamic no longer renders "loading..." by default while loading · withAmp has been removed in favor of an exported configuration object · next export no longer exports pages as index.html · pages/api/ is treated differently
- To upgrade to version 9, run the following command:
- **Good to know:** If you are using TypeScript, ensure you also upgrade `@types/react` and `@types/react-dom` to their corresponding versions.
- Example: `npm i next@9`

## `02-pages/03-building-your-application` (21 docs)

### `02-pages/03-building-your-application/01-routing/01-pages-and-layouts.md` — Pages and Layouts
- Create your first page and shared layout with the Pages Router.
- Sections: Index routes · Nested routes · Pages with Dynamic Routes · Layout Pattern · Single Shared Layout with Custom App · Per-Page Layouts · With TypeScript · Data Fetching
- The Pages Router has a file-system based router built on the concept of pages.
- When a file is added to the `pages` directory, it's automatically available as a route.
- Example: `export default function About() { return <div>About</div> }`

### `02-pages/03-building-your-application/01-routing/02-dynamic-routes.md` — Dynamic Routes
- Dynamic Routes are pages that allow you to add custom params to your URLs. Start creating Dynamic Routes and learn more here.
- Sections: Convention · Catch-all Segments · Optional Catch-all Segments
- When you don't know the exact segment names ahead of time and want to create routes from dynamic data, you can use Dynamic Segments that are filled in at request time or prerendere
- A Dynamic Segment can be created by wrapping a file or folder name in square brackets: `[segmentName]`. For example, `[id]` or `[slug]`.
- Example: `import { useRouter } from 'next/router' export default function Page() { const router = useRouter() return <p>Post: {router.query.slug}</p> }`

### `02-pages/03-building-your-application/01-routing/03-linking-and-navigating.md` — Linking and Navigating
- Learn how navigation works in Next.js, and how to use the Link Component and `useRouter` hook.
- Sections: Linking to dynamic paths · Injecting the router · Imperative Routing · Shallow Routing · Caveats
- The Next.js router allows you to do client-side route transitions between pages, similar to a single-page application.
- A React component called `Link` is provided to do this client-side route transition.
- Example: `import { useRouter } from 'next/router' export default function ReadMore() { const router = useRouter() return ( <button onClick={() => router.push('/about')}> `

### `02-pages/03-building-your-application/01-routing/05-custom-app.md` — Custom App
- Control page initialization and add a layout that persists for all pages by overriding the default App component used by Next.js.
- Sections: Usage · getInitialProps with App
- Next.js uses the `App` component to initialize pages. You can override it and control the page initialization and:
- - Create a shared layout between page changes
- Example: `import type { AppProps } from 'next/app' export default function MyApp({ Component, pageProps }: AppProps) { return <Component {...pageProps} /> }`

### `02-pages/03-building-your-application/01-routing/06-custom-document.md` — Custom Document
- Extend the default document markup added by Next.js.
- Sections: Caveats · Customizing renderPage
- A custom `Document` can update the `<html>` and `<body>` tags used to render a Page.
- To override the default `Document`, create the file `pages/_document` as shown below:

### `02-pages/03-building-your-application/01-routing/07-api-routes.md` — API Routes
- Next.js supports API Routes, which allow you to build your API without leaving your Next.js app. Learn how it works here.
- Sections: Parameters · HTTP Methods · Request Helpers · Custom config · Response Helpers · Setting the status code of a response · Sending a JSON response · Sending an HTTP response
- - [API Routes Request Helpers](https://github.com/vercel/next.js/tree/canary/examples/api-routes-middleware)
- - [API Routes with GraphQL](https://github.com/vercel/next.js/tree/canary/examples/api-routes-graphql)
- Example: `export default function handler(req, res) { res.status(200).json({ message: 'Hello from Next.js!' }) }`

### `02-pages/03-building-your-application/01-routing/08-custom-error.md` — Custom Errors
- Override and extend the built-in Error page to handle custom errors.
- Sections: 404 Page · Customizing The 404 Page · 500 Page · Customizing The 500 Page · More Advanced Error Page Customizing · Reusing the built-in error page · Caveats
- A 404 page may be accessed very often. Server-rendering an error page for every visit increases the load of the Next.js server. This can result in increased costs and slow experien
- To avoid the above pitfalls, Next.js provides a static 404 page by default without having to add any additional files.
- Example: `export default function Custom404() { return <h1>404 - Page Not Found</h1> }`

### `02-pages/03-building-your-application/01-routing/index.md` — Routing
- Learn the fundamentals of routing for front-end applications with the Pages Router.
- The Pages Router has a file-system based router built on concepts of pages. When a file is added to the `pages` directory it's automatically available as a route. Learn more about 

### `02-pages/03-building-your-application/02-rendering/01-server-side-rendering.md` — Server-side Rendering (SSR)
- Use Server-side Rendering to render pages on each request.
- Also referred to as "SSR" or "Dynamic Rendering".
- If a page uses **Server-side Rendering**, the page HTML is generated on **each request**.

### `02-pages/03-building-your-application/02-rendering/02-static-site-generation.md` — Static Site Generation (SSG)
- Use Static Site Generation (SSG) to prerender pages at build time.
- Sections: Static Generation without data · Static Generation with data · When should I use Static Generation?
- - [Agility CMS Example](https://github.com/vercel/next.js/tree/canary/examples/cms-agilitycms) ([Demo](https://next-blog-agilitycms.vercel.app/))
- - [Builder.io Example](https://github.com/vercel/next.js/tree/canary/examples/cms-builder-io) ([Demo](https://cms-builder-io.vercel.app/))
- Example: `function About() { return <div>About</div> } export default About`

### `02-pages/03-building-your-application/02-rendering/04-automatic-static-optimization.md` — Automatic Static Optimization
- Next.js automatically optimizes your app to be static HTML whenever possible. Learn how it works here.
- Sections: How it works · Caveats
- Next.js automatically determines that a page is static (can be prerendered) if it has no blocking data requirements. This determination is made by the absence of `getServerSideProp
- This feature allows Next.js to emit hybrid applications that contain **both server-rendered and statically generated pages**.
- Example: `.next/server/pages/about.html`

### `02-pages/03-building-your-application/02-rendering/05-client-side-rendering.md` — Client-side Rendering (CSR)
- Learn how to implement client-side rendering in the Pages Router.
- In Client-Side Rendering (CSR) with React, the browser downloads a minimal HTML page and the JavaScript needed for the page. The JavaScript is then used to update the DOM and rende
- After the page has been loaded for the first time, navigating to other pages on the same website is typically faster, as only necessary data needs to be fetched, and JavaScript can

### `02-pages/03-building-your-application/02-rendering/index.md` — Rendering
- Learn the fundamentals of rendering in React and Next.js.
- Sections: Prerendering
- By default, Next.js **prerenders** every page. This means that Next.js generates HTML for each page in advance, instead of having it all done by client-side JavaScript. Prerenderin
- Each generated HTML is associated with minimal JavaScript code necessary for that page. When a page is loaded by the browser, its JavaScript code runs and makes the page fully inte

### `02-pages/03-building-your-application/03-data-fetching/01-get-static-props.md` — getStaticProps
- Fetch data and generate static pages with `getStaticProps`. Learn more about this API for data fetching in Next.js.
- Sections: When should I use getStaticProps? · When does getStaticProps run · Using getStaticProps to fetch data from a CMS · Write server-side code directly · Statically generates both HTML and JSON · Where can I use getStaticProps · Runs on every request in development · Preview Mode
- If you export a function called `getStaticProps` (Static Site Generation) from a page, Next.js will prerender this page at build time using the props returned by `getStaticProps`.
- Note that irrespective of rendering type, any `props` will be passed to the page component and can be viewed on the client-side in the initial HTML. This is to allow the page to be

### `02-pages/03-building-your-application/03-data-fetching/02-get-static-paths.md` — getStaticPaths
- Fetch data and generate static pages with `getStaticPaths`. Learn more about this API for data fetching in Next.js.
- Sections: When should I use getStaticPaths? · When does getStaticPaths run · How does getStaticProps run with regards to getStaticPaths · Where can I use getStaticPaths · Runs on every request in development · Generating paths on-demand
- If a page has Dynamic Routes and uses `getStaticProps`, it needs to define a list of paths to be statically generated.
- When you export a function called `getStaticPaths` (Static Site Generation) from a page that uses dynamic routes, Next.js will statically prerender all the paths specified by `getS

### `02-pages/03-building-your-application/03-data-fetching/03-get-server-side-props.md` — getServerSideProps
- Fetch data on each request with `getServerSideProps`.
- Sections: When should I use getServerSideProps? · Behavior · Error Handling · Edge Cases · Caching with Server-Side Rendering (SSR)
- `getServerSideProps` is a Next.js function that can be used to fetch data and render the contents of a page at request time.
- You can use `getServerSideProps` by exporting it from a Page Component. The example below shows how you can fetch data from a 3rd party API in `getServerSideProps`, and pass the da

### `02-pages/03-building-your-application/03-data-fetching/05-client-side.md` — Client-side Fetching
- Learn about client-side data fetching, and how to use SWR, a data fetching React Hook library that handles caching, revalidation, focus tracking, refetching on interval and more.
- Sections: Client-side data fetching with useEffect · Client-side data fetching with SWR
- Client-side data fetching is useful when your page doesn't require SEO indexing, when you don't need to prerender your data, or when the content of your pages needs to update frequ
- If done at the page level, the data is fetched at runtime, and the content of the page is updated as the data changes. When used at the component level, the data is fetched at the 

### `02-pages/03-building-your-application/03-data-fetching/index.md` — Data Fetching
- Next.js allows you to fetch data in multiple ways, with prerendering, server-side rendering or static-site generation, and incremental static regeneration. Learn how to manage your application data in Next.js.
- Data fetching in Next.js allows you to render your content in different ways, depending on your application's use case. These include prerendering with **Server-side Rendering** or
- - [Agility CMS Example](https://github.com/vercel/next.js/tree/canary/examples/cms-agilitycms) ([Demo](https://next-blog-agilitycms.vercel.app/))

### `02-pages/03-building-your-application/06-configuring/12-error-handling.md` — Error Handling
- Handle errors in your Next.js app.
- Sections: Handling Errors in Development · Handling Server Errors · Handling Client Errors · Reporting Errors
- This documentation explains how you can handle development, server-side, and client-side errors.
- When there is a runtime error during the development phase of your Next.js application, you will encounter an **overlay**. It is a modal that covers the webpage. It is **only** vis

### `02-pages/03-building-your-application/06-configuring/index.md` — Configuring
- Learn how to configure your Next.js application.
- Next.js allows you to customize your project to meet specific requirements. This includes integrations with TypeScript, ESlint, and more, as well as internal configuration options 

### `02-pages/03-building-your-application/index.md` — Building Your Application
- Learn how to use Next.js features to build your application.

## `02-pages/04-api-reference` (89 docs)

### `02-pages/04-api-reference/01-components/font.md` — Font Module
- API Reference for the Font Module

### `02-pages/04-api-reference/01-components/form.md` — Form
- Learn how to use the `<Form>` component to handle form submissions and search params updates with client-side navigation.

### `02-pages/04-api-reference/01-components/head.md` — Head
- Add custom elements to the `head` of your page with the built-in Head component.
- Sections: Avoid duplicated tags · Use minimal nesting · Use next/script for scripts · No html or body tags
- We expose a built-in component for appending elements to the `head` of the page:
- To avoid duplicate tags in your `head` you can use the `key` property, which will make sure the tag is only rendered once, as in the following example:
- Example: `import Head from 'next/head' function IndexPage() { return ( <div> <Head> <title>My page title</title> </Head> <p>Hello world!</p> </div> ) } export default Ind`

### `02-pages/04-api-reference/01-components/image-legacy.md` — Image (Legacy) [legacy]
- Backwards compatible Image Optimization with the Legacy Image component.
- Sections: Comparison · Required Props · src · width · height · Optional Props · layout · loader
- Starting with Next.js 13, the `next/image` component was rewritten to improve both the performance and developer experience. In order to provide a backwards compatible upgrade solu
- **Warning**: `next/legacy/image` is deprecated and will be removed in a future version of Next.js. Please use `next/image` instead.
- History: v16.0.0: `next/legacy/image` deprecated and will be removed in a future version of Next.js. Please use `next/image` instead.; v13.0.0: `next/image` renamed to `next/legacy/image`
- Example: `import Image from 'next/legacy/image' const myLoader = ({ src, width, quality }) => { return `https://example.com/${src}?w=${width}&q=${quality || 75}` } const `

### `02-pages/04-api-reference/01-components/image.md` — Image
- Optimize Images in your Next.js Application using the built-in `next/image` Component.

### `02-pages/04-api-reference/01-components/index.md` — Components
- API Reference for Next.js built-in components in the Pages Router.

### `02-pages/04-api-reference/01-components/link.md` — Link
- API reference for the `<Link>` component.

### `02-pages/04-api-reference/01-components/script.md` — Script
- Optimize third-party scripts in your Next.js application using the built-in `next/script` Component.

### `02-pages/04-api-reference/02-file-conventions/index.md` — File-system conventions
- API Reference for Next.js file-system conventions.

### `02-pages/04-api-reference/02-file-conventions/instrumentation.md` — instrumentation.js
- API reference for the instrumentation.js file.

### `02-pages/04-api-reference/02-file-conventions/proxy.md` — Proxy
- Learn how to use Proxy to run code before a request is completed.

### `02-pages/04-api-reference/02-file-conventions/public-folder.md` — public Folder
- Next.js allows you to serve static files, like images, in the public directory. You can learn how it works here.

### `02-pages/04-api-reference/02-file-conventions/src-folder.md` — src Directory
- Save pages under the `src` folder as an alternative to the root `pages` directory.

### `02-pages/04-api-reference/03-functions/catchError.md` — catchError
- API Reference for the catchError function.

### `02-pages/04-api-reference/03-functions/get-initial-props.md` — getInitialProps
- Fetch dynamic data on the server for your React component with getInitialProps.
- Sections: Context Object · Caveats
- **Good to know**: `getInitialProps` is a legacy API. We recommend using `getStaticProps` or `getServerSideProps` instead.
- `getInitialProps` is an `async` function that can be added to the default exported React component for the page. It will run on both the server-side and again on the client-side du

### `02-pages/04-api-reference/03-functions/get-server-side-props.md` — getServerSideProps
- API reference for `getServerSideProps`. Learn how to fetch data on each request with Next.js.
- Sections: Context parameter · getServerSideProps return values · props · notFound · redirect
- When exporting a function called `getServerSideProps` (Server-Side Rendering) from a page, Next.js will prerender this page on each request using the data returned by `getServerSid
- You can import modules in top-level scope for use in `getServerSideProps`. Imports used will **not be bundled for the client-side**. This means you can write **server-side code dir
- History: v13.4.0: App Router is now stable with simplified data fetching; v10.0.0: `locale`, `locales`, `defaultLocale`, and `notFound` options added.; v9.3.0: `getServerSideProps` introduced.
- Example: `export async function getServerSideProps(context) { return { props: { message: `Next.js is awesome` }, // will be passed to the page component as props } }`

### `02-pages/04-api-reference/03-functions/get-static-paths.md` — getStaticPaths
- API reference for `getStaticPaths`. Learn how to fetch data and generate static pages with `getStaticPaths`.
- Sections: getStaticPaths return values · paths · fallback: false · fallback: true · fallback: 'blocking' · Fallback pages
- When exporting a function called `getStaticPaths` from a page that uses Dynamic Routes, Next.js will statically prerender all the paths specified by `getStaticPaths`.
- The `getStaticPaths` function should return an object with the following **required** properties:
- History: v13.4.0: App Router is now stable with simplified data fetching, including `generateStaticParams()`; v12.2.0: On-Demand Incremental Static Regeneration is stable.; v12.1.0: On-Demand Incremental Static Regeneration added (beta).; v9.5.0: Stable Incremental Static Regeneration
- Example: `return { paths: [ { params: { id: '1' }}, { params: { id: '2' }, // with i18n configured the locale for the path can be returned as well locale: "en", }, ], fal`

### `02-pages/04-api-reference/03-functions/get-static-props.md` — getStaticProps
- API reference for `getStaticProps`. Learn how to use `getStaticProps` to generate static pages with Next.js.
- Sections: Context parameter · getStaticProps return values · props · revalidate · notFound · redirect · Reading files: Use process.cwd()
- Exporting a function called `getStaticProps` will prerender a page at build time using the props returned from the function:
- You can import modules in top-level scope for use in `getStaticProps`. Imports used will **not be bundled for the client-side**. This means you can write **server-side code directl
- History: v13.4.0: App Router is now stable with simplified data fetching; v12.2.0: On-Demand Incremental Static Regeneration is stable.; v12.1.0: On-Demand Incremental Static Regeneration added (beta).; v10.0.0: `locale`, `locales`, `defaultLocale`, and `notFound` options added.
- Example: `export async function getStaticProps(context) { return { props: { message: `Next.js is awesome` }, // will be passed to the page component as props } }`

### `02-pages/04-api-reference/03-functions/index.md` — Functions
- API Reference for Functions and Hooks in Pages Router.

### `02-pages/04-api-reference/03-functions/next-request.md` — NextRequest
- API Reference for NextRequest.

### `02-pages/04-api-reference/03-functions/next-response.md` — NextResponse
- API Reference for NextResponse.

### `02-pages/04-api-reference/03-functions/use-params.md` — useParams
- API Reference for the useParams hook in the Pages Router.
- Sections: Parameters · Returns · Behavior · Behavior during prerendering · Using with getServerSideProps · Comparison with router.query · Sharing components with App Router
- `useParams` is a hook that lets you read a route's dynamic params filled in by the current URL.
- `useParams` does not take any parameters.
- History: v13.3.0: `useParams` introduced.
- Example: `const params = useParams()`

### `02-pages/04-api-reference/03-functions/use-report-web-vitals.md` — useReportWebVitals
- Send Core Web Vitals to analytics with `useReportWebVitals`, and Next.js custom performance metrics with the `reportWebVitals` export from `pages/_app`.

### `02-pages/04-api-reference/03-functions/use-router.md` — useRouter
- Learn more about the API of the Next.js Router, and access the router instance in your page with the useRouter hook.
- Sections: router object · router.push · router.replace · router.prefetch · router.beforePopState · router.back · router.reload · router.events
- If you want to access the `router` object inside any function component in your app, you can use the `useRouter` hook, take a look at the following example:
- `useRouter` is a [React Hook](https://react.dev/learn#using-hooks), meaning it cannot be used with classes. You can either use withRouter or wrap your class in a function component
- Example: `router.push(url, as, options)`

### `02-pages/04-api-reference/03-functions/use-search-params.md` — useSearchParams
- API Reference for the useSearchParams hook in the Pages Router.
- Sections: Parameters · Returns · Behavior · Behavior during prerendering · Using with getServerSideProps · Updating search params · Sharing components with App Router
- `useSearchParams` is a hook that lets you read the current URL's **query string**.
- `useSearchParams` returns a **read-only** version of the [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) interface.
- History: v13.0.0: `useSearchParams` introduced.
- Example: `const searchParams = useSearchParams()`

### `02-pages/04-api-reference/03-functions/userAgent.md` — userAgent
- The userAgent helper extends the Web Request API with additional properties and methods to interact with the user agent object from the request.

### `02-pages/04-api-reference/04-config/01-next-config-js/adapterPath.md` — adapterPath
- Configure a custom adapter for Next.js to hook into the build process.

### `02-pages/04-api-reference/04-config/01-next-config-js/allowedDevOrigins.md` — allowedDevOrigins
- Use `allowedDevOrigins` to configure additional origins that can request the dev server.

### `02-pages/04-api-reference/04-config/01-next-config-js/assetPrefix.md` — assetPrefix
- Learn how to use the assetPrefix config option to configure your CDN.

### `02-pages/04-api-reference/04-config/01-next-config-js/basePath.md` — basePath
- Use `basePath` to deploy a Next.js application under a sub-path of a domain.

### `02-pages/04-api-reference/04-config/01-next-config-js/bundlePagesRouterDependencies.md` — bundlePagesRouterDependencies
- Enable automatic dependency bundling for Pages Router
- Enable automatic server-side dependency bundling for Pages Router applications. Matches the automatic dependency bundling in App Router.
- Explicitly opt-out certain packages from being bundled using the `serverExternalPackages` option.
- History: v15.0.0: Moved from experimental to stable. Renamed from `bundlePagesExternals` to `bundlePagesRouterDependencies`
- Example: `/** @type {import('next').NextConfig} */ const nextConfig = { bundlePagesRouterDependencies: true, } module.exports = nextConfig`

### `02-pages/04-api-reference/04-config/01-next-config-js/compress.md` — compress
- Next.js provides gzip compression to compress rendered content and static files, it only works with the server target. Learn more about it here.

### `02-pages/04-api-reference/04-config/01-next-config-js/crossOrigin.md` — crossOrigin
- Use the `crossOrigin` option to add a crossOrigin tag on the `script` tags generated by `next/script` and `next/head`.

### `02-pages/04-api-reference/04-config/01-next-config-js/deploymentId.md` — deploymentId
- Configure a deployment identifier used for version skew protection and cache busting.

### `02-pages/04-api-reference/04-config/01-next-config-js/devIndicators.md` — devIndicators
- Optimized pages include an indicator to let you know if it's being statically optimized. You can opt-out of it here.

### `02-pages/04-api-reference/04-config/01-next-config-js/distDir.md` — distDir
- Set a custom build directory to use instead of the default .next directory.

### `02-pages/04-api-reference/04-config/01-next-config-js/enablePrerenderSourceMaps.md` — enablePrerenderSourceMaps
- Enable source maps for errors during prerendering in next build.

### `02-pages/04-api-reference/04-config/01-next-config-js/env.md` — env
- Learn to add and access environment variables in your Next.js application at build time.

### `02-pages/04-api-reference/04-config/01-next-config-js/exportPathMap.md` — exportPathMap
- Customize the pages that will be exported as HTML files when using `next export`.

### `02-pages/04-api-reference/04-config/01-next-config-js/generateBuildId.md` — generateBuildId
- Configure the build id, which is used to identify the current build in which your application is being served.

### `02-pages/04-api-reference/04-config/01-next-config-js/generateEtags.md` — generateEtags
- Next.js will generate etags for every page by default. Learn more about how to disable etag generation here.

### `02-pages/04-api-reference/04-config/01-next-config-js/headers.md` — headers
- Add custom HTTP headers to your Next.js app.

### `02-pages/04-api-reference/04-config/01-next-config-js/httpAgentOptions.md` — httpAgentOptions
- Next.js will automatically use HTTP Keep-Alive by default. Learn more about how to disable HTTP Keep-Alive here.

### `02-pages/04-api-reference/04-config/01-next-config-js/images.md` — images
- Custom configuration for the next/image loader

### `02-pages/04-api-reference/04-config/01-next-config-js/index.md` — next.config.js Options
- Learn about the options available in next.config.js for the Pages Router.

### `02-pages/04-api-reference/04-config/01-next-config-js/logging.md` — logging
- Configure logging behavior in the terminal when running Next.js in development mode.

### `02-pages/04-api-reference/04-config/01-next-config-js/onDemandEntries.md` — onDemandEntries
- Configure how Next.js will dispose and keep in memory pages created in development.

### `02-pages/04-api-reference/04-config/01-next-config-js/optimizePackageImports.md` — optimizePackageImports [experimental]
- API Reference for optimizePackageImports Next.js Config Option

### `02-pages/04-api-reference/04-config/01-next-config-js/output.md` — output
- Next.js automatically traces which files are needed by each page to allow for easy deployment of your application. Learn how it works here.

### `02-pages/04-api-reference/04-config/01-next-config-js/pageExtensions.md` — pageExtensions
- Extend the default page extensions used by Next.js when resolving pages in the Pages Router.

### `02-pages/04-api-reference/04-config/01-next-config-js/poweredByHeader.md` — poweredByHeader
- Next.js will add the `x-powered-by` header by default. Learn to opt-out of it here.

### `02-pages/04-api-reference/04-config/01-next-config-js/productionBrowserSourceMaps.md` — productionBrowserSourceMaps
- Enables browser source map generation during the production build.

### `02-pages/04-api-reference/04-config/01-next-config-js/proxyClientMaxBodySize.md` — experimental.proxyClientMaxBodySize
- Configure the maximum request body size when using proxy.

### `02-pages/04-api-reference/04-config/01-next-config-js/reactStrictMode.md` — reactStrictMode
- The complete Next.js runtime is now Strict Mode-compliant, learn how to opt-in

### `02-pages/04-api-reference/04-config/01-next-config-js/redirects.md` — redirects
- Add redirects to your Next.js app.

### `02-pages/04-api-reference/04-config/01-next-config-js/rewrites.md` — rewrites
- Add rewrites to your Next.js app.

### `02-pages/04-api-reference/04-config/01-next-config-js/serverExternalPackages.md` — serverExternalPackages
- Opt-out specific dependencies from the dependency bundling enabled by `bundlePagesRouterDependencies`.
- Opt-out specific dependencies from being included in the automatic bundling of the `bundlePagesRouterDependencies` option.
- These pages will then use native Node.js `require` to resolve the dependency.
- Example: `/** @type {import('next').NextConfig} */ const nextConfig = { serverExternalPackages: ['@acme/ui'], } module.exports = nextConfig`

### `02-pages/04-api-reference/04-config/01-next-config-js/skipProxyUrlNormalize.md` — skipProxyUrlNormalize
- Let Proxy see the original request instead of Next.js's normalized version. Formerly skipMiddlewareUrlNormalize.

### `02-pages/04-api-reference/04-config/01-next-config-js/skipTrailingSlashRedirect.md` — skipTrailingSlashRedirect
- Disable the automatic trailing slash redirects so you can handle trailing slashes yourself in Proxy.

### `02-pages/04-api-reference/04-config/01-next-config-js/trailingSlash.md` — trailingSlash
- Configure Next.js pages to resolve with or without a trailing slash.

### `02-pages/04-api-reference/04-config/01-next-config-js/transpilePackages.md` — transpilePackages
- Automatically transpile and bundle dependencies from local packages (like monorepos) or from external dependencies (`node_modules`).

### `02-pages/04-api-reference/04-config/01-next-config-js/turbopack.md` — turbopack
- Configure Next.js with Turbopack-specific options

### `02-pages/04-api-reference/04-config/01-next-config-js/turbopackChunking.md` — turbopackChunking [experimental]
- Configure how Turbopack splits your client-side JavaScript into chunks in production.

### `02-pages/04-api-reference/04-config/01-next-config-js/typescript.md` — typescript
- Next.js reports TypeScript errors by default. Learn to opt-out of this behavior here.

### `02-pages/04-api-reference/04-config/01-next-config-js/urlImports.md` — urlImports [experimental]
- Configure Next.js to allow importing modules from external URLs.

### `02-pages/04-api-reference/04-config/01-next-config-js/useLightningcss.md` — useLightningcss [experimental]
- Enable experimental support for Lightning CSS.

### `02-pages/04-api-reference/04-config/01-next-config-js/useTypeScriptCli.md` — useTypeScriptCli [experimental]
- Run the project-local TypeScript CLI for type checking during production builds.

### `02-pages/04-api-reference/04-config/01-next-config-js/webpack.md` — Custom Webpack Config
- Learn how to customize the webpack config used by Next.js

### `02-pages/04-api-reference/04-config/01-next-config-js/webVitalsAttribution.md` — webVitalsAttribution
- Learn how to use the webVitalsAttribution option to pinpoint the source of Web Vitals issues.

### `02-pages/04-api-reference/04-config/01-typescript.md` — TypeScript
- Next.js provides a TypeScript-first development experience for building your React application.

### `02-pages/04-api-reference/04-config/02-eslint.md` — ESLint
- Next.js reports ESLint errors and warnings during builds by default. Learn how to opt-out of this behavior here.

### `02-pages/04-api-reference/04-config/index.md` — Configuration
- Learn how to configure your Next.js application.

### `02-pages/04-api-reference/05-cli/create-next-app.md` — create-next-app CLI
- Create Next.js apps using one command with the create-next-app CLI.

### `02-pages/04-api-reference/05-cli/index.md` — CLI
- API Reference for the Next.js Command Line Interface (CLI) tools.

### `02-pages/04-api-reference/05-cli/next.md` — next CLI
- Learn how to run and build your application with the Next.js CLI.

### `02-pages/04-api-reference/06-adapters/01-configuration.md` — Configuration
- Configure `adapterPath` or `NEXT_ADAPTER_PATH` to use a custom deployment adapter.

### `02-pages/04-api-reference/06-adapters/02-creating-an-adapter.md` — Creating an Adapter
- Create an adapter module that implements the `NextAdapter` interface.

### `02-pages/04-api-reference/06-adapters/03-api-reference.md` — API Reference
- Reference for `modifyConfig` and `onBuildComplete` in the `NextAdapter` interface.

### `02-pages/04-api-reference/06-adapters/04-testing-adapters.md` — Testing Adapters
- Validate adapters with the Next.js compatibility test harness and custom lifecycle scripts.

### `02-pages/04-api-reference/06-adapters/05-routing-with-next-routing.md` — Routing with @next/routing
- Use `@next/routing` to apply Next.js route matching behavior in adapters.

### `02-pages/04-api-reference/06-adapters/06-runtime-integration.md` — Runtime Integration
- Understand how build-time adapters and runtime cache interfaces work together.

### `02-pages/04-api-reference/06-adapters/07-invoking-entrypoints.md` — Invoking Entrypoints
- Invoke Node.js and Edge build entrypoints with adapter runtime context.

### `02-pages/04-api-reference/06-adapters/08-output-types.md` — Output Types
- Reference for all build output types exposed to adapters.

### `02-pages/04-api-reference/06-adapters/09-routing-information.md` — Routing Information
- Reference for routing phases and route fields exposed in `onBuildComplete`.

### `02-pages/04-api-reference/06-adapters/10-use-cases.md` — Use Cases
- Common patterns and examples for deployment adapter implementations.

### `02-pages/04-api-reference/06-adapters/index.md` — Adapters
- Build deployment adapters for Next.js platforms and infrastructure.

### `02-pages/04-api-reference/06-edge.md` — Edge Runtime
- API Reference for the Edge Runtime.

### `02-pages/04-api-reference/08-turbopack.md` — Turbopack
- Turbopack is an incremental bundler optimized for JavaScript and TypeScript, written in Rust, and built into Next.js.

### `02-pages/04-api-reference/index.md` — API Reference
- Next.js API Reference for the Pages Router.

## `02-pages/index.md` (1 docs)

### `02-pages/index.md` — Pages Router
- Before Next.js 13, the Pages Router was the main way to create routes in Next.js with an intuitive file-system router.
- You're viewing the documentation for the Pages Router. See the App Router documentation for the latest features.
- The **Pages Router** uses an intuitive file-system router to map each file to a route.

## `03-architecture/accessibility.md` (1 docs)

### `03-architecture/accessibility.md` — Accessibility
- The built-in accessibility features of Next.js.
- Sections: Route Announcements · Linting · Accessibility Resources
- The Next.js team is committed to making Next.js accessible to all developers (and their end-users). By adding accessibility features to Next.js by default, we aim to make the Web m
- When transitioning between pages rendered on the server (e.g. using the `<a href>` tag) screen readers and other assistive technology announce the page title when the page loads so

## `03-architecture/fast-refresh.md` (1 docs)

### `03-architecture/fast-refresh.md` — Fast Refresh
- Fast Refresh is a hot module reloading experience that gives you instantaneous feedback on edits made to your React components.
- Sections: How It Works · Error Resilience · Syntax Errors · Runtime Errors · Limitations · Tips · Fast Refresh and Hooks
- Fast refresh is a React feature integrated into Next.js that allows you to live reload the browser page while maintaining temporary client-side state when you save changes to a fil
- - If you edit a file that **only exports React component(s)**, Fast Refresh will

## `03-architecture/index.md` (1 docs)

### `03-architecture/index.md` — Architecture
- How Next.js Works
- Learn about the Next.js architecture and how it works under the hood.

## `03-architecture/nextjs-compiler.md` (1 docs)

### `03-architecture/nextjs-compiler.md` — Next.js Compiler
- Next.js Compiler, written in Rust, which transforms and minifies your Next.js application.
- Sections: Why SWC? · Supported Features · Styled Components · Jest · Relay · Remove React Properties · Remove Console · Legacy Decorators
- The Next.js Compiler, written in Rust using [SWC](https://swc.rs/), allows Next.js to transform and minify your JavaScript code for production. This replaces Babel for individual f
- Compilation using the Next.js Compiler is 17x faster than Babel and enabled by default since Next.js version 12. If you have an existing Babel configuration or are using unsupporte
- History: v13.1.0: [Module Transpilation](https://nextjs.org/blog/next-13-1#built-in-module-transpilation-stable) and [Modularize Imports](; v13.0.0: SWC Minifier enabled by default.; v12.3.0: SWC Minifier [stable](https://nextjs.org/blog/next-12-3#swc-minifier-stable).; v12.2.0: SWC Plugins experimental support added.
- Example: `module.exports = { compiler: { styledComponents: true, }, }`

## `03-architecture/supported-browsers.md` (1 docs)

### `03-architecture/supported-browsers.md` — Supported Browsers
- Browser support and which JavaScript features are supported by Next.js.
- Sections: Browserslist · Polyfills · Custom Polyfills · JavaScript Language Features · TypeScript Features · Customizing Babel Config (Advanced)
- Next.js supports **modern browsers** with zero configuration.
- If you would like to target specific browsers or features, Next.js supports [Browserslist](https://browsersl.ist) configuration in your `package.json` file. Next.js uses the follow
- Example: `{ "browserslist": ["chrome 111", "edge 111", "firefox 111", "safari 16.4"] }`

## `04-community/01-contribution-guide.md` (1 docs)

### `04-community/01-contribution-guide.md` — Docs Contribution Guide
- Learn how to contribute to Next.js Documentation
- Sections: Why Contribute? · How to Contribute · GitHub Workflow · Writing MDX · VSCode · Review Process · File Structure · Metadata
- Welcome to the Next.js Docs Contribution Guide! We're excited to have you here.
- This page provides instructions on how to edit the Next.js documentation. Our goal is to ensure that everyone in the community feels empowered to contribute and improve our docs.
- Example: `{ "files.associations": { "*.mdx": "markdown" } }`

## `04-community/02-rspack.md` (1 docs)

### `04-community/02-rspack.md` — Rspack Integration [experimental]
- Use the `next-rspack` plugin to bundle your Next.js with Rspack.
- The Rspack team has created a community plugin for Next.js, which is part of a [partnering effort](https://rspack.rs/blog/rspack-next-partner) with the Rspack team.
- This plugin is currently experimental. Please use this [discussion thread](https://github.com/vercel/next.js/discussions/77800) to give feedback on any issues you encounter.

## `04-community/index.md` (1 docs)

### `04-community/index.md` — Next.js Community
- Get involved in the Next.js community.
- Sections: Contributing · Discussions · Social Media · Code of Conduct
- With over 5 million weekly downloads, Next.js has a large and active community of developers across the world. Here's how you can get involved in our community:
- There are a couple of ways you can contribute to the development of Next.js:

## `index.md` (1 docs)

### `index.md` — Next.js Docs
- Welcome to the Next.js Documentation.
- Sections: What is Next.js? · How to use the docs · App Router and Pages Router · React version handling · Pre-requisite knowledge · Accessibility · Join our Community
- Welcome to the Next.js documentation!
- Next.js is a React framework for building full-stack web applications. You use React Components to build user interfaces, and Next.js for additional features and optimizations.
