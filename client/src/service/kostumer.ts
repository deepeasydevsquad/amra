import api from "./api"; // Import service API

export const list = async (param : any) => {
  try {
    const response = await api.post("/kostumer/list", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengambil kostumer:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const add = async (param : any) => {
  try {
    const response = await api.post("/kostumer/add", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan kostumer:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const edit = async (id : any, param : any) => {
  try {
    const response = await api.post(`/kostumer/update` , {...param,...{id : id }}); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengedit kostumer:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const delete = async (id : number) => {
  try {
    const response = await api.post(`/kostumer/delete`,{ id : id}); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menghapus kostumer:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};
