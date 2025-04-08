<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    @click.self="emit('close')"
  >
    <div class="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Form Transaksi Deposit Saldo</h2>
        <button @click="emit('close')" class="text-gray-500 hover:text-gray-700">&times;</button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit">
        <!-- Nama Member -->
        <div class="mb-4 relative">
          <label class="block text-sm font-medium text-gray-700 mb-1"> Nama Member </label>

          <!-- Custom select trigger -->
          <div
            @click="isOpen = !isOpen"
            class="flex items-center justify-between w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-left cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <span v-if="selectedMember" class="text-gray-700">{{ selectedMember.fullname }}</span>
            <span v-else class="text-gray-400">Pilih Member</span>
            <svg
              class="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <!-- Dropdown dengan input pencarian -->
          <div
            v-if="isOpen"
            class="text-gray-700 absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto"
          >
            <!-- Input pencarian -->
            <div class="px-4 py-2 sticky top-0 bg-white">
              <input
                type="text"
                v-model="memberSearch"
                placeholder="Cari nama member..."
                class="text-gray-700 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                @input="filterMembers"
              />
            </div>

            <!-- Daftar member -->
            <ul class="py-1">
              <li
                v-for="member in filteredMembers"
                :key="member.id"
                @click="selectMember(member)"
                class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                :class="{
                  'bg-blue-50 text-blue-600 font-medium': form.memberId === member.id,
                  'text-gray-900': form.memberId !== member.id,
                }"
              >
                <span class="block truncate">{{ member.fullname }}</span>
                <span
                  v-if="form.memberId === member.id"
                  class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600"
                >
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
              </li>

              <li v-if="filteredMembers.length === 0" class="px-4 py-2 text-gray-500">
                Tidak ditemukan
              </li>
            </ul>
          </div>
        </div>

        <!-- Biaya Deposit -->
        <div class="mb-4">
          <label for="biaya" class="block text-sm font-medium text-gray-700 mb-1">
            Biaya Deposit (Rp)
          </label>
          <input
            type="text"
            id="nominal"
            v-model="computedNominal"
            placeholder="Masukkan nominal"
            class="text-gray-700 w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />

          <p class="text-xs text-gray-500 mt-1">Minimal deposit Rp1.000</p>
        </div>

        <!-- Info Deposit -->
        <div class="mb-6">
          <label for="info" class="block text-sm font-medium text-gray-700 mb-1"
            >Keterangan (Opsional)</label
          >
          <textarea
            id="info"
            v-model="form.info"
            placeholder="Contoh: Deposit awal"
            rows="3"
            class="text-gray-700 w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            BATAL
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition disabled:opacity-50"
          >
            <span>TAMBAH DEPOSIT</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { getMember } from '@/service/member'
import { addDeposit, infoDeposit } from '@/service/deposit_saldo'

import { reactive } from 'vue'

const computedNominal = computed({
  get() {
    return form.value.nominal
      ? 'Rp ' + form.value.nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      : ''
  },
  set(value: string) {
    const clean = value.replace(/[^\d]/g, '')
    form.value.nominal = Number(clean)
  },
})

interface FormType {
  nominal: number
}

function formatRupiah(angka: number | null): string {
  if (!angka || angka === 0) return ''
  return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function updateNominal(value: string): void {
  const clean = value.replace(/[^\d]/g, '')
  form.nominal = Number(clean)
}

interface Member {
  id: string | number
  fullname: string
  memberId: string
}

interface DepositForm {
  memberId: string | number
  nominal: number | 0
  info: string
}

const emit = defineEmits(['close', 'submit'])

// State
const members = ref<Member[]>([])
const filteredMembers = ref<Member[]>([])
const memberSearch = ref('')
const isLoading = ref(true)
const isSubmitting = ref(false)
const isOpen = ref(false)
const selectedMember = ref<Member | null>(null)

const form = ref<DepositForm>({
  memberId: '',
  nominal: null,
  info: '',
})

// Fetch members
const fetchMember = async () => {
  try {
    const response = await getMember()
    members.value = response.data || []
    filteredMembers.value = [...members.value] // Initialize filtered members
  } catch (error) {
    console.error('Gagal fetch data member:', error)
    // Tambahkan notifikasi error jika perlu
  } finally {
    isLoading.value = false
  }
}

// Filter members based on search query
const filterMembers = () => {
  if (!memberSearch.value) {
    filteredMembers.value = [...members.value]
    return
  }

  const searchTerm = memberSearch.value.toLowerCase()
  filteredMembers.value = members.value.filter((member) =>
    member.fullname.toLowerCase().includes(searchTerm),
  )
}

// Select member
const selectMember = (member: Member) => {
  form.value.memberId = member.id
  selectedMember.value = member
  isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

// Submit form
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const handleSubmit = async () => {
  try {
    const result = await addDeposit(form.value)
    // console.log('🟢 ID dari addDeposit:', result.id)
    // console.log("-----------------");
    // console.log(result);
    // console.log(result.data.invoice);
    // console.log("-----------------");

    await delay(100) // tunggu sebentar
    // const depositInfo = await infoDeposit(result.id)
    // localStorage.setItem('depositInfo', JSON.stringify(depositInfo))
    window.open('/invoice-deposit/'+ result.data.invoice, '_blank')
    // console.log('Deposit info:', depositInfo)
    emit('success')
  } catch (error) {
    console.error('Gagal menambahkan deposit:', error)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchMember()
  document.addEventListener('click', handleClickOutside)
})
</script>
