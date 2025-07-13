<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import PrimaryButton from '@/components/Button/PrimaryButton.vue'
import { addTransaksiPassport, getCityList } from '@/service/transaksi_passport'
import { onMounted, ref } from 'vue'
import Form from '@/components/Modal/FormEditProfile.vue'
import InputText from '@/components/Form/InputText.vue'
import InputDate from '@/components/Form/InputDate.vue'
import SelectField from '@/components/Form/SelectField.vue'
import TextArea from '@/components/Form/TextArea.vue'
import LightButton from '@/components/Button/LightButton.vue'
import DangerButton from '@/components/Button/DangerButton.vue'
import DeleteIcon from '@/components/Icons/DeleteIcon.vue'

const props = defineProps<{ isFormOpen: boolean }>()
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'save-success', message: string): void
}>()

const handleCancel = () => {
  emit('cancel')
}

const cityList = ref<city[]>([])

interface city {
  id: string
  name: string
  kode: string
}

const formList = ref([
  {
    name: '',
    identity: '',
    kkNumber: '',
    birthPlace: '',
    birthDate: '',
    cityId: '',
    address: '',
    price: '',
  },
])

const addRow = () => {
  formList.value.push({
    name: '',
    identity: '',
    kkNumber: '',
    birthPlace: '',
    birthDate: '',
    cityId: '',
    address: '',
    price: '',
  })
}

const fetch_kota = async () => {
  try {
    const res = await getCityList()
    cityList.value = res
  } catch (error) {
    console.error('error getCityList:', error)
  }
}
onMounted(fetch_kota)

const cityOptions = computed(() => [
  { id: '', name: 'Pilih Kota' }, // ini buat default/null
  ...cityList.value.map((item) => ({
    id: item.id,
    name: `${item.name} - ${item.kode}`,
  })),
])

const payerIndex = ref<number | null>(0) // default ke index pertama, bisa null juga

const handleSubmit = async () => {
  if (!validateForm()) return

  const payerData = formList.value[payerIndex.value!]

  const payload = {
    payer: payerData.name,
    payer_identity: payerData.identity,
    passport_details: formList.value.map((item) => ({
      name: item.name,
      identity_number: item.identity,
      birth_place: item.birthPlace,
      birth_date: item.birthDate,
      kk_number: item.kkNumber,
      address: item.address,
      city: parseInt(item.cityId),
      price: item.price,
    })),
  }

  try {
    const res = await addTransaksiPassport(payload)
    emit('save-success', 'Berhasil tambah transaksi passport!')
  } catch (err) {
    console.error('Gagal kirim transaksi:', err)
    alert('Gagal menyimpan transaksi, coba lagi.')
  }
}

const formatRupiah = (value: string | number): string => {
  let num = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value
  if (isNaN(num)) return ''
  return 'Rp ' + num.toLocaleString('id-ID')
}

const parseRupiah = (formatted: string): number => {
  const clean = formatted.replace(/[^0-9]/g, '')
  return parseInt(clean || '0')
}

const errors = ref<Record<number, Record<string, string>>>({})
const validateForm = (): boolean => {
  let isValid = true
  errors.value = {}

  formList.value.forEach((form, index) => {
    const rowErrors: Record<string, string> = {}

    if (!form.name) {
      rowErrors.name = 'Nama wajib diisi.'
      isValid = false
    }
    if (!form.identity) {
      rowErrors.identity = 'Identitas wajib diisi.'
      isValid = false
    }
    if (!form.kkNumber) {
      rowErrors.kkNumber = 'Nomor KK wajib diisi.'
      isValid = false
    }
    if (!form.birthPlace) {
      rowErrors.birthPlace = 'Tempat lahir wajib diisi.'
      isValid = false
    }
    if (!form.birthDate) {
      rowErrors.birthDate = 'Tanggal lahir wajib diisi.'
      isValid = false
    }
    if (!form.cityId) {
      rowErrors.cityId = 'Kota wajib dipilih.'
      isValid = false
    }
    if (!form.address) {
      rowErrors.address = 'Alamat wajib diisi.'
      isValid = false
    }
    if (!form.price || parseInt(form.price.toString()) <= 0) {
      rowErrors.price = 'Harga wajib diisi dan lebih dari 0.'
      isValid = false
    }

    if (Object.keys(rowErrors).length > 0) {
      errors.value[index] = rowErrors
    }
  })

  if (payerIndex.value === null || formList.value[payerIndex.value] === undefined) {
    alert('Silakan pilih siapa yang membayar dulu!')
    isValid = false
  }

  return isValid
}
</script>

