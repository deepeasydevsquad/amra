import api from "./api"; // Import service API

export const daftarHotel = async (param : any) => {
  try {
    const response = await api.post("/daftar_hotel/list", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan kota:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const addHotel = async (param : any) => {
  try {
    const response = await api.post("/daftar_hotel", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan kota:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const editHotel = async (id : any, param : any) => {
  try {
    const response = await api.post(`/daftar_hotel/update` , {...param,...{id : id }}); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan kota:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const deleteHotel = async (id : number) => {
  try {
    const response = await api.post(`/daftar_hotel/delete`,{ id : id}); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan kota:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};
// deleteHotel
