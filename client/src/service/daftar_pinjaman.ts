import api from "./api"; // Import service API

export const daftarPinjaman = async (param : any) => {
  try {
    const response = await api.post("/get-peminjaman", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengambil data pinjaman:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
};

export const addPinjaman = async (param : any) => {
  try {
    const response = await api.post("/add-peminjaman", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal menambahkan pinjaman:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
}

export const getSkema = async (param: number) => {
  try {
    const response = await api.post('/get-skema', { peminjaman_id: param }); // Kirim id via body
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data skema:", error);
    throw error;
  }
}

export const updateSkema = async ( param : any) => {
  try {
    const response = await api.post("/update-skema", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal mengubah skema:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
}

export const pembayaranPerbulan = async (param : any) => {
  try {
    const response = await api.post("/bayar-perbulan", param); // Kirim data ke backend
    return response.data; // Kembalikan data hasil request
  } catch (error) {
    console.error("Gagal membuat pembayaran perbulan:", error);
    throw error; // Bisa ditangani di bagian pemanggilan
  }
}

export const downloadPeminjaman = async (param: any) => {
  try {
    const response = await api.post('/download_data_peminjaman', param, {
      responseType: 'blob', // << penting biar axios handle sebagai file
    })

    // Bikin blob dari data response
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

    // Buat URL dari blob
    const url = window.URL.createObjectURL(blob)

    // Buat element <a> buat trigger download
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'daftar_peminjaman.xlsx') // Nama file
    document.body.appendChild(link)
    link.click()

    // Cleanup
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Gagal download data peminjaman:', error)
    throw error
  }
}
