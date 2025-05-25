import api from "./api"; // Import service API

export const paramCabang = async () => {
  try {
    const response = await api.get("/Param-cabang"); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengambil data param:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};
