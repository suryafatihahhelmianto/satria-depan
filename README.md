# satria-depan

Frontend aplikasi Satria — antarmuka modern, performa tinggi, dengan sentuhan estetik mewah dan gaya yang santai tapi profesional.

Deskripsi singkat: proyek ini adalah frontend berbasis Next.js yang disusun modular untuk skalabilitas, pengembangan cepat, dan pengalaman pengguna premium.

## Teknologi inti

- Next.js (React)
- Tailwind CSS
- PostCSS
- Struktur kode modular di `src/`

## Prasyarat

- Node.js (LTS) dan npm atau yarn
- Variabel environment di `.env.local` [Private]

## Instalasi

1. Clone repo:

```sh
git clone <repo-url>
cd satria
```

2. Pasang dependensi:

```sh
npm install
# atau
yarn
```

## Mode Pengembangan

Jalankan server development dengan hot-reload:

```sh
npm run dev
# atau
yarn dev
```

Buka http://localhost:3000

## Build & Production

Bangun dan jalankan aplikasi untuk production:

```sh
npm run build
npm start
# atau
yarn build
yarn start
```

## Skrip Penting

- dev: development server
- build: compile ke production
- start: jalankan build di Node
- lint / format: cek style (jika tersedia)
- test: jalankan test suite (jika tersedia)

Periksa `package.json` untuk nama skrip yang akurat.

## Workflow & Kontribusi

1. Buat branch fitur: `git checkout -b feat/<nama-fitur>`
2. Kembangkan fitur di `src/`
3. Jalankan `npm run dev` dan pastikan lint & test lulus
4. Commit yang jelas & buat PR ke `main`/`master`
5. Code review → rebase bila perlu → merge

Praktik terbaik: commit kecil & atomic, gunakan konvensi branch (feat/, fix/, chore/), dokumentasikan perubahan publik di README.

## Struktur Proyek

- `src/` – sumber kode utama
- `public/` – aset statis
- `next.config.mjs` – konfigurasi Next
- `tailwind.config.js`, `postcss.config.mjs` – styling
- `.env.local` – secrets lokal (tidak di-commit)

## Debug & Maintenance

- Hapus cache Next bila perlu: hapus folder `.next/`
- Periksa log build & runtime di terminal
- Untuk masalah aset: cek `public/` dan konfigurasi basePath di `next.config.mjs`

## Deploy

Direkomendasikan: Vercel (native Next.js) atau container Docker + process manager (PM2). Pastikan environment variables diatur pada platform deploy.

## Kontak & Support

Butuh perubahan gaya dokumentasi, penambahan CI/CD, atau pengaturan deploy? Buka issue atau PR — kita rapikan bareng.

<!-- end -->
