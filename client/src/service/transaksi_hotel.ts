import api from "./api";

export const daftar_kota = async (param : any) => {
    try {
        const response = await api.get("/trans_hotel/daftar_kota", param);
        return response.data;
    } catch (error) {
        console.error("Gagal menambahkan tiket:", error);
        throw error;
    }
}

export const daftar_hotel = async (param : any) => {
    try {
        const response = await api.get("/trans_hotel/daftar_hotel", param);
        return response.data;
    } catch (error) {
        console.error("Gagal menambahkan tiket:", error);
        throw error;
    }
}

export const daftar_transaksi = async (param : any) => {

    try {
        const response = await api.post("/trans_hotel/daftar_transaksi", param);
        return response.data;
    } catch (error) {
        console.error("Gagal menambahkan tiket:", error);
        throw error;
    }
}

export const add_transaksi = async (param : any) => {
    try {
        const response = await api.post("/trans_hotel/add_transaksi", param);
        return response.data;
    } catch (error) {
        console.error("Gagal menambahkan tiket:", error);
        throw error;
    }
}

export const hapus_transaksi = async (param : any) => {
    try {
        const response = await api.post("/trans_hotel/delete_transaksi", param);
        return response.data;
    } catch (error) {
        console.error("Gagal menambahkan tiket:", error);
        throw error;
    }
}