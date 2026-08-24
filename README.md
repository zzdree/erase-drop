# ✂️ EraseDrop — In-Browser AI Background Remover

> **Fast, 100% Private, and Unlimited AI Background Removal running completely on your device.**  
> Built with WebGPU, WebAssembly, React, Vite, and Tailwind CSS.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/zzdree/erase-drop)
[![100% Client Side](https://img.shields.io/badge/Privacy-100%25%20On--Device-emerald)](https://github.com/zzdree/erase-drop)
[![WebGPU Accelerated](https://img.shields.io/badge/Engine-WebGPU%20%2F%20WASM-cyan)](https://github.com/zzdree/erase-drop)

---

## 🌟 Key Features

- 🔒 **100% Private & Zero Cloud Upload:** No photos are ever sent over the network. Everything processes locally on your device.
- ⚡ **WebGPU & WASM Acceleration:** Ultra-fast neural segmentation in 1–3s with WebGPU hardware acceleration (or multithreaded WASM CPU fallback).
- 📦 **Unlimited Batch Processing:** Drop 10, 50, or 100+ images at once and download everything as a clean packaged ZIP archive.
- 🎨 **Interactive Backdrop Studio:**
  - **Before vs After Split Slider:** Compare fine cutout edges in real-time.
  - **Formal Pas Foto Presets:** Indonesian Formal ID Red (`#D61C1C` - Ganjil) & Blue (`#1C54D6` - Genap).
  - **E-Commerce Solid & Gradient Colors:** Pure white catalog backdrops, dark studio charcoal, and cyber gradients.
  - **Custom Backdrop Upload:** Add your own custom scenery or background image.
- 💾 **Local Offline History:** Keeps your processed cutouts cached in browser storage (IndexedDB) for instant recovery without taking up server space.
- 🌓 **Dark & Light Mode:** Tailored design system with high-tactile feedback and responsive controls.

---

## 🚀 Tech Stack

- **Frontend:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **AI Matting Engine:** [`@imgly/background-removal`](https://github.com/imgly/background-removal-js) (ONNX Runtime Web / WebGPU / WASM SIMD)
- **Batch Export:** [`JSZip`](https://stuk.github.io/jszip/) & [`file-saver`](https://github.com/eligrey/FileSaver.js/)
- **Local Persistence:** Native Browser IndexedDB

---

## 🛠️ Local Development

```bash
# 1. Clone repository
git clone https://github.com/zzdree/erase-drop.git
cd erase-drop

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

---

## 🌐 Deploy to Vercel

```bash
# Deploy with Vercel CLI
npx vercel --prod
```

Or connect the GitHub repository [zzdree/erase-drop](https://github.com/zzdree/erase-drop) in your [Vercel Dashboard](https://vercel.com/new).

---

## 📄 Documentation & System Specs

- [Product Requirements Document (PRD.md)](./PRD.md)
- [Design System & Aesthetics (DESIGN.md)](./DESIGN.md)

---

## 👤 Author

- **Andreas Restuawanta Christwara** ([@zzdree](https://github.com/zzdree))
