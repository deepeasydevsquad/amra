import api from './api' // Import service API


export const getMember = async () => {
  try {
    const response = await api.get('/get-member-not-jamaah')
    return response.data
  } catch (error) {
    console.error('Gagal Mengambil Data:', error)
    throw error
  }
}

export const daftarJamaah = async (param: any) => {
  try {
    const response = await api.post('/get-daftar-jamaah', param) // Kirim data ke backend
    return response.data // Kembalikan data hasil request
  } catch (error) {
    console.error('Gagal mengambil data jamaah:', error)
    throw error // Bisa ditangani di bagian pemanggilan
  }
}

export const downloadJamaah = async (param: any) => {
  try {
    const response = await api.post('/download-daftar-jamaah', param, {
      responseType: 'blob', // << penting biar axios handle sebagai file
    })

    // Bikin blob dari data response
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

    // Buat URL dari blob
    const url = window.URL.createObjectURL(blob)

    // Buat element <a> buat trigger download
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'daftar_jamaah.xlsx') // Nama file
    document.body.appendChild(link)
    link.click()

    // Cleanup
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Gagal download data jamaah:', error)
    throw error
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
