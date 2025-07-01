import api from './api';

export const getBerandaUtama = async () => {
  try {
    const response = await api.get('/beranda-utama/status-card');
    return response.data;
  } catch (error) {
    console.error('Error fetching Beranda Utama:', error);
    throw error;
  }
}

export const getDaftarJamaah = async (param: any) => {
  try {
    const response = await api.post('/beranda-utama/daftar-jamaah', param);
    return response.data;
  } catch (error) {
    console.error('Error fetching Daftar Jamaah:', error);
    throw error;
  }
}

export const getDaftarPermintaanDepositMember = async (param: any) => {
  try {
    // const response = await api.post('/beranda-utama/daftar-permintaan-deposit-member', param);
    // return response.data;
    console.log('Comingsoon');
  } catch (error) {
    console.error('Error fetching Daftar Deposit:', error);
    throw error;
  }
}

export const getDaftarHeadline = async (param: any) => {
  try {
    // const response = await api.post('/beranda-utama/daftar-headline', param);
    // return response.data;
    console.log('Comingsoon');
  } catch (error) {
    console.error('Error fetching Daftar Headline:', error);
    throw error;
  }
}
