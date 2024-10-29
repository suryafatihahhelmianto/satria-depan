"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; // Use Link for navigation

export default function Dashboard() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const totalSlides = 3;

  const slides = [
    {
      id: 1,
      src: "/img/login.png",
      title: "Peningkatan layanan kesehatan di daerah terpencil",
    },
    {
      id: 2,
      src: "/img/dashboard.png",
      title: "Pemulihan ekonomi pasca-pandemi",
    },
    {
      id: 3,
      src: "/img/dashboard1.png",
      title: "Peran pendidikan dalam membangun masa depan",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 9000); // Slide auto-change every 9 seconds
    return () => clearInterval(interval);
  }, [currentSlideIndex]);

  const nextSlide = () => {
    setCurrentSlideIndex((currentSlideIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((currentSlideIndex - 1 + totalSlides) % totalSlides);
  };

  const updateDots = (index) => {
    setCurrentSlideIndex(index);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-ijoTebu text-white text-center py-4">
        <div className="flex justify-center items-center space-x-10 mb-6">
          <Image
            src="/img/logorajawali.png"
            alt="Logo Rajawali"
            width={250}
            height={250}
            style={{ width: "auto", height: "auto" }} // Maintain aspect ratio
          />
          <Image
            src="/img/logoipb.png"
            alt="Logo IPB"
            width={250}
            height={250}
            style={{ width: "auto", height: "auto" }} // Maintain aspect ratio
          />
        </div>
        <h1 className="text-4xl font-bold">Segera Hadir</h1>
        <h2 className="text-4xl font-bold mt-10">
          "Sistem Analitik dan Teknologi Rajawali-IPB untuk Inovasi Agro:
          Pengukuran Kinerja Keberlanjutan Rantai Pasok dan Prediksi Rendemen"
        </h2>
        <h1 className="text-3xl font-bold mt-10">SATRIA KEREN</h1>
      </header>

      {/* Main Content with Slider and Card */}
      <div className="flex justify-center items-center mt-10 space-x-10 px-5">
        {/* Slider Section */}
        <div className="relative w-3/4 h-[600px] overflow-hidden rounded-lg">
          {" "}
          {/* Perbesar slider */}
          <div
            className="slides flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
          >
            {slides.map((slide) => (
              <div key={slide.id} className="min-w-full h-full relative">
                <div className="absolute inset-0">
                  {" "}
                  {/* Ensure full coverage */}
                  <Image
                    src={slide.src}
                    alt={`Slide ${slide.id}`}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-black to-transparent z-10"></div>
                <div className="absolute bottom-10 left-10 text-white z-20">
                  <h2 className="text-lg font-bold">{slide.title}</h2>
                </div>
              </div>
            ))}
          </div>
          {/* Prev and Next buttons */}
          <button
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            onClick={prevSlide}
          >
            &#10094;
          </button>
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            onClick={nextSlide}
          >
            &#10095;
          </button>
          {/* Dots navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot w-3 h-3 bg-white bg-opacity-50 rounded-full cursor-pointer ${
                  index === currentSlideIndex ? "bg-ijoTebu" : ""
                }`}
                onClick={() => updateDots(index)}
              ></span>
            ))}
          </div>
        </div>

        {/* Card Section */}
        <div className="bg-gray-300 p-4 rounded-lg w-1/4 h-80 flex flex-col justify-center items-center space-y-4">
          {" "}
          {/* Perkecil card */}
          <h2 className="text-lg font-bold">Masuk ke sistem</h2>
          <Link
            href="/login"
            className="bg-ijoTebu text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700"
          >
            Masuk
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-700 text-white text-center py-4 mt-10">
        <p>© 2024 Buatan Mas Wasis. All rights reserved.</p>
      </footer>
    </div>
  );
}
