<script setup lang="ts">

// Import Icon
// import DeleteIcon from "./Icon/DeleteIcon.vue"
// import EditIcon from "./Icon/EditIcon.vue"

// // import element
// import DangerButton from "./Particle/DangerButton.vue"
// import EditButton from "./Particle/EditButton.vue"
import PrimaryButton from "./Particle/PrimaryButton.vue"
import DangerButton from "./Particle/DangerButton.vue"
import SuccessButton from "./Particle/SuccessButton.vue"
import ModalPrimary from "./Particle/ModalPrimary.vue"

//

// import Notification from "./Particle/Notification.vue"
// import Confirmation from "./Particle/Confirmation.vue"

// // import api from "@/services/api"; // Import service API
import { getFilterAkun, daftarAkun, checkAkun } from "../../../../service/akun"; // Import function POST
import { ref, onMounted, computed, watchEffect } from 'vue';

import { useCurrencyInput } from 'vue-currency-input';
// Konfigurasi format currency
// const options = {
//   currency: 'IDR', // IDR untuk Rupiah, USD untuk Dollar, dll.
//   locale: 'id-ID', // Format lokal Indonesia
//   autoDecimalDigits: true, // Desimal otomatis
//   precision: 0, // Angka di belakang koma (0 jika tidak ada)
// };

// Gunakan composable useCurrencyInput
// const { inputRef, formattedValue } = useCurrencyInput(options);
// import axios from 'axios';
// // import Confirmation from "./Particle/Confirmation.vue"

// const itemsPerPage = 100; // Jumlah kota per halaman
// const currentPage = ref(1);
// const search = ref("");
// //const perpage = ref(100);
// const pageNumber = ref(0);
// const totalPages = ref(0);

// const nextPage = () => {
//   if (currentPage.value < totalPages.value) {
//     currentPage.value++;
//     fetchData()
//   }
// };

// const prevPage = () => {
//   if (currentPage.value > 1) {
//     currentPage.value--;
//     fetchData()
//   }
// };


// const pageNow = (page : number) => {
//   currentPage.value = page
//   fetchData()
// }

// // Generate array angka halaman
// const pages = computed(() => {
//   return Array.from({ length: totalPages.value }, (_, i) => i + 1);
// });

// // // Hitung total halaman
// //const totalPages = computed(() => Math.ceil(searchKota.value.length / itemsPerPage));
// // const apiUrl = 'http://localhost:3001/daftar_kota';
// // const accessToken = localStorage.getItem('access_token');
// // const headers = accessToken ? { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
// // const apiClient = axios.create({
// //   baseURL: apiUrl,
// //   headers,
// // });

// interface Kota {
//   id: number;
//   kode: string;
//   name: string;
// }

interface secondaryAkun {
  id: number;
  kode: string;
  name: string;
}

interface primaryAkun {
  id: number;
  nomor: string;
  name: string;
  type: 'header' | "child",
  tipe_akun : 'bawaan' | "tambahan",
  saldo_awal : string,
  saldo_akhir: string,
  detail : secondaryAkun
}

interface addAkunInterface {
  primary_id : number;
  prefix : string,
  nomor : string;
  nama : string;
  saldo : string;
}



// const timeoutId = ref<number | null>(null);
const dataAkun = ref<primaryAkun[]>([]);
// const dataAddAkun = ref<addAkunInterface[]>([]);
const dataAddAkun = ref<Partial<addAkunInterface>>({
  primary_id : 0,
  prefix : '',
  nomor: '',
  nama : '',
  saldo : ''
});

// const selectedKota = ref<Partial<Kota>>({
//   kode: '',
//   name: '',
// });


// const isModalOpen = ref<boolean>(false);
// const showNotification = ref<boolean>(false);
//
// const notificationMessage = ref<string>('');
// const notificationType = ref<'success' | 'error'>('success');
// const confirmMessage = ref<string>('');
// const confirmTitle = ref<string>('');
// const confirmAction = ref<(() => void) | null>(null);
const totalColumns = ref(3); // Default 3 kolom
const optionFilterAkun = ref([{ id: 0, name: 'Pilih Semua Akun' }]);
const optionFilterCabang = ref([{ id: 0, name: 'Pilih Semua Cabang' }]);
const selectedOptionAkun = ref(0);
const selectedOptionCabang = ref(0);





