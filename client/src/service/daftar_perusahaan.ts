import api from './api_backbone';

export const list = async (param: { search: string; perpage: number; pageNumber: number }) => {
  try {
    const response = await api.post('/backbone/daftar_perusahaan/list', param);
    return response.data;
  } catch (error) {
    console.error('Gagal:', error);
    throw error;
  }
};

export const add_perusahaan = async (param: any) => {
  try {
    const response = await api.post('/backbone/daftar_perusahaan/add', param);
    return response.data;
  } catch (error) {
    console.error('Error fetching Daftar Jamaah:', error);
    throw error;
  }
};

export const update_perusahaan = async (param: any) => {
  try {
    const response = await api.post('/backbone/daftar_perusahaan/update', param);
    return response.data;
  } catch (error) {
    console.error('Error fetching Daftar Jamaah:', error);
    throw error;
  }
};

// export const getDaftarPermintaanDepositMember = async (param: any) => {
//   try {
//     const response = await api.post('/beranda-utama/daftar-permintaan-deposit-member', param);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching Daftar Deposit:', error);
//     throw error;
//   }
// }

// export const updateStatusRequestDepositMember = async (param: any) => {
//   try {
//     const response = await api.post('/beranda-utama/update-request-deposit-member', param);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating status permintaan deposit member:', error);
//     throw error;
//   }
// }

// export const deleteRequestDepositMember = async (id: number) => {
//   try {
//     const response = await api.post('/beranda-utama/delete-request-deposit-member', { id });
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting permintaan deposit member:', error);
//     throw error;
//   }
// }

// export const getDaftarHeadline = async (param: any) => {
//   try {
//     const response = await api.post('/beranda-utama/daftar-headline', param);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching Daftar Headline:', error);
//     throw error;
//   }
// }

// export const deleteHeadline = async (id : number) => {
//   try {
//     const response = await api.post("/beranda-utama/delete-headline", {id : id});
//     return response.data;
//   } catch (error) {
//     console.error("Gagal menghapus headline:", error);
//     throw error;
//   }
// };
