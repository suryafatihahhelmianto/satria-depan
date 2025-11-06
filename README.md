# satria-depan

Frontend aplikasi Satria — antarmuka modern, performa tinggi, estetika mewah, dan gaya santai
Proyek ini dibangun dengan Next.js dan Tailwind, disusun modular untuk skalabilitas dan pengembangan cepat.

## Teknologi inti

- Next.js (React)
- Tailwind CSS
- PostCSS
- Struktur kode modular di `src/`

## Versi utama (sesuai package.json)

- Node.js: rekomendasi LTS (18 atau 20)
- Next.js: 14.2.13
- React / React DOM: ^18.3.1
- Tailwind CSS: ^3.4.1
- postcss: ^8
- sharp: ^0.33.5
- framer-motion, axios, lucide-react, react-icons, recharts, dll (lihat package.json untuk lengkapnya)

## Prasyarat

- Node.js (LTS) dan npm / yarn
- Git
- File environment lokal: `.env.local` (jangan commit)

## Instalasi singkat

```ps1
git clone <repo-url>
cd satria
npm install
# atau
yarn
```

## Mode Pengembangan

```ps1
npm run dev
# atau
yarn dev
```

Akses: http://localhost:3000

## Build & Production (lokal)

```ps1
npm run build
npm start
# atau
yarn build
yarn start
```

Jika build OOM di server rendah memori:

```ps1
$env:NODE_OPTIONS="--max_old_space_size=4096"; npm run build
```

## Deploy — VPS Ubuntu dengan PM2 (ringkas)

Langkah singkat untuk production di VPS Ubuntu menggunakan PM2:

1. Siapkan server (Ubuntu), pasang Node via nvm:

```bash
# contoh di server
curl -fsSL https://fnm.vercel.app/install | bash   # atau gunakan nvm
source ~/.bashrc
fnm install 20
fnm use 20
```

2. Clone repo dan install:

```bash
git clone <repo-url>
cd satria
npm install
```

3. Set environment variables (contoh):

```bash
cat > .env.production <<EOF
NEXT_PUBLIC_API_URL=https://api.example.com
# tambah variabel lain
EOF
```

4. Build:

```bash
npm run build
```

5. Jalankan dengan PM2:

- Opsi singkat:

```bash
pm2 start npm --name "satria" -- start
```

- Rekomendasi: gunakan ecosystem file (untuk env & reload zero-downtime)

Contoh ecosystem.config.js:

```js
module.exports = {
  apps: [
    {
      name: "satria",
      script: "npm",
      args: "start",
      env_production: {
        NODE_ENV: "production",
        NEXT_PUBLIC_API_URL: "https://api.example.com",
      },
      instances: "max",
      exec_mode: "cluster",
    },
  ],
};
```

Lalu:

```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

6. Reverse proxy (opsional, disarankan): pasang Nginx untuk melayani TLS & proxy ke port PM2 (default 3000). Contoh server block ringkas di /etc/nginx/sites-available/satria.

7. Monitoring & deploy ulang:

```bash
# lihat logs
pm2 logs satria

# deploy ulang setelah update
git pull
npm install
npm run build
pm2 restart satria
```

## Troubleshooting singkat (kasus umum)

- Build gagal: cek versi Node, jalankan dengan NODE_OPTIONS lebih besar.
- sharp gagal build: pasang build-essential / libvips atau gunakan binary prebuilt.
- Port 3000 terpakai: set PORT env sebelum start (`PORT=4000 pm2 start npm --name "satria" -- start`).
- Permision errors di Ubuntu: pastikan user punya akses ke direktori project dan jalankan dengan user non-root; gunakan sudo hanya saat perlu instal paket sistem.

## Struktur penting

- src/ — kode sumber
- public/ — aset statis
- next.config.mjs — konfigurasi Next
- tailwind.config.js, postcss.config.mjs — styling
- .env.local / .env.production — environment variables

<!-- EOF -->
