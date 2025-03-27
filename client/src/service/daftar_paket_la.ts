import api from "./api";

export const daftarPaketLA = async (param : any) => {
  try {
    const response = await api.post("/daftar_paket_la/list", param);
    return response.data;
  } catch (error) {
    console.error("Gagal menambahkan paket la:", error);
    throw error;
  }
};

export const addPaketLA = async (param : any) => {
  try {
    const response = await api.post("/daftar_paket_la", param);
    return response.data;
  } catch (error) {
    console.error("Gagal menambahkan paket la:", error);
    throw error;
  }
};

export const editPaketLA = async (id : any, param : any) => {
  try {
    const response = await api.post(`/daftar_paket_la/update` , {...param,...{id : id }});
    return response.data;
  } catch (error) {
    console.error("Gagal menambahkan paket la:", error);
    throw error;
  }
};

export const deletePaketLA = async (id : number) => {
  try {
    const response = await api.post(`/daftar_paket_la/delete`,{ id : id});
    return response.data;
  } catch (error) {
    console.error("Gagal menambahkan paket la:", error);
    throw error;
  }
};
