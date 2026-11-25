# Assignment 3 Specs

## Overview

Extend your **Pet Care Planner** by adding a **Care Plans Manager**.

A **care plan** is a named collection of tasks (for example: "Daily Routine", "Weekend Routine", "Vacation Schedule"). In Assignment 3 you will build the foundational (read-only) Plans workflow:

- Client-side routing for Pets and Plans pages.
- Route-param based pet selection so a selected pet is bookmarkable/shareable.
- View the list of plans.
- View a single plan (detail route) including its tasks.
- Create a custom hook to fetch plans data from the backend.

This assignment focuses on **React Router**, **data-driven UI**, and **async fetching patterns** (without TanStack Query yet).

---

## Learning Outcomes Assessed

1. Develop a state-driven UI with React functional components and hooks.
2. Apply React Router for static and dynamic routing.
3. Manage component lifecycle with `useEffect` to synchronize async data.
4. Fetch and render backend data with clear loading/error/empty states.
5. Build reusable data logic via a custom hook.
6. Design a responsive, styled interface using Tailwind CSS and DaisyUI.

---

## Backend API (Required)

This assignment must use the provided backend API.

See the [backend/README.md](backend/README.md) for API details.

---

## What You'll Build

You will add a Plans feature area to your existing app.

### Core Features

| Component / Page | Description | Key Features |
|------------------|-------------|--------------|
| `<Dashboard />` | Main layout with navigation | Must include navigation links with text "Pets" and "Plans" and an `<Outlet />` for nested routes |
| `<PetsPage />` | Existing pets workflow | Renders your existing pet/tasks/log UI and drives selected pet from route params |
| `<PlansPage />` | Plans workflow | Displays `<PlanList />` in a side area and an `<Outlet />` for plan detail |
| `<PlanList />` | Plan list | Fetch and display plans; each plan item displays the plan title; empty state "No plans available."; loading text "Loading plans..."; error state uses an element with `role="alert"` |
| `<PlanDetail />` | Plan detail | Fetch and display plan title/description and its tasks for `/plans/:id`; empty state "No tasks found for this plan."; loading text "Loading plan..."; error alert with `role="alert"` |
| `usePlans()` | Custom hook | Encapsulates plan list + plan detail fetching and exposes loading/error state |

---

## Application Routing (Required)

React Router is implemented to support these routes:

- `/` --> redirect to `/pets`
- `/pets` --> Pets page (no explicit pet selected yet)
- `/pets/:petId` --> Pets page with selected pet loaded from route param
- `/plans` --> Plans page (plan list)
- `/plans/:id` --> Plan detail

> Routing is expected to be configured in the app entrypoint (typically `main.jsx`).

---

## Technical Requirements

1. **Routing**
   - Configure static and dynamic routes as above.
   - Ensure navigation between Pets and Plans works.
   - Pet selection must be route-driven (`/pets/:petId`), not stored only in local component state/localStorage.
2. **Plans Fetching**
   - Fetch plan list and plan detail from the backend API.
   - Plans data must not be hard-coded in the React UI.
3. **Async UX**
   - Loading and error states are required for the plans list and the plan detail.
   - Error state must render an element with `role="alert"`.
4. **Custom Hook: `usePlans()`**
   - Implement a custom React hook to encapsulate fetching logic.
   - Must expose at minimum:
     - `plans`: array
     - `loading`: boolean
     - `error`: string | null
     - `fetchPlans()`: fetches all plans and sets internal state
     - `fetchPlanById(planId)`: returns a single plan object (requires an additional fetch call)
   - `fetchPlanById` must be memoized with `useCallback`.
5. **UI and Accessibility**
   - Use Tailwind and DaisyUI for a polished layout (cards/list, buttons, alerts).
   - Ensure keyboard focus works for navigation and list selection.
6. **Code Quality**
   - Keep a clear separation between API logic, hooks, and presentation components.

### Required Markup Test Hooks

To ensure the automated tests can locate and assert required behaviour, your implementation must include these hooks and labels:

- Dashboard root: `data-testid="pet-care-dashboard"`
- Pet picker container: `data-testid="pet-picker"`
- Task list container: `data-testid="task-list"`
- Care log container: `data-testid="care-log"`

Required route behaviour asserted by tests:

- `/` redirects to `/pets`
- `/pets/:petId` loads selected pet state from route params
- Selecting a pet updates URL to `/pets/:petId`
- `/plans` renders plans list view
- `/plans/:id` renders plan detail view

Required nav/link behaviour asserted by tests:

- Dashboard nav includes link text `Pets` and `Plans`
- `Pets` nav link target is `/pets`
- Plans list items link to `/plans/:id`

Required loading/empty/error text asserted by tests:

- Plan list loading text: `Loading plans...`
- Plan list empty text: `No plans available.`
- Plan detail loading text: `Loading plan...`
- Plan detail empty tasks text: `No tasks found for this plan.`
- Plan list and plan detail errors render with `role="alert"`

---

## Milestone Roadmap

This assignment builds the foundation for Assignment 4. Follow the milestones below.

### Milestone A - Routing and Navigation
- Install/configure React Router.
- Add navigation links and routes for Pets and Plans.

### Milestone B - Plan List
- Implement `<PlanList />` with loading/error/empty states.
- Ensure plan items are clickable and route to the correct plan.

### Milestone C - Plan Detail
- Implement `<PlanDetail />` for `/plans/:id`.
- Render plan title/description and its tasks.

### Milestone D - Hook + Polish
- Implement `usePlans()` and refactor components to use it.
- UI polish, accessibility checks, and end-to-end manual testing.

> Tip: Treat each milestone as a mini checkpoint. Do not move forward until the previous stage is working and committed.

---

## Tips for Success

- Keep side effects inside hooks/components that own the data.
- Prefer a single source of truth for loading/error state per view.
- Start with list rendering, then add the detail route, then refactor into a hook.
