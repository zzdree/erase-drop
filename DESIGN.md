# Design System: EraseDrop (DESIGN.md)

**Project:** EraseDrop  
**Aesthetic Thesis:** *Precision Industrial Minimal* with High-Tactile Micro-Interactions  
**DFII Score:** 13/15 (High Impact, High Fit, Web-Safe Feasibility, Crisp Contrast)  

---

## 1. Visual Theme & Atmosphere

EraseDrop embraces a **high-precision, ultra-clean studio aesthetic**. Drawing inspiration from professional creative tools (Lightroom, Figma, Linear) and modern privacy-first web utilities:
- **Tone:** Focused, calm, high-efficiency, with razor-sharp typography and tactile feedback.
- **Surface Depth:** Subtle layered translucency (glassmorphic blur on navbar/floating modals), ultra-fine borders (`border-white/10` in dark, `border-black/5` in light), and deep neutral contrast.
- **Translucency Grid:** Classic optical checkerboard canvas pattern for transparent image review with crisp edge delineation.

---

## 2. Color Palette & Functional Roles

EraseDrop avoids generic purple AI gradients, sticking to an authoritative, high-contrast palette with purposeful electric teal/cyan precision accents:

### Dark Mode (Default / Primary Vibe)
- **Deep Void Background:** `#090A0F` — Root canvas background
- **Surface Level 1 (Cards & Modals):** `#12141C` — Container base
- **Surface Level 2 (Hover/Active states):** `#1B1E2B` — Interactive surface
- **Surface Level 3 (Inputs & Wells):** `#0E1017` — Dropzones & inset frames
- **Electric Cyan Primary Accent:** `#00E5FF` — Primary action triggers, active sliders, glowing indicators
- **Precision Emerald Positive:** `#10B981` — Success status, complete badges, download triggers
- **Crimson Warning / Delete:** `#FF453A` — Clear data, removal alerts, abort buttons
- **Text High-Contrast Primary:** `#F8FAFC` — Headlines and primary labels
- **Text Muted Secondary:** `#94A3B8` — Subheadings, file dimensions, file size info

### Light Mode
- **Clean Studio Canvas:** `#F8FAFC` — Root background
- **Pure White Surface:** `#FFFFFF` — Cards, dropzone active panels
- **Muted Border Slate:** `#E2E8F0` — Clean structural dividers
- **Deep Slate Text Primary:** `#0F172A` — Primary typography
- **Subtle Muted Slate:** `#64748B` — Secondary labels

### Passport / ID Presets (Indonesian & Global Standard)
- **Formal ID Red (Pas Foto Merah - Tahun Ganjil):** `#D61C1C`
- **Formal ID Blue (Pas Foto Biru - Tahun Genap):** `#1C54D6`
- **E-Commerce Pure White:** `#FFFFFF`
- **Studio Charcoal:** `#1F2937`

---

## 3. Typography & Hierarchy

- **Display & Headline Font:** `Plus Jakarta Sans` or `Inter` (Font weight 700 / 800, tight letter-spacing `-0.03em` for bold, modern punch).
- **Body & Controls Font:** `Plus Jakarta Sans` (Font weight 400 / 500 / 600, `line-height: 1.5`, letter-spacing `-0.01em`).
- **Mono / Technical Metadata:** `JetBrains Mono` or `Fira Code` (Font weight 400 / 500 for image resolutions `1920x1080`, file sizes `2.4 MB`, and execution duration `1.2s`).

---

## 4. Component Stylings & Micro-Interactions

### 4.1. The Dropzone Hero
- **Resting State:** 2px dashed border (`border-cyan-500/30` or `border-slate-300`), dark card inset with subtle animated glowing dashed border on dragover.
- **Dragging Over:** Scales up subtly (`transform: scale(1.01)`), cyan ambient glow (`box-shadow: 0 0 30px rgba(0, 229, 255, 0.15)`).
- **Tactile Center Action:** Icon with micro-bounce, clear single/multi-file upload button.

### 4.2. Action Buttons
- **Primary Buttons (Download All, Start Batch):** High-contrast filled pill or 8px rounded corners (`rounded-xl`), electric gradient/solid background with smooth hover lift (`translate-y-[-1px]`, `shadow-lg`).
- **Secondary Buttons (Clear, Settings):** Ghost / subtle bordered buttons with clean hover fill transition.
- **Danger Actions (Clear All):** Outline red with smooth warning fill on hover.

### 4.3. Image Queue Cards
- **Card Anatomy:**
  - Left: Thumbnail (Checkerboard background for transparent PNG).
  - Center: File name, original format, dimensions, size badge, and live progress bar / status indicator.
  - Right: Quick Actions (Edit in Studio, Download Single PNG, Remove from Queue).
- **Status Indicator:**
  - `Queued`: Subtle yellow badge (`bg-amber-500/10 text-amber-400`).
  - `Processing`: Animated cyan pulse ring + percentage text.
  - `Completed`: Crisp emerald check badge (`bg-emerald-500/10 text-emerald-400`).

### 4.4. The Before-After Studio Slider
- Split-screen comparison component with draggable vertical line and custom divider handle.
- Real-time backdrop switcher: 1-click pill buttons for Transparent, Red, Blue, White, and Color Picker swatch.

---

## 5. Layout & Spatial Composition

- **Header / Navigation:** 64px docked top bar with glassmorphic backdrop (`backdrop-blur-md bg-opacity-80`), brand logo with gradient dot, nav pills (Dashboard, Studio, History, Docs), and theme toggle.
- **Hero / Header Summary:** Compact, non-intrusive value proposition with badge pill: `100% Client-Side • Zero Server • Unlimited`.
- **Main Working Area:** Max width `1200px` centered, balanced 24px/32px vertical rhythm.
- **Sticky / Bottom Action Bar (When files present):** Floating glassy dock at screen bottom showing total completed count, total batch size, and "Download All ZIP" CTA button.

---

## 6. Differentiation Anchor

> **"This avoids generic AI background remover UI by replacing boring cookie-cutter upload boxes with a high-performance studio workstation featuring instant ID photo presets (Pas Foto Merah/Biru), live WebGPU hardware telemetry, zero-server privacy guarantee badge, and seamless split-slider studio editing."**