// const selectedKota = ref<Partial<Kota>>({
//   kode: '',
//   name: '',
// });

interface ErrorsAdd {
  nomor_add_akun: string;
  nama_add_akun: string;
  saldo_add_akun: string;
}

const errors_add = ref<ErrorsAdd>({
  nomor_add_akun: '',
  nama_add_akun: '',
  saldo_add_akun :'',
});



// <p v-if="errors.nomor_add_akun" class="mt-1 text-sm text-red-600">{{ errors.nomor_add_akun }}</p>
//             </div>
//           </div>
//           <div>
//             <label class="block text-sm font-medium text-gray-700 mb-1">Nama Akun</label>
//             <input type="text" v-model="dataAddAkun.nama" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal" placeholder="Nama Akun" />
//             <p v-if="errors.nama_add_akun" class="mt-1 text-sm text-red-600">{{ errors.nama_add_akun }}</p>
//           </div>
//           <div>
//             <label class="block text-sm font-medium text-gray-700 mb-1">Saldo</label>
//             <input
//             class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal" placeholder="Saldo"
//               type="text"
//               id="rupiah"
//               v-model="formattedPrice"
//               @input="formatToRupiah"
//             />
//             <p v-if="errors.saldo_add_akun" class="mt-1 text-sm text-red-600">{{ errors.saldo_add_akun }}</p>




const fetchFilterData = async() => {
  const response = await getFilterAkun();
  optionFilterAkun.value = response.data.akun;
  optionFilterCabang.value = response.data.cabang;
  // const response = await daftarKota({search: search.value, perpage: itemsPerPage, pageNumber: currentPage.value});
  // totalPages.value = Math.ceil(response.total / itemsPerPage)
  await getData();
}

const getData = async() => {
  const response = await daftarAkun({akun: selectedOptionAkun.value, cabang: selectedOptionCabang.value});
  dataAkun.value = response.data;
  console.log("_________________111");
  console.log(dataAkun.value);
  console.log("_________________111");
}


// ADD AKUN FUNCTION //

const showAddModal = ref<boolean>(false);

const addAkunBtn = async (id : number, nomor : string) => {
  errors_add.value = { nomor_add_akun: '', nama_add_akun: '', saldo_add_akun : '' };
  dataAddAkun.value.prefix = nomor.toString().charAt(0);
  dataAddAkun.value.primary_id = id;
  showAddModal.value = true;
}

const closeAddModal = async () => {
  showAddModal.value = false;
}

const validateFormAddAkun = async (): Promise<boolean> => {

  errors_add.value = { nomor_add_akun: '', nama_add_akun: '', saldo_add_akun : '' };

  let isValid = true;

  if (!dataAddAkun.value.nomor?.trim()) {
    errors_add.value.nomor_add_akun = 'Nomor Akun tidak boleh kosong';
    isValid = false;
  }

  if (!dataAddAkun.value.nama?.trim()) {
    errors_add.value.nama_add_akun = 'Nama Akun tidak boleh kosong';
    isValid = false;
  }

  if (!dataAddAkun.value.saldo?.trim()) {
    errors_add.value.saldo_add_akun = 'Saldo tidak boleh kosong. Jika tidak ada silahkan isikan Rp 0';
    isValid = false;
  }

  if( isValid  === true ) {
    const response = await checkAkun({nomor_akun: dataAddAkun.value.nomor, prefix: dataAddAkun.value.prefix, primary_id: dataAddAkun.value.primary_id });
    if( response.error == true) {
      var detailError = response.detail;
      for ( let x in detailError ) {
        if( detailError[x].path === 'nomor_akun') {
          errors_add.value.nomor_add_akun = errors_add.value.nomor_add_akun + detailError[x].msg;
        } else if( detailError[x].path === 'prefix' ) {
          errors_add.value.nomor_add_akun = errors_add.value.nomor_add_akun + detailError[x].msg;
        } else if( detailError[x].path === 'primary_id' ) {
          errors_add.value.nomor_add_akun = errors_add.value.nomor_add_akun + detailError[x].msg;
        }
      }
    }
  }

  return isValid;
};

