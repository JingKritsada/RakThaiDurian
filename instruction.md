# 🛠️ RakThaiDurian — Refactoring & Code Quality Instruction

> สำหรับการ refactor project ผ่าน VS Code + GitHub Copilot  
> เวอร์ชัน: 1.0 | วันที่: 2026-02-23

---

## 📋 สารบัญ

1. [ภาพรวม Project ปัจจุบัน](#1-ภาพรวม-project-ปัจจุบัน)
2. [แผนการทำงาน (Plan Before Implementation)](#2-แผนการทำงาน)
3. [Phase 1 — Security Debt Detection & Remediation](#3-phase-1--security-debt)
4. [Phase 2 — Technical Debt Detection & Remediation](#4-phase-2--technical-debt)
5. [Phase 3 — Clean Functions](#5-phase-3--clean-functions)
6. [Phase 4 — Centralize Configuration](#6-phase-4--centralize-configuration)
7. [Phase 5 — Improve Components](#7-phase-5--improve-components)
8. [Phase 6 — Code Consistency & Folder Structure](#8-phase-6--code-consistency--folder-structure)
9. [Prompt Templates for VS Code GitHub Copilot](#9-prompt-templates)
10. [Checklist Summary](#10-checklist-summary)

---

## 1. ภาพรวม Project ปัจจุบัน

### Project Tree Structure (Current)

```
RakThaiDurian/
├── App.tsx                     # Root component with routing
├── index.tsx                   # Entry point
├── index.html                  # HTML template
├── index.css                   # Global styles
├── vite.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── package.json
├── components/					⚠️ ต้อง refactor more flexible
│   ├── AccommodationManager.tsx
│   ├── Button.tsx              ⚠️ ต้อง refactor (size/variant)
│   ├── Card.tsx
│   ├── ErrorBoundary.tsx
│   ├── FilterSheet.tsx
│   ├── FormInputs.tsx
│   ├── FuzzyText.tsx
│   ├── Header.tsx
│   ├── Lightbox.tsx
│   ├── LocationPicker.tsx
│   ├── MiniCarousel.tsx
│   ├── ModalAlert.tsx
│   ├── OrchardDetailView.tsx
│   ├── OrchardMap.tsx
│   ├── PackageManager.tsx
│   └── SocialLinks.tsx
├── context/
│   ├── AlertContext.tsx
│   ├── AuthContext.tsx
│   ├── LoadingContext.tsx
│   ├── MasterDataContext.tsx
│   └── ThemeContext.tsx
├── docs/
│   ├── api-analyze.md
│   └── api_spec.yaml
├── interface/
│   ├── dropdownInterface.ts
│   ├── imageInterface.ts
│   ├── inputInterface.ts
│   ├── orchardInterface.ts
│   ├── responseInterface.ts
│   ├── themeInterface.ts
│   └── userInterface.ts
├── pages/						⚠️ ต้อง refactor (ใหญ่เกินไป แยกเป็น sub-folders + sub-components)
│   ├── ErrorPage.tsx
│   ├── HomePage.tsx            ⚠️ 27KB — ต้อง refactor (ใหญ่มาก)
│   ├── Login.tsx
│   ├── NotFoundPage.tsx
│   ├── OrchardDetailPage.tsx   ⚠️ 28KB — ต้อง refactor (ใหญ่มาก)
│   ├── OrchardForm.tsx         ⚠️ 37KB — ต้อง refactor (ใหญ่มาก)
│   ├── OwnerDashboard.tsx
│   └── TestErrorPage.tsx       ⚠️ ควรลบ (test page)
├── public/
├── routes/
│   └── PrivateRoute.tsx
├── services/
│   ├── api.ts
│   ├── dropdownService.ts
│   ├── orchardService.ts
│   ├── uploadService.ts
│   └── userService.ts
└── utils/
    ├── constants.ts
    ├── enum.ts
    ├── icons.tsx
    ├── loadingManager.ts
    └── mock.ts
```

### ปัญหาที่ตรวจพบ (Summary)

| Category        | Issue                                                                                      | Severity  |
| --------------- | ------------------------------------------------------------------------------------------ | --------- |
| **Security**    | API Key exposed via `process.env` in client bundle                                         | 🔴 High   |
| **Security**    | Token stored in `localStorage` (XSS vulnerable)                                            | 🟡 Medium |
| **Security**    | Hardcoded base URL `https://platform.psru.ac.th:3022`                                      | 🟡 Medium |
| **Security**    | `UploadResponse` interface duplicated (image vs response)                                  | 🟡 Low    |
| **Tech Debt**   | `HomePage.tsx` = 27KB, `OrchardForm.tsx` = 37KB, `OrchardDetailPage.tsx` = 28KB            | 🔴 High   |
| **Tech Debt**   | `useWindowSize` hook & `calculateDistance` utility defined inline in `HomePage.tsx`        | 🟡 Medium |
| **Tech Debt**   | `dropdownService.ts` uses fake setTimeout mock instead of API                              | 🟡 Medium |
| **Tech Debt**   | `TestErrorPage.tsx` left in production code                                                | 🟡 Low    |
| **Component**   | `Button` — hardcoded `px-4 py-3` prevents small buttons; no `size` prop                    | 🟡 Medium |
| **Component**   | `Button` — `variant` defined but `none` used as workaround everywhere with `!p-0 !min-h-0` | 🟡 Medium |
| **Consistency** | Mix of `../` relative imports and `@/` alias imports                                       | 🟡 Low    |
| **Consistency** | Enum re-exported from `orchardInterface.ts` AND defined in `utils/enum.ts`                 | 🟡 Low    |
| **z-index**     | `z-[100]`, `z-[2500]`, `z-[9999]` — ค่า z-index กระจัดกระจาย                               | 🟡 Medium |

---

## 2. แผนการทำงาน

### วิธีการ Enable → Detection → Remediation

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   1. ENABLE      │───▶│   2. DETECT      │───▶│   3. REMEDIATE   │
│   Visibility     │    │   Identification │    │   Fix & Verify   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Step 1: Enable Visibility**

- เปิด ESLint + Prettier ให้ทำงานอยู่เสมอ (`npm run lint`)
- ใช้ VS Code Extensions: ESLint, Prettier, GitHub Copilot, Error Lens
- เปิด TypeScript strict mode ใน `tsconfig.json`

**Step 2: Detection**

- ใช้ GitHub Copilot ใน VS Code เพื่อ scan หา debt
- ใช้ `npm audit` เพื่อเช็ค dependency vulnerabilities
- ใช้ Copilot Chat `/explain` กับไฟล์ที่สงสัย

**Step 3: Remediation**

- สร้าง branch แยกสำหรับแต่ละ phase
- ใช้ Copilot `/fix` และ `/refactor` ผ่าน VS Code
- ทดสอบทุกครั้งหลัง refactor

### แนวทาง Branch Strategy

```
main
├── refactor/phase1-security
├── refactor/phase2-tech-debt
├── refactor/phase3-clean-functions
├── refactor/phase4-centralize
├── refactor/phase5-components
└── refactor/phase6-consistency
```

---

## 3. Phase 1 — Security Debt

### 3.1 API Key Exposure

**ปัญหา:** `vite.config.ts` injects `GEMINI_API_KEY` into client bundle

```typescript
define: {
  "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
  "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
},
```

**แก้ไข:** ย้าย API key calls ไปเป็น backend proxy

- ลบ `define` block ออกจาก `vite.config.ts`
- สร้าง API endpoint ที่ backend สำหรับเรียก Gemini

### 3.2 Token Storage (XSS)

**ปัญหา:** `localStorage` ถูกเข้าถึงได้จาก XSS attack

```typescript
// services/userService.ts
localStorage.setItem("durian_token", token);
```

**แก้ไข:**

- ใช้ `httpOnly` cookie (ต้องแก้ backend ด้วย)
- หรือในขั้นตอนนี้ ใช้ `sessionStorage` + CSP headers เป็น minimum

### 3.3 Hardcoded URLs

**ปัญหา:** `utils/constants.ts` hardcodes server URL

```typescript
export const UPLOADS_BASE_URL = "https://platform.psru.ac.th:3022";
```

**แก้ไข:** ใช้ environment variable

```typescript
export const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL || "";
```

### 3.4 Duplicate Interface

**ปัญหา:** `UploadResponse` ประกาศทั้งใน `interface/imageInterface.ts` และ `interface/responseInterface.ts`

**แก้ไข:** ลบที่ซ้ำ เหลือที่เดียวใน `responseInterface.ts` แล้ว re-export

---

## 4. Phase 2 — Technical Debt

### 4.1 แยก Utility Functions ออกจาก Page Files

**ปัญหา:** `HomePage.tsx` มี utility functions ปนอยู่ในไฟล์:

- `calculateDistance()` — Haversine formula
- `useWindowSize()` — window resize hook

**แก้ไข:**

```
utils/
├── geo.ts          ← ย้าย calculateDistance()
hooks/
├── useWindowSize.ts ← ย้าย useWindowSize()
```

### 4.2 ลบ Test Page

**ปัญหา:** `pages/TestErrorPage.tsx` มี TODO comment บอกว่าต้องลบ

```typescript
// TODO: Delete this page later. It is only for testing error handling.
```

**แก้ไข:** ลบไฟล์ + ลบ route ใน `App.tsx`

### 4.3 Mock Data Service

**ปัญหา:** `dropdownService.ts` ใช้ `setTimeout` + mock data แทน API จริง

**แก้ไข:** เตรียม structure ให้ swap เป็น API จริงได้ง่าย

```typescript
export const dropdownService = {
	getServiceTypes: async (options?: ApiOptions): Promise<ServiceTypeResponse[]> => {
		if (import.meta.env.VITE_USE_MOCK === "true") {
			return mockGetServiceTypes(options);
		}
		return apiRequest<ServiceTypeResponse[]>(
			() => apiClient.get("/data/service-types"),
			options
		);
	},
};
```

### 4.4 แยก Page ใหญ่ออกเป็น Sub-components

**ไฟล์ที่ต้อง refactor:**

| File                          | Size | Action                                                                          |
| ----------------------------- | ---- | ------------------------------------------------------------------------------- |
| `pages/OrchardForm.tsx`       | 37KB | แยกเป็น tabs: `GeneralTab`, `LocationTab`, `MediaTab`, `ServicesTab`            |
| `pages/OrchardDetailPage.tsx` | 28KB | แยก `OrchardInfo`, `OrchardGallery`, `OrchardPackages`, `OrchardAccommodations` |
| `pages/HomePage.tsx`          | 27KB | แยก `MapView`, `ListView`, `RoutePanel`, `SearchBar`                            |

---

## 5. Phase 3 — Clean Functions

### หลักการ

| Rule                   | คำอธิบาย                                                 |
| ---------------------- | -------------------------------------------------------- |
| **Small & Focused**    | ฟังก์ชันควรทำงานเดียว ไม่เกิน 30 บรรทัด                  |
| **Meaningful Names**   | ชื่อบอกสิ่งที่ทำ เช่น `formatDistance()` ไม่ใช่ `calc()` |
| **Pure Functions**     | แยก data transformation ออกจาก side effects              |
| **Minimal Parameters** | รับเฉพาะที่จำเป็น ใช้ object destructuring               |
| **No Duplication**     | ลบ function ที่ทำงานซ้ำกัน                               |

### ตัวอย่างที่ต้องแก้

**ก่อน (ใน `orchardService.ts`):**

```typescript
// attachImagesToOrchard ทำหลายอย่างเกินไป
attachImagesToOrchard(orchard, imageResult) {
  // ทั้ง map images + map packages + map accommodations
}
```

**หลัง:**

```typescript
const attachOrchardImages = (orchard, urls: string[]) => ({ ...orchard, images: urls });
const attachPackageImages = (packages, imageMap) => packages.map(pkg => ({...}));
const attachAccommodationImages = (accommodations, imageMap) => accommodations.map(acc => ({...}));
```

---

## 6. Phase 4 — Centralize Configuration

### 6.1 Z-Index Registry

สร้างไฟล์ `utils/zIndex.ts`:

```typescript
/**
 * Centralized z-index values for consistent layering
 * ค่า z-index ทั้งหมดของ project อยู่ที่นี่
 */
export const Z_INDEX = {
	/** Map markers and controls */
	mapControls: 10,
	/** Sticky headers */
	header: 50,
	/** Lightbox overlay */
	lightbox: 100,
	/** Bottom sheets and side panels */
	sheet: 200,
	/** Filter modals */
	filterModal: 500,
	/** Alert/Confirm modals */
	alertModal: 2500,
	/** Toast notifications */
	toast: 5000,
	/** Global loading overlay */
	globalLoading: 9999,
} as const;

export type ZIndexKey = keyof typeof Z_INDEX;
```

**แทนที่ค่า z-index กระจัดกระจาย:**
| Component | ปัจจุบัน | เปลี่ยนเป็น |
|-----------|---------|------------|
| `Lightbox.tsx` | `z-[100]` | `z-[${Z_INDEX.lightbox}]` |
| `FilterSheet.tsx` | `z-[2500]` | `z-[${Z_INDEX.filterModal}]` |
| `LoadingContext.tsx` | `z-[9999]` | `z-[${Z_INDEX.globalLoading}]` |

### 6.2 Centralize API Base URLs

สร้าง `utils/config.ts`:

```typescript
export const CONFIG = {
	API_BASE_URL: import.meta.env.VITE_API_URL || "/api",
	UPLOADS_BASE_URL: import.meta.env.VITE_UPLOADS_BASE_URL || "",
	MAP_TILE_URL: import.meta.env.VITE_MAP_TILE_URL || "https://tile.openstreetmap.org",
	OSRM_URL: "https://router.project-osrm.org",
} as const;
```

---

## 7. Phase 5 — Improve Components

### 7.1 Refactor Button Component

**ปัญหาปัจจุบัน:**

- `px-4 py-3` hardcoded ทำให้ปุ่มเล็กต้อง `!p-0 !min-h-0` override
- `variant="none"` ใช้เป็น workaround
- ไม่มี `size` prop

**แก้ไข:**

```typescript
// components/Button.tsx

import React, { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-xs gap-1 rounded-lg",
  sm: "px-3 py-1.5 text-sm gap-1.5 rounded-lg",
  md: "px-4 py-2.5 text-base gap-2 rounded-xl",
  lg: "px-6 py-3 text-lg gap-2 rounded-xl",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-forest-800 hover:bg-forest-900 text-white shadow-sm hover:shadow-md",
  secondary:
    "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm",
  danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
  ghost:
    "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
  outline:
    "bg-transparent border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyle =
    "font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
};

const LoadingSpinner: React.FC = () => (
  <span className="flex items-center gap-2">
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
    </svg>
    กำลังประมวลผล...
  </span>
);
```

**การ migrate:**
| ก่อน | หลัง |
|------|------|
| `<Button variant="none" className="!p-0 !min-h-0">` | `<Button variant="ghost" size="xs">` |
| `<Button variant="ghost" className="p-2">` | `<Button variant="ghost" size="sm">` |
| `<Button variant="primary">` (default) | `<Button>` (ไม่ต้องเปลี่ยน) |

---

## 8. Phase 6 — Code Consistency & Folder Structure

### 8.1 Export Style Convention

**กฎ:** ทุกที่ใช้ `export const` inline (ไม่ประกาศแล้วค่อย export ทีหลัง)

```typescript
// ✅ ถูกต้อง
export const Button: React.FC<ButtonProps> = ({ ... }) => { ... };

// ❌ ห้ามใช้
const Button: React.FC<ButtonProps> = ({ ... }) => { ... };
export default Button;
```

### 8.2 Import Path Convention

**กฎ:** ใช้ `@/` alias เสมอ (ไม่ใช้ `../` relative path)

```typescript
// ✅ ถูกต้อง
import { Button } from "@/components/Button";
import { useAuth } from "@/context/AuthContext";

// ❌ ห้ามใช้
import { Button } from "../../components/Button";
import { useAuth } from "../context/AuthContext";
```

### 8.3 Proposed Folder Structure (หลัง refactor)

```
RakThaiDurian/
├── src/                          ← ย้ายทุกอย่างเข้า src/
│   ├── App.tsx
│   ├── main.tsx                  ← เปลี่ยนชื่อจาก index.tsx
│   ├── components/
│   │   ├── ui/                   ← Reusable UI atoms
│   │   │   ├── Button.tsx
│   │   │   ├��─ FormInputs.tsx
│   │   │   ├── ModalAlert.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── layout/               ← Layout components
│   │   │   └── Header.tsx
│   │   ├── orchard/              ← Domain-specific components
│   │   │   ├── Card.tsx
│   │   │   ├── OrchardMap.tsx
│   │   │   ├── OrchardDetailView.tsx
│   │   │   ├── FilterSheet.tsx
│   │   │   ├── AccommodationManager.tsx
│   │   │   ├── PackageManager.tsx
│   │   │   └── SocialLinks.tsx
│   │   ├── media/                ← Media-related
│   │   │   ├── Lightbox.tsx
│   │   │   ├── MiniCarousel.tsx
│   │   │   └── LocationPicker.tsx
│   │   └── effects/              ← Visual effects
│   │       └── FuzzyText.tsx
│   ├── context/                  ← (เหมือนเดิม)
│   ├── hooks/                    ← NEW: Custom hooks
│   │   └── useWindowSize.ts
│   ├── interfaces/               ← เปลี่ยนชื่อจาก interface
│   │   ├── orchard.interface.ts  ← เปลี่ยน��ื่อให้ชัดเจน
│   │   ├── user.interface.ts
│   │   ├── image.interface.ts
│   │   ├── response.interface.ts
│   │   ├── dropdown.interface.ts
│   │   ├── input.interface.ts
│   │   └── theme.interface.ts
│   ├── pages/
│   │   ├── home/                 ← แยก sub-components
│   │   │   ├── HomePage.tsx
│   │   │   ├── MapView.tsx
│   │   │   ├── ListView.tsx
│   │   │   ├── RoutePanel.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── orchard/
│   │   │   ├── OrchardDetailPage.tsx
│   │   │   ├── OrchardForm.tsx
│   │   │   ├── tabs/
│   │   │   │   ├── GeneralTab.tsx
│   │   │   │   ├── LocationTab.tsx
│   │   │   │   ├── MediaTab.tsx
│   │   │   │   └── ServicesTab.tsx
│   │   │   └── OwnerDashboard.tsx
│   │   ├── auth/
│   │   │   └── Login.tsx
│   │   └── error/
│   │       ├── ErrorPage.tsx
│   │       └── NotFoundPage.tsx
│   ├── routes/
│   │   └── PrivateRoute.tsx
│   ├── services/                 ← (เหมือนเดิม)
│   └── utils/
│       ├── config.ts             ← NEW: centralized config
│       ├── constants.ts
│       ├── enum.ts
│       ├── geo.ts                ← NEW: geo utilities
│       ├── icons.tsx
│       ├── loadingManager.ts
│       ├── mock.ts
│       └── zIndex.ts             ← NEW: z-index registry
├── index.html
├── vite.config.ts
├── tsconfig.json
└── eslint.config.mjs
```

---

## 9. Prompt Templates for VS Code GitHub Copilot

### 🔍 Phase 1: Security Scan

```
@workspace /explain ตรวจหา security vulnerability ทั้งหมดใน project นี้ โดยเฉพาะ:
1. API key ที่ expose ใน client-side code
2. Token storage ที่อาจถูก XSS attack
3. Hardcoded URLs หรือ credentials
4. Missing input validation
แสดงผลเป็นตาราง severity + file path + แนวทางแก้ไข
```

### 🧹 Phase 2: Technical Debt Detection

```
@workspace ช่วยวิเคราะห์ technical debt ใน project นี้:
1. ไฟล์ไหนที่ใหญ่เกินไป (เกิน 300 บรรทัด) ควรแยกออก
2. Function ไหนที่ทำงานหลายอย่างเกินไป
3. Code ที่ซ้ำซ้อนกัน (duplication)
4. Dead code หรือ TODO ที่ยังไม่ได้ทำ
5. Mock data ที่ยังไม่ได้เปลี่ยนเป็น API จริง
```

### ✂️ Phase 3: Refactor Large Files

```
@workspace /refactor ช่วยแยก pages/HomePage.tsx ออกเป็น sub-components ดังนี้:
- MapView: ส่วนแสดงแผนที่ Leaflet
- ListView: ส่วนแสดง list ของ Card
- RoutePanel: ส่วน route mode (เลือกสวน + แสดงเส้นทาง)
- SearchBar: ส่วน search + filter button
ย้าย calculateDistance() ไปที่ utils/geo.ts
ย้าย useWindowSize() ไปที่ hooks/useWindowSize.ts
```

```
@workspace /refactor ช่วยแยก pages/OrchardForm.tsx ออกเป็น tab components:
- GeneralTab: ข้อมูลทั่วไป (ชื่อ, คำอธิบาย, ประเภท, สถานะ)
- LocationTab: แผนที่ + ที่อยู่ + พิกัด
- MediaTab: รูปภาพ + วิดีโอ + social media links
- ServicesTab: accommodations + packages + crops
แต่ละ tab ควรรับ formData + setFormData เป็น props
```

```
@workspace /refactor ช่วยแยก pages/OrchardDetailPage.tsx ออกเป็น:
- OrchardHero: ส่วน header + image carousel + status badge
- OrchardInfo: ส่วนข้อมูลทั่ว���ป + ที่อยู่ + เบอร์โทร
- OrchardGallery: ส่วนรูปภาพ + วิดีโอ + lightbox
- OrchardPackages: ส่วนแพ็กเกจ
- OrchardAccommodations: ส่วนที่พัก
- OrchardLocation: ส่วนแผนที่
```

### 🎨 Phase 4: Refactor Button Component

```
@workspace /refactor ช่วย refactor components/Button.tsx ให้รองรับ:
1. size prop: "xs" | "sm" | "md" | "lg"
   - xs: px-2 py-1 text-xs
   - sm: px-3 py-1.5 text-sm
   - md: px-4 py-2.5 text-base (default)
   - lg: px-6 py-3 text-lg
2. ลบ variant "none" แล้วให้ ghost ทำหน้าที่แทน
3. เพิ่ม leftIcon และ rightIcon props
4. แยก LoadingSpinner เป็น sub-component
5. base style ไม่ควร hardcode padding
ให้ backward compatible โดยใช้ default values
```

### 🗂️ Phase 5: Centralize Z-Index

```
@workspace สร้าง utils/zIndex.ts เป็น centralized z-index registry
รวบรวมค่า z-index ทั้งหมดที่ใช้ในโปรเจค:
- Lightbox: z-[100]
- FilterSheet: z-[2500]
- Loading overlay: z-[9999]
สร้างเป็น const object ที่ export ได้ พร้อม comment อธิบายแต่ละค่า
แล้วช่วย update ทุก component ที่ใช้ z-index ให้อ้างอิงจากไฟล์นี้แทน
```

### 🔗 Phase 6: Standardize Imports

```
@workspace ช่วยเปลี่ยน import path ทั้ง project ให้ใช้ @/ alias แทน ../ relative path
เช่น:
- import { Button } from "../components/Button"  →  import { Button } from "@/components/Button"
- import { useAuth } from "../../context/AuthContext"  →  import { useAuth } from "@/context/AuthContext"
ตรวจสอบว่า tsconfig.json และ vite.config.ts มี alias config ถูกต้อง
```

### 🗑️ Phase 7: Cleanup

```
@workspace ช่วย cleanup:
1. ลบ pages/TestErrorPage.tsx และ route ที่เกี่ยวข้องใน App.tsx
2. ลบ UploadResponse ที่ซ้ำกันใน interface/imageInterface.ts (เก็บไว้ที่ responseInterface.ts)
3. ลบ eslint-disable comments ที่ไม่จำเป็น
4. ลบ console.log ทั้งหมด
5. ลบ commented-out code ที่ไม่ใช้แล้ว
```

### 📝 Phase 8: Final Verification

```
@workspace ช่วยตรวจสอบความสมบูรณ์หลัง refactor:
1. ทุก import path ถูกต้อง ไม่มี broken imports
2. ทุก component export เป็น named export (export const)
3. ทุก interface อยู่ใน interface/ folder
4. ไม่มี function ที่ซ้ำซ้อน
5. ทุก enum ถูก import จาก utils/enum.ts ที่เดียว
6. ไม่มี hardcoded URLs (ใช้ config แทน)
7. Button component ใช้ size prop แทน !p-0 override
```

---

## 10. Checklist Summary

### Security ✅

- [ ] ลบ API key ออกจาก client bundle (`vite.config.ts` define block)
- [ ] ย้าย `UPLOADS_BASE_URL` ไปใช้ env variable
- [ ] ตรวจ `npm audit` และ update dependencies ที่มี vulnerability
- [ ] เพิ่ม CSP headers ที่ deployment (Vercel)

### Technical Debt ✅

- [ ] ลบ `TestErrorPage.tsx` + route
- [ ] แยก `HomePage.tsx` เป็น sub-components
- [ ] แยก `OrchardForm.tsx` เป็น tab components
- [ ] แยก `OrchardDetailPage.tsx` เป็น sections
- [ ] ย้าย `calculateDistance` ไป `utils/geo.ts`
- [ ] ย้าย `useWindowSize` ไป `hooks/useWindowSize.ts`
- [ ] เตรียม `dropdownService` ให้ swap mock/api ได้

### Clean Functions ✅

- [ ] แยก `attachImagesToOrchard` เป็น functions ย่อย
- [ ] ทำให้ทุก function < 30 บรรทัด
- [ ] ตั้งชื่อ function ให้สื่อความหมาย

### Centralize ✅

- [ ] สร้าง `utils/zIndex.ts` — z-index registry
- [ ] สร้าง `utils/config.ts` — centralized config
- [ ] อัปเดตทุก component ให้ใช้ค่าจาก centralized files

### Components ✅

- [ ] Refactor `Button` ให้มี `size` prop
- [ ] ลบ `variant="none"` และ `!p-0` overrides
- [ ] เพิ่ม `leftIcon` / `rightIcon` props

### Consistency ✅

- [ ] ใช้ `@/` alias ทั้ง project
- [ ] ใช้ `export const` ทุกที่ (ไม่ `export default`)
- [ ] ลบ `UploadResponse` ที่ซ้ำ
- [ ] ลบ enum re-export จาก `orchardInterface.ts`
- [ ] พิจารณาย้ายเข้า `src/` folder

---

## 🚀 วิธีเริ่มต้น

1. **Clone & Branch:**

    ```bash
    git checkout -b refactor/phase1-security
    ```

2. **Enable tools:**

    ```bash
    npm run lint          # ตรวจ ESLint issues
    npm audit             # ตรวจ dependency vulnerabilities
    ```

3. **ใช้ VS Code Copilot:**
    - เปิด Copilot Chat (Ctrl+Shift+I)
    - คัดลอก prompt จาก Section 9 ไปใช้ทีละ phase
    - ใช้ `@workspace` prefix เพื่อให้ Copilot เห็น context ทั้ง project

4. **ทดสอบ:**

    ```bash
    npm run dev           # ตรวจว่าหน้าเว็บยังทำงานปกติ
    npm run build         # ตรวจ build errors
    npm run lint          # ตรวจ lint errors
    ```

5. **Commit & PR:**
    ```bash
    git add .
    git commit -m "refactor(phase1): fix security vulnerabilities"
    git push origin refactor/phase1-security
    ```
    แล้วเปิด Pull Request ให้ review ก่อน merge

---

> 💡 **Tips:** ทำทีละ phase อย่าทำทั้งหมดพร้อมกัน เพราะจะทำให้ review ยากและ merge conflict เยอะ
