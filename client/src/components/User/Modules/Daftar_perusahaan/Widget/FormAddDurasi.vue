<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { tambah_waktu_berlangganan } from '@/service/daftar_perusahaan';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  isModalOpen: {
    type: Boolean,
    required: true,
  },
});

interface FormData {
  company_name: string;
  start_subscribtion: string;
  end_subscribtion: string;
  durasi: number;
}

const form = ref<FormData>({
  company_name: '',
  start_subscribtion: '',
  end_subscribtion: '',
  durasi: 0,
});

const showNotification = ref(false);
const notificationMessage = ref('');
const notificationType = ref<'success' | 'error'>('success');
const timeoutId = ref<number | null>(null);
const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
  if (timeoutId.value) clearTimeout(timeoutId.value);
  timeoutId.value = window.setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

const fetchEditData = async () => {
  try {
    const response = await get_data_edit_perusahaan({
      id: props.id,
    });

    form.value = {
      company_name: response.data.company_name,
      start_subscribtion: response.data.start_subscribtion,
      end_subscribtion: response.data.end_subscribtion,
      durasi: 0,
    };
  } catch (error) {
    displayNotification(error.response.data.message, 'error');
  }
};

const errors = ref<Record<string, string>>({});

const reset = (): void => {
  form.value = {
    company_name: '',
    start_subscribtion: '',
    end_subscribtion: '',
    durasi: 0,
  };
  errors.value = {};
};

const handleCancel = (): void => {
  emit('close');
  reset();
  errors.value = {};
};

const validateForm = (): boolean => {
  errors.value = {};

  let isValid = true;

  if (form.value.durasi == 0) {
    errors.value.durasi = 'Durasi tidak boleh kosong.';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const data = {
      company_name: form.value.company_name,
      start_subscribtion: form.value.start_subscribtion,
      end_subscribtion: form.value.end_subscribtion,
    };

    const response = await tambah_waktu_berlangganan(data);
    displayNotification(response.message, 'success');
    emit('close');
    reset();
  } catch (error) {
    displayNotification(error.response.data.message, 'error');
  }
};

watch(
  () => props.isModalOpen,
  (val) => {
    if (val) {
      fetchEditData();
    }
  },
);
</script>

<template>
  <Form
    :form-status="isModalOpen"
    :label="props.id === 0 ? 'Tambah Perusahaan' : 'Update Perusahaan'"
    @close="handleCancel"
    @cancel="handleCancel"
    @submit="handleSubmit"
    width="sm:w-full sm:max-w-xl"
    :submitLabel="props.id === 0 ? 'TAMBAH PERUSAHAAN' : 'UPDATE PERUSAHAAN'"
  >
    <!-- <div class="grid grid-cols-6 gap-6">
      <div class="col-span-4">
        <InputText
          id="nama_perusahaan"
          v-model="form.company_name"
          label="Nama Perusahaan"
          placeholder="Masukkan nama perusahaan"
          required
          :error="errors.company_name"
        />
      </div>
      <div class="col-span-2">
        <SelectField
          id="type"
          v-model="form.type"
          label="Tipe Langganan"
          :options="[
            { id: '0', name: '-- Pilih Tipe --' },
            { id: 'limited', name: 'Limited' },
            { id: 'unlimited', name: 'Unlimited' },
          ]"
          required
          :error="errors.type"
        />
      </div>
      <div class="col-span-3">
        <InputDate
          id="start_subscribtion"
          v-model="form.start_subscribtion"
          label="Mulai berlangganan"
          placeholder="Masukkan mulai berlangganan"
          required
          :error="errors.start_subscribtion"
        />
      </div>
      <div class="col-span-3">
        <InputDate
          id="end_subscribtion"
          v-model="form.end_subscribtion"
          label="Akhir berlangganan"
          placeholder="Masukkan akhir berlangganan"
          required
          :error="errors.end_subscribtion"
          :disabled="form.type != 'limited' ? true : false"
        />
      </div>
      <div class="col-span-3">
        <InputText
          id="saldo"
          v-model="saldoRp"
          label="Saldo"
          placeholder="Saldo"
          required
          :error="errors.saldo"
        />
      </div>
      <div class="col-span-3">
        <InputText
          id="whatsapp_company_number"
          v-model="form.whatsapp_company_number"
          label="Nomor Whatsapp"
          placeholder="Nomor whatsapp"
          required
          :error="errors.whatsapp_company_number"
        />
      </div>
      <div class="col-span-3">
        <InputText
          type="email"
          id="email"
          v-model="form.email"
          label="Email"
          placeholder="Email"
          required
          :error="errors.email"
        />
      </div>
      <div class="col-span-3">
        <InputText
          id="username"
          v-model="form.username"
          label="Username"
          placeholder="Username"
          required
          :error="errors.username"
        />
      </div>
      <div class="col-span-3">
        <InputPassword
          id="password"
          v-model="form.password"
          label="Password"
          placeholder="Password"
          required
          :error="errors.password"
        />
      </div>
      <div class="col-span-3">
        <InputPassword
          id="konfirmmasi"
          v-model="form.konfirmasi_password"
          label="Konfirmasi Password"
          placeholder="Konfirmasi Password"
          required
          :error="errors.konfirmasi_password"
        />
      </div>
    </div> -->
  </Form>
</template>
