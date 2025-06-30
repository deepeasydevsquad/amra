import api from "./api";

export const add_tiket = async (param : any) => {
    console.log(param);
    try {
        const response = await api.post("/trans_tiket/add_tiket", param);
        console.log("Response add tiket");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Gagal menambahkan tiket:", error);
        throw error;
    }
}
export const get_transactions = async (param: any) => {
    try {
      const response = await api.get("/trans_tiket/ticket_transactions", {
        params: {
          pageNumber: param.pageNumber,
          perpage: param.perpage,
          search: param.search || '',
          filter: param.filter || '',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Gagal mengambil tiket transactions:", error);
      throw error;
    }
};

export const generate_nomor_register = async (param : any) => {
    try {
        const response = await api.get("/trans_tiket/generate_nomor_register", param);
        return response.data;
    }
    catch(error) {
        console.error("Gagal mengambil nomor register", error);
        throw error;
    }
}
export const generate_nomor_invoice = async (param : any) => {
    try {
        const response = await api.get("/trans_tiket/generate_nomor_invoice", param);
        return response.data;
    }
    catch(error) {
        console.error("Gagal mengambil nomor invoice", error);
        throw error;
    }
}

export const getAirlines = async () => {
  try {
    const response = await api.get("/trans_tiket/get-airlines");
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export const add_pembayaran = async (param : any) => {

    try {
        const response = await api.post("/trans_tiket/add_pembayaran", param);
        return response.data;
    } catch (error) {
        console.error("Gagal menambahkan tiket:", error);
        throw error;
    }
}


export const get_detail = async (param : any) => {
  try {
      const response = await api.post("/trans_tiket/detail", param);
      return response.data;
  } catch (error) {
      console.error("Gagal mengambil detail tiket:", error);
      throw error;
  }
}