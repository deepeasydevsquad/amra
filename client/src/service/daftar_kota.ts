import api from "./api"; // Import service API

export const daftarKota = async (param : any) => {
  try {
    const response = await api.post("/daftar_kota/list", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengambil kota:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const addKota = async (param : any) => {
  try {
    const response = await api.post("/daftar_kota", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan kota:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const editKota = async (id : any, param : any) => {
  try {
    const response = await api.post(`/daftar_kota/update` , {...param,...{id : id }}); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengedit kota:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const deleteKota = async (id : number) => {
  try {
    const response = await api.post(`/daftar_kota/delete`,{ id : id}); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menghapus kota:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};
// deleteKota