const addAkun = async () => {

  if (! await validateFormAddAkun()) return;

  // const isEdit = !!selectedKota.value.id;
  // const action = async () => {
  //   try {
  //     if (isEdit) {
  //       const response = await editKota(selectedKota.value.id, selectedKota.value );
  //       showConfirmDialog.value = false;
  //       displayNotification(response.error_msg);
  //     } else {
  //       const response = await addKota(selectedKota.value);
  //       showConfirmDialog.value = false;
  //       displayNotification(response.error_msg);
  //     }
  //     isModalOpen.value = false;
  //     fetchData();
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       displayNotification(error.response?.data?.error_msg || 'Terjadi kesalahan saat menyimpan data.', 'error');
  //     } else {
  //       displayNotification('Terjadi kesalahan yang tidak terduga.', 'error');
  //     }
  //     showConfirmDialog.value = false;
  //   }
  // };

  // isEdit ? showConfirmation('Konfirmasi Perubahan', 'Apakah Anda yakin ingin mengubah data ini?', action) : action();
};



// const openModal = (kota?: Kota) => {
//   selectedKota.value = kota ? { ...kota } : { kode: '', name: '' };
//   isModalOpen.value = true;
// };

onMounted(async () => {
  await fetchFilterData(); // Pastikan data sudah diambil sebelum menghitung jumlah kolom
  totalColumns.value = document.querySelectorAll("thead th").length;
});


// const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
//   notificationMessage.value = message;
//   notificationType.value = type;
//   showNotification.value = true;

//   if (timeoutId.value) clearTimeout(timeoutId.value);

//   timeoutId.value = window.setTimeout(() => {
//     showNotification.value = false;
//   }, 3000);
// };

// const showConfirmation = (title: string, message: string, action: () => void) => {
//   confirmTitle.value = title;
//   confirmMessage.value = message;
//   confirmAction.value = action;
//   showConfirmDialog.value = true;
// };

// const saveData = async () => {
//   if (!validateForm()) return;

//   const isEdit = !!selectedKota.value.id;
//   const action = async () => {
//     try {
//       if (isEdit) {
//         const response = await editKota(selectedKota.value.id, selectedKota.value );
//         showConfirmDialog.value = false;
//         displayNotification(response.error_msg);
//       } else {
//         const response = await addKota(selectedKota.value);
//         showConfirmDialog.value = false;
//         displayNotification(response.error_msg);
//       }
//       isModalOpen.value = false;
//       fetchData();
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         displayNotification(error.response?.data?.error_msg || 'Terjadi kesalahan saat menyimpan data.', 'error');
//       } else {
//         displayNotification('Terjadi kesalahan yang tidak terduga.', 'error');
//       }
//       showConfirmDialog.value = false;
//     }
//   };

//   isEdit ? showConfirmation('Konfirmasi Perubahan', 'Apakah Anda yakin ingin mengubah data ini?', action) : action();
// };

// const deleteData = async (id: number) => {
//   showConfirmation(
//     'Konfirmasi Hapus',
//     'Apakah Anda yakin ingin menghapus data ini?',
//     async () => {
//       try {
//         const response = await deleteKota(id);
//         showConfirmDialog.value = false;
//         displayNotification(response.error_msg);
//         fetchData();
//       } catch (error) {
//         console.error('Error deleting data:', error);
//         displayNotification('Terjadi kesalahan saat menghapus data.', 'error');
//       }
//     }
//   );
// };

const formattedPrice = computed(() => {
  return formatRupiah(dataAddAkun.value.saldo);
});

const formatToRupiah = (event :any )  => {
  let value = event.target.value.replace(/\D/g, ""); // Hanya angka
  dataAddAkun.value.saldo = value;
};

