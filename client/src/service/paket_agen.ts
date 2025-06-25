import api from './api'

export const get_paket_agen = async (orderId: any) => {
  try {
    const response = await api.get('/paket/agen')
    return response.data
  } catch (error) {
    console.log('gagal mendapatkan gwitansi:', error)
  }
}

