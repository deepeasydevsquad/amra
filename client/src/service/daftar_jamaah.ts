import api from './api' // Import service API

export const daftarJamaah = async (param: any) => {
  try {
    const response = await api.post('/get-daftar-jamaah', param) // Kirim data ke backend
    return response.data // Kembalikan data hasil request
  } catch (error) {
    console.error('Gagal mengambil data jamaah:', error)
    throw error // Bisa ditangani di bagian pemanggilan
  }
}

export const addJamaah = async (param: any) => {
  try {
    const response = await api.post('/add-daftar-jamaah', param, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }) // Kirim data ke backend
    return response.data // Kembalikan data hasil request
  } catch (error) {
    console.error('Gagal menambah data jamaah:', error)
    throw error // Bisa ditangani di bagian pemanggilan
  }
}

export const editJamaah = async (param: any) => {
  try {
    const response = await api.post('/edit-daftar-jamaah', param, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('gagal update data jamaah', error)
    throw error
  }
}

export const deleteJamaah = async (param: any) => {
  try {
    const response = await api.post('/delete-daftar-jamaah', param)
    return response.data
  } catch (error) {
    console.error('gagal delete data jamaah', error)
    throw error
  }
}
