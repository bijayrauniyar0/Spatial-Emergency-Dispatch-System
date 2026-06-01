---

# NAXA React Starter Kit v6

This starter kit provides a robust, production-ready foundation for building modern web applications with Next.js 15, TypeScript, and Tailwind CSS. It emphasizes a modular architecture, centralized state management, and a powerful service layer for API interactions.

---

## Getting Started

### Prerequisites

* Node.js 18+
* pnpm

### Installation

1. Clone the repository.

   ```bash
   git@github.com:naxa-developers/frontend-starterkit-v6.git
   ```
2. Install dependencies:

   ```bash
   pnpm install
   ```
3. Configure environment variables by copying `env.txt` to `.env.local` and filling required values.
4. Start the development server:

   ```bash
   pnpm dev
   ```

---

## Architecture

The project follows a **Feature-Based Modular Service Architecture**, designed for scalability, maintainability, and AI-assisted development.

### Core Principles

* **Feature-based architecture** (each feature = self-contained module)
* **Sub-feature support** for scalable complexity
* **Server-first rendering model** (Next.js App Router)
* **Donut composition pattern** (Server outside, Client inside)
* **Centralized API layer** using resource factories
* **Strict feature boundaries** via public APIs (`index.ts`)

---

### Feature Architecture

All business logic must live inside:

```
src/features/[feature]/
```

Each feature contains:

```
components/     UI + feature components
hooks/          feature-specific hooks
store/          Zustand (UI state only)
services/       API resources (factory-based)
validations/    Zod schemas
constants/      static values
pages/          sub-feature pages (optional)
index.ts        public API
```

---

### Sub-Feature Architecture

Used when:

* Feature becomes large
* Multiple independent flows exist

#### Structure

```
components/[SubFeatureName]/     (PascalCase)
pages/[subFeature]/              (route-aligned)
```

#### Example

```
src/features/users/
  components/
    UserDetails/
    UserSettings/
  pages/
    userDetails/
    userSettings/
```

---

### Routing (App Router)

```ts
// src/app/(main)/users/userDetails/page.tsx
import { UserDetailsPage } from "@/features/users/pages/UserDetails";
```

---

### Feature Boundaries

```ts
// ✅ Allowed
import { UserForm } from "@/features/users";

// ❌ Forbidden
import UserForm from "@/features/users/components/UserForm";
```

* No deep imports across features
* Communication via:

  * Props
  * Global store (only if necessary)

---

## Server vs Client Components (Donut Pattern)

The project follows a **Server-first rendering model**.

### Core Rule

> Default to Server Components
> Use Client Components only when interaction is required

---

### Server Components (Default)

Used for:

* Data fetching
* Layout composition
* Feature orchestration

```tsx
export default async function Page() {
  const { data } = await userServerResource.request({
    pathKey: "listUsers",
  });

  return <UserList data={data} />;
}
```

---

### Client Components

Use only when needed:

* `useState`, `useEffect`
* Event handlers
* Browser APIs
* Forms and UI state

```tsx
"use client";

export function UserActions() {
  const [loading, setLoading] = useState(false);

  return <button onClick={() => setLoading(true)}>Save</button>;
}
```

---

### Donut Pattern

```
Server Page / Layout
    ↓
Server Data Layer
    ↓
Server Feature Components
    ↓
Client Interaction Islands
```

---

### Rules

* Never mark entire feature as `"use client"`
* Isolate interactivity into small components
* Prefer splitting over converting

---

## Folder Structure

* `src/app/` → App Router (thin wrappers only)
* `src/components/`

  * `common/` → shared components
  * `ui/` → base UI (Shadcn)
* `src/features/` → **core architecture (features + sub-features)**
* `src/services/` → API factories only
* `src/store/` → global Zustand (UI state)
* `src/lib/` → configs (auth, query)
* `src/validations/` → shared schemas (rare)
* `src/utils/` → helpers

---

## API Proxying

To avoid CORS issues:

* Client calls → `/api/backend/*`
* Rewritten via `next.config.ts` → `NEXT_PUBLIC_API_V1`

---

## Service Layer

