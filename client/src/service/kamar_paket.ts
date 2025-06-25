import api from './api'

interface KamarPayload {
  hotel_id: number | null
  tipe_kamar: string
  kapasitas_kamar: number
  jamaah_ids: (number | null)[]
}

export const getDaftarKamarPaket = async (param: any) => {
  try {
    const response = await api.post(`/daftar-kamar-paket/get-kamar-paket/list`, param)
    return response.data
  } catch (error) {
    console.error('Gagal mengambil daftar kamar paket:', error)
    throw error
  }
}

export const createKamar = async (payload: KamarPayload) => {
  try {
    const response = await api.post('/daftar-kamar-paket/create-kamar', payload)
    return response.data
  } catch (error) {
    console.error('Gagal membuat kamar:', error)
    throw error
  }
}

export const getAllHotels = async () => {
  try {
    const response = await api.get('/daftar-kamar-paket/get-hotels')
    return response.data.data
  } catch (error) {
    console.error('Gagal mengambil data hotel:', error)
    throw error
  }
}

export const getAllJamaah = async (
  forEdit: boolean = false,
  currentKamarId: number | null = null,
) => {
  try {
    let url = `/daftar-kamar-paket/get-available-jamaah?forEdit=${forEdit}`
    if (currentKamarId) {
      url += `&currentKamarId=${currentKamarId}`
    }
    const response = await api.get(url)
    return response.data.data
  } catch (error) {
    console.error('Gagal mengambil data jamaah:', error)
    throw error
  }
}

export const getKamarById = async (id: number) => {
  try {
    const response = await api.get(`/daftar-kamar-paket/${id}`)
    return response.data.data
  } catch (error) {
    console.error(`Gagal mengambil data kamar dengan ID ${id}:`, error)
    throw error
  }
}

export const updateKamar = async (id: number, payload: any) => {
  try {
    const response = await api.put(`/daftar-kamar-paket/${id}`, payload)
    return response.data
  } catch (error) {
    console.error(`Gagal memperbarui kamar dengan ID ${id}:`, error)
    throw error
  }
}

export const deleteKamar = async (id: number) => {
  try {
    const response = await api.delete(`/daftar-kamar-paket/${id}`)
    return response.data
  } catch (error) {
    console.error(`Gagal menghapus kamar dengan ID ${id}:`, error)
    throw error
  }
}

export const getDownloadData = async () => {
  try {
    const response = await api.get('/daftar-kamar-paket/download')
    return response.data
  } catch (error) {
    console.error('Gagal mengambil data download:', error)
    throw error
  }
}
