import api from './api';

export const getDaftarPaket = async () => {
  try {
    const response = await api.get('/daftar-trans-paket/daftar-paket/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching daftar paket:', error);
    throw error;
  }
};
