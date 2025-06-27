import api from './api'

export const daftarManifestPaket = async (param: any) => {
  try {
    const response = await api.post('/daftar-manifest-paket/get-daftar-manifest-paket/list', param)
    return response.data;
  } catch (error) {
    console.log('gagal mengambil daftar manifest paket:', error)
    throw error
  }
}

export const updateManifestPaket = async (param: any) => {
  try {
    const response = await api.post('/daftar-manifest-paket/update-manifest-paket', param)
    return response.data
  } catch (error) {
    console.log("gagal update manifest paket:", error)
    throw error
  }
}

export const infoUpdateManifestPaket = async (id: number) => {
  try {
    const response = await api.post('/daftar-manifest-paket/get-info-update-manifest-paket', { id })
    return response.data;
  } catch (error) {
    console.log('gagal mengambil info update manifest paket:', error)
    throw error
  }
}

export const downloadAbsensi = async (id: number) => {
  try {
    const response = await api.post('/daftar-manifest-paket/download-manifest-paket',
      { paketId: id },
      { responseType: 'blob' }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Manifest.xlsx'); // ⬅️ Nama file
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url); // ⬅️ Free memory
  } catch (error) {
    console.log('gagal download absensi:', error)
    throw error
  }
}
