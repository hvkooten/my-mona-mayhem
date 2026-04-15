# Mona Mayhem - Copilot Instructions

## Project Overview

This is a workshop template for building a retro arcade-themed GitHub Contribution Battle Arena using Astro. The app compares GitHub contribution graphs of two users in a "battle" format with a retro gaming aesthetic.

**Tech Stack:**
- Framework: Astro v5 (SSR mode with @astrojs/node adapter)
- Runtime: Node.js
- Font: Press Start 2P (retro gaming font)
- API: GitHub's contribution graph API (https://github.com/{username}.contribs)

## Build & Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Production build
npm run build

# Preview production build
npm preview

# Run Astro CLI
npm run astro
```

**Important:** If changes don't appear in the browser (especially new routes or major changes), stop the dev server (Ctrl+C) and restart with `npm run dev`.

## Architecture

### Server-Side Rendering (SSR)

This project uses Astro's **server mode** with the Node.js adapter in standalone mode (`output: 'server'` in astro.config.mjs). All routes are server-rendered by default unless explicitly marked with `export const prerender = true`.

### File Structure

```
src/
└── pages/
    ├── index.astro              # Main battle arena page
    └── api/
        └── contributions/
            └── [username].ts    # Server-side API proxy for GitHub data
```

### API Route Pattern

The `src/pages/api/contributions/[username].ts` file defines a server-side API endpoint that:
- Uses Astro's dynamic route parameters (`[username]`)
- Disables prerendering with `export const prerender = false`
- Implements a `GET` handler that fetches data from GitHub's contribution graph API
- Acts as a CORS proxy to avoid client-side cross-origin issues

**Example endpoint:** `/api/contributions/octocat`

### Page Structure

- **index.astro** - The main page uses Astro's file-based routing. It contains:
  - Two username input fields (Player 1 and Player 2)
  - A "battle" button to trigger the comparison
  - Results area displaying contribution data and the winner

## Key Conventions

### Astro Component Structure

Astro components (`.astro` files) have three main sections:
1. **Frontmatter** - JavaScript/TypeScript code between `---` delimiters at the top
2. **Template** - HTML-like markup
3. **Styling** - `<style>` tags (scoped by default)

```astro
---
// Frontmatter: runs server-side
const data = await fetchData();
---

<div>
  <!-- Template: HTML with dynamic expressions -->
  <p>{data.message}</p>
</div>

<style>
  /* Scoped by default */
  p { color: blue; }
</style>
```

### API Routes

API routes in `src/pages/api/` must:
- Export HTTP method handlers (GET, POST, etc.) as named exports
- Use the `APIRoute` type from 'astro'
- Set `export const prerender = false` for SSR routes
- Return `Response` objects

```typescript
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
```

### GitHub Contribution Data API

The GitHub contribution data is fetched from:
```
https://github.com/{username}.contribs
```

This endpoint returns JSON with contribution calendar data. The API proxy in this project fetches this data server-side to avoid CORS restrictions.

### Retro Gaming Theme

The design uses:
- Press Start 2P font (Google Fonts)
- Arcade/pixel aesthetic
- Bright colors and retro UI patterns
- "Battle" metaphor for comparing contributions

## Workshop Context

This repository is a **starting point** for a GitHub Copilot workshop. The workshop teaches:
- Context engineering with `.github/copilot-instructions.md`
- Planning before coding (Plan Mode)
- Agentic implementation (Agent Mode)
- Design-first theming
- Parallel work with multiple agents

The `workshop/` directory contains detailed step-by-step guides but is NOT part of the application itself—it's teaching material.

### What Exists vs. What Needs Building

**Current state:**
- Basic Astro project structure
- Placeholder `index.astro` with minimal content
- Stub API route (`[username].ts`) with TODO comments

**To be built during workshop:**
- Complete API proxy implementation with error handling and caching
- Battle page UI with username inputs and results display
- Retro arcade styling and animations
- Contribution data visualization
- Winner determination logic
