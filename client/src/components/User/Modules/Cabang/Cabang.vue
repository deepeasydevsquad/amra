<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <button
        @click="openModal('add')"
        class="bg-[#455494] text-white px-4 py-2 rounded-lg hover:bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Tambah Cabang
      </button>
      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
        <input
          v-model="search"
          type="text"
          placeholder="Cari cabang..."
          class="block w-64 px-3 py-2 text-gray-700 bg-white -gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:-blue-500 transition-all duration-200"
        />
      </div>
    </div>
    <div class="overflow-hidden rounded-lg -gray-200 shadow-md">
      <div class="overflow-x-auto">
        <table class="w-full -collapse bg-white text-left text-sm text-gray-500">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 font-bold text-gray-900 text-center w-[20%] -gray-200">
                Nama Kota
              </th>
              <th class="px-4 py-3 font-bold text-gray-900 text-center w-[15%] -gray-200">
                Kode Pos
              </th>
              <th class="px-4 py-3 font-bold text-gray-900 text-center w-[25%] -gray-200">
                Alamat
              </th>
              <th class="px-4 py-3 font-bold text-gray-900 text-center w-[30%] -gray-200">
                Catatan
              </th>
              <th class="px-4 py-3 font-bold text-gray-900 text-center w-[10%] -gray-200">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 -t -gray-100" v-if="paginatedCabang.length > 0">
            <tr
              v-for="(cabang, index) in paginatedCabang"
              :key="cabang.id"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-3 text-center -gray-200">{{ cabang.city }}</td>
              <td class="px-4 py-3 text-center -gray-200">{{ cabang.pos_code }}</td>
              <td class="px-4 py-3 text-center -gray-200">{{ cabang.address }}</td>
              <td class="px-4 py-3 text-center -gray-200 truncate">
                {{ cabang.note }}
              </td>
              <td class="px-4 py-3 text-center -gray-200 flex justify-center gap-2">
                <EditButton @click="openModal('edit', cabang)">
                  <EditIcon></EditIcon>
                </EditButton>
                <DangerButton @click="hapusData(cabang)">
                  <DeleteIcon></DeleteIcon>
                </DangerButton>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="5" class="px-4 py-3 text-center -gray-200">Data tidak ditemukan</td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-100 font-bold border">
            <tr>
              <td class="px-4 py-4 text-center" :colspan="5">
                <nav class="flex mt-0">
                  <ul class="inline-flex items-center -space-x-px">
                    <!-- Tombol Previous -->
                    <li>
                      <button
                        @click="prevPage"
                        :disabled="currentPage === 1"
                        class="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                    </li>
                    <!-- Nomor Halaman -->
                    <li v-for="page in pages" :key="page" v-if="paginatedCabang.length > 0">
                      <button
                        @click="pageNow(page)"
                        class="px-3 py-2 leading-tight border min-w-[40px]"
                        :class="
                          currentPage === page
                            ? 'text-white bg-[#333a48] border-[#333a48]'
                            : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                        "
                      >
                        {{ page }}
                      </button>
                    </li>

                    <!-- Tombol Next -->
                    <li>
                      <button
                        @click="nextPage"
                        :disabled="currentPage === totalPages"
                        class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Modal Tambah & Update -->
    <Modal
      v-if="modalOpen && modalType === 'add'"
      @close="modalOpen = false"
      :form="formData"
      @save="saveData"
    />
    <ModalUpdate
      v-if="modalOpen && modalType === 'edit'"
      :cabang="formData"
      @update="updateData"
      @close="modalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Modal from './particle/Modal.vue'
import ModalUpdate from './particle/ModalUpdate.vue'
import { daftarCabang, addCabang, editCabang, hapusCabang } from '../../../../service/cabang'
import DeleteIcon from './Icon/DeleteIcon.vue'
import EditIcon from './Icon/EditIcon.vue'

