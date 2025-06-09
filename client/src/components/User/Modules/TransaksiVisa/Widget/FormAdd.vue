<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';

// Import komponen & service
import PrimaryButton from "@/components/Button/PrimaryButton.vue";
import { addTransaksiVisa, getCityList,  getVisaTypesList } from '@/service/transaksi_visa';

// Import komponen "particle" untuk form
import FormInput from '@/components/User/Modules/TransaksiVisa/Particle/BaseInput.vue';
import FormSelect from '@/components/User/Modules/TransaksiVisa/Particle/BaseSelect.vue';
import Notification from '@/components/User/Modules/TransaksiVisa/Particle/Notification.vue';

// Props & Emits
defineProps<{ isFormOpen: boolean }>();
const emit = defineEmits<{ 
  (e: 'close'): void, 
  (e: 'save-success', message: string): void
}>();

// === NOTIFICATION STATE ===
const showNotification = ref<boolean>(false);
const notificationMessage = ref<string>('');
const notificationType = ref<'success' | 'error'>('success');

// === INVOICE GENERATOR FUNCTION ===
const generateInvoiceCode = (): string => {
  // Generate random 5 character alphanumeric code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomCode = '';
  for (let i = 0; i < 5; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `VISA-${randomCode}`;
};

// Interface untuk struktur data form
interface FormState {
  // Invoice field
  invoice: string;
  // Step 1
  payer: string;
  payer_identity: string;
  gender: string;
  birth_place: string;
  birth_date: string;
  nationality: string;
  // Step 2
  jenis_visa: string;
  passport_number: string;
  passport_issued_place: string;
  passport_issued_date: string;
  passport_expire_date: string;
  indonesia_job: string;
  abroad_job: string;
  work_address: string;
  postal_code: string;
  city: number | string;
  origin_country: string;
  phone: string;
  // Step 3
  valid_until: string;
  price: number;
  payment_method: boolean;
  // Properti untuk payload akhir
  name: string;
  identity_number: string;
}

// Interface untuk opsi dropdown
interface DropdownOption {
  value: number | string;
  label: string;
}
interface CityOption {
    id: number;
    name: string;
    kode: string;
}

const visaTypeOptions = ref<DropdownOption[]>([]);

// State untuk alur multi-langkah
const currentStep = ref(1);
const totalSteps = 3;

// State untuk loading, notifikasi, dan data
const isLoading = ref(false);
const cityOptions = ref<DropdownOption[]>([]);

// State utama untuk semua data form
const form = reactive<FormState>({
  invoice: '',
  payer: '', payer_identity: '', gender: '', birth_place: '', birth_date: '', nationality: '',
  jenis_visa: '', passport_number: '', passport_issued_place: '', passport_issued_date: '',
  passport_expire_date: '', indonesia_job: '', abroad_job: '', work_address: '',
  postal_code: '', city: '', origin_country: '', phone: '',
  valid_until: '', price: 0, payment_method: false, name: '', identity_number: '',
});

// State untuk menampung pesan error validasi
const errors = ref<Partial<Record<keyof FormState, string>>>({});

// Opsi statis untuk dropdown
const genders: DropdownOption[] = [{ value: 'Laki-laki', label: 'Laki-laki' }, { value: 'Perempuan', label: 'Perempuan' }];

// === NOTIFICATION FUNCTIONS ===
const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  setTimeout(() => {
    if (type === 'error' && message.includes('<br>')) {
      
      const errorPoints = message
        .split('<br>')
        .filter(point => point.trim() !== '') 
        .map(point => '• ' + point.trim()) 
        .join('\n');
      notificationMessage.value = errorPoints;
    } else {
      notificationMessage.value = message;
    }
    
    notificationType.value = type;
    showNotification.value = true;
  }, 100);
};

// Fungsi validasi lengkap untuk semua field
const validateStep = (step: number): boolean => {
  errors.value = {};
  let isValid = true;
  const checkField = (fieldName: keyof FormState, message: string) => {
    const value = form[fieldName];
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '') || (typeof value === 'number' && value <= 0)) {
      errors.value[fieldName] = message;
      isValid = false;
    }
  };

  if (step === 1) {
    checkField('payer', 'Nama Pelanggan wajib diisi');
    checkField('payer_identity', 'Nomor Identitas wajib diisi');
    checkField('gender', 'Jenis Kelamin wajib dipilih');
    checkField('birth_place', 'Tempat Lahir wajib diisi');
    checkField('birth_date', 'Tanggal Lahir wajib diisi');
    checkField('nationality', 'Kewarganegaraan wajib diisi');
  } else if (step === 2) {
    checkField('jenis_visa', 'Jenis Visa wajib dipilih');
    checkField('passport_number', 'Nomor Passport wajib diisi');
    checkField('passport_issued_place', 'Tempat Dikeluarkan wajib diisi');
    checkField('passport_issued_date', 'Tanggal Dikeluarkan wajib diisi');
    checkField('passport_expire_date', 'Tanggal Berakhir wajib diisi');
    checkField('indonesia_job', 'Pekerjaan di Indonesia wajib diisi');
    checkField('abroad_job', 'Pekerjaan di Luar Negeri wajib diisi');
    checkField('work_address', 'Alamat Pekerjaan wajib diisi');
    checkField('postal_code', 'Kode Pos wajib diisi');
    checkField('city', 'Kota Alamat wajib dipilih');
    checkField('origin_country', 'Negara Asal wajib diisi');
    checkField('phone', 'Nomor Telepon wajib diisi');
  } else if (step === 3) {
    checkField('valid_until', 'Tanggal Permohonan wajib diisi');
    checkField('price', 'Harga wajib diisi');
  }
  return isValid;
};

