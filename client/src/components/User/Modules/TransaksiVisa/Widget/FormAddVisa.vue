<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import FormEditProfile from '@/components/Modal/FormEditProfile.vue'
import InputText from '@/components/Form/InputText.vue'
import InputDate from '@/components/Form/InputDate.vue'
import SelectField from '@/components/Form/SelectField.vue'
import InputCurrency from '@/components/Form/InputCurrency.vue'
import TextArea from '@/components/Form/TextArea.vue'
import Notification from '@/components/Modal/Notification.vue'
import PrimaryButton from '@/components/Button/PrimaryButton.vue'
import DangerButton from '@/components/Button/DangerButton.vue'
import DeleteIcon from '@/components/Icons/DeleteIcon.vue'
import { getCityList, getVisaTypesList, addTransaksiVisa } from '@/service/transaksi_visa'

// Props & Emit
const props = defineProps<{ formStatus: boolean }>()
const emit = defineEmits(['cancel', 'submitted', 'notify'])

// Static options
const JenisKelaminOptions = [
  { id: '', name: '-- Pilih Jenis Kelamin --' },
  { id: 'laki_laki', name: 'Laki-laki' },
  { id: 'perempuan', name: 'Perempuan' },
]

// Dynamic Options
const visaTypeOptions = ref<{ id: number; name: string }[]>([])
const cityOptions = ref<{ id: number; name: string }[]>([])

// List of form rows
const rows = ref([
  {
    name: '',
    identity_number: '',
    gender: '',
    birth_place: '',
    birth_date: '',
    jenis_visa: 0,
    visa_date: '',
    passport_number: '',
    passport_issued_date: '',
    passport_issued_place: '',
    passport_expire_date: '',
    indonesia_job: '',
    abroad_job: '',
    work_address: '',
    postal_code: '',
    city_id: 0,
    origin_country: '',
    phone: '',
    price: 0,
    is_payer: false,
  },
])

// Get options
onMounted(async () => {
  try {
    const visa = await getVisaTypesList()
    const city = await getCityList()

    visaTypeOptions.value = [
      { id: 0, name: '-- Pilih Jenis Visa --' },
      ...visa.map((v: any) => ({ id: v.id, name: v.name })),
    ]

    cityOptions.value = [
      { id: 0, name: '-- Pilih Kota --' },
      ...city.map((c: any) => ({ id: c.id, name: `${c.name} (${c.kode})` })),
    ]
  } catch (err) {
    emit('notify', {
      type: 'error',
      message: 'Gagal mengambil data kota atau visa',
    })
  }
})

// Add Row
const addRow = () => {
  rows.value.push({
    name: '',
    identity_number: '',
    gender: '',
    birth_place: '',
    birth_date: '',
    jenis_visa: 0,
    visa_date: '',
    passport_number: '',
    passport_issued_date: '',
    passport_issued_place: '',
    passport_expire_date: '',
    indonesia_job: '',
    abroad_job: '',
    work_address: '',
    postal_code: '',
    city_id: 0,
    origin_country: '',
    phone: '',
    price: 0,
    is_payer: false,
  })
}

// Remove Row
const removeRow = (index: number) => {
  rows.value.splice(index, 1)
}

// Submit
const submit = async () => {
  const validData = rows.value.filter((r) => r.name && r.identity_number)
  const payer = rows.value.find((r) => r.is_payer)

  if (!payer) {
    emit('notify', { type: 'error', message: 'Pilih salah satu pembayar' })
    return
  }

  const payload = {
    details: validData.map((r) => ({
      name: r.name,
      identity_number: r.identity_number,
      gender: r.gender,
      birth_place: r.birth_place,
      birth_date: r.birth_date,
      nationality: r.origin_country,
      jenis_visa: r.jenis_visa,
      passport_number: r.passport_number,
      passport_issued_date: r.passport_issued_date,
      passport_issued_place: r.passport_issued_place,
      passport_expire_date: r.passport_expire_date,
      indonesia_job: r.indonesia_job,
      abroad_job: r.abroad_job,
      work_address: r.work_address,
      postal_code: r.postal_code,
      city: r.city_id,
      origin_country: r.origin_country,
      phone: r.phone,
      price: r.price,
      status_pembayaran: r.is_payer || false,
    })),
  }
  console.log(payload)
  try {
    const res = await addTransaksiVisa(payload)

    emit('submitted') // trigger buat nutup modal & refresh data
    resetForm()
  } catch (err: any) {
    console.error('❌ Gagal kirim transaksi:', err)
    emit('notify', { type: 'error', message: err.message || 'Gagal menyimpan transaksi visa.' })
  }
}

