export const formatTanggal = (tanggal) => {
  if (!tanggal) {
    return "Tanggal tidak tersedia"; // Tampilkan pesan default jika tanggal kosong
  }

  const dateObj = new Date(tanggal);
  if (isNaN(dateObj)) {
    return "Tanggal tidak valid"; // Tampilkan pesan jika format tanggal salah
  }

  // Format tanggal ke Bahasa Indonesia
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dateObj);
};
