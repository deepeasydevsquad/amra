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
}

export const getSkema = async (param: number) => {
  try {
    const response = await api.post('/get-skema', { peminjaman_id: param }); // Kirim id via body
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data skema:", error);
    throw error;
  }
}

export const updateSkema = async ( param : any) => {
  try {
    const response = await api.post("/update-skema", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengubah skema:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
}