// Fungsi navigasi antar langkah
const nextStep = () => {
  if (validateStep(currentStep.value)) {
    if (currentStep.value < totalSteps) currentStep.value++;
  } else {
    displayNotification('Harap lengkapi semua field yang wajib diisi.', 'error');
  }
};
const prevStep = () => { if (currentStep.value > 1) currentStep.value--; };

// Fungsi untuk mereset dan menutup form
const resetFormAndClose = () => {
  currentStep.value = 1;
  Object.assign(form, {
    invoice: '',
    payer: '', payer_identity: '', gender: '', birth_place: '', birth_date: '', nationality: '',
    jenis_visa: 'VISA SINGGAH', passport_number: '', passport_issued_place: '', passport_issued_date: '',
    passport_expire_date: '', indonesia_job: '', abroad_job: '', work_address: '',
    postal_code: '', city: '', origin_country: '', phone: '',
    valid_until: '', price: 0, payment_method: false, name: '', identity_number: '',
  });
  errors.value = {};
  showNotification.value = false; 
  emit('close');
};

// Fungsi untuk generate invoice baru
const generateNewInvoice = () => {
  form.invoice = generateInvoiceCode();
};

// Fungsi utama untuk menyimpan data ke backend
const saveData = async () => {
  if (!validateStep(currentStep.value)) {
    displayNotification('Harap lengkapi semua field yang wajib diisi.', 'error');
    return;
  }
  
  // Generate invoice jika belum ada
  if (!form.invoice) {
    form.invoice = generateInvoiceCode();
  }
  
  isLoading.value = true;
  try {
    form.name = form.payer;
    form.identity_number = form.payer_identity;
    const response = await addTransaksiVisa(form);

    if (response.success) {
      const successMessage = `Menambahkan Transaksi Visa Baru dengan Invoice : ${form.invoice}`;
      emit('save-success', successMessage);
      resetFormAndClose(); 
    } else {
      displayNotification(response.error_msg || 'Gagal menambahkan transaksi', 'error');
    }
  } catch (error: any) {
    console.error('Error adding transaction:', error);
    
    let errorMessage = 'Terjadi kesalahan jaringan';
    
    if (error?.response?.data?.error_msg) {
      errorMessage = error.response.data.error_msg;
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    displayNotification(errorMessage, 'error');
  } finally {
    isLoading.value = false;
  }
};

// Mengambil data kota saat komponen dimuat dan generate invoice
onMounted(async () => {
  form.invoice = generateInvoiceCode();
  
  // Ambil data kota
  const citiesFromApi = await getCityList();
  if (citiesFromApi && citiesFromApi.length > 0) {
    cityOptions.value = citiesFromApi.map((city: CityOption) => ({
      value: city.id,
      label: `${city.name} (${city.kode})`
    }));
  }

  // Ambil data jenis visa
  const visaTypesFromApi = await getVisaTypesList();
  if (visaTypesFromApi && visaTypesFromApi.length > 0) {
    visaTypeOptions.value = visaTypesFromApi.map((visaType: any) => ({
      value: visaType.name, 
      label: visaType.name
    }));
  }
});

// Helper format harga
const formatPrice = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
const unformatPrice = (formatted: string) => parseInt(formatted.replace(/[^\d]/g, ''), 10) || 0;
</script>

<template>
  <div v-if="isFormOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center px-4">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm" @click="resetFormAndClose"></div>
      
      <div class="relative w-full max-w-3xl transform rounded-2xl bg-white text-left shadow-2xl transition-all">
        <div class="bg-white px-6 py-4 border-b border-gray-200 rounded-t-2xl flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-800">Tambah Transaksi Visa</h3>
            <button @click="resetFormAndClose" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <div class="px-6 py-5">
            <div class="flex items-center">
                <template v-for="step in totalSteps" :key="step">
                <div class="flex items-center" :class="step <= currentStep ? 'text-gray-800' : 'text-gray-400'">
                    <div class="w-8 h-8 flex items-center justify-center rounded-full border-2 font-bold" :class="step <= currentStep ? 'border-gray-800 bg-gray-100' : 'border-gray-300'">{{ step }}</div>
                    <div class="ml-3 text-sm font-semibold">
                    <span v-if="step === 1">Info Pelanggan</span>
                    <span v-if="step === 2">Info Permohonan</span>
                    <span v-if="step === 3">Biaya & Aksi</span>
                    </div>
                </div>
                <div v-if="step < totalSteps" class="flex-auto border-t-2 mx-4" :class="step < currentStep ? 'border-gray-800' : 'border-gray-300'"></div>
                </template>
            </div>
        </div>

        <div class="px-6 py-6 max-h-[60vh] overflow-y-auto space-y-6 border-t">
          
          <div v-show="currentStep === 1" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Nama Pelanggan" v-model="form.payer" :error="errors.payer" :required="true" />
              <FormInput label="Nomor Identitas" v-model="form.payer_identity" placeholder="KTP/Passport" :error="errors.payer_identity" :required="true" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormSelect label="Jenis Kelamin" v-model="form.gender" :options="genders" :error="errors.gender" :required="true" />
              <FormInput label="Tempat Lahir" v-model="form.birth_place" :error="errors.birth_place" :required="true" />
              <FormInput label="Tanggal Lahir" v-model="form.birth_date" type="date" :error="errors.birth_date" :required="true" />
            </div>
            <FormInput label="Kewarganegaraan" v-model="form.nationality" :error="errors.nationality" :required="true" />
          </div>

          <div v-show="currentStep === 2" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect label="Jenis Permohonan Visa" v-model="form.jenis_visa" :options="visaTypeOptions" :required="true" :error="errors.jenis_visa"/>
              <FormInput label="Nomor Passport" v-model="form.passport_number" :error="errors.passport_number" :required="true" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput label="Tempat Dikeluarkan Passport" v-model="form.passport_issued_place" :required="true" :error="errors.passport_issued_place"/>
              <FormInput label="Tgl Dikeluarkan Passport" v-model="form.passport_issued_date" type="date" :required="true" :error="errors.passport_issued_date"/>
              <FormInput label="Tgl Berakhir Passport" v-model="form.passport_expire_date" type="date" :required="true" :error="errors.passport_expire_date"/>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Pekerjaan di Indonesia" v-model="form.indonesia_job" :required="true" :error="errors.indonesia_job"/>
              <FormInput label="Pekerjaan di Luar Negeri" v-model="form.abroad_job" :required="true" :error="errors.abroad_job"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-800">Alamat Pekerjaan <span class="text-red-500">*</span></label>
              <textarea v-model="form.work_address" rows="2" class="w-full mt-1 px-3 py-2 border rounded-md text-black" :class="errors.work_address ? 'border-red-500' : 'border-gray-300'"></textarea>
               <p v-if="errors.work_address" class="text-sm text-red-600 mt-1">{{ errors.work_address }}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Kode Pos" v-model="form.postal_code" :required="true" :error="errors.postal_code"/>
              <FormSelect label="Kota Alamat" v-model="form.city" :options="cityOptions" :required="true" :error="errors.city"/>
              <FormInput label="Negara Asal" v-model="form.origin_country" :required="true" :error="errors.origin_country"/>
              <FormInput label="Nomor Telepon" v-model="form.phone" :error="errors.phone" :required="true" />
            </div>
          </div>

          <div v-show="currentStep === 3" class="space-y-4">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Tanggal Permohonan Visa" v-model="form.valid_until" type="date" :error="errors.valid_until" :required="true" />
                <div>
                  <label class="block text-sm font-medium text-gray-800">Harga Per Paket <span class="text-red-500">*</span></label>
                  <input type="text" :value="formatPrice(form.price)" @input="form.price = unformatPrice(($event.target as HTMLInputElement).value)" class="w-full mt-1 px-3 py-2 border rounded-md font-semibold text-black" :class="errors.price ? 'border-red-500' : 'border-gray-300'"/>
                  <p v-if="errors.price" class="text-sm text-red-600 mt-1">{{ errors.price }}</p>
                </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-800">Aksi</label>
              <div class="mt-2 flex items-center gap-3 p-3 border border-gray-200 rounded-md">
                <input id="pembayar" type="checkbox" v-model="form.payment_method" class="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"/>
                <label for="pembayar" class="text-sm font-medium text-gray-800">Pembayar</label>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 flex items-center justify-between rounded-b-2xl">
          <div class="flex items-center gap-3">
            <button @click="resetFormAndClose" type="button" class="px-6 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 font-semibold transition-colors duration-200">Cancel</button>
            <button v-if="currentStep > 1" @click="prevStep" type="button" class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">Kembali</button>
          </div>
          <div>
            <PrimaryButton v-if="currentStep < totalSteps" @click="nextStep">Selanjutnya</PrimaryButton>
            <PrimaryButton v-if="currentStep === totalSteps" @click="saveData" :is-loading="isLoading">Simpan Transaksi</PrimaryButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Component -->
    <Notification 
      v-if="showNotification" 
      :show-notification="showNotification"
      :notification-message="notificationMessage" 
      :notification-type="notificationType"
      @close="showNotification = false" 
    />
  </div>
</template>