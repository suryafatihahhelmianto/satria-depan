// "use client";
// import { useState, useEffect, useCallback } from "react";
// import Image from "next/image";
// import Link from "next/link"; // Use Link for navigation

// export default function Dashboard() {
//   const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
//   const totalSlides = 3;

//   const slides = [
//     {
//       id: 1,
//       src: "/img/login.png",
//       title: "Peningkatan layanan kesehatan di daerah terpencil",
//     },
//     {
//       id: 2,
//       src: "/img/dashboard.png",
//       title: "Pemulihan ekonomi pasca-pandemi",
//     },
//     {
//       id: 3,
//       src: "/img/dashboard1.png",
//       title: "Peran pendidikan dalam membangun masa depan",
//     },
//   ];

//   const nextSlide = useCallback(() => {
//     setCurrentSlideIndex((currentSlideIndex + 1) % totalSlides);
//   }, [currentSlideIndex, totalSlides]);

//   const prevSlide = () => {
//     setCurrentSlideIndex((currentSlideIndex - 1 + totalSlides) % totalSlides);
//   };

//   const updateDots = (index) => {
//     setCurrentSlideIndex(index);
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       nextSlide();
//     }, 9000); // Slide auto-change every 9 seconds
//     return () => clearInterval(interval);
//   }, [nextSlide]);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-ijoTebu text-white text-center py-4">
//         <div className="flex justify-center items-center space-x-10 mb-6">
//           <Image
//             src="/img/logorajawali.png"
//             alt="Logo Rajawali"
//             width={250}
//             height={250}
//             style={{ width: "auto", height: "auto" }} // Maintain aspect ratio
//           />
//           <Image
//             src="/img/logoipb.png"
//             alt="Logo IPB"
//             width={250}
//             height={250}
//             style={{ width: "auto", height: "auto" }} // Maintain aspect ratio
//           />
//         </div>
//         <h1 className="text-4xl font-bold">Segera Hadir</h1>
//         <h2 className="text-4xl font-bold mt-10">
//           &quot;Sistem Analitik dan Teknologi Rajawali-IPB untuk Inovasi Agro:
//           Pengukuran Kinerja Keberlanjutan Rantai Pasok dan Prediksi
//           Rendemen&quot;
//         </h2>
//         <h1 className="text-3xl font-bold mt-10">SATRIA KEREN</h1>
//       </header>

//       {/* Main Content with Slider and Card */}
//       <div className="flex justify-center items-center mt-10 space-x-10 px-5">
//         {/* Slider Section */}
//         <div className="relative w-3/4 h-[600px] overflow-hidden rounded-lg">
//           {" "}
//           {/* Perbesar slider */}
//           <div
//             className="slides flex transition-transform duration-700 ease-in-out h-full"
//             style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
//           >
//             {slides.map((slide) => (
//               <div key={slide.id} className="min-w-full h-full relative">
//                 <div className="absolute inset-0">
//                   {" "}
//                   {/* Ensure full coverage */}
//                   <Image
//                     src={slide.src}
//                     alt={`Slide ${slide.id}`}
//                     fill
//                     className="object-cover rounded-lg"
//                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                   />
//                 </div>
//                 <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-black to-transparent z-10"></div>
//                 <div className="absolute bottom-10 left-10 text-white z-20">
//                   <h2 className="text-lg font-bold">{slide.title}</h2>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {/* Prev and Next buttons */}
//           <button
//             className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
//             onClick={prevSlide}
//           >
//             &#10094;
//           </button>
//           <button
//             className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
//             onClick={nextSlide}
//           >
//             &#10095;
//           </button>
//           {/* Dots navigation */}
//           <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
//             {slides.map((_, index) => (
//               <span
//                 key={index}
//                 className={`dot w-3 h-3 bg-white bg-opacity-50 rounded-full cursor-pointer ${
//                   index === currentSlideIndex ? "bg-ijoTebu" : ""
//                 }`}
//                 onClick={() => updateDots(index)}
//               ></span>
//             ))}
//           </div>
//         </div>

//         {/* Card Section */}
//         <div className="bg-gray-300 p-4 rounded-lg w-1/4 h-80 flex flex-col justify-center items-center space-y-4">
//           {" "}
//           {/* Perkecil card */}
//           <h2 className="text-lg font-bold">Masuk Sekarang</h2>
//           <Link
//             href="/login"
//             className="bg-ijoTebu text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700"
//           >
//             Masuk
//           </Link>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-gray-700 text-white text-center py-4 mt-10">
//         <p>© 2024 Buatan Mas Wasis. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

import Link from "next/link";
import { BarChart2, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-green-200 to-green-50 ">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-green-800 ">
                  SATRIA-KEREN
                </h1>
                <p className="text-xl font-semibold text-green-600">
                  Sistem Analitik dan Teknologi Rajawali-IPB untuk Inovasi Agro
                </p>
                <p className="mx-auto max-w-[700px] text-green-700 md:text-xl">
                  Pengukuran Kinerja Keberlanjutan Rantai Pasok dan Prediksi
                  Rendemen
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login">
                  <button className="px-8 py-3 text-lg font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                    Masuk ke Sistem
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-green-800">
              Fitur Utama
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white  border border-green-200 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-green-700 mb-4">
                    <BarChart2 className="h-6 w-6" />
                    <h3 className="text-xl font-semibold">
                      Analisis Kinerja Keberlanjutan Rantai Pasok
                    </h3>
                  </div>
                  <p className="text-green-600">
                    Evaluasi komprehensif terhadap keberlanjutan rantai pasok
                    agro dengan metrik terukur. Identifikasi area peningkatan
                    dan optimalkan efisiensi operasional Anda untuk
                    keberlanjutan jangka panjang.
                  </p>
                </div>
              </div>
              <div className="bg-white border border-green-200 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-green-700 mb-4">
                    <TrendingUp className="h-6 w-6" />
                    <h3 className="text-xl font-semibold">
                      Analisis Prediksi Rendemen
                    </h3>
                  </div>
                  <p className="text-green-600">
                    Manfaatkan kekuatan analitik prediktif untuk memperkirakan
                    hasil panen dengan akurasi tinggi. Optimalkan perencanaan
                    produksi dan pengambilan keputusan berdasarkan data yang
                    dapat diandalkan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-green-200 ">
        <p className="text-xs text-green-600 ">
          © 2024 SATRIA-KEREN. Hak Cipta Dilindungi.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#terms"
            className="text-xs hover:underline underline-offset-4 text-green-600 hover:text-green-700  "
          >
            Syarat Penggunaan
          </Link>
          <Link
            href="#privacy"
            className="text-xs hover:underline underline-offset-4 text-green-600 hover:text-green-700  "
          >
            Kebijakan Privasi
          </Link>
        </nav>
      </footer>
    </div>
  );
}
