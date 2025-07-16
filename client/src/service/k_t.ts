import api from "./api";

export const getInfoPaketKT = async (param : any) => {
  try {
    const response = await api.post("/k_t/list", param);
    return response.data;
  } catch (error) {
    console.error("Gagal:", error);
    throw error;
  }
};
