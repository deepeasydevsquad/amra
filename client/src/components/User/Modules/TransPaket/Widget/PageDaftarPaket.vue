<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getDaftarPaket } from '@/service/trans_paket'
import Notification from '@/components/User/Modules/TransPaket/Particle/Notification.vue'
const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL

interface Paket {
  id: number
  name: string
  kode: string
  photo: string
  durasi: number
  departure_date: string
  prices: {
    min: number
    max: number
  }
  total_jamaah: number
}

const isLoading = ref(false)
const daftarPaket = ref<Paket[]>([])
const notificationMessage = ref<string>('');
const notificationType = ref<'success' | 'error'>('success');
const showNotification = ref<boolean>(false);
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

const fetchDaftarPaket = async () => {
  isLoading.value = true
  try {
    const response = await getDaftarPaket()
    daftarPaket.value = response.data
  } catch (error) {
    console.error('Error fetching daftar paket:', error);
    displayNotification(error?.response?.data?.error_msg || 'Gagal memuat daftar paket', 'error');
  } finally {
    isLoading.value = false
  }
}

const emit = defineEmits<{
  (e: 'showDetailPaket', paketId: number): void
}>()

const handleBeliPaket = (id: number) => {
  emit('showDetailPaket', id)
}

const formatPrice = (price: number) => {
  if (price === 0) return 'Rp 0';
  const priceInMillions = price / 1_000_000;
  return `Rp ${priceInMillions.toFixed(1)}jt`;
};

onMounted(() => {
  fetchDaftarPaket()
})
</script>

<template>
  <div class="p-4 bg-white rounded-b-lg shadow-md text-gray-800">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="paket in daftarPaket"
          :key="paket.id"
          class="bg-white border rounded-lg shadow-sm hover:shadow-md transition"
        >
          <div
            class="relative w-full h-96 rounded-t-lg bg-gray-200"
            :class="{ 'bg-gray-300': !paket.photo || paket.photo === '-' }"
          >
            <img
              v-if="paket.photo && paket.photo !== '-'"
              :src="BASE_URL + paket.photo"
              :alt="`Foto Paket ${paket.name}`"
              class="w-full h-full object-cover"
                          @error="paket.photo = '-'"
            />
            <div
              v-else
              class="absolute inset-0 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-400"
            >
              <p class="text-xl font-semibold">Gambar tidak ditemukan</p>
            </div>
          </div>
          <h3 class="p-2 text-lg font-bold text-center">{{ paket.name }}</h3>
          <div class="pr-4 pl-4 space-y-8 pb-8 pt-4">
            <div class="grid grid-cols-2 gap-y-3 text-sm">
              <div class="flex items-center gap-1">
                <font-awesome-icon :icon="['fas', 'qrcode']" class="w-4 h-4 text-gray-600" />
                <span>Kode Paket</span>
              </div>
              <div class="ml-6 font-semibold">{{ paket.kode }}</div>

              <div class="flex items-center gap-1">
                <font-awesome-icon :icon="['fas', 'calendar']" class="w-4 h-4 text-gray-600" />
                <span>Jdwl. Berangkat</span>
              </div>
              <div class="ml-6 font-semibold">{{ paket.departure_date }}</div>

              <div class="flex items-center gap-1">
                <font-awesome-icon :icon="['far', 'clock']" class="w-4 h-4 text-gray-600" />
                <span>Durasi Perjalanan</span>
              </div>
              <div class="ml-6 font-semibold">{{ paket.durasi }} Hari</div>

              <div class="flex items-center gap-1">
                <font-awesome-icon :icon="['far', 'user']" class="w-4 h-4 text-gray-600" />
                <span>Total Jamaah</span>
              </div>
              <div class="ml-6 font-semibold">{{ paket.total_jamaah }} Orang</div>

              <div class="flex items-center gap-1">
                <font-awesome-icon :icon="['fas', 'money-bill']" class="w-4 h-4 text-gray-600" />
                <span>Harga</span>
              </div>
              <div class="flex flex-col">
                <span class="ml-6 font-semibold text-blue-600">
                  {{ formatPrice(paket.prices.min) }}
                </span>
                <span
                  v-if="paket.prices.min !== paket.prices.max"
                  class="ml-6 font-semibold text-blue-600"
                >
                  {{ formatPrice(paket.prices.max) }}
                </span>
              </div>
            </div>
            <button
              @click="handleBeliPaket(paket.id)"
              class="mt-3 w-full px-3 py-2 border border-[#455494] text-[#455494] rounded hover:bg-[#455494] hover:text-white transition"
            >
              Beli Paket
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Notification
    :showNotification="showNotification"
    :notificationType="notificationType"
    :notificationMessage="notificationMessage"
    @close="showNotification = false"
  />
</template>
