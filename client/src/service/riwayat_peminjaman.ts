import api from './api' // Import service API

export const getRiwayatPeminjaman = async () => {
    try {
        const response = await api.post('/riwayat_peminjaman')
        return response.data
    } catch (error) {
        console.error('Gagal Mengambil Data:', error)
        throw error
    }
}