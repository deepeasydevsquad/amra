import api from "./api";

export const getDaftarTransaksiVisa = async (param: any) => {
  try {
    const response = await api.post(`/daftar-transaksi-visa/get-transaksi-visa/list`, param);
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil daftar transaksi visa:", error);
    throw error;
  }
}

export const addTransaksiVisa = async (payload: TransaksiVisaPayload) => {
  try {
    const response = await api.post('/daftar-transaksi-visa/add-new', payload);
    return response.data;
  } catch (error) {
    console.error("Gagal menambah transaksi visa:", error);
    throw error;
  }
}

export const getCityList = async () => {
  try {
    const response = await api.get('/transaksi-visa/get-all-cities');
    return response.data.data || [];
  } catch (error) {
    console.error("Gagal mengambil daftar kota:", error);
    return [];
  }
};

export const deleteTransaksiVisa = async (id: number) => {
  try {
    console.log('Deleting transaksi visa with ID:', id);
    const response = await api.delete(`/daftar-transaksi-visa/delete/${id}`);
    console.log('Delete API response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Delete service error:', error);
    return {
      error: true,
      error_msg: error.response?.data?.message || 
                 error.response?.data?.error_msg || 
                 error.message || 
                 'Gagal menghubungi server.'
    };
  }
};

// Interface untuk TypeScript
interface TransaksiVisaPayload {
  [key: string]: any;
}

export const getVisaTypesList = async () => {
  try {
    const response = await api.get('/transaksi-visa/get-all-visa-types');
    return response.data.data || [];
  } catch (error) {
    console.error("Gagal mengambil daftar jenis visa:", error);
    return [];
  }
};