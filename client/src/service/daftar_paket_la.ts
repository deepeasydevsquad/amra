import api from "./api"; // Import service API

export const daftarKostumerPaketLA = async (param : any) => {
  try {
    const response = await api.post("/daftar_kostumer_paket_la/list", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan kota:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const addKostumerPaketLA = async (param : any) => {
  try {
    const response = await api.post("/daftar_kostumer_paket_la", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan kota:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const editKostumerPaketLA = async (id : any, param : any) => {
  try {
    const response = await api.post(`/daftar_kostumer_paket_la/update` , {...param,...{id : id }}); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan kota:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const deleteKostumerPaketLA = async (id : number) => {
  try {
    const response = await api.post(`/daftar_kostumer_paket_la/delete`,{ id : id}); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan kota:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};
// deleteKostumerPaketLA
