import api from "./api";

export const daftarFasilitas = async (param : any) => {
  try {
    const response = await api.post("/daftar_fasilitas/list", param);
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil fasilitas:", error);
    throw error;
  }
};

export const addFasilitas = async (param : any) => {
  try {
    const response = await api.post("/daftar_fasilitas", param);
    return response.data;
  } catch (error) {
    console.error("Gagal menambahkan fasilitas:", error);
    throw error;
  }
};

export const editFasilitas = async (id : any, param : any) => {
  try {
    const response = await api.post(`/daftar_fasilitas/update` , {...param,...{id : id }});
    return response.data;
  } catch (error) {
    console.error("Gagal mengedit fasilitas:", error);
    throw error;
  }
};

export const deleteFasilitas = async (id : number) => {
  try {
    const response = await api.post(`/daftar_fasilitas/delete`,{ id : id});
    return response.data;
  } catch (error) {
    console.error("Gagal menghapus fasilitas:", error);
    throw error;
  }
};
