import api from './api' // Import service API

export const dataInvoiceDeposit = async (param: string) => {
  try {
    const response = await api.get(`/invoice/invoice-deposit/${param}`) // Kirim data ke backend
    return response.data // Kembalikan data hasil request
  } catch (error) {
    console.error('Gagal mengambil data deposit', error)
    throw error // Bisa ditangani di bagian pemanggilan
  }
}
