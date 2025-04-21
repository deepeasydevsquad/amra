import api from "./api";

export const daftarProvinsi = async (param : any) => {
  try {
    const response = await api.post("/get-provinsi", param);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export const daftarKabupaten = async (param : any) => {
  try {
    const response = await api.post("/get-kabupaten", param);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export const daftarKecamatan = async (param : any) => {
  try {
    const response = await api.post("/get-kecamatan", param);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export const daftarKelurahan = async (param : any) => {
  try {
    const response = await api.post("/get-kelurahan", param);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export const daftarMahram = async (param : any) => {
  try {
    const response = await api.post("/get-mahram", param);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export const daftarPekerjaan = async (param : any) => {
  try {
    const response = await api.post("/get-pekerjaan", param);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export const daftarPendidikan = async (param : any) => {
  try {
    const response = await api.post("/get-pendidikan", param);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export const daftarPengalaman = async (param : any) => {
  try {
    const response = await api.post("/get-pengalaman", param);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};