const formatRupiah = (angka :any, prefix = "Rp ") => {
  let numberString = angka.toString().replace(/\D/g, ""),
    split = numberString.split(","),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/g);

  if (ribuan) {
    let separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  return prefix + (rupiah || "0");
};

</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Tambah data dan Search -->
    <div class="flex justify-between mb-4">
      <div class="inline-flex rounded-md shadow-xs" role="group">
        <div class="inline-flex rounded-md shadow-xs" role="group">
          <button type="button" class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
            <font-awesome-icon icon="fa-solid fa-book" class="mr-2" />
            Tutup Buku
          </button>
          <button type="button" class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-e  border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
            <font-awesome-icon icon="fa-solid fa-book" class="mr-2" />
            Kembali Ke Buku Sebelumnya
          </button>
        </div>

      </div>

      <!-- <button
        @click="openModal()"
        class="bg-[#333a48] text-white px-4 py-2 rounded-lg hover:bg-[#333a48] transition-colors duration-200 ease-in-out flex items-center gap-2" >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Tambah Kota Baru
      </button> -->






      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Filter</label>
        <div class="inline-flex rounded-md shadow-xs" role="group">
          <select  v-model="selectedOptionAkun" style="width: 300px;"  @change="getData()" class="bg-gray-50 border-t border-b border-s border-gray-300 text-gray-900 text-sm rounded-s-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option v-for="optionA in optionFilterAkun" :key="optionA.id" :value="optionA.id">
                {{ optionA.name }}
              </option>
          </select>
          <select  v-model="selectedOptionCabang" style="width: 300px;" @change="getData()" class="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-e-lg border-t border-b border-e focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option v-for="optionC in optionFilterCabang" :key="optionC.id" :value="optionC.id">
                {{ optionC.name }}
              </option>
          </select>
        </div>
      </div>
      <!--
      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Pilih Cabang</label>
      </div>
      -->
    </div>

    <!-- Table data -->
    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-[10%] px-6 py-4 font-bold text-gray-900 text-center" colspan="2">Nomor</th>
            <th class="w-[35%] px-6 py-4 font-bold text-gray-900 text-center">Nama Akun</th>
            <th class="w-[15%] px-6 py-4 font-bold text-gray-900 text-center">Type</th>
            <th class="w-[15%] px-6 py-4 font-bold text-gray-900 text-center">Saldo Awal</th>
            <th class="w-[15%] px-6 py-4 font-bold text-gray-900 text-center">Saldo Akhir</th>
            <th class="w-[10%] px-6 py-4 font-bold text-gray-900 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <template v-if="dataAkun && dataAkun.length > 0">
            <tr v-for="akun in dataAkun" :key="akun.nomor" class="hover:bg-gray-50">
              <td v-if="akun.type === 'header'" class="px-6 py-4 text-left font-bold bg-gray-200" colspan="2">
                {{ akun.nomor }}
              </td>
              <template v-else>
                <td class="w-[2%] px-6 py-4 text-center"><font-awesome-icon icon="arrow-right" /></td>
                <td class="px-6 py-4 text-left">{{ akun.nomor }}</td>
              </template>
              <td class="px-6 py-4 text-left" :class="akun.type === 'header' ? 'font-bold uppercase bg-gray-200' : '' ">
                <!-- {{ akun.id }}
                <br> -->
                {{ akun.name }}</td>
              <td class="px-6 py-4 text-center" :class="akun.type === 'header' ? 'font-bold uppercase bg-gray-200' : '' ">{{ akun.tipe_akun }}</td>
              <td class="px-6 py-4 text-center" :class="akun.type === 'header' ? 'font-bold bg-gray-200' : '' ">{{ akun.saldo_awal }}</td>
              <td class="px-6 py-4 text-center" :class="akun.type === 'header' ? 'font-bold bg-gray-200' : '' ">{{ akun.saldo_akhir }}</td>
              <td class="px-6 py-4 text-center" :class="akun.type === 'header' ? 'font-bold uppercase bg-gray-200' : '' ">
                <div class="flex justify-center gap-2">
                  <PrimaryButton v-if=" akun.type === 'header'" @click="addAkunBtn(akun.id, akun.nomor)">
                    <font-awesome-icon icon="fa-solid fa-plus" class="mr-0" />
                  </PrimaryButton>
                  <template v-else>
                    <SuccessButton v-if="akun.tipe_akun === 'bawaan' " >
                      <font-awesome-icon icon="fa-solid fa-money-bill" class="mr-0" />
                    </SuccessButton>
                    <template v-else>
                      <PrimaryButton >
                        <font-awesome-icon icon="fa-solid fa-pencil" class="mr-0" />
                      </PrimaryButton>
                      <DangerButton >
                        <font-awesome-icon icon="fa-solid fa-times" class="mr-0" />
                      </DangerButton>
                    </template>
                  </template>
                  <!-- <EditButton @click="openModal(kota)">
                    <EditIcon></EditIcon>
                  </EditButton>
                  <DangerButton @click="deleteData(kota.id)">
                    <DeleteIcon></DeleteIcon>
                  </DangerButton> -->
                </div>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="6" class="px-6 py-4 text-center text-base text-gray-600">Daftar Akun tidak ditemukan.</td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-100 font-bold">
          <tr>
            <td class="px-4 py-4 text-center border h-[50px]" :colspan="7">
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <!-- Modal Form -->
    <!-- <Transition
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
                {{ selectedKota.id ? "Edit Data Kota" : "Tambah Kota Baru" }}
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kode</label>
                  <input
                    v-model="selectedKota.kode"
                    type="text"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal" placeholder="Kode Kota"
                  />
                  <p v-if="errors.kode" class="mt-1 text-sm text-red-600">{{ errors.kode }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input
                    v-model="selectedKota.name"
                    type="text"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal" placeholder="Nama Kota"
                  />
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                @click="saveData"
                class="inline-flex w-full justify-center rounded-md border border-transparent bg-[#333a48] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
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
    </Transition> -->

    <!-- Confirmation Dialog -->
    <!-- <Confirmation  :showConfirmDialog="showConfirmDialog"  :confirmTitle="confirmTitle" :confirmMessage="confirmMessage" >
      <button @click="confirmAction && confirmAction()"
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
    </Confirmation> -->

    <!-- Modal Tambah Akun Baru -->

    <ModalPrimary  :showStatus="showAddModal"  :title="`Tambah Akun Baru`"  :action="closeAddModal" >
      <template #content>
        <div class="space-y-4">
          <div>
            <label for="website-admin" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nomor Akun</label>
            <div class="flex">
              <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                {{ dataAddAkun.prefix }}
              </span>
              <input type="text" id="website-admin" v-model="dataAddAkun.nomor" class="rounded-none bg-gray-50 border-t border-b border-e text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 rounded-e dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nomor Akun">
              <!-- <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-e-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                Check Nomor Akun
              </span> -->

            </div>
            <p v-if="errors_add.nomor_add_akun" class="mt-1 text-sm text-red-600 italic">{{ errors_add.nomor_add_akun }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Akun</label>
            <input type="text" v-model="dataAddAkun.nama" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal" placeholder="Nama Akun" />
            <p v-if="errors_add.nama_add_akun" class="mt-1 text-sm text-red-600">{{ errors_add.nama_add_akun }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Saldo</label>
            <input
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal" placeholder="Saldo"
              type="text"
              id="rupiah"
              v-model="formattedPrice"
              @input="formatToRupiah"
            />
            <p v-if="errors_add.saldo_add_akun" class="mt-1 text-sm text-red-600">{{ errors_add.saldo_add_akun }}</p>
          </div>
        </div>
      </template>

      <template #footer>
        <button @click="showAddModal = false"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" >
          Batal
        </button>
        <button @click="addAkun"
          class="inline-flex w-full justify-center rounded-md border border-transparent bg-[#333a48] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm" >
          Tambah Akun Baru
        </button>
      </template>

    </ModalPrimary>
    <!-- <Notification  :showNotification="showNotification"  :notificationType="notificationType" :notificationMessage="notificationMessage" ></Notification> -->
  </div>
</template>
