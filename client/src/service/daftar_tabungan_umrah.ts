import api from "./api";

export const getJamaah = async () => {
  try {
    const response = await api.get("/get-Jamaah-Tabungan-Umrah/list");
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil daftar jamaah:", error);
    throw error;
  }
};

export const getPaket = async () => {
  try {
    const response = await api.get("/get-Paket-Tabungan-Umrah/list");
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil daftar paket:", error);
    throw error;
  }
}

export const getAgen = async (id: number) => {
  try {
    const response = await api.post("/get-Agen-Tabungan-Umrah", { id });
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil daftar agen:", error);
    throw error;
  }
}

export const addTabunganUmrah = async (param : any) => {
  try {
    const response = await api.post("/daftar_tabungan_umrah", param);
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
    console.error("Gagal menghapus paket la:", error);
    throw error;
  }
};
