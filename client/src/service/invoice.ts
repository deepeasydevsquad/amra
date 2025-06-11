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

export const getKwitansiTabunganUmrah = async (param : string) => {
  try {
    const response = await api.get(`/invoice/kwitansi-tabungan-umrah/${param}`); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengambil kwitansi terakhir tabungan umrah:", error);
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

export const getKwitansiHandoverFasilitas = async (param : string) => {
  try {
    console.log("Param:", param);
    const response = await api.get(`/invoice/kwitansi-handover-fasilitas/${param}`); // Kirim data melewait URL
    console.log("Response data:", response.data); // Debugging log
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengambil invoice paket umrah:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const getKwitansiHandoverBarang = async (param: string) => {
  try {
    console.log("Param:", param);
    const response = await api.get(`/invoice/kwitansi-handover-barang/${param}`); // Kirim data melewait URL
    console.log("Response data:", response.data); // Debugging log
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.log("Gagal mengambil kwitansi handover barang:", error);
    throw error;
  }
}

export const getKwitansiPengembalianBarang = async (param: string) => {
  try {
    console.log("Param:", param);
    const response = await api.get(`/invoice/kwitansi-pengembalian-handover-barang/${param}`); // Kirim data melewait URL
    console.log("Response data:", response.data); // Debugging log
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.log("Gagal mengambil kwitansi pengembalian barang:", error);
    throw error;
  }
}

export const cetakKwitansiVisa = async (invoice: string) => {
  try {
    if (!invoice || invoice === 'undefined' || invoice === 'null') {
      throw new Error('Invoice tidak valid atau kosong.');
    }
    const encodedInvoice = encodeURIComponent(invoice);
    const url = `/invoice/kwitansi-visa/${encodedInvoice}`;
    const response = await api.get(url);
  
    return response.data;
  } catch (error) {
    console.error('[SERVICE ERROR] Gagal saat mencetak kwitansi visa:', error);
    throw error;
  }
};
