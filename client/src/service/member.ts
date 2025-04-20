import api from './api'

export const getMember = async () => {
  try {
    const response = await api.get('/get-member')
    return response.data
  } catch (error) {
    console.error('Gagal Mengambil Data:', error)
    throw error
  }
}

export const addMember = async (param: any) => {
  try {
    const { data } = await api.post('/add-member', param, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  } catch (error) {
    console.log('gagal menambahkan data:', error)
    throw error
  }
}

export const editMember = async (param: any) => {
  try {
    const { data } = await api.put('/update-member', param, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  } catch (error) {
    console.log('gagal edit data', error)
    throw error
  }
}

export const deleteMember = async (id: number) => {
  try {
    const { data } = await api.post('/delete-member', { id: id })
    console.log('Tipe data ID:', typeof id) // Debug tipe data
    return data
  } catch (error) {
    console.log('gagal hapus data', error)
    throw error
  }
}

export const getType = async () => {
  try {
    const { data } = await api.get('/get-type')
    return data
  } catch (error) {
    console.log('gagal mengambiltype:', error)
    throw error
  }
}
