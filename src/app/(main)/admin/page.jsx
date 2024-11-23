"use client";

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { fetchData, postData, putData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import { AiFillPlusCircle } from "react-icons/ai";
import Skeleton from "@/components/common/Skeleton";

export default function PenggunaPage() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [factories, setFactories] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    password: "",
    jabatan: "",
    level: "",
    nomorHp: "",
    pabrikGulaId: 0,
  });

  useEffect(() => {
    fetchUsers();
    fetchFactories();
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
        password: "", // Kosongkan password agar bisa diisi ulang
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
  };

  const handleClickOutside = (e) => {
    if (e.target.id === "modalOverlay") {
      closeModal();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Jika jabatan diubah, atur pabrikGulaId menjadi 0 jika "ADMIN" atau "DIREKSI"
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

    const dataToSend = {
      ...formData,
      level: formData.jabatan,
    };

    // Jika jabatan adalah "ADMIN" atau "DIREKSI", hapus atau set pabrikGulaId ke 0
    if (dataToSend.jabatan === "ADMIN" || dataToSend.jabatan === "DIREKSI") {
      dataToSend.pabrikGulaId = 99;
    }

    console.log("Data to send:", dataToSend);

    if (isEditMode && !dataToSend.password) {
      delete dataToSend.password;
    }

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
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error("Error saving user: ", error);
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

  if (loading) {
    return (
      <div>
        <Skeleton rows={3} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 my-5">
        <AiFillPlusCircle
          className="text-2xl text-gray-500 cursor-pointer"
          onClick={() => openModal()}
        />
        <h1 className="cursor-pointer" onClick={() => openModal()}>
          Tambah Pengguna
        </h1>
      </div>
      <h1 className="text-2xl font-bold mb-6">Data Pengguna</h1>
      <table className="w-full text-left border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border">Pabrik</th>
            <th className="py-2 px-4 border">Nama</th>
            <th className="py-2 px-4 border">Jabatan</th>
            <th className="py-2 px-4 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border">
                  {user.pabrikGula?.namaPabrik || "Semua"}
                </td>
                <td className="py-2 px-4 border">{user.nama}</td>
                <td className="py-2 px-4 border">{user.jabatan}</td>
                <td className="py-2 px-4 border">
                  <div className="flex gap-2">
                    <button
                      className="p-2 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={() => openModal(user)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="p-2 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={() => handleDelete(user.id)}
                    >
                      <FaTrash />
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

      {isModalOpen && (
        <div
          id="modalOverlay"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-32"
          onClick={handleClickOutside}
        >
          <div className="bg-gray-50 p-8 rounded-lg shadow-lg w-96 relative max-h-[60vh] overflow-y-auto mt-16">
            <button
              className="absolute top-2 right-2 text-black font-bold"
              onClick={closeModal}
            >
              X
            </button>
            <h2 className="text-black font-bold text-center mb-4">
              {isEditMode ? "Edit Pengguna" : "Tambah Pengguna Baru"}
            </h2>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <label htmlFor="nama">Nama</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Nama"
                  className="w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  className="w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={
                    isEditMode
                      ? "Kosongkan jika tidak ingin diubah"
                      : "Password"
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="jabatan">Jabatan</label>
                <select
                  className="w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none"
                  value={formData.jabatan}
                  onChange={handleInputChange}
                  name="jabatan"
                >
                  <option value="">Pilih Jabatan</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="DIREKSI">DIREKSI</option>
                  <option value="KEPALAPABRIK">KEPALA PABRIK</option>
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
              {/* Input Pabrik hanya tampil jika jabatan bukan ADMIN atau DIREKSI */}
              {formData.jabatan !== "ADMIN" &&
                formData.jabatan !== "DIREKSI" && (
                  <div>
                    <label htmlFor="pabrikGulaId">Pabrik</label>
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
              <div>
                <label htmlFor="nomorHp">Nomor HP</label>
                <input
                  type="tel"
                  name="nomorHp"
                  value={formData.nomorHp}
                  onChange={handleInputChange}
                  placeholder="Nomor HP"
                  className="w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-400 text-white py-2 rounded-lg hover:bg-green-500"
              >
                {isEditMode ? "Simpan Perubahan" : "Daftar"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
