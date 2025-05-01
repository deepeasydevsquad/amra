import api from "./api"; // Import service API

export const daftarAirlines = async (param : any) => {
  try {
    const response = await api.post("/airlines/list", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengambil airlines:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const addAirlines = async (param : any) => {
  try {
    const response = await api.post("/airlines", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan airlines:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const editAirlines = async (id : any, param : any) => {
  try {
    const response = await api.post(`/airlines/update` , {...param,...{id : id }}); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengedit airlines:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const deleteAirlines = async (id : number) => {
  try {
    const response = await api.post(`/airlines/delete`,{ id : id}); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menghapus airlines:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};
// deleteAirlines
