import api from './api'

export const getMember = async (id:number) => {
  // Kosong
}

export const getInfoMember = async (id:number) => {
  try {
    const response = await api.post("/member/get-member", { id });
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil asuransi:", error);
    throw error;
  }
};

export const addMember = async (param: any) => {
  try {
    const { data } = await api.post('/add-member', param, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  } catch (error) {
    console.log('gagal menambahkan data:', error)
    throw error
  }
}

export const editMember = async (param: any) => {
  try {
    const { data } = await api.put('/update-member', param, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  } catch (error) {
    console.log('gagal edit data', error)
    throw error
  }
}

export const deleteMember = async (id: number) => {
  try {
    const { data } = await api.post('/delete-member', { id: id })
    console.log('Tipe data ID:', typeof id) // Debug tipe data
    return data
  } catch (error) {
    console.log('gagal hapus data', error)
    throw error
  }
}

export const getType = async () => {
  try {
    const { data } = await api.get('/get-type')
    return data
  } catch (error) {
    console.log('gagal mengambiltype:', error)
    throw error
  }
}

export const daftarCabang = async () => {
  try {
    const { data } = await api.get('/member/get-daftar-cabang')
    return data
  } catch (error) {
    console.log('gagal mengambiltype:', error)
    throw error
  }
}

