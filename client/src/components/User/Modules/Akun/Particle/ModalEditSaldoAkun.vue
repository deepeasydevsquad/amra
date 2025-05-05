<script setup lang="ts">
  import Notification from "../../../../Modal/Notification.vue"
  import Confirmation from "../../../../Modal/Confirmation.vue"
  import { defineProps, defineEmits } from 'vue'
  import { ref, computed, watchEffect } from 'vue';
  import { updateSaldo } from "../../../../../service/akun"; // Import function POST

  interface ErrorsAdd {
    saldo_add_akun: string;
  }

  interface dataEditSaldo {
    id: number;
    saldo: string;
    cabang: number;
  }

  interface Props {
    showStatus: boolean;
    selectedAkun?: number,
    data: Partial<dataEditSaldo>;
    cabang: number;
  }

  const props = defineProps<Props>();
  const emit = defineEmits(["close", "update-statusShow"]);
  const showNotification = ref<boolean>(false);
  const showConfirmDialog = ref<boolean>(false);
  const confirmMessage = ref<string>('');
  const confirmTitle = ref<string>('');
  const confirmAction = ref<(() => void) | null>(null);
  const notificationMessage = ref<string>('');
  const notificationType = ref<'success' | 'error'>('success');
  const errors_message = ref<ErrorsAdd>({
    saldo_add_akun :'',
  });
  const dataEditSaldos = ref<Partial<dataEditSaldo>>({
    id : 0,
    saldo : '',
    cabang : 0
  });

  const validateFormAddAkun = async (): Promise<boolean> => {
    errors_message.value = { saldo_add_akun : '' };
    let isValid = true;
    if (!dataEditSaldos.value.saldo?.trim()) {
      errors_message.value.saldo_add_akun = 'Nama Akun tidak boleh kosong';
      isValid = false;
    }
    return isValid;
  };

  const save = async () => {
    if (! await validateFormAddAkun()) return;
    const isEdit = !!props.selectedAkun;
    const action = async () => {
      try {
        dataEditSaldos.value.cabang = props.cabang;
        const response = await updateSaldo(dataEditSaldos.value);
        dataEditSaldos.value = {};
        showConfirmDialog.value = false;
        emit('update-statusShow', false);
        displayNotification(response.error_msg);
      } catch (error) {
        showConfirmDialog.value = false;
      }
    };

    isEdit ? showConfirmation('Konfirmasi Perubahan', 'Apakah Anda yakin ingin mengubah data saldo ini?', action) : action();
  };

  const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
    notificationMessage.value = message;
    notificationType.value = type;
    showNotification.value = true;
  };

  const showConfirmation = (title: string, message: string, action: () => void) => {
    confirmTitle.value = title;
    confirmMessage.value = message;
    confirmAction.value = action;
    showConfirmDialog.value = true;
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
    return formatRupiah(dataEditSaldos.value.saldo);
  });

  const formatToRupiah = (event :any )  => {
    let value = event.target.value.replace(/\D/g, "");
    dataEditSaldos.value.saldo = value;
  };

  const closeModal = () => {
    emit('close')
    dataEditSaldos.value = {};
  };

  watchEffect(async () => {
    dataEditSaldos.value.id = props.data.id;
    dataEditSaldos.value.saldo = props.data.saldo;
  });

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
            <h3 class="text-2xl flex justify-center font-bold leading-6 text-gray-900 mb-4">Perbaharui Data Saldo Akun</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Saldo</label>
                <input class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal" placeholder="Saldo" type="text" id="rupiah" v-model="formattedPrice" @input="formatToRupiah"/>
                <p v-if="errors_message.saldo_add_akun" class="mt-1 text-sm text-red-600">{{ errors_message.saldo_add_akun }}</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <footer>
              <button @click="closeModal"
                class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" >
                Batal
              </button>
              <button @click="save"
                class="inline-flex w-full justify-center rounded-md border border-transparent bg-[#333a48] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm" >
                  Perbaharui Saldo Akun
              </button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Confirmation Dialog -->
  <Confirmation  :showConfirmDialog="showConfirmDialog"  :confirmTitle="confirmTitle" :confirmMessage="confirmMessage" >
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
  </Confirmation>

  <!-- Notification -->
  <Notification  :showNotification="showNotification"  :notificationType="notificationType" :notificationMessage="notificationMessage" @close="showNotification = false"  ></Notification>

</template>
