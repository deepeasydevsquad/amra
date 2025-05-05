import api from "./api"; // Import service API

export const daftarPinjaman = async (param : any) => {
  try {
    const response = await api.post("/get-peminjaman", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengambil data pinjaman:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const addPinjaman = async (param : any) => {
  try {
    const response = await api.post("/add-peminjaman", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan pinjaman:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};