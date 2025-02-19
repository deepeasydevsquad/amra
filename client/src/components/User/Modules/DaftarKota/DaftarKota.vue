<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const apiUrl = 'http://localhost:3001/daftar_kota';
const accessToken = localStorage.getItem('access_token');
const headers = accessToken ? { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };

const apiClient = axios.create({
  baseURL: apiUrl,
  headers,
});

interface Kota {
  id: number;
  kode: string;
  name: string;
}

interface Errors {
  kode: string;
  name: string;
}

const timeoutId = ref<number | null>(null);
const daftarKota = ref<Kota[]>([]);
const search = ref<string>('');
const isModalOpen = ref<boolean>(false);
const showNotification = ref<boolean>(false);
const showConfirmDialog = ref<boolean>(false);
const notificationMessage = ref<string>('');
const notificationType = ref<'success' | 'error'>('success');
const confirmMessage = ref<string>('');
const confirmTitle = ref<string>('');
const confirmAction = ref<(() => void) | null>(null);

const selectedKota = ref<Partial<Kota>>({
  kode: '',
  name: '',
});

const errors = ref<Errors>({
  kode: '',
  name: '',
});

const fetchData = async () => {
  try {
    const response = await apiClient.get('/');
    daftarKota.value = response.data.data;
  } catch (error  : any) {
    console.error('Error fetching data:', error);
    displayNotification('Terjadi kesalahan saat mengambil data.', 'error');
  }
};

onMounted(fetchData);

const searchKota = computed(() => {
  const result = daftarKota.value.filter((kota) =>
    [kota.kode, kota.name].some((value) => value.toLowerCase().includes(search.value.toLowerCase()))
  );
  return result.length ? result : null;
});

const validateForm = (): boolean => {
  errors.value = { kode: '', name: '' };
  let isValid = true;

  if (!selectedKota.value.kode?.trim()) {
    errors.value.kode = 'Kode tidak boleh kosong';
    isValid = false;
  }
  if (!selectedKota.value.name?.trim()) {
    errors.value.name = 'Nama tidak boleh kosong';
    isValid = false;
  }
  return isValid;
};

const openModal = (kota?: Kota) => {
  selectedKota.value = kota ? { ...kota } : { kode: '', name: '' };
  isModalOpen.value = true;
};

const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;

  if (timeoutId.value) clearTimeout(timeoutId.value);

  timeoutId.value = window.setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

const showConfirmation = (title: string, message: string, action: () => void) => {
  confirmTitle.value = title;
  confirmMessage.value = message;
  confirmAction.value = action;
  showConfirmDialog.value = true;
};

const saveData = async () => {
  if (!validateForm()) return;

  const isEdit = !!selectedKota.value.id;
  const action = async () => {
    try {
      if (isEdit) {
        await apiClient.put(`/${selectedKota.value.id}`, selectedKota.value);
        showConfirmDialog.value = false;
        displayNotification('Data berhasil diperbarui!');
      } else {
        await apiClient.post('/', { ...selectedKota.value });
        displayNotification('Data berhasil ditambahkan!');
      }
      isModalOpen.value = false;
      fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      showConfirmDialog.value = false;
      displayNotification('Terjadi kesalahan saat menyimpan data.', 'error');
    }
  };

  isEdit ? showConfirmation('Konfirmasi Perubahan', 'Apakah Anda yakin ingin mengubah data ini?', action) : action();
};

const deleteData = async (id: number) => {
  showConfirmation(
    'Konfirmasi Hapus',
    'Apakah Anda yakin ingin menghapus data ini?',
    async () => {
      try {
        await apiClient.delete(`/${id}`);
        showConfirmDialog.value = false;
        displayNotification('Data berhasil dihapus!');
        fetchData();
      } catch (error) {
        console.error('Error deleting data:', error);
        displayNotification('Terjadi kesalahan saat menghapus data.', 'error');
      }
    }
  );
};
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Tambah data dan Search -->
    <div class="flex justify-between mb-4">
      <button
        @click="openModal()"
        class="bg-[#455494] text-white px-4 py-2 rounded-lg hover:bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Tambah Data
      </button>
      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
        <input
          type="text"
          id="search"
          class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          v-model="search"
          placeholder="Cari data..."
        />
      </div>
    </div>

    <!-- Table data -->
    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-2/12 px-6 py-4 font-medium text-gray-900">ID</th>
            <th class="w-2/12 px-6 py-4 font-medium text-gray-900">Kode</th>
            <th class="w-4/12 px-6 py-4 font-medium text-gray-900">Nama</th>
            <th class="w-3/12 px-6 py-4 font-medium text-gray-900">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <template v-if="searchKota && searchKota.length > 0">
            <tr v-for="kota in searchKota" :key="kota.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">{{ kota.id }}</td>
              <td class="px-6 py-4">{{ kota.kode }}</td>
              <td class="px-6 py-4">{{ kota.name }}</td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button
                    @click="openModal(kota)"
                    class="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    @click="deleteData(kota.id)"
                    class="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="4" class="px-6 py-4 text-center text-xl text-gray-600">Daftar kota tidak ditemukan.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="isModalOpen = false"></div>
          <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
          <div class="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-2xl flex justify-center font-bold leading-6 text-gray-900 mb-4">
                {{ selectedKota.id ? "Edit Data" : "Tambah Data" }}
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kode</label>
                  <input
                    v-model="selectedKota.kode"
                    type="text"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal"
                  />
                  <p v-if="errors.kode" class="mt-1 text-sm text-red-600">{{ errors.kode }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input
                    v-model="selectedKota.name"
                    type="text"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal"
                  />
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                @click="saveData"
                class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {{ selectedKota.id ? "Simpan Perubahan" : "Tambah" }}
              </button>
              <button
                @click="isModalOpen = false"
                class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Confirmation Dialog -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="showConfirmDialog" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
          <div class="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-2xl font-medium leading-6 text-gray-900" id="modal-title">{{ confirmTitle }}</h3>
                  <div class="mt-2">
                    <p class="text-lg text-gray-500">{{ confirmMessage }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                @click="confirmAction && confirmAction()"
                class="inline-flex w-full justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Ya
              </button>
              <button
                @click="showConfirmDialog = false"
                class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Notification Popup -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="showNotification" class="fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm">
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 relative">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div v-if="notificationType === 'success'" class="bg-green-100 rounded-full p-2">
                <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div v-else class="bg-red-100 rounded-full p-2">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-2xl font-medium" :class="notificationType === 'success' ? 'text-green-900' : 'text-red-900'">
                {{ notificationType === 'success' ? 'Berhasil' : 'Gagal' }}
              </h3>
              <p class="mt-1 text-lg text-gray-500">{{ notificationMessage }}</p>
            </div>
          </div>
          <button
            @click="showNotification = false"
            class="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
          >
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
