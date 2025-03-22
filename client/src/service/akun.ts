import api from "./api"; // Import service API

export const getFilterAkun = async () => {
  try {
    const response = await api.get("/akun/filter_akun"); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan kota:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const getData = async (param : any) => {
  try {
    const response = await api.post("/daftar_akun/", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan kota:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const addAkun = async (param : any) => {
  try {
    const response = await api.post("/daftar_akun/add", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan akun:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const editAkun = async (id:number, param : any) => {
  try {
    const response = await api.post("/daftar_akun/edit", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal memperbaharui akun:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const checkAkun = async (param : any) => {
  try {
    const response = await api.post("/daftar_akun/check_akun", param); // Kirim data ke backend

    // console.log("+++++++++++++++");
    // console.log(response.data);
    // console.log("+++++++++++++++");
    return response.data; // Kembalikan data hasil request
  } catch (error) {

    // console.log("==================");
    // console.log(error.response.data);
    // console.log("==================");
    // console.error("Gagal menambahkan kota:", error);
    return error.response.data; // Bisa ditangani di bagian pemanggilan
  }
};

export const deleteAkun = async (param : number) => {
  try {
    const response = await api.post("/daftar_akun/delete", { id : param }); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    return error.response.data; // Bisa ditangani di bagian pemanggilan
  }
};
