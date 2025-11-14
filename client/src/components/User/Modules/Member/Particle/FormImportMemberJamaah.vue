<script setup lang="ts">
import { ref, watch } from 'vue';
import SelectField from '@/components/Form/SelectField.vue';
import Form from '@/components/Modal/Form.vue';
import InputFile from '@/components/Form/InputFile.vue';
import { importMemberJamaah } from '@/service/member';

interface Cabang {
  id: number;
  name: string;
}

const props = defineProps<{
  showForm: boolean;
  cabangs: Cabang[];
}>();

const emit = defineEmits<{ (e: 'close'): void }>();
const fileName = ref<string>('');
const errors = ref<Record<string, string>>({ cabang_id: '', excel: '' });
const form = ref({
  cabang_id: 0,
  excel: null as File | null,
});

const handleFileUpload = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedTypes.includes(file.type)) {
      errors.value.excel = 'File harus berupa Excel (.xls atau .xlsx)';
      fileName.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      errors.value.excel = 'Ukuran file maksimum 2MB';
      fileName.value = '';
      return;
    }

    fileName.value = file.name;
    form.value.excel = file;
    errors.value.excel = '';
  }
};

const validateForm = (): boolean => {
  errors.value = {};
  let isValid = true;

  if (!form.value.cabang_id || form.value.cabang_id == 0) {
    errors.value.cabang_id = 'Silahkan pilih salah satu cabang';
    isValid = false;
  }

  if (!form.value.excel) {
    errors.value.excel = 'File Excel harus diupload';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) return;

  try {
    const formData = new FormData();
    formData.append('cabang_id', form.value.cabang_id);
    if (form.value.excel) {
      formData.append('excel', form.value.excel);
    }

    await importMemberJamaah(formData);
    emit('close');
  } catch (error) {
    console.error('Gagal import member:', error);
    errors.value.excel = 'Gagal import data, periksa format file';
  }
};

const handleCancel = (): void => {
  emit('close');
};

watch(
  () => props.showForm,
  (e) => {
    if (e) {
      if (e) {
        if (props.showForm && props.cabangs.length > 0) {
          form.value = { cabang_id: props.cabangs[0].id, excel: null };
          fileName.value = '';
          errors.value = { cabang_id: '', excel: '' };
        }
      }
    }
  },
  { immediate: true },
);
</script>

<template>
  <Form
    :form-status="props.showForm"
    label="Import Member & Jamaah"
    @close="handleCancel"
    @cancel="handleCancel"
    @submit="handleSubmit"
    width="sm:w-full sm:max-w-md"
    submitLabel="IMPORT DATA"
  >
    <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-6">
      <SelectField
        v-model="form.cabang_id"
        id="cabang"
        label="Pilih Cabang"
        placeholder="Pilih Cabang"
        :options="props.cabangs"
      />
      <div v-if="errors.cabang_id" class="text-sm text-red-600 mt-1">
        {{ errors.cabang_id }}
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-0">
      <InputFile
        id="excel"
        label="Upload File Excel (.xls / .xlsx)"
        :error="errors.excel"
        @change="handleFileUpload"
        :accept="'.xls,.xlsx'"
        :maxSize="'1000'"
      />
      <div v-if="fileName" class="text-sm text-green-600 mt-1">File terpilih: {{ fileName }}</div>
      <div v-if="errors.excel" class="text-sm text-red-600 mt-1">
        {{ errors.excel }}
      </div>
    </div>
  </Form>
</template>