// import element
import DangerButton from './particle/DangerButton.vue'
import EditButton from './particle/EditButton.vue'
import Notification from './particle/Notification.vue'
import Confirmation from './particle/Confirmation.vue'

const cabangs = ref([])
const search = ref('')
const modalOpen = ref(false)
const modalType = ref('add')

const fetchCabang = async () => {
  try {
    const response = await daftarCabang()
    if (response?.data) {
      cabangs.value = response.data
    }
  } catch (error) {
    console.error('Gagal mengambil data cabang:', error)
  }
}

const filteredCabang = computed(() => {
  return cabangs.value.filter((cabang) =>
    cabang.city.toLowerCase().includes(search.value.toLowerCase()),
  )
})

const formData = ref({
  name: '',
  city: '',
  pos_code: '',
  address: '',
  tanda_tangan: null,
  note: '',
})

const openModal = (mode = 'add', cabang = null) => {
  console.log('openModal called with:', { mode, cabang }) // Debugging

  if (mode === 'edit' && cabang) {
    console.log('Masuk ke mode edit')
    formData.value = { ...cabang, city: cabang.city_id || cabang.city }
  } else {
    console.log('Masuk ke mode add')
    formData.value = {
      name: '',
      city: '',
      pos_code: '',
      address: '',
      tanda_tangan: null,
      note: '',
    }
  }
  modalType.value = mode
  modalOpen.value = true
}

const saveData = async (formValue) => {
  try {
    const formData = new FormData()
    formData.append('name', formValue.name)
    formData.append('city', formValue.city)
    formData.append('pos_code', formValue.pos_code)
    formData.append('address', formValue.address)
    formData.append('note', formValue.note)
    if (formValue.tanda_tangan) {
      formData.append('tanda_tangan', formValue.tanda_tangan)
    } else {
      alert('File tanda tangan wajib diunggah!')
      return
    }
    const response = await addCabang(formData)
    console.log('🔍 Full Response:', response)

    if (response.success || response.data?.success) {
      alert('Cabang berhasil Ditambahkan!')
      modalOpen.value = false
      fetchCabang()
    }
  } catch (error) {
    console.error('Error saat menyimpan data:', error)
    alert('Terjadi kesalahan, coba lagi!')
  }
}

const updateData = async (formValue) => {
  try {
    const response = await editCabang(formValue.id, formValue)

    console.log('🔍 Full Response:', response)

    if (response.success || response.data?.success) {
      alert('Cabang berhasil diperbarui!')
      modalOpen.value = false
      fetchCabang()
    } else {
      console.warn('⚠️ Response sukses = false, cek API!', response)
    }
  } catch (error) {
    console.error('Error saat memperbarui data:', error)
    alert('Terjadi kesalahan, coba lagi!')
  }
}

const hapusData = async (cabang) => {
  if (!confirm('Apakah kamu yakin ingin menghapus cabang ini?')) return

  try {
    const response = await hapusCabang(cabang.id) // Kirim hanya ID ke API
    console.log('Response:', response)

    if (response.success || response.data?.success) {
      alert('Cabang berhasil dihapus!')
      fetchCabang() // Refresh daftar cabang setelah hapus
    } else {
      console.warn('⚠️ Gagal menghapus cabang, cek response!', response)
      alert('Gagal menghapus cabang, coba lagi!')
    }
  } catch (error) {
    console.error('Error saat menghapus cabang:', error)
    alert('Terjadi kesalahan, coba lagi!')
  }
}

const itemsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() => {
  return Math.max(1, Math.ceil((filteredCabang.value?.length || 0) / itemsPerPage))
})

const paginatedCabang = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredCabang.value.slice(start, start + itemsPerPage)
})

const pages = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1)
})

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const pageNow = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Reset ke page 1 saat filter berubah
watch(search, () => {
  currentPage.value = 1
})

// Pastikan currentPage tidak lebih besar dari totalPages setelah filter berubah
watch(filteredCabang, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

onMounted(fetchCabang)
</script>
