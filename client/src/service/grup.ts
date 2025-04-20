import api from './api'

export const daftarMenu = async (param: any) => {
  try {
    const response = await api.get('/get-menu', param)
    return response.data
  } catch (error) {
    console.error('Gagal Mengambil Menu', error)
    throw error
  }
}

export const daftarGrup = async (param: any) => {
  try {
    const response = await api.get('/get-grup', param)
    return response.data
  } catch (error) {
    console.error('Gagal Mengambil Grup', error)
    throw error
  }
}

export const addGrup = async (param: any) => {
  try {
    const response = await api.post('/add-grup', param)
    return response.data
  } catch (error) {
    console.error('Gagal menambahkan grup:', error)
    throw error
  }
}

export const editGrup = async (param: any) => {
  try {
    const response = await api.put('/update-grup', param)
    return response.data
  } catch (error) {
    console.error('Gagal menambahkan grup:', error)
    throw error
  }
}

export const hapusGrup = async (id: any) => {
  try {
    const response = await api.post(`/delete-grup`, { id: id })
    return response.data
  } catch (error) {
    console.error('Gagal menambahkan grup:', error)
    throw error
  }
}
