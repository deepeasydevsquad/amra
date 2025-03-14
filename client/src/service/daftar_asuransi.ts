import api from "./api";

export const daftarAsuransi = async (param : any) => {
  try {
    const response = await api.post("/daftar_asuransi/list", param);
    return response.data;
  } catch (error) {
    console.error("Gagal menambahkan asuransi:", error);
    throw error;
  }
};

export const addAsuransi = async (param : any) => {
  try {
    const response = await api.post("/daftar_asuransi", param);
    return response.data;
  } catch (error) {
    console.error("Gagal menambahkan asuransi:", error);
    throw error;
  }
};

export const editAsuransi = async (id : any, param : any) => {
  try {
    const response = await api.post(`/daftar_asuransi/update` , {...param,...{id : id }});
    return response.data;
  } catch (error) {
    console.error("Gagal menambahkan asuransi:", error);
    throw error;
  }
};

export const deleteAsuransi = async (id : number) => {
  try {
    const response = await api.post(`/daftar_asuransi/delete`,{ id : id});
    return response.data;
  } catch (error) {
    console.error("Gagal menambahkan asuransi:", error);
    throw error;
  }
};
