<script setup lang="ts">
import Form from '@/components/Modal/Form.vue'
import InputText from '@/components/Form/InputText.vue'
import SelectField from '@/components/Form/SelectField.vue'
import { add_stock, get_sumber_dana } from '@/service/daftar_stock_fasilitas'
import { ref, computed, onMounted, watch } from 'vue'

const emit = defineEmits(['close', 'success'])
const props = defineProps<{
  idFasilitas: number | null,
  showForm:boolean
}>()

const form = ref({
  fasilitas_id: props.idFasilitas,
  jumlah: 0,
  harga_beli: 0,
  harga_jual: 0,
})

watch(
  () => props.idFasilitas,
  (val) => {
    form.value.fasilitas_id = val
  },
  { immediate: true },
)

interface optionInterface {
  id: number
  name: string
}

const hargaBeliDisplay = ref('')
const hargaJualDisplay = ref('')
const selectedSumberDana = ref(0);
const optionSumberDana = ref<optionInterface[]>([])

watch(
  () => form.value.harga_beli,
  (val) => {
    hargaBeliDisplay.value = formatRupiah(val)
  },
)

watch(
  () => form.value.harga_jual,
  (val) => {
    hargaJualDisplay.value = formatRupiah(val)
  },
)

watch(hargaBeliDisplay, (val) => {
  form.value.harga_beli = parseRupiah(val)
})

watch(hargaJualDisplay, (val) => {
  form.value.harga_jual = parseRupiah(val)
})

function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value || 0)
}

function parseRupiah(value: string): number {
  return parseInt(value.replace(/[^0-9]/g, '')) || 0
}

const handleSubmit = async () => {
  try {
    const payload = {
      jumlah: form.value.jumlah,
      mst_fasilitas_id: form.value.fasilitas_id,
      harga_beli: form.value.harga_beli,
      harga_jual: form.value.harga_jual,
      sumber_dana: selectedSumberDana.value,
    }
    await add_stock(payload)
    emit('success')
  } catch (error: any) {
    console.error('Gagal tambah stok:', error)
  }
}

const fetchData = async () => {
  try {
    const response = await get_sumber_dana()
    optionSumberDana.value = response.data
  } catch (error) {
    console.error('Gagal fetch data level agen:', error)
  }
}

watch(
  () => props.showForm,
  () => {
    console.log('ID Fasilitas berubah:', props.idFasilitas)
    fetchData();
  },
)
</script>
<template>
  <Form :formStatus="showForm" :label="'Tambah Stok Fasilitas'" :width="'w-full max-w-md'" :submitLabel="'Tambah Stok'" @cancel="emit('close')" @submit="handleSubmit">
    <SelectField v-model="selectedSumberDana" label="Sumber Dana" placeholder="Pilih Sumber Dana" class="mt-4" :options="optionSumberDana" optionLabel="nama" optionValue="id"/>
    <InputText v-model="form.jumlah" label="Jumlah" placeholder="Masukkan jumlah" class="mt-4" required/>
    <InputText v-model="hargaBeliDisplay" label="Harga Beli Per Satuan" placeholder="Masukkan harga beli"  class="mt-4"  required />
    <InputText v-model="hargaJualDisplay" label="Harga Jual Per Satuan" placeholder="Masukkan harga jual"  class="mt-4" required />
  </Form>
</template>
