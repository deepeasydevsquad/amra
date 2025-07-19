<script setup lang="ts">
import Form from '@/components/Modal/Form.vue'
import { ref, watch, onMounted } from 'vue'
import { get_detail } from '@/service/trans_tiket'

const props = defineProps<{
  nomor_register: string
}>()

const data = ref({
  nomor_register: '',
  riwayat_pembayaran: [],
})

const isLoading = ref(false)

watch(
  () => props.nomor_register,
  async (newVal) => {
    if (newVal) {
      isLoading.value = true // jangan lupa start loading
      try {
        const res = await get_detail({ nomor_register: newVal })

        if (res?.riwayat_pembayaran) {
          data.value = res
        } else {
          data.value = {
            nomor_register: newVal,
            riwayat_pembayaran: [],
          }
        }
      } catch (err) {
        console.error('❌ Gagal ambil detail:', err)
        data.value = {
          nomor_register: newVal,
          riwayat_pembayaran: [],
        }
      } finally {
        isLoading.value = false
      }
    }
  },
  { immediate: true },
)

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submitted'): void
}>()
</script>

<template>
  <Form :label="'Detail Pembayaran Tiket'" :width="'w-1/2'" @cancel="emit('cancel')">
    <div class="text-base font-semibold text-gray-800 mb-4">
      Nomor Register: {{ props.nomor_register }}
    </div>

    <div v-if="isLoading" class="text-center py-6 text-gray-500">Loading...</div>

    <table
      v-else-if="data && data.riwayat_pembayaran"
      class="w-full border-collapse bg-white text-center text-sm text-gray-500"
    >
      <thead class="bg-gray-100 text-gray-800">
        <tr>
          <th class="px-4 py-2 border-b">Invoice</th>
          <th class="px-4 py-2 border-b">Nama Kostumer</th>
          <th class="px-4 py-2 border-b">Petugas</th>
          <th class="px-4 py-2 border-b text-right">Nominal</th>
          <th class="px-4 py-2 border-b">Status</th>
        </tr>
      </thead>
      <tbody v-if="data.riwayat_pembayaran.length > 0">
        <tr v-for="(item, index) in data.riwayat_pembayaran" :key="index" class="hover:bg-gray-50">
          <td class="px-4 py-2 border-b text-center">
            <div class="font-medium text-gray-800">
              {{ item.invoice }}
            </div>
            <div class="text-xs text-gray-500">
              {{ item.tanggal_transaksi }}
            </div>
          </td>

          <td class="px-4 py-2 border-b">
            {{ item.customer_name }}
          </td>
          <td class="px-4 py-2 border-b">{{ item.petugas }}</td>
          <td class="px-4 py-2 border-b">
            <div class="flex justify-end gap-1">
              <span>Rp</span>
              <span>{{ item.nominal.toLocaleString() }}</span>
            </div>
          </td>

          <td class="px-4 py-2 border-b capitalize">{{ item.status }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="5" class="text-center py-4 text-gray-500">Belum ada riwayat pembayaran.</td>
        </tr>
      </tbody>
    </table>

    <div v-else class="text-center py-4 text-red-500">Gagal memuat data riwayat pembayaran.</div>
  </Form>
</template>
