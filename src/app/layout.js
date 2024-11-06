import localFont from "next/font/local";
import { Poppins } from "next/font/google";
// import "./globals.css";
import "@/app/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Satria Keren",
  description:
    "Sistem Analitik dan Teknologi Rajawali-IPB untuk Inovasi Agro: Pengukuran Kinerja Keberlanjutan Rantai Pasok dan Prediksi Rendemen",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-gray-100`}>{children}</body>
    </html>
  );
}
