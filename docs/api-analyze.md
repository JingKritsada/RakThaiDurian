# Frontend API Analysis Report

## Overview

The current frontend application relies primarily on **Mock Data** and `setTimeout` simulations within service files. There is no centralized HTTP client (like axios) currently configured for backend communication, with the exception of one external call to a map routing service.

## API Services Identified

### 1. Orchard Service (`services/orchardService.ts`)

**Current State:** Simulates a database using a local variable `ORCHARDS_DB`.
**Inferred Endpoints:**

- `GET /orchards`: List all orchards.
- `GET /orchards?ownerId=...`: Get orchards by owner.
- `GET /orchards/{id}`: Get details.
- `POST /orchards`: Create.
- `PUT /orchards/{id}`: Update.
- `DELETE /orchards/{id}`: Delete.

### 2. User Service (`services/userService.ts`)

**Current State:** Simulates Login with hardcoded credentials (`owner@durian.com` / `123456`). Simulates Session by storing data in `localStorage`.
**Inferred Endpoints:**

- `POST /auth/login`: Authenticate.
- `POST /auth/logout`: Clear session (server-side invalidation).
- `GET /auth/me`: Validate token and get profile.

### 3. Dropdown Service (`services/dropdownService.ts`)

**Current State:** Returns static constant arrays from `utils/mock.ts`.
**Inferred Endpoints:**

- `GET /data/service-types`
- `GET /data/statuses`
- `GET /data/crops`

### 4. External Services (`pages/HomePage.tsx`)

**Real HTTP Call Found:**

- **Service:** Project OSRM (Open Source Routing Machine)
- **Endpoint:** `https://router.project-osrm.org/route/v1/driving/...`
- **Purpose:** Used to draw route paths on the map.
- **Note:** This is a direct call from the client. It does not go through the backend.

## Recommendations for Backend Implementation

1.  **Filtering:** The frontend currently fetches _all_ orchards and filters them in the browser (`HomePage.tsx`). The backend API should implement query parameters (`?q=...`, `?type=...`) to handle this efficiently.
2.  **Authentication:** Backend needs to implement JWT (Bearer Token) as implied by the localStorage usage.
3.  **Data Consistency:** The `Orchard` object is complex. Special attention is needed for:
    - `types` (Array of Enums)
    - `images` (Array of Strings/URLs)
    - `packages` & `accommodations` (Nested Objects)

## Artifacts

- **[api_spec.yaml](api_spec.yaml)**: Complete OpenAPI 3.0 definition ready for Swagger UI or Code Gen.
