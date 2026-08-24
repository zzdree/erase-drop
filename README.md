<div align="center">

# ✂️ EraseDrop
### **Penghapus Background Gambar Berbasis AI 100% di Dalam Browser**

*Gratis, Tanpa Batas, Menjaga Privasi Penuh, dan Dipercepat oleh WebGPU.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-erase--drop.vercel.app-00E5FF?style=for-the-badge&logo=vercel&logoColor=white)](https://erase-drop.vercel.app)
[![GitHub Stars](https://img.shields.io/github/stars/zzdree/erase-drop?style=for-the-badge&logo=github&color=00E5FF&logoColor=white)](https://github.com/zzdree/erase-drop/stargazers)
[![License: MIT](https://img.shields.io/badge/Lisensi-MIT-10B981?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](https://opensource.org/licenses/MIT)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privasi-100%25%20Lokal%20Device-10B981?style=for-the-badge&logo=shield&logoColor=white)](https://erase-drop.vercel.app)
[![Engine: WebGPU + WASM](https://img.shields.io/badge/Mesin-WebGPU%20%2F%20WASM-00E5FF?style=for-the-badge&logo=webassembly&logoColor=white)](https://erase-drop.vercel.app)

<br />

### 🌐 **Akses Website Langsung:** [https://erase-drop.vercel.app](https://erase-drop.vercel.app)

<br />

<p align="center">
  <a href="#-tentang-erasedrop">Tentang</a> •
  <a href="#-fitur-utama">Fitur Utama</a> •
  <a href="#-cara-kerja--jaminan-privasi">Cara Kerja & Privasi</a> •
  <a href="#-preset-warna-pas-foto-resmi-indonesia">Preset Pas Foto</a> •
  <a href="#-teknologi-yang-digunakan">Teknologi</a> •
  <a href="#-panduan-instalasi-lokal">Instalasi Lokal</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

</div>

## 💡 Tentang EraseDrop

**EraseDrop** adalah aplikasi web penghapus latar belakang gambar modern yang bekerja tanpa server (*zero-server upload*). Berbeda dengan aplikasi penghapus background konvensional yang memungut biaya langganan, sistem token/kredit, atau mengunggah foto pribadi Anda ke server cloud, **EraseDrop menjalankan model kecerdasan buatan (*neural network matting*) langsung di dalam browser perangkat Anda**.

Seluruh file foto tetap berada di perangkat Anda secara aman. Tanpa login akun, tanpa watermark, dan tanpa batasan kuota.

---

## ✨ Fitur Utama

<table>
  <tr>
    <td width="50%">
      <h3>🔒 100% Privasi di Perangkat</h3>
      <p>Tidak ada 1 byte pun data foto yang dikirim ke internet. Pemotongan background dieksekusi langsung di memori browser Anda menggunakan WebAssembly & WebGPU.</p>
    </td>
    <td width="50%">
      <h3>⚡ Akselerasi Hardware WebGPU</h3>
      <p>Proses pemotongan subjek super cepat (1–3 detik per foto) memanfaatkan GPU lokal perangkat, dengan fallback otomatis ke WASM SIMD multi-threading.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📦 Batch Processing Tanpa Batas</h3>
      <p>Masukkan 10, 50, hingga 100+ foto sekaligus. Progress dipantau secara real-time per gambar dan dapat diunduh sekaligus dalam format <strong>ZIP 1-Klik</strong>.</p>
    </td>
    <td width="50%">
      <h3>🎨 Studio & Editor Background Interaktif</h3>
      <p>Bandingkan detail potongan secara presisi dengan slider <em>Before vs After</em>, ganti latar belakang menjadi warna solid, gradien studio, atau foto custom.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🇮🇩 Preset Warna Pas Foto Resmi</h3>
      <p>1-Klik ganti latar belakang pas foto formal dokumen Indonesia: <strong>Merah (#D61C1C)</strong> untuk tahun lahir ganjil & <strong>Biru (#1C54D6)</strong> untuk tahun lahir genap.</p>
    </td>
    <td width="50%">
      <h3>💾 Riwayat Offline Lokal (IndexedDB)</h3>
      <p>Hasil foto tersimpan di penyimpanan lokal browser Anda (<strong>IndexedDB</strong>) sehingga dapat diunduh kembali kapan saja tanpa memakan ruang server.</p>
    </td>
  </tr>
</table>

---

## 🛡️ Cara Kerja & Jaminan Privasi

```mermaid
graph LR
    A[User Memilih / Drop Foto] --> B[Memori Browser / Blob]
    B --> C{WebGPU Didukung?}
    C -- Ya --> D[Inferensi AI WebGPU Cepat]
    C -- Tidak --> E[WASM SIMD Multi-Threading CPU]
    D --> F[Hasil Alpha Matte Transparan]
    E --> F
    F --> G[Studio Background & Export ZIP]
    F --> H[Penyimpanan Riwayat Lokal IndexedDB]
    
    style A fill:#171A24,stroke:#00E5FF,color:#fff
    style B fill:#171A24,stroke:#334155,color:#fff
    style D fill:#10B981,stroke:#10B981,color:#000
    style E fill:#F59E0B,stroke:#F59E0B,color:#000
    style F fill:#00E5FF,stroke:#00E5FF,color:#000
    style G fill:#1C54D6,stroke:#1C54D6,color:#fff
    style H fill:#171A24,stroke:#334155,color:#fff
```

> **Catatan Keamanan:** EraseDrop beroperasi dengan isolasi penuh pada sisi klien (*client-side*). Anda bahkan dapat mematikan koneksi internet setelah website dimuat, dan aplikasi akan tetap berfungsi normal secara offline.

---

## 📸 Preset Warna Pas Foto Resmi Indonesia

EraseDrop menyediakan preset warna terkalibrasi khusus untuk kebutuhan dokumen resmi Indonesia, lamaran kerja, CPNS, visa, dan administrasi:

| Nama Preset | Kode Hex | Penggunaan Resmi |
| :--- | :---: | :--- |
| **Merah Formal** | `#D61C1C` | Pas Foto KTP / Ijazah / Dokumen Resmi (**Tahun Kelahiran Ganjil**) |
| **Biru Formal** | `#1C54D6` | Pas Foto KTP / Ijazah / Dokumen Resmi (**Tahun Kelahiran Genap**) |
| **Studio Putih** | `#FFFFFF` | Katalog Produk E-Commerce, Pengajuan Visa Internasional |
| **Studio Abu-Abu** | `#E2E8F0` | Foto Profil LinkedIn, Portfolio Minimalis & Profesional |
| **Charcoal Gelap** | `#1E293B` | Foto Profil Modern Dark Theme |

---

## 🛠️ Teknologi yang Digunakan

- **Framework Utama:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Desain & Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Mesin Inferensi AI:** [`@imgly/background-removal`](https://github.com/imgly/background-removal-js) melalui ONNX Runtime Web
- **Batch ZIP Exporter:** [`JSZip`](https://stuk.github.io/jszip/) & [`file-saver`](https://github.com/eligrey/FileSaver.js/)
- **Ikon & Visual:** [`lucide-react`](https://lucide.dev/) & [`canvas-confetti`](https://www.npmjs.com/package/canvas-confetti)
- **Penyimpanan Lokal:** Browser Native IndexedDB

---

## 💻 Panduan Instalasi Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18+ atau 20+
- Browser modern (Google Chrome, Microsoft Edge, Safari, Firefox, atau Brave)

### Langkah Menjalankan

```bash
# 1. Clone repositori dari GitHub
git clone https://github.com/zzdree/erase-drop.git

# 2. Masuk ke direktori proyek
cd erase-drop

# 3. Install seluruh dependensi
npm install

# 4. Jalankan server lokal development
npm run dev
```

Buka `http://localhost:5173` di browser Anda untuk mulai menghapus background gambar secara lokal.

---

## 🚀 Deployment

- **Production URL:** [https://erase-drop.vercel.app](https://erase-drop.vercel.app)
- **Platform:** Vercel

```bash
# Deploy pembaruan via Vercel CLI
npx vercel --prod
```

---

## 📄 Dokumentasi Proyek

- [Product Requirements Document (PRD.md)](./PRD.md)
- [Design System & UI Tokens (DESIGN.md)](./DESIGN.md)

---

## 👨‍💻 Pengembang & Pemilik Proyek

**Andreas Restuawanta Christwara**  
- GitHub: [@zzdree](https://github.com/zzdree)
- Repositori: [zzdree/erase-drop](https://github.com/zzdree/erase-drop)

---

<div align="center">
  <sub>Dibuat dengan ❤️ untuk privasi, efisiensi, dan kemudahan para kreator & pengguna di seluruh dunia.</sub>
</div>
