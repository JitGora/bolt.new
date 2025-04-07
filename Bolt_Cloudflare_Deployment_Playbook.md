# Bolt + Cloudflare Deployment Playbook

---

## Part 1: How Bolt Works

### Overview

Bolt is an AI-powered, browser-based development environment built with:

- **Remix**: A full-stack React framework.
- **Vite**: A fast build tool and dev server.
- **WebContainer API**: Runs Node.js inside the browser.
- **Claude AI SDK**: Integrates Anthropic's Claude models.
- **Cloudflare Pages + Functions**: Hosts the app with serverless backend.

---

### Architecture

```mermaid
flowchart TD
    User[User in Browser]
    subgraph Cloudflare Pages
      Static[Static Assets (HTML, CSS, JS)]
      Function[Serverless Function (Remix Server)]
    end
    subgraph Browser
      WebContainer[WebContainer API (Node.js VM)]
      UI[Remix React UI]
    end
    User --> UI
    UI -->|API Calls| Function
    UI -->|Runs Code| WebContainer
    Function -->|SSR, API| User
```

- The **Remix UI** runs in the browser.
- The **WebContainer API** allows running Node.js code directly in-browser.
- The **Claude AI SDK** enables AI-powered features.
- **Cloudflare Pages** hosts static assets and serverless functions for SSR and APIs.

---

## Part 2: How We Deployed Bolt to Cloudflare

### 1. Environment Setup

- Ensure **Node.js** and **pnpm** are installed.
- Create `.env.local` with your Anthropic API key:

  ```
  ANTHROPIC_API_KEY=your-key
  VITE_LOG_LEVEL=debug
  ```

---

### 2. Project Configuration

- **`remix.config.js`**: Configured to output server bundle to `build/server`.
- **`vite.config.ts`**:
  - Integrates UnoCSS, Node polyfills, CSS modules.
  - **Disabled Miniflare** in production builds to avoid build errors.
- **`wrangler.toml`**:
  - Specifies static assets directory.
  - Removed unsupported `[build]` and `[functions]` sections for Pages compatibility.

---

### 3. Building the Project

- Run:

  ```bash
  pnpm install
  pnpm run build
  ```

- This uses **Remix + Vite** to generate:
  - Static assets in `build/client`.
  - Server bundle in `build/server/index.js`.

---

### 4. Fixing Build Issues

- Disabled Miniflare proxy during production builds in `vite.config.ts`.
- Ensured Vite handled:
  - **Sass** files (`.scss`).
  - **UnoCSS** virtual imports.
  - **Node.js polyfills** for browser compatibility.

---

### 5. Deploying to Cloudflare Pages

- Used Wrangler CLI:

  ```bash
  npx wrangler pages deploy ./build/client
  ```

- Wrangler:
  - Uploaded static assets.
  - Linked server bundle for SSR.
  - Created or updated the Cloudflare Pages project.

- Deployment URL was generated, e.g.:

  ```
  https://your-project.pages.dev
  ```

---

## Summary

- Bolt combines AI, in-browser Node.js, and Remix for a powerful dev environment.
- The build process uses Remix + Vite, outputting static and server bundles.
- Deployment to Cloudflare Pages required:
  - Correct build output.
  - Disabling Miniflare during build.
  - Cleaning up `wrangler.toml`.
- The final deployment is a **serverless, AI-powered IDE** running entirely in the browser, hosted on Cloudflare.

---
