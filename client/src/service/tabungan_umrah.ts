import api from "./api";

export const cekKwitansiTabunganUmrah = async (invoice: string) => {
  try {
    console.log("========================================")
    console.log(`/invoice/cek-kwitansi-tabungan-umrah`)
    console.log("========================================")
    const response = await api.post(`/invoice/cek-kwitansi-tabungan-umrah`, { invoice });
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil kwitansi terakhir tabungan umrah:", error);
    throw error;
  }
}

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

export const daftar_tabungan_umrah = async (param : any) => {
  try {
    const response = await api.post("/daftar_tabungan_umrah/list", param);
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil paket:", error);
    throw error;
  }
};

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
    console.error("Gagal menambahkan tabungan umrah:", error);
    throw error;
  }
};

export const deleteTabunganUmrah = async (id : number) => {
  try {
    const response = await api.post(`/daftar_tabungan_umrah/delete`,{ id : id});
    return response.data;
  } catch (error) {
    console.error("Gagal menghapus tabungan umrah:", error);
    throw error;
  }
};
