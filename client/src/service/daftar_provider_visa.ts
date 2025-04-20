import api from "./api";

export const daftarProviderVisa = async (param : any) => {
  try {
    const response = await api.post("/daftar_provider_visa/list", param);
    return response.data;
  } catch (error) {
    console.error("Gagal menambahkan provider visa:", error);
    throw error;
  }
};

export const addProviderVisa = async (param : any) => {
  try {
    const response = await api.post("/daftar_provider_visa", param);
    return response.data;
  } catch (error) {
    console.error("Gagal menambahkan provider visa:", error);
    throw error;
  }
};

export const editProviderVisa = async (id : any, param : any) => {
  try {
    const response = await api.post(`/daftar_provider_visa/update` , {...param,...{id : id }});
    return response.data;
  } catch (error) {
    console.error("Gagal menambahkan provider visa:", error);
    throw error;
  }
};

export const deleteProviderVisa = async (id : number) => {
  try {
    const response = await api.post(`/daftar_provider_visa/delete`,{ id : id});
    return response.data;
  } catch (error) {
    console.error("Gagal menambahkan provider visa:", error);
    throw error;
  }
};
