<script setup lang="ts">

import PrimaryButton from "./Particle/PrimaryButton.vue"
import DangerButton from "./Particle/DangerButton.vue"
import SuccessButton from "./Particle/SuccessButton.vue"
import ModalPrimary from "./Particle/ModalPrimary.vue"
import { getFilterAkun, getData, checkAkun, addAkun, editAkun } from "../../../../service/akun"; // Import function POST
import { ref, onMounted, computed, watchEffect } from 'vue';
import { useCurrencyInput } from 'vue-currency-input';

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

// interface addUpdateAkunInterface {
//   primary_id: number;
//   prefix: string,
//   nomor: string;
//   nama: string;
//   saldo: string;
// }

const daftarAkun = ref<primaryAkun[]>([]);
// const dataAddUpdateAkun = ref<Partial<addUpdateAkunInterface>>({
//   primary_id : 0,
//   prefix : '',
//   nomor: '',
//   nama : '',
//   saldo : ''
// });


const totalColumns = ref(3); // Default 3 kolom
const optionFilterAkun = ref([{ id: 0, name: 'Pilih Semua Akun' }]);
const optionFilterCabang = ref([{ id: 0, name: 'Pilih Semua Cabang' }]);
const selectedOptionAkun = ref(0);
const selectedOptionCabang = ref(0);

// interface ErrorsAdd {
//   nomor_add_akun: string;
//   nama_add_akun: string;
//   saldo_add_akun: string;
// }

// const errors_add = ref<ErrorsAdd>({
//   nomor_add_akun: '',
//   nama_add_akun: '',
//   saldo_add_akun :'',
// });

// interface addUpdateAkunInterface {
//   primary_id: number;
//   prefix: string,
//   nomor: string;
//   nama: string;
//   saldo: string;
// }

// const dataAddUpdateAkun = ref<Partial<addUpdateAkunInterface>>({
//   primary_id : 0,
//   prefix : '',
//   nomor: '',
//   nama : '',
//   saldo : ''
// });

const fetchFilterData = async() => {
  const response = await getFilterAkun();
  optionFilterAkun.value = response.data.akun;
  optionFilterCabang.value = response.data.cabang;
  await fetch();
}

const fetch = async() => {
  const response = await getData({akun: selectedOptionAkun.value, cabang: selectedOptionCabang.value});
  daftarAkun.value = response.data;
}

const selectedAkun = ref<number>();

interface addUpdateAkunInterface {
  primary_id: number;
  prefix: string,
  nomor: string;
  nama: string;
  saldo: string;
}

const dataAddUpdateAkun = ref<Partial<addUpdateAkunInterface>>({
  primary_id : 0,
  prefix : '',
  nomor: '',
  nama : '',
  saldo : ''
});

// ADD AKUN FUNCTION //
const showAddModal = ref<boolean>(false);
const addAkunBtn = async (id : number, nomor : string) => {
  dataAddUpdateAkun.value.prefix = nomor.toString().charAt(0);
  dataAddUpdateAkun.value.primary_id = id;
  showAddModal.value = true;
}

// const closeAddModal = async () => {
//   showAddModal.value = false;
// }

// const validateFormAddAkun = async (): Promise<boolean> => {

//   errors_add.value = { nomor_add_akun: '', nama_add_akun: '', saldo_add_akun : '' };

//   let isValid = true;

//   if (!dataAddUpdateAkun.value.nomor?.trim()) {
//     errors_add.value.nomor_add_akun = 'Nomor Akun tidak boleh kosong';
//     isValid = false;
//   }

//   if (!dataAddUpdateAkun.value.nama?.trim()) {
//     errors_add.value.nama_add_akun = 'Nama Akun tidak boleh kosong';
//     isValid = false;
//   }

//   if (!dataAddUpdateAkun.value.saldo?.trim()) {
//     errors_add.value.saldo_add_akun = 'Saldo tidak boleh kosong. Jika tidak ada silahkan isikan Rp 0';
//     isValid = false;
//   }

//   if( isValid  === true ) {
//     const response = await checkAkun({nomor_akun: dataAddUpdateAkun.value.nomor, prefix: dataAddUpdateAkun.value.prefix, primary_id: dataAddUpdateAkun.value.primary_id });
//     if( response.error == true) {
//       var detailError = response.detail;
//       for ( let x in detailError ) {
//         if( detailError[x].path === 'nomor_akun') {
//           errors_add.value.nomor_add_akun = errors_add.value.nomor_add_akun + detailError[x].msg;
//         } else if( detailError[x].path === 'prefix' ) {
//           errors_add.value.nomor_add_akun = errors_add.value.nomor_add_akun + detailError[x].msg;
//         } else if( detailError[x].path === 'primary_id' ) {
//           errors_add.value.nomor_add_akun = errors_add.value.nomor_add_akun + detailError[x].msg;
//         }
//       }
//     }
//   }

