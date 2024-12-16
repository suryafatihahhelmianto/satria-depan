"use client";

import React, { useState } from "react";
import {
  FaLeaf,
  FaCalendarAlt,
  FaDna,
  FaSeedling,
  FaThermometerHalf,
  FaVial,
  FaCloudRain,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";

export default function RendemenInputPage() {
  const [formData, setFormData] = useState({
    blokKebun: "",
    jenis: "",
    masaTanam: "",
    varietas: "",
    kemasakan: "",
    brix: "",
    pol: "",
    curahHujan: "",
  });
  const [predictionValue, setPredictionValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const {
      blokKebun,
      jenis,
      masaTanam,
      varietas,
      kemasakan,
      brix,
      pol,
      curahHujan,
    } = formData;

    const data = {
      blokKebun: blokKebun,
      jenis: parseFloat(jenis),
      masaTanam: parseFloat(masaTanam),
      varietas: parseFloat(varietas),
      kemasakan: parseFloat(kemasakan),
      brix: parseFloat(brix),
      pol: parseFloat(pol),
      curahHujan: parseFloat(curahHujan),
    };

    try {
      const response = await fetchData(`/api/rendemen/input`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json",
        },
        data,
      });

      setPredictionValue(response.newRendemen.nilaiRendemen);
      // router.push("/rendemen");
    } catch (error) {
      console.error("Error submitting data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
              Input Data
            </div>
            <h2 className="block mt-1 text-lg leading-tight font-medium text-black">
              Rendemen Tebu
            </h2>
            <p className="mt-2 text-gray-500">
              Masukkan data rendemen tebu untuk analisis.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FaVial className="mr-2 text-indigo-500" />
                  Blok Kebun
                </label>
                <input
                  type="text"
                  name="blokKebun"
                  value={formData.blokKebun}
                  onChange={handleInputChange}
                  placeholder="Masukkan nilai Blok"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FaLeaf className="mr-2 text-green-500" />
                  Jenis
                </label>
                <select
                  name="jenis"
                  value={formData.jenis}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Pilih Jenis</option>
                  <option value="0">Mandiri</option>
                  <option value="1">PC</option>
                  <option value="2">R1</option>
                  <option value="3">R2</option>
                  <option value="4">R3</option>
                  <option value="5">RC</option>
                  <option value="6">TRS I KM B</option>
                  <option value="7">TRS I KM C</option>
                  <option value="8">TRS I KM E</option>
                  <option value="9">TRS II KM B</option>
                  <option value="10">TRS II KM C</option>
                  <option value="11">TRS II KM D</option>
                  <option value="12">TRS II KM E</option>
                  <option value="13">TRS II KM K</option>
                  <option value="14">TRT I KM B</option>
                  <option value="15">TRT I KM K</option>
                  <option value="16">TRT II KM B</option>
                  <option value="17">TRT II KM C</option>
                  <option value="18">TRT II KM K</option>
                  <option value="19">TRT III KM C</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  Masa Tanam
                </label>
                <select
                  name="masaTanam"
                  value={formData.masaTanam}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Pilih Masa Tanam</option>
                  <option value="1">10A</option>
                  <option value="2">10B</option>
                  <option value="3">11A</option>
                  <option value="4">11B</option>
                  <option value="5">12A</option>
                  <option value="6">12B</option>
                  <option value="7">13A</option>
                  <option value="8">5A</option>
                  <option value="9">5B</option>
                  <option value="10">6A</option>
                  <option value="11">6B</option>
                  <option value="12">7A</option>
                  <option value="13">7B</option>
                  <option value="14">8A</option>
                  <option value="15">8B</option>
                  <option value="16">9A</option>
                  <option value="17">9B</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FaDna className="mr-2 text-purple-500" />
                  Varietas
                </label>
                <select
                  name="varietas"
                  value={formData.varietas}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Pilih Varietas</option>
                  <option value="0">BL</option>
                  <option value="1">CENING</option>
                  <option value="2">GMP1</option>
                  <option value="3">GMP2</option>
                  <option value="4">GMP3</option>
                  <option value="5">KK</option>
                  <option value="6">KENTUNG</option>
                  <option value="7">LAMPUNG3</option>
                  <option value="8">PA8213</option>
                  <option value="9">PA8218</option>
                  <option value="10">PA822</option>
                  <option value="11">PA822 (KB II)</option>
                  <option value="12">PA828</option>
                  <option value="13">PA1301</option>
                  <option value="14">PA1303</option>
                  <option value="15">PA1401</option>
                  <option value="16">PA1601</option>
                  <option value="17">PA197</option>
                  <option value="18">PS851</option>
                  <option value="19">PS862</option>
                  <option value="20">PS864</option>
                  <option value="21">PS865</option>
                  <option value="22">PS881</option>
                  <option value="23">PS882</option>
                  <option value="24">PSJK922</option>
                  <option value="25">PSJT941</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FaSeedling className="mr-2 text-yellow-500" />
                  Kemasakan
                </label>
                <select
                  name="kemasakan"
                  value={formData.kemasakan}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Pilih Kemasakan</option>
                  <option value="0">Awal</option>
                  <option value="1">Awal Tengah</option>
                  <option value="2">Tengah</option>
                  <option value="3">Tengah Lambat</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FaThermometerHalf className="mr-2 text-red-500" />
                  Brix
                </label>
                <input
                  type="number"
                  name="brix"
                  value={formData.brix}
                  onChange={handleInputChange}
                  placeholder="Masukkan nilai Brix"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FaVial className="mr-2 text-indigo-500" />
                  Pol
                </label>
                <input
                  type="number"
                  name="pol"
                  value={formData.pol}
                  onChange={handleInputChange}
                  placeholder="Masukkan nilai Pol"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FaCloudRain className="mr-2 text-blue-500" />
                  Curah Hujan
                </label>
                <input
                  type="number"
                  name="curahHujan"
                  value={formData.curahHujan}
                  onChange={handleInputChange}
                  placeholder="Masukkan nilai curah hujan"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isLoading}
                >
                  {isLoading ? "Menghitung..." : "Submit Data"}
                </button>
              </div>
            </form>
            {predictionValue !== null && (
              <div className="mt-8 bg-gradient-to-r from-green-400 to-green-500 rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Nilai Prediksi
                </h3>
                <p className="text-6xl font-bold text-white">
                  {predictionValue}%
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
