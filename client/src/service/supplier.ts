import api from "./api"; // Import service API

export const daftarBank = async (param : any) => {
  try {
    const response = await api.post("/daftar_bank/list", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menampilkan bank:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const daftarSupplier = async (param : any) => {
  try {
    const response = await api.post("/supplier/list", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menampilkan supplier:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const addSupplier = async (param : any) => {
  try {
    const response = await api.post("/supplier", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan supplier:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const editSupplier = async (id : any, param : any) => {
  try {
    const response = await api.post(`/supplier/update` , {...param,...{id : id }}); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengedit supplier:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const deleteSupplier = async (id : number) => {
  try {
    const response = await api.post(`/supplier/delete`,{ id : id}); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menghapus supplier:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};
// deleteSupplier
