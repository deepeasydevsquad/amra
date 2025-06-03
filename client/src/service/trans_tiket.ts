import api from "./api";

export const add_tiket = async (param : any) => {
    console.log(param);
    try {
        const response = await api.post("/add_tiket", param);
        return response.data;
    } catch (error) {
        console.error("Gagal menambahkan tiket:", error);
        throw error;
    }
}

export const get_transactions = async (param : any) => {
    try {
        const response = await api.get("/ticket_transactions", param);
        return response.data;
    }
    catch(error) {
        console.error("Gagal mengambil tiket transactions:", error);
        throw error;
    }
}