//   return isValid;
// };

// const saveAkun = async () => {

//   if (! await validateFormAddAkun()) return;

//   const isEdit = !!selectedAkun.value;
//   const action = async () => {
//     try {
//       if (isEdit) {
//         const response = await editAkun(selectedKota.value.id, selectedKota.value );
//         // showConfirmDialog.value = false;
//         // displayNotification(response.error_msg);
//       } else {
//         const response = await addAkun(selectedKota.value);
//         // showConfirmDialog.value = false;
//         // displayNotification(response.error_msg);
//       }
//       // isModalOpen.value = false;
//       fetch();
//     } catch (error) {
//       // if (axios.isAxiosError(error)) {
//       //   displayNotification(error.response?.data?.error_msg || 'Terjadi kesalahan saat menyimpan data.', 'error');
//       // } else {
//       //   displayNotification('Terjadi kesalahan yang tidak terduga.', 'error');
//       // }
//       // showConfirmDialog.value = false;
//     }
//   };

//   // isEdit ? showConfirmation('Konfirmasi Perubahan', 'Apakah Anda yakin ingin mengubah data ini?', action) : action();
// };



// const openModal = (kota?: Kota) => {
//   selectedKota.value = kota ? { ...kota } : { kode: '', name: '' };
//   isModalOpen.value = true;
// };


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

// const formattedPrice = computed(() => {
//   return formatRupiah(dataAddAkun.value.saldo);
// });

// const formatToRupiah = (event :any )  => {
//   let value = event.target.value.replace(/\D/g, "");
//   dataAddAkun.value.saldo = value;
// };

// const formatRupiah = (angka :any, prefix = "Rp ") => {
//   let numberString = angka.toString().replace(/\D/g, ""),
//     split = numberString.split(","),
//     sisa = split[0].length % 3,
//     rupiah = split[0].substr(0, sisa),
//     ribuan = split[0].substr(sisa).match(/\d{3}/g);

//   if (ribuan) {
//     let separator = sisa ? "." : "";
//     rupiah += separator + ribuan.join(".");
//   }

//   return prefix + (rupiah || "0");
// };


const updateStatusShow = (newStatus: boolean) => {
  // title.value = newTitle;
  showAddModal.value = newStatus;
};

onMounted(async () => {
  await fetchFilterData(); // Pastikan data sudah diambil sebelum menghitung jumlah kolom
  totalColumns.value = document.querySelectorAll("thead th").length;
});


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
      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Filter</label>
        <div class="inline-flex rounded-md shadow-xs" role="group">
          <select  v-model="selectedOptionAkun" style="width: 300px;"  @change="fetch()" class="bg-gray-50 border-t border-b border-s border-gray-300 text-gray-900 text-sm rounded-s-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option v-for="optionA in optionFilterAkun" :key="optionA.id" :value="optionA.id">
                {{ optionA.name }}
              </option>
          </select>
          <select  v-model="selectedOptionCabang" style="width: 300px;" @change="fetch()" class="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-e-lg border-t border-b border-e focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option v-for="optionC in optionFilterCabang" :key="optionC.id" :value="optionC.id">
                {{ optionC.name }}
              </option>
          </select>
        </div>
      </div>
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
          <template v-if="daftarAkun && daftarAkun.length > 0">
            <tr v-for="akun in daftarAkun" :key="akun.nomor" class="hover:bg-gray-50">
              <td v-if="akun.type === 'header'" class="px-6 py-4 text-left font-bold bg-gray-200" colspan="2">{{ akun.nomor }}</td>
              <template v-else>
                <td class="w-[2%] px-6 py-4 text-center"><font-awesome-icon icon="arrow-right" /></td>
                <td class="px-6 py-4 text-left">{{ akun.nomor }}</td>
              </template>
              <td class="px-6 py-4 text-left" :class="akun.type === 'header' ? 'font-bold uppercase bg-gray-200' : '' ">
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

    <!-- Modal Tambah Akun Baru -->
    <ModalPrimary  :showStatus="showAddModal" @update-statusShow="updateStatusShow" :data="dataAddUpdateAkun" :selectedAkun="selectedAkun" @close="showAddModal = false"  >
      <!-- <template #content>

      </template>
      <template #footer>
        <button @click="showAddModal = false"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" >
          Batal
        </button>
        <button @click="saveAkun"
          class="inline-flex w-full justify-center rounded-md border border-transparent bg-[#333a48] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm" >
          Tambah Akun Baru
        </button>
      </template> -->
    </ModalPrimary>
    <!-- <Notification  :showNotification="showNotification"  :notificationType="notificationType" :notificationMessage="notificationMessage" ></Notification> -->
  </div>
</template>
