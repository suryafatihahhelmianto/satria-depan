"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import { AiFillPlusCircle } from "react-icons/ai";
import { fetchData, postData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import Skeleton from "@/components/common/Skeleton";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineUser,
  AiOutlineIdcard,
  AiOutlineLock,
  AiOutlinePhone,
  AiOutlineTool,
} from "react-icons/ai";
import { FaUserTie, FaIndustry } from "react-icons/fa";

export default function PenggunaPage() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [factories, setFactories] = useState([]);
  const { isAdmin } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    password: "",
    jabatan: "",
    level: "",
    nomorHp: "",
    pabrikGulaId: 0,
  });

  // 🔹 Filter state
  const [selectedFactory, setSelectedFactory] = useState("Semua");
  const [selectedJabatan, setSelectedJabatan] = useState("Semua Jabatan");

  // Loading, success, error
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchFactories();
    console.log(process.env.NEXT_PUBLIC_HOLDING);
  }, []);

  const fetchUsers = async () => {
    try {
      const token = getCookie("token");
      const response = await fetchData("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  const fetchFactories = async () => {
    try {
      const token = getCookie("token");
      const response = await fetchData("/api/pabrik", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFactories(response);
    } catch (error) {
      console.error("Error fetching factories: ", error);
    }
  };

  const openModal = (user) => {
    if (user) {
      setEditMode(true);
      setSelectedUserId(user.id);
      setFormData({
        nama: user.nama,
        username: user.username,
        password: "",
        jabatan: user.jabatan,
        level: user.jabatan,
        nomorHp: user.nomorHp,
        pabrikGulaId: user.pabrikGulaId || 0,
      });
    } else {
      setEditMode(false);
      setFormData({
        nama: "",
        username: "",
        password: "",
        jabatan: "",
        level: "",
        nomorHp: "",
        pabrikGulaId: 0,
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUserId(null);
    setErrorMessage("");
  };

  const handleClickOutside = (e) => {
    if (e.target.id === "modalOverlay") {
      closeModal();
    }
  };

  const displayJabatan = (jabatan) => {
    if (jabatan === "FABRIKASI") return "PABRIKASI";
    return jabatan;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "jabatan") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        pabrikGulaId:
          value === "ADMIN" || value === "DIREKSI" ? 0 : prevData.pabrikGulaId,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: name === "pabrikGulaId" ? parseInt(value, 10) : value,
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie("token");
    setIsLoading(true);

    const dataToSend = {
      ...formData,
      level: formData.jabatan,
    };

    if (dataToSend.jabatan === "ADMIN" || dataToSend.jabatan === "DIREKSI") {
      dataToSend.pabrikGulaId = 99;
    }

    if (isEditMode && !dataToSend.password) delete dataToSend.password;

    try {
      if (isEditMode) {
        await fetchData(`/api/users/edit/${selectedUserId}`, {
          method: "PUT",
          data: dataToSend,
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await postData("/api/users/create", dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setSuccessMessage(
        isEditMode
          ? "Pengguna berhasil diperbarui"
          : "Pengguna berhasil ditambahkan"
      );
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error("Error saving user: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus pengguna ini?"
    );
    if (confirmDelete) {
      try {
        const token = getCookie("token");
        await fetchData(`/api/users/delete/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    }
  };

  // Filter logic yang sesuai
  const filteredUsers = users.filter((user) => {
    const namaPabrik = user.pabrikGula?.namaPabrik || "";

    // User dianggap "holding" jika:
    // 1. Tidak punya pabrikGula data
    // 2. namaPabrik === "Semua"
    // 3. jabatan adalah ADMIN atau DIREKSI
    const isHoldingUser =
      !user.pabrikGula ||
      namaPabrik === "Semua" ||
      user.jabatan === "ADMIN" ||
      user.jabatan === "DIREKSI";

    const matchFactory =
      selectedFactory === "Semua" ||
      (selectedFactory === process.env.NEXT_PUBLIC_HOLDING && isHoldingUser) ||
      namaPabrik === selectedFactory;

    const matchJabatan =
      selectedJabatan === "Semua Jabatan" ||
      displayJabatan(user.jabatan) === selectedJabatan;

    return matchFactory && matchJabatan;
  });

  if (loading) return <Skeleton rows={3} />;

  return (
    <div className="p-6">
      {successMessage && (
        <div className="mb-4 text-green-500 font-semibold">
          {successMessage}
        </div>
      )}
      {/* Header filter & action */}
      <div className="flex flex-col mb-6 gap-4">
        <h1 className="text-3xl font-semibold text-green-700">
          Daftar Pengguna
        </h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Filter controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-semibold text-gray-700">Filter by:</h2>

            {/* Filter Pabrik */}
            <select
              value={selectedFactory}
              onChange={(e) => setSelectedFactory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 hover:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 transition"
            >
              <option value="Semua">Semua</option>
              <option value={process.env.NEXT_PUBLIC_HOLDING}>
                {process.env.NEXT_PUBLIC_HOLDING}
              </option>
              {factories
                .filter((factory) => factory.namaPabrik !== "Semua") // Exclude pabrik "Semua"
                .map((factory) => (
                  <option key={factory.id} value={factory.namaPabrik}>
                    {factory.namaPabrik}
                  </option>
                ))}
            </select>

            {/* Filter Jabatan */}
            <select
              value={selectedJabatan}
              onChange={(e) => setSelectedJabatan(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 hover:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 transition"
            >
              <option>Semua Jabatan</option>
              <option>DIREKSI</option>
              <option>KEPALAPABRIK</option>
              <option>ADMIN</option>
              <option>QUALITYCONTROL</option>
              <option>SDM</option>
              <option>INSTALASI</option>
              <option>PABRIKASI</option>
              <option>TANAMAN</option>
              <option>TUK</option>
            </select>
          </div>

          {/* Right: Add button */}
          {isAdmin && (
            <div className="flex justify-end mr-1">
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:rounded-xl border-green-800 rounded-md p-2 hover:border-green-900"
              >
                <AiFillPlusCircle className="text-2xl text-green-800 hover:text-green-900 cursor-pointer" />
                <h1 className="cursor-pointer hover:text-green-600">
                  Tambah Pengguna
                </h1>
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg border">
        <table className="w-full text-left border-collapse border border-gray-300">
          <thead className="bg-gradient-to-r from-ijoWasis to-ijoDash text-white">
            <tr>
              <th className="py-2 px-4">Pabrik</th>
              <th className="py-2 px-4">Nama</th>
              <th className="py-2 px-4">Jabatan</th>
              <th className="py-2 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-200">
                  <td className="py-2 px-4 border">
                    {user.pabrikGula
                      ? user.pabrikGula.namaPabrik === "Semua"
                        ? process.env.NEXT_PUBLIC_HOLDING
                        : user.pabrikGula.namaPabrik
                      : process.env.NEXT_PUBLIC_HOLDING}
                  </td>
                  <td className="py-2 px-4 border">{user.nama}</td>
                  <td className="py-2 px-4 border">
                    {displayJabatan(user.jabatan)}
                  </td>
                  <td className="py-2 px-4 border">
                    <div className="flex gap-2">
                      <button
                        className="p-2 bg-yellow-500 rounded hover:bg-yellow-600"
                        onClick={() => openModal(user)}
                      >
                        <FaEdit className="text-white" />
                      </button>
                      <button
                        className="p-2 bg-red-500 rounded hover:bg-red-600"
                        onClick={() => handleDelete(user.id)}
                      >
                        <FaTrash className="text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Tidak ada pengguna
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div
          id="modalOverlay"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-32"
          onClick={handleClickOutside}
        >
          <div className="bg-gray-50 p-8 rounded-lg shadow-lg w-full sm:w-[30rem] md:w-[40rem] lg:w-[25rem] xl:w-[45rem] relative max-h-[60vh] overflow-y-auto mt-16">
            <button
              className="absolute top-2 right-2 text-black hover:text-red-500 font-bold"
              onClick={closeModal}
            >
              X
            </button>
            <h2 className="text-black font-bold text-center mb-4 text-xl">
              {isEditMode ? "Edit Pengguna" : "Tambah Pengguna Baru"}
            </h2>

            <form className="space-y-4" onSubmit={handleFormSubmit}>
              {/* NAMA */}
              <div>
                <label
                  htmlFor="nama"
                  className="flex items-center gap-2 font-semibold"
                >
                  <AiOutlineUser className="text-green-700" /> Nama
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Nama"
                  className="w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none"
                />
              </div>

              {/* USERNAME */}
              <div>
                <label
                  htmlFor="username"
                  className="flex items-center gap-2 font-semibold"
                >
                  <AiOutlineIdcard className="text-green-700" /> Username
                </label>
                <input
                  type="text"
                  name="username"
                  autoComplete="new-username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  className="w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="flex items-center gap-2 font-semibold"
                >
                  <AiOutlineLock className="text-green-700" /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={
                      isEditMode
                        ? "Kosongkan jika tidak ingin diubah"
                        : "Password"
                    }
                    className={`w-full px-4 py-2 rounded-lg pr-10 focus:outline-none ${
                      formData.password.length > 0 &&
                      (!/[A-Z]/.test(formData.password) ||
                        !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ||
                        !/[0-9]/.test(formData.password) ||
                        formData.password.length < 8)
                        ? "bg-red-100 border-2 border-red-500"
                        : "bg-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-600 hover:text-black"
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </button>
                </div>

                {/* Pesan kesalahan password */}
                {formData.password.length > 0 && (
                  <div className="text-red-500 text-sm mt-1">
                    {!/[A-Z]/.test(formData.password) && (
                      <p>- Harus mengandung minimal 1 huruf kapital.</p>
                    )}
                    {!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) && (
                      <p>- Harus mengandung minimal 1 simbol.</p>
                    )}
                    {!/[0-9]/.test(formData.password) && (
                      <p>- Harus mengandung minimal 1 angka.</p>
                    )}
                    {formData.password.length < 8 && (
                      <p>- Harus minimal 8 karakter.</p>
                    )}
                  </div>
                )}
              </div>

              {/* JABATAN */}
              <div>
                <label
                  htmlFor="jabatan"
                  className="flex items-center gap-2 font-semibold"
                >
                  <FaUserTie className="text-green-700" /> Jabatan
                </label>
                <select
                  className="w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none"
                  value={formData.jabatan}
                  onChange={handleInputChange}
                  name="jabatan"
                >
                  <option value="">Pilih Jabatan</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="DIREKSI">DIREKSI</option>
                  <option value="KEPALAPABRIK">
                    GENERAL MANAGER / KEPALA PABRIK
                  </option>
                  <option value="QUALITYCONTROL">
                    KEPALA BAGIAN QUALITY CONTROL
                  </option>
                  <option value="SDM">KEPALA BAGIAN SDM DAN UMUM</option>
                  <option value="INSTALASI">KEPALA BAGIAN INSTALASI</option>
                  <option value="FABRIKASI">KEPALA BAGIAN FABRIKASI</option>
                  <option value="TANAMAN">KEPALA BAGIAN TANAMAN</option>
                  <option value="TUK">KEPALA BAGIAN TUK</option>
                </select>
              </div>

              {/* PABRIK */}
              {formData.jabatan !== "ADMIN" &&
                formData.jabatan !== "DIREKSI" && (
                  <div>
                    <label
                      htmlFor="pabrikGulaId"
                      className="flex items-center gap-2 font-semibold"
                    >
                      <FaIndustry className="text-green-700" /> Pabrik
                    </label>
                    <select
                      name="pabrikGulaId"
                      value={formData.pabrikGulaId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none"
                    >
                      <option value="">Pilih Pabrik</option>
                      {factories.map((factory) => (
                        <option key={factory.id} value={factory.id}>
                          {factory.namaPabrik}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              {/* NOMOR HP */}
              <div>
                <label
                  htmlFor="nomorHp"
                  className="flex items-center gap-2 font-semibold"
                >
                  <AiOutlinePhone className="text-green-700" /> Nomor HP
                </label>
                <div className="relative">
                  <input
                    type={showPhone ? "text" : "password"}
                    name="nomorHp"
                    value={formData.nomorHp}
                    onChange={handleInputChange}
                    placeholder="Nomor HP"
                    className={`w-full px-4 py-2 rounded-lg pr-10 focus:outline-none ${
                      !/^0[0-9]*$/.test(formData.nomorHp) ||
                      formData.nomorHp.length > 13 ||
                      formData.nomorHp.length < 10
                        ? "bg-red-100 border-2 border-red-500"
                        : "bg-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPhone(!showPhone)}
                    className="absolute right-3 top-2.5 text-gray-600 hover:text-black"
                  >
                    {showPhone ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </button>
                </div>
                {(!/^0[0-9]*$/.test(formData.nomorHp) ||
                  formData.nomorHp.length > 13 ||
                  formData.nomorHp.length < 10) && (
                  <p className="text-red-500 text-sm mt-1">
                    Nomor HP harus dimulai dengan &quot;0&quot;, minimal 10 dan
                    maksimal 13 digit angka.
                  </p>
                )}
              </div>

              {errorMessage && (
                <div className="mb-4 text-red-500 font-semibold">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-2 rounded-lg hover:bg-green-800"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin mx-auto" />
                ) : isEditMode ? (
                  "Simpan Perubahan"
                ) : (
                  "Daftar"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
