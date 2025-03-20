import api from './api' // Import service API

export const getSistemLog = async (param: any) => {
  try {
    const response = await api.get('/sistem_log', param) // Kirim data ke backend
    return response.data // Kembalikan data hasil request
  } catch (error) {
    console.error('Gagal menambahkan kota:', error)
  }
}