All API logic lives in `src/services`.

* Uses factory pattern
* Shared between Client + Server
* Strongly typed

---

## State Management

* **UI State** → Zustand
* **Server State** → TanStack Query

### Rules

* Do not store API data manually
* Do not mix UI + server state

---

## API Resource Factories

### Client (`makeClientApiResource`)

* Generates:

  * `useApiQuery`
  * `useApiMutation`
  * `useInfiniteApiQuery`

### Server (`makeServerApiResource`)

* Used in Server Components
* Handles cookies automatically

---

## Authentication & Token Rotation

* Cookie-based auth
* Axios interceptor handles:

  * 401 errors
  * token refresh
  * request retry queue

---

## Modal Management

Centralized modal system using Zustand.

* Register in `modal-registry.tsx`
* Typed modal data via `ModalDataMap`
* Trigger via `useModalActions`

---

## Forms & Validation

* React Hook Form + Zod
* Schema-first validation
* Typed end-to-end

---

## Shared Components

### FileUploader

* Drag & drop
* Validation
* Preview support

### MapLibre

* Map system
* Layer control
* Hooks for map access

---

## Theming

* Tailwind CSS 4
* OKLCH color system
* Centralized tokens in `globals.css`

---

## Development Guidelines

### Do

* Use API factories
* Keep logic inside features
* Use Server Components by default
* Follow Donut pattern
* Type everything

---

### Don’t

* Use axios directly
* Break feature boundaries
* Create large components
* Duplicate logic
* Mark entire feature as client

---

## Summary (What matters most)

* Features are the **source of truth**
* Pages are **thin wrappers**
* API is **centralized**
* Server Components are **default**
* Client Components are **isolated**
* Architecture is **strict by design**

---

If you want, next step I’d strongly recommend:

👉 Turn this into:

* ESLint rules (auto enforce)
* Feature generator CLI
* AI prompt guard (for Cursor/Claude)

That’s how you make this *actually stick*, not just exist as docs.
* `src/services/` → API factories only
* `src/store/` → global Zustand (UI state)
* `src/lib/` → configs (auth, query)
* `src/validations/` → shared schemas (rare)
* `src/utils/` → helpers

---

## API Proxying

To avoid CORS issues:

* Client calls → `/api/backend/*`
* Rewritten via `next.config.ts` → `NEXT_PUBLIC_API_V1`

---

## Service Layer

All API logic lives in `src/services`.

* Uses factory pattern
* Shared between Client + Server
* Strongly typed

---

## State Management

* **UI State** → Zustand
* **Server State** → TanStack Query

### Rules

* Do not store API data manually
* Do not mix UI + server state

---

## API Resource Factories

### Client (`makeClientApiResource`)

* Generates:

  * `useApiQuery`
  * `useApiMutation`
  * `useInfiniteApiQuery`

### Server (`makeServerApiResource`)

* Used in Server Components
* Handles cookies automatically

---

## Authentication & Token Rotation

* Cookie-based auth
* Axios interceptor handles:

  * 401 errors
  * token refresh
  * request retry queue

---

## Modal Management

Centralized modal system using Zustand.

* Register in `modal-registry.tsx`
* Typed modal data via `ModalDataMap`
* Trigger via `useModalActions`

---

## Forms & Validation

* React Hook Form + Zod
* Schema-first validation
* Typed end-to-end

---

## Shared Components

### FileUploader

* Drag & drop
* Validation
* Preview support

### MapLibre

* Map system
* Layer control
* Hooks for map access

---

## Theming

* Tailwind CSS 4
* OKLCH color system
* Centralized tokens in `globals.css`

---

## Development Guidelines

### Do

* Use API factories
* Keep logic inside features
* Use Server Components by default
* Follow Donut pattern
* Type everything

---

### Don’t

* Use axios directly
* Break feature boundaries
* Create large components
* Duplicate logic
* Mark entire feature as client

---

## Summary (What matters most)

* Features are the **source of truth**
* Pages are **thin wrappers**
* API is **centralized**
* Server Components are **default**
* Client Components are **isolated**
* Architecture is **strict by design**

---
