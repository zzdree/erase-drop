# Product Requirements Document (PRD): EraseDrop

**Project Name:** EraseDrop  
**Tagline:** In-Browser AI Background Remover — Fast, Private, and Unlimited.  
**Repository:** [https://github.com/zzdree/erase-drop](https://github.com/zzdree/erase-drop)  
**Author:** Andreas (@zzdree)  
**Version:** 1.0.0  
**Status:** In Progress / Active Development  

---

## 1. Executive Summary & Vision

**EraseDrop** is an ultra-fast, 100% client-side web application for automatic image background removal. Built as an evolution beyond existing tools (such as EraseIn), EraseDrop eliminates the need for remote cloud AI processing by executing lightweight neural segmentation models directly inside the user's browser via WebGPU and WebAssembly.

### Core Value Propositions:
1. **Zero Server Costs ($0/mo Infra):** Computational heavy-lifting runs on the client device.
2. **100% Data Privacy:** User photos never leave their device (no network transmission of images).
3. **Unlimited & Free Forever:** No tokens, subscriptions, or image volume limits.
4. **Batch Processing Power:** Handle tens or hundreds of high-resolution images in parallel or sequential pipeline with one-click bulk ZIP export.
5. **Creative Customization:** Instant background swap (solid colors, ID photo presets, gradients, custom backdrops) with real-time before/after comparison.

---

## 2. Target Audience & Use Cases

1. **E-Commerce Sellers & Creators:** Clean white/transparent background cutout for product catalogs (Shopee, Tokopedia, Shopify).
2. **Professionals & Job Seekers:** Instant Indonesian/Global ID Photo background replacement (Formal Red / Blue background preset).
3. **Graphic Designers & Marketers:** Quick batch cutout for social media banners, marketing collateral, and mockups.
4. **Privacy-Conscious Users:** Sensitive documents, personal photos, or enterprise imagery that cannot be uploaded to 3rd-party cloud APIs.

---

## 3. Key Feature Specifications

### 3.1. In-Browser AI Removal Engine
- **Engine Options:**
  - Client-side execution utilizing `@imgly/background-removal` or ONNX Runtime Web (`RMBG-1.4` / `BiRefNet`).
  - WebGPU acceleration with automatic graceful fallback to WebAssembly (WASM SIMD multi-threaded).
- **Execution Lifecycle:**
  - Intelligent asset caching (models & WASM binaries cached in CacheStorage / IndexedDB for offline support).
  - Web Worker delegation to ensure main thread remains 60fps responsive without UI stutter during heavy matting.

### 3.2. Drag & Drop Batch Upload & Queue Manager
- **Dropzone:** High-contrast, tactile drag & drop zone supporting JPG, PNG, WEBP, and AVIF.
- **Batch Processing:**
  - Multi-file selection up to 100+ images.
  - Per-item processing state indicators (Queued, Processing %, Completed, Error).
  - Global progress bar with time estimation.
- **Controls:**
  - "Clear All" with confirmation safeguard.
  - "Download All as ZIP" with automatic archive naming (`erasedrop_batch_[timestamp].zip`).

### 3.3. Interactive Studio & Backdrop Editor
- **Per-Image Editing Modal / View:**
  - **Before vs After Slider:** Interactive split-screen visual comparison.
  - **Backdrop Modes:**
    - *Transparent:* Standard PNG alpha channel.
    - *ID Photo Presets:* Formal Indonesian Pas Foto (Merah `#D61C1C`, Biru `#1C54D6`), Pure White (`#FFFFFF`), Soft Gray (`#F3F4F6`), Charcoal (`#1F2937`).
    - *Color Picker:* Any hex / RGB color input.
    - *Gradient Studio:* Modern subtle studio gradients.
    - *Custom Image Backdrop:* Upload secondary background image with fit/fill options.
  - **Export Settings:** Format selection (PNG / WEBP / JPG) & quality slider.

### 3.4. Local History & Offline Cache
- Local storage of recent items using **IndexedDB**.
- Retains thumbnail and cutout result between browser sessions without external database queries.
- Clear history action.

### 3.5. UX, Aesthetics & Accessibility
- Dark & Light mode toggle with smooth theme transition.
- Responsive design tailored for mobile phones, tablets, and wide desktop screens.
- Keyboard accessible navigation and screen-reader compliant aria-labels.

---

## 4. Technical Architecture & Tech Stack

```
[ Browser Client ]
  ├── React 18 + Vite (SPA State & Fast Client Execution)
  ├── Tailwind CSS & Lucide Icons (Design Tokens & Responsive Styling)
  ├── Web Worker (AI Pipeline)
  │     └── @imgly/background-removal / ONNX Web Runtime (WASM / WebGPU)
  ├── JSZip + FileSaver (Batch compression & client file downloads)
  └── IndexedDB (Local history & session recovery)
```

- **Framework:** Vite + React + TypeScript
- **Styling:** Vanilla CSS + Tailwind CSS Design System
- **State Management:** Zustand / React State
- **Packaging & Compression:** `jszip`, `file-saver`
- **Deployment Target:** Vercel / Cloudflare Pages

---

## 5. Non-Functional Requirements (NFR)

1. **Performance:** Under 3s processing time on modern WebGPU devices; under 6s on standard CPU WASM fallback.
2. **Reliability:** 100% client resilience; gracefully handle malformed images without crashing queue.
3. **Security:** Zero data exfiltration. Strict CSP (Content Security Policy).
4. **Deployability:** Single command continuous deployment via Vercel CLI / GitHub integration.

---

## 6. Success Metrics & Roadmap

- **Phase 1:** Core AI matting engine, drag & drop single/multi-file queue, transparent PNG download, ZIP bulk export.
- **Phase 2:** Studio backdrop editor (Pas Foto presets, color picker, Before/After comparison slider).
- **Phase 3:** IndexedDB History manager, Dark/Light mode theme engine, responsive polish.
- **Phase 4:** Vercel deployment, SEO metadata, PWA offline support.
