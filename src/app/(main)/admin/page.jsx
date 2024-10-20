"use client";

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { fetchData, postData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";

export default function PenggunaPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    password: "",
    jabatan: "",
    level: "",
    nomorHp: "",
  });

  // Fetch data pengguna dari API saat komponen pertama kali di-load
  const fetchUsers = async () => {
    try {
      const token = getCookie("token");
      const response = await fetchData("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("ini response: ", response);
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  // Load data pengguna saat komponen pertama kali dirender
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to open the modal
  const openModal = () => {
    setModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Function to handle closing modal when clicking outside
  const handleClickOutside = (e) => {
    if (e.target.id === "modalOverlay") {
      closeModal();
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission to add a new user
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      level: formData.jabatan, // Gunakan nilai jabatan untuk level
    };

    try {
      const token = getCookie("token");
      await postData("/api/users/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({
        nama: "",
        username: "",
        password: "",
        jabatan: "",
        level: "",
        nomorHp: "",
      });
      closeModal();
      fetchUsers(); // Refresh users after adding
    } catch (error) {
      console.error("Error creating user: ", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Data Pengguna</h1>
      <table className="w-full text-left border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border">Nama</th>
            <th className="py-2 px-4 border">Username</th>
            <th className="py-2 px-4 border">Nomor Hp</th>
            <th className="py-2 px-4 border">Jabatan</th>
            <th className="py-2 px-4 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border">{user.nama}</td>
                <td className="py-2 px-4 border">{user.username}</td>
                <td className="py-2 px-4 border">{user.nomorHp}</td>
                <td className="py-2 px-4 border">{user.jabatan}</td>
                <td className="py-2 px-4 border">
                  <div className="flex gap-2">
                    <button className="p-2 bg-gray-300 rounded hover:bg-gray-400">
                      <FaEdit />
                    </button>
                    <button className="p-2 bg-gray-300 rounded hover:bg-gray-400">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                Tidak ada pengguna
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex w-full justify-end">
        <button
          className="mt-4 py-2 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          onClick={openModal}
        >
          Baru
        </button>
      </div>

      {/* Modal untuk menambah pengguna baru */}
      {isModalOpen && (
        <div
          id="modalOverlay"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={handleClickOutside}
        >
          <div className="bg-teal-800 p-8 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-white font-bold"
              onClick={closeModal}
            >
              X
            </button>
            <h2 className="text-red-600 font-bold text-center mb-4">
              Silahkan isi data dibawah ini!
            </h2>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
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
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none"
                />
              </div>
              {/* <div>
                <input
                  type="text"
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleInputChange}
                  placeholder="Jabatan"
                  className="w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none"
                />
              </div> */}
              <div>
                <select
                  className="w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none"
                  value={formData.jabatan}
                  onChange={(e) =>
                    setFormData({ ...formData, jabatan: e.target.value })
                  }
                >
                  <option value="">Pilih Jabatan</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="DIREKSI">DIREKSI</option>
                  <option value="KEPALAPABRIK">KEPALA PABRIK</option>
                  <option value="KEPALABAGIAN">KEPALA BAGIAN</option>
                </select>
              </div>
              {/* <div>
                <select
                  className="w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none"
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
                  }
                >
                  <option value="">Pilih Level</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="DIREKSI">DIREKSI</option>
                  <option value="KEPALAPABRIK">KEPALA PABRIK</option>
                  <option value="KEPALABAGIAN">KEPALA BAGIAN</option>
                </select>
              </div> */}
              <div>
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
                Daftar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
