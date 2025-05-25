import api from './api' // Import service API


export const getRiwayatSurat = async () => {
  try {
    const response = await api.post('/get_riwayat_surat')
    return response.data
  } catch (error) {
    console.error('Gagal Mengambil Data:', error)
    throw error
  }
}

export const getKonfigurasi = async () => {
  try {
    const response = await api.post('/get_konfigurasi_surat')
    return response.data
  } catch (error) {
    console.error('Gagal Mengambil Data:', error)
    throw error
  }
}

export const addKonfigurasi = async (data : any) => {
  try {
    const response = await api.post('/add_konfigurasi_surat', data)
    return response.data
  } catch (error) {
    console.error('Gagal Mengirim Data:', error)
    throw error
  }
}