const resetForm = () => {
  rows.value = [
    {
      name: '',
      identity_number: '',
      gender: '',
      birth_place: '',
      birth_date: '',
      jenis_visa: 0,
      visa_date: '',
      passport_number: '',
      passport_issued_date: '',
      passport_issued_place: '',
      passport_expire_date: '',
      indonesia_job: '',
      abroad_job: '',
      work_address: '',
      postal_code: '',
      city_id: 0,
      origin_country: '',
      phone: '',
      price: 0,
      is_payer: false,
    },
  ]
}
</script>

<template>
  <FormEditProfile
    :formStatus="formStatus"
    label="Tambah Transaksi Visa"
    submitLabel="Simpan"
    width="w-4/5"
    @cancel="emit('cancel') || resetForm()"
    @submit="submit"
  >
    <table class="w-full border-collapse bg-white text-left text-sm text-gray-700">
      <thead class="bg-gray-50">
        <tr>
          <th class="text-center px-6 py-4 w-[25%]">Info Pelanggan</th>
          <th class="text-center px-6 py-4 w-[45%]">Info Permohonan Visa</th>
          <th class="text-center px-6 py-4 w-[20%]">Pembayaran</th>
          <th class="text-center px-6 py-4 w-[10%]">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100 border-t border-gray-100">
        <tr
          v-for="(row, i) in rows"
          :key="i"
          class="hover:bg-gray-100 transition-colors duration-200"
        >
          <td class="px-6 py-4 align-top">
            <InputText v-model="row.name" placeholder="Nama Pelanggan" note="Nama Pelanggan" />
            <InputText
              v-model="row.identity_number"
              placeholder="Nomor Identitas"
              note="Nomor Identitas"
            />
            <SelectField
              v-model="row.gender"
              :options="JenisKelaminOptions"
              placeholder="Pilih Jenis Kelamin"
              note="Jenis Kelamin"
            />
            <InputText v-model="row.birth_place" placeholder="Tempat Lahir" note="Tempat Lahir" />
            <InputDate v-model="row.birth_date" note="Tanggal Lahir" />
          </td>

          <td class="px-6 py-4 align-top">
            <div class="flex gap-4">
              <SelectField
                v-model="row.jenis_visa"
                :options="visaTypeOptions"
                placeholder="Jenis Visa"
                note="Jenis Permohonan Visa"
              />
              <InputDate v-model="row.visa_date" note="Tanggal Permohonan" />
            </div>

            <div class="flex gap-4">
              <InputText
                v-model="row.passport_number"
                placeholder="Nomor Pasport"
                note="Nomor Pasport"
              />
              <InputDate v-model="row.passport_issued_date" note="Tanggal Dikeluarkan Pasport" />
            </div>

            <div class="flex gap-4">
              <InputText
                v-model="row.passport_issued_place"
                placeholder="Tempat Dikeluarkan"
                note="Tempat Dikeluarkan"
              />
              <InputDate v-model="row.passport_expire_date" note="Tanggal Berlaku Pasport" />
            </div>

            <div class="flex gap-4">
              <InputText
                v-model="row.indonesia_job"
                placeholder="Pekerjaan di Indonesia"
                note="Pekerjaan di Indonesia"
              />
              <InputText
                v-model="row.abroad_job"
                placeholder="Pekerjaan Luar Negeri"
                note="Pekerjaan Luar Negeri"
              />
            </div>

            <TextArea v-model="row.work_address" placeholder="Alamat" note="Alamat" />

            <div class="flex gap-4">
              <InputText v-model="row.postal_code" placeholder="Kode Pos" note="Kode Pos" />
              <SelectField
                v-model="row.city_id"
                :options="cityOptions"
                placeholder="Pilih Kota"
                note="Pilih Kota"
              />
            </div>

            <div class="flex gap-4">
              <InputText
                v-model="row.origin_country"
                placeholder="Negara Asal"
                note="Negara Asal"
              />
              <InputText v-model="row.phone" placeholder="Nomor Telepon" note="Nomor Telepon" />
            </div>
          </td>

          <td class="px-6 py-4 align-top">
            <InputCurrency v-model="row.price" note="Masukkan jumlah dalam Rupiah" />
          </td>

          <td class="px-6 py-4 align-top">
            <div class="flex flex-col items-center gap-2">
              <DangerButton @click="removeRow(i)"><DeleteIcon /></DangerButton>
              <label class="flex items-center gap-2 mt-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  v-model="row.is_payer"
                  class="w-5 h-5 border-gray-300 text-gray-600 rounded focus:ring-gray-500"
                />
                Pembayar
              </label>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-4 flex justify-end">
      <PrimaryButton @click="addRow">+ Tambah Pelanggan</PrimaryButton>
    </div>
  </FormEditProfile>
</template>
