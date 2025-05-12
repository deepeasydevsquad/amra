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

export const getInvoicePaketLA = async (param : string) => {
  try {
    const response = await api.get(`/invoice/invoice-paket-la/${param}`); // Kirim data melewait URL
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengambil invoice paket la:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};


export const getKwitansiTerakhir = async (param : string) => {
  try {
    const response = await api.get(`/invoice/kwitansi-terakhir/${param}`); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengambil kwitansi terakhir paket la:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};



export const getInvoicePembayaranPerbulan = async (param : string) => {
  try {
    const response = await api.get(`/invoice/pembayaran-perbulan/${param}`); // Kirim data melewait URL
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengambil invoice pembayaran perbulan:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
}