<template>
  <Form
    title="'Tambah Transaksi Passport'"
    :form-status="props.isFormOpen"
    :submitLabel="'TAMBAH TRANSAKSI'"
    :width="'w-2/3'"
    @cancel="handleCancel"
    @submit="handleSubmit"
  >
    <table class="table-auto w-full">
      <thead class="bg-gray-100 text-sm text-gray-700">
        <tr class="text-center">
          <th class="w-[30%] px-4 font-medium py-3">Info Pelanggan</th>
          <th class="w-[30%] px-4 font-medium py-3">Info Alamat pelanggan</th>
          <th class="w-[30%] px-4 font-medium py-3">Biaya</th>
          <th class="w-[10%] px-4 font-medium py-3">Aksi</th>
        </tr>
      </thead>
      <tbody class="text-sm">
        <tr class="bg-white border-b" v-for="(form, index) in formList" :key="index">
          <td class="w-[30%] px-4 py-3">
            <InputText
              note="Nama Pelanggan"
              placeholder="Masukkan Nama Pelanggan"
              v-model="form.name"
              :error="errors[index]?.name"
            />
            <InputText
              note="Identitas Pelanggan"
              placeholder="Masukkan Identitas"
              v-model="form.identity"
              :error="errors[index]?.identity"
            />
            <InputText
              note="Nomor KK"
              placeholder="Masukkan Nomor KK"
              v-model="form.kkNumber"
              :error="errors[index]?.kkNumber"
            />
            <InputText
              note="Tempat Lahir"
              placeholder="Masukkan Tempat Lahir"
              v-model="form.birthPlace"
              :error="errors[index]?.birthPlace"
            />
            <InputDate
              note="Tanggal Lahir"
              v-model="form.birthDate"
              :error="errors[index]?.birthDate"
            />
          </td>
          <td class="w-[30%] px-4 py-3 align-top">
            <SelectField
              note="Nama Kota"
              placeholder="Pilih Kota"
              :options="cityOptions"
              v-model="form.cityId"
              optionLabel="name"
              optionValue="id"
              :error="errors[index]?.cityId"
            />
            <TextArea
              note="Alamat Pelanggan"
              placeholder="Masukkan Alamat"
              v-model="form.address"
              :error="errors[index]?.address"
            />
          </td>
          <td class="w-[30%] px-4 py-3 align-top">
            <InputText
              note="Biaya"
              placeholder="Masukkan Biaya"
              :model-value="formatRupiah(form.price)"
              @update:model-value="(val) => (form.price = parseRupiah(val))"
              :error="errors[index]?.price"
            />
          </td>
          <td class="w-[10%] px-4 py-5 align-top text-gray-800 items-center">
            <DangerButton @click="formList.splice(index, 1)">
              <DeleteIcon />
            </DangerButton>
            <label class="inline-flex items-center mt-2">
              <input
                type="radio"
                :name="'payer'"
                class="form-radio text-blue-600"
                :value="index"
                v-model="payerIndex"
              />
              <span class="ml-2 text-sm">Pembayar</span>
            </label>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-end mt-4 pr-6">
      <PrimaryButton @click="addRow">+ Tambah Pelanggan</PrimaryButton>
    </div>
  </Form>
</template>
