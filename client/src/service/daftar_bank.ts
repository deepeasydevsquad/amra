import api from "./api"; // Import service API

export const daftarBank = async (param : any) => {
  try {
    const response = await api.post("/daftar_bank/list", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengambil bank:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const addBank = async (param : any) => {
  try {
    const response = await api.post("/daftar_bank", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan bank:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const editBank = async (id : any, param : any) => {
  try {
    const response = await api.post(`/daftar_bank/update` , {...param,...{id : id }}); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengedit bank:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const deleteBank = async (id : number) => {
  try {
    const response = await api.post(`/daftar_bank/delete`,{ id : id}); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menghapus bank:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};
