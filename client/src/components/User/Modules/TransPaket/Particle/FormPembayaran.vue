<script setup lang="ts">
import Form from '@/components/Modal/FormEditProfile.vue'
import { ref, watch, computed, onMounted } from 'vue'
import { get_fee_by_agen, add_pembayaran } from '@/service/pembayaran_fee_agen_paket'

const props = defineProps<{
  agen_id: number
  formStatus: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submitted'): void
}>()

const listFee = ref<any[]>([])
const loading = ref(false)
const selectedIds = ref<number[]>([])

watch(
  () => props.formStatus,
  async (val) => {
    if (val && props.agen_id) {
      loading.value = true
      try {
        const res = await get_fee_by_agen({ agen_id: props.agen_id })
        listFee.value = res
        selectedIds.value = []
      } catch (err) {
        console.error('Gagal ambil data fee:', err)
        listFee.value = []
      } finally {
        loading.value = false
      }
    }
  },
)

const toggleSelection = (id_fee_agen: number) => {
  if (selectedIds.value.includes(id_fee_agen)) {
    selectedIds.value = selectedIds.value.filter((x) => x !== id_fee_agen)
  } else {
    selectedIds.value.push(id_fee_agen)
  }
}

const submitPembayaran = async (selectedFeeIds: number[]) => {
  if (!selectedFeeIds.length) {
    alert('Pilih minimal satu fee dulu.')
    return
  }

  const selectedFeeItems = listFee.value.filter((item) => selectedFeeIds.includes(item.id_fee_agen))

  const total = selectedFeeItems.reduce((acc, item) => acc + item.nominal_fee, 0)

  const payload = {
    agen_id: props.agen_id,
    fee_agen_id: selectedFeeIds,
    nominal: total,
  }

  console.log('📤 Payload:', payload)

  try {
    const res = await add_pembayaran(payload)
    console.log('✅ Sukses bayar:', res)
    emit('submitted')
  } catch (err) {
    console.error('❌ Gagal bayar:', err)
  }
}

const totalNominal = computed(() =>
  listFee.value
    .filter((item) => selectedIds.value.includes(item.id_fee_agen)) // ✅ HARUS id_fee_agen
    .reduce((acc, item) => acc + item.nominal_fee, 0),
)

onMounted(() => {
  console.log('🛠 ID Fee Agen yang akan diupdate:', selectedIds)
})
</script>

<template>
  <Form
    :formStatus="props.formStatus"
    :label="'Form Pembayaran Fee Agen'"
    :width="'w-5/6'"
    :submitLabel="'Bayar'"
    @submit="submitPembayaran(selectedIds)"
    @cancel="() => emit('cancel')"
  >
    <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
      <thead class="bg-gray-100 border-t border-b">
        <tr>
          <th class="text-center font-medium px-6 text-gray-900 py-3 text-sm w-[30%]">INFO AGEN</th>
          <th class="text-center font-medium px-6 text-gray-900 py-3 text-sm w-[30%]">
            INFO TRANSAKSI
          </th>
          <th class="text-center font-medium px-6 text-gray-900 py-3 text-sm w-[30%]">INFO FEE</th>
          <th class="text-center font-medium px-6 text-gray-900 py-3 text-sm w-[10%]">AKSI</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in listFee" :key="index" class="border-b align-top">
          <!-- INFO AGEN -->
          <td class="px-4 py-2 text-left align-top">
            <div class="py-1">
              <span class="inline-block w-28 font-bold">Nama</span>: {{ item.nama_agen }}
            </div>
            <div class="py-1">
              <span class="inline-block w-28 font-bold">Level</span>: {{ item.level_agen }}
            </div>
            <div class="py-1">
              <span class="inline-block w-28 font-bold">WhatsApp</span>: {{ item.no_wa_agen }}
            </div>
          </td>

          <!-- INFO TRANSAKSI -->
          <td class="px-4 py-2 text-left align-top">
            <div class="py-1">
              <span class="inline-block w-28 font-bold">Nama Jamaah</span>: {{ item.nama_jamaah }}
            </div>
            <div class="py-1">
              <span class="inline-block w-28 font-bold">NIK</span>: {{ item.no_identitas_jamaah }}
            </div>
            <div class="py-1">
              <span class="inline-block w-28 font-bold">Kode Paket</span>: {{ item.kode_paket }}
            </div>
            <div class="py-1">
              <span class="inline-block w-28 font-bold">Paket</span>: {{ item.nama_paket }}
            </div>
          </td>

          <!-- INFO FEE -->
          <td class="px-4 py-2 text-left align-top">
            <div class="py-1">
              <span class="inline-block w-28 font-bold">Nominal</span>: Rp
              {{ item.nominal_fee.toLocaleString('id-ID') }}
            </div>
            <div class="py-1">
              <span class="inline-block w-28 font-bold">Status</span>:
              <span
                :class="
                  item.status_bayar === 'lunas'
                    ? 'text-green-600 font-semibold'
                    : 'text-red-600 font-semibold'
                "
              >
                {{ item.status_bayar.replace(/_/g, ' ').toUpperCase() }}
              </span>
            </div>
          </td>

          <!-- AKSI -->
          <td class="px-4 py-4 text-left align-center">
            <template v-if="item.status_bayar === 'lunas'">
              <span class="text-green-600 font-semibold text-sm text-center">Sudah Dibayar</span>
            </template>
            <template v-else>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  :value="item.id_fee_agen"
                  :checked="selectedIds.includes(item.id_fee_agen)"
                  @change="toggleSelection(item.id_fee_agen)"
                  class="accent-black w-4 h-4"
                />
                <span class="text-sm text-gray-600 font-semibold">Pilih</span>
              </label>
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="listFee.length === 0 && !loading" class="text-center text-sm text-gray-500 py-6">
      Tidak ada data fee untuk agen ini.
    </div>

    <div
      v-if="selectedIds.length > 0"
      class="flex justify-start items-center gap-4 pt-4 mt-4 text-sm"
      :style="{ paddingLeft: '60%' }"
    >
      <div class="font-semibold text-gray-600">Total Fee Dibayar:</div>
      <div class="text-gray-600 font-bold text-lg">
        Rp {{ totalNominal.toLocaleString('id-ID') }}
      </div>
    </div>
  </Form>
</template>
