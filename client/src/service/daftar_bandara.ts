import api from "./api"; // Import service API

export const daftarBandara = async (param : any) => {
  try {
    const response = await api.post("/daftar_bandara/list", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan bandara:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const addBandara = async (param : any) => {
  try {
    const response = await api.post("/daftar_bandara", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan bandara:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const editBandara = async (id : any, param : any) => {
  try {
    const response = await api.post(`/daftar_bandara/update` , {...param,...{id : id }}); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan bandara:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const deleteBandara = async (id : number) => {
  try {
    const response = await api.post(`/daftar_bandara/delete`,{ id : id}); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan bandara:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};
// deleteBandara
