<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'

  import { ref, computed, onMounted } from 'vue';
  import { getFilterAkun, getData, checkAkun, addAkun, editAkun } from "../../../../../service/akun"; // Import function POST

  // const props = defineProps<{ showStatus: boolean, title: string, data : any }>()

  interface addUpdateAkunInterface {
    primary_id: number;
    prefix: string,
    nomor: string;
    nama: string;
    saldo: string;
  }

  interface Props {
    showStatus: boolean;
    // title: string;
    selectedAkun: number,
    data: addUpdateAkunInterface; // Gantilah `any` dengan tipe yang lebih spesifik jika memungkinkan
  }

  //  :title="`Tambah Akun Baru`"

  const props = defineProps<Props>();

  const emit = defineEmits(["close", "update-statusShow"]);

  interface ErrorsAdd {
    nomor_add_akun: string;
    nama_add_akun: string;
    saldo_add_akun: string;
  }

  const errors_message = ref<ErrorsAdd>({
    nomor_add_akun: '',
    nama_add_akun: '',
    saldo_add_akun :'',
  });

  const validateFormAddAkun = async (): Promise<boolean> => {

    errors_message.value = { nomor_add_akun: '', nama_add_akun: '', saldo_add_akun : '' };

    let isValid = true;

    if (!props.data.nomor?.trim()) {
      errors_message.value.nomor_add_akun = 'Nomor Akun tidak boleh kosong';
      isValid = false;
    }

    if (!props.data.nama?.trim()) {
      errors_message.value.nama_add_akun = 'Nama Akun tidak boleh kosong';
      isValid = false;
    }

    if (!props.data.saldo?.trim()) {
      errors_message.value.saldo_add_akun = 'Saldo tidak boleh kosong. Jika tidak ada silahkan isikan Rp 0';
      isValid = false;
    }

    if( isValid  === true ) {
      const response = await checkAkun({nomor_akun: props.data.nomor, prefix: props.data.prefix, primary_id: props.data.primary_id });
      if( response.error == true) {
        var detailError = response.detail;
        for ( let x in detailError ) {
          if( detailError[x].path === 'nomor_akun') {
            errors_message.value.nomor_add_akun = errors_message.value.nomor_add_akun + detailError[x].msg;
          } else if( detailError[x].path === 'prefix' ) {
            errors_message.value.nomor_add_akun = errors_message.value.nomor_add_akun + detailError[x].msg;
          } else if( detailError[x].path === 'primary_id' ) {
            errors_message.value.nomor_add_akun = errors_message.value.nomor_add_akun + detailError[x].msg;
          }
        }
      }
    }

    return isValid;
  };


  const save = async () => {

    if (! await validateFormAddAkun()) return;

    // selectedAkun
    const isEdit = !!props.selectedAkun;


    emit('update-statusShow', false);


  //   const action = async () => {
  //   try {
  //     if (isEdit) {
  //       // const response = await editKota(selectedKota.value.id, selectedKota.value );
  //       // showConfirmDialog.value = false;
  //       // props.showStatus = false;
  //       emit('update:statusShow', false);
  //       // displayNotification(response.error_msg);
  //     } else {
  //       // const response = await addKota(selectedKota.value);
  //       // showConfirmDialog.value = false;
  //       emit('update:statusShow', false);
  //       // displayNotification(response.error_msg);
  //     }
  //     // isModalOpen.value = false;
  //     // fetchData();
  //   } catch (error) {
  //     // if (axios.isAxiosError(error)) {
  //     //   displayNotification(error.response?.data?.error_msg || 'Terjadi kesalahan saat menyimpan data.', 'error');
  //     // } else {
  //     //   displayNotification('Terjadi kesalahan yang tidak terduga.', 'error');
  //     // }
  //     // showConfirmDialog.value = false;
  //   }
  // };

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

  const formattedPrice = computed(() => {
    return formatRupiah(props.data.saldo);
  });

  const formatToRupiah = (event :any )  => {
    let value = event.target.value.replace(/\D/g, "");
    props.data.saldo = value;
  };

</script>

<template>
  <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
    <div v-if="showStatus" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="emit('close')"></div>
        <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        <div class="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-2xl flex justify-center font-bold leading-6 text-gray-900 mb-4">{{ selectedAkun ? 'Perbaharui Data Akun' : "Tambah Akun Baru" }}</h3>
            <div class="space-y-4">
              <div>
                <label for="website-admin" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nomor Akun</label>
                <div class="flex">
                  <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                    {{ data.prefix }}
                  </span>
                  <input type="text" id="website-admin" v-model="data.nomor" class="rounded-none bg-gray-50 border-t border-b border-e text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 rounded-e dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nomor Akun">
                </div>
                <p v-if="errors_message.nomor_add_akun" class="mt-1 text-sm text-red-600 italic">{{ errors_message.nomor_add_akun }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Akun</label>
                <input type="text" v-model="data.nama" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal" placeholder="Nama Akun" />
                <p v-if="errors_message.nama_add_akun" class="mt-1 text-sm text-red-600">{{ errors_message.nama_add_akun }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Saldo</label>
                <input class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal" placeholder="Saldo" type="text" id="rupiah" v-model="formattedPrice" @input="formatToRupiah"/>
                <p v-if="errors_message.saldo_add_akun" class="mt-1 text-sm text-red-600">{{ errors_message.saldo_add_akun }}</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <footer>
              <button @click="emit('close')"
                class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" >
                Batal
              </button>
              <button @click="save"
                class="inline-flex w-full justify-center rounded-md border border-transparent bg-[#333a48] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm" >
                {{ selectedAkun ? 'Perbaharui Akun' : 'Tambah Akun Baru' }}
              </button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>


