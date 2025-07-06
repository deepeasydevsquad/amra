<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getBerandaUtama, getDaftarJamaah, getDaftarPermintaanDepositMember, getDaftarHeadline } from '@/service/beranda_utama'

// Import components
import SkeletonTable from '@/components/User/Modules/BerandaUtama/widget/SkeletonTable.vue'
import InfoCard from '@/components/User/Modules/BerandaUtama/widget/InfoCard.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import PrimaryButton from '@/components/Button/PrimaryButton.vue'
import PrimaryButtonLight from '@/components/Button/PrimaryButtonLight.vue'

interface StatusCard {
  saldo_perusahaan: number;
  total_jamaah_terdaftar: number;
  total_paket_berangkat: number;
  total_jamaah_berangkat: number;
  total_tiket_terjual: number;
}

interface Jamaah {
  jamaah_name: string;
  jamaah_identity: string;
  birth_date: string;
  birth_place: string;
  no_passport: string;
  total: number;
}

interface Headline {
  title: string;
  content: string;
  date: string;
}

interface DepositMember {
  member_name: string;
  member_identity: string;
  jumlah: number;
  keperluan: string;
  sumber_biaya: string;
  bank_info: string;
}

// Status Card
const isLoading = ref(true)
const dataStatusCard = ref<StatusCard>({
  saldo_perusahaan: 0,
  total_jamaah_terdaftar: 0,
  total_paket_berangkat: 0,
  total_jamaah_berangkat: 0,
  total_tiket_terjual: 0,
})

const headline = reactive({
  isLoading: true,
  currentPage: 1,
  totalPages: 0,
  totalColumns: 2,
  itemsPerPage: 5,
  data: [] as Headline[],
})

const jamaah = reactive({
  isLoading: true,
  currentPage: 1,
  search: '',
  totalPages: 0,
  totalColumns: 4,
  itemsPerPage: 10,
  data: [] as Jamaah[],
})

const deposit = reactive({
  isLoading: true,
  currentPage: 1,
  search: '',
  totalPages: 0,
  totalColumns: 4,
  itemsPerPage: 10,
  data: [] as DepositMember[],
})

const fetchStatusCard = async () => {
  try {
    isLoading.value = true
    const res = await getBerandaUtama()
    dataStatusCard.value = res.data
  } catch (error) {
    console.error('Error fetching status card:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchHeadlineData = async () => {
  try {
    headline.isLoading = true
    const res = await getDaftarHeadline({
      perpage: headline.itemsPerPage,
      pageNumber: headline.currentPage,
    })
    headline.data = res.data
    headline.totalPages = Math.ceil(res.total / headline.itemsPerPage)
  } catch (error) {
    console.error('Error fetching headline:', error)
  } finally {
    headline.isLoading = false
  }
}

const fetchJamaahData = async () => {
  try {
    jamaah.isLoading = true
    const res = await getDaftarJamaah({
      search: jamaah.search,
      perpage: jamaah.itemsPerPage,
      pageNumber: jamaah.currentPage,
    })
    jamaah.data = res.data
    jamaah.totalPages = Math.ceil(res.total / jamaah.itemsPerPage)
  } catch (error) {
    console.error('Error fetching jamaah:', error)
  } finally {
    jamaah.isLoading = false
  }
}

const fetchDepositMemberData = async () => {
  try {
    deposit.isLoading = true
    const res = await getDaftarPermintaanDepositMember({
      search: deposit.search,
      perpage: deposit.itemsPerPage,
      pageNumber: deposit.currentPage,
    })
    deposit.data = res.data
    deposit.totalPages = Math.ceil(res.total / deposit.itemsPerPage)
  } catch (error) {
    console.error('Error fetching deposit:', error)
  } finally {
    deposit.isLoading = false
  }
}

const pages = (totalPages: number) => {
  return Array.from({ length: totalPages }, (_, i) => i + 1)
}

const handlePageChange = (state: { currentPage: number; fetchData: () => void }, page: number) => {
  state.currentPage = page
  state.fetchData()
}

const prevPage = (state: { currentPage: number; fetchData: () => void }) => {
  if (state.currentPage > 1) {
    state.currentPage--
    state.fetchData()
  }
}

const nextPage = (state: { currentPage: number; totalPages: number; fetchData: () => void }) => {
  if (state.currentPage < state.totalPages) {
    state.currentPage++
    state.fetchData()
  }
}

let timeoutId: number | null = null
const handleSearch = (state: { currentPage: number; fetchData: () => void }) => {
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = window.setTimeout(() => {
    state.currentPage = 1
    state.fetchData()
  }, 500)
}

onMounted(() => {
  fetchStatusCard()
  fetchHeadlineData()
  fetchJamaahData()
  fetchDepositMemberData()
})
</script>

<template>
  <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
  </div>
  <div class="p-4 space-y-6 text-gray-800">
    <div class="flex justify-between items-center border-b pb-4 mb-4">
      <PrimaryButtonLight class="flex items-center gap-2 text-base"  @click="$router.go(0)">
        <font-awesome-icon icon="fa-undo-alt" class="mr-0" /> Reload Page
      </PrimaryButtonLight>
      <PrimaryButtonLight class="flex items-center gap-2 text-base">
        <font-awesome-icon icon="fa-solid fa-money-bill-alt" class="mr-2" /> <strong>Saldo Perusahaan :</strong> Rp. {{ dataStatusCard.saldo_perusahaan.toLocaleString() }}
      </PrimaryButtonLight>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-8 gap-4">
      <div class="md:col-span-5">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InfoCard title="JAMAAH" subtitle="terdaftar" :count="dataStatusCard.total_jamaah_terdaftar" color="bg-cyan-600" icon="user-check" />
          <InfoCard title="PAKET" subtitle="akan berangkat" :count="dataStatusCard.total_paket_berangkat" color="bg-green-600" icon="box-open" />
          <InfoCard title="JAMAAH" subtitle="akan berangkat" :count="dataStatusCard.total_jamaah_berangkat" color="bg-yellow-500" icon="user" />
          <InfoCard title="TIKET" subtitle="terjual bulan ini" :count="dataStatusCard.total_tiket_terjual" color="bg-red-600" icon="ticket" />
        </div>
      </div>
      <div class="md:col-span-3">
        <!-- Headline -->
        <div class="bg-white rounded shadow p-4">
          <div class="flex justify-between items-center mb-4 text-sm">
            <PrimaryButton>
              <font-awesome-icon icon="plus" class="mr-2" /> Tambahkan Headline
            </PrimaryButton>
          </div>
          <SkeletonTable v-if="headline.isLoading" :columns="headline.totalColumns" :rows="headline.itemsPerPage" />
          <table v-else class="w-full text-sm border">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-3 py-3 font-medium text-gray-900 text-center">Headline</th>
                <th class="px-3 py-3 font-medium text-gray-900 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in headline.data" :key="index" class="hover:bg-gray-50 text-center">
                <td class="text-center px-3 py-3 align-top">{{ item.title }}</td>
                <td class="text-center px-3 py-3 align-top">
                  <button class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    <font-awesome-icon icon="pencil-alt" class="mr-1" /> Edit
                  </button>
                  <button class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    <font-awesome-icon icon="trash-alt" class="mr-1" /> Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="headline.data.length === 0">
                <td :colspan="headline.totalColumns" class="border p-3 hover:bg-gray-100 text-center text-gray-500">Daftar Headline Tidak Ditemukan</td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-100 font-bold">
              <Pagination
                :current-page="headline.currentPage"
                :total-pages="headline.totalPages"
                :pages="pages(headline.totalPages)"
                :total-columns="headline.totalColumns"
                @prev-page="() => prevPage({ ...headline, fetchData: fetchHeadlineData })"
                @next-page="() => nextPage({ ...headline, fetchData: fetchHeadlineData })"
                @page-now="(page) => handlePageChange({ ...headline, fetchData: fetchHeadlineData }, page)"
              />
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- Jamaah Terdaftar & Permintaan Deposit -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white rounded shadow p-4">
        <div class="flex items-center mb-4 justify-between">
          <h2 class="font-semibold mt-1">Jamaah Terdaftar</h2>
          <input
            type="text"
            class="block w-1/2 px-3 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
            v-model="jamaah.search"
            @input="handleSearch({ ...jamaah, fetchData: fetchJamaahData })"
            placeholder="Nama / Nomor Identitas Jamaah"
          />
        </div>
        <div class="overflow-x-auto ">
          <SkeletonTable v-if="jamaah.isLoading" :columns="jamaah.totalColumns" :rows="jamaah.itemsPerPage" />
          <table v-else class="w-full text-sm border">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-3 py-3 font-medium text-gray-900 text-center">Nama Jamaah / Nomor Identitas</th>
                <th class="px-3 py-3 font-medium text-gray-900 text-center">Tempat / Tanggal Lahir</th>
                <th class="px-3 py-3 font-medium text-gray-900 text-center">Nomor Passport</th>
                <th class="px-3 py-3 font-medium text-gray-900 text-center">Total Pembelian</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in jamaah.data" :key="index" class="hover:bg-gray-50 text-center">
                <td class="text-center px-3 py-3 align-top">{{ item.jamaah_name }} / {{ item.jamaah_identity }}</td>
                <td class="text-center px-3 py-3 align-top">{{ item.birth_place }} / {{ item.birth_date }}</td>
                <td class="text-center px-3 py-3 align-top">{{ item.no_passport }}</td>
                <td class="text-center px-3 py-3 align-top">{{ item.total }}</td>
              </tr>
              <tr v-if="jamaah.data.length === 0">
                <td :colspan="jamaah.totalColumns" class="border p-3 hover:bg-gray-100 text-center text-gray-500">Data Jamaah Tidak Ditemukan</td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-100 font-bold">
              <Pagination
                :current-page="jamaah.currentPage"
                :total-pages="jamaah.totalPages"
                :pages="pages(jamaah.totalPages)"
                :total-columns="jamaah.totalColumns"
                @prev-page="() => prevPage({ ...jamaah, fetchData: fetchJamaahData })"
                @next-page="() => nextPage({ ...jamaah, fetchData: fetchJamaahData })"
                @page-now="(page) => handlePageChange({ ...jamaah, fetchData: fetchJamaahData }, page)"
              />
            </tfoot>
          </table>
        </div>
      </div>
      <div class="bg-white rounded shadow p-4">
        <div class="flex items-center mb-4 justify-between">
          <h2 class="font-semibold mt-1">Permintaan Deposit Member</h2>
          <input
            type="text"
            class="block w-1/2 px-3 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
            v-model="deposit.search"
            @input="handleSearch({ ...deposit, fetchData: fetchDepositMemberData })"
            placeholder="Nama / Nomor Identitas Member"
          />
        </div>
        <div class="overflow-x-auto rounded-lg">
          <SkeletonTable v-if="deposit.isLoading" :columns="deposit.totalColumns" :rows="deposit.itemsPerPage" />
          <table v-else class="w-full text-sm border">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-3 font-medium text-gray-900 text-center">Nama Member / Identitas Member</th>
                <th class="p-3 font-medium text-gray-900 text-center">Jumlah / Keperluan / Sumber Biaya</th>
                <th class="p-3 font-medium text-gray-900 text-center">Bank Info</th>
                <th class="p-3 font-medium text-gray-900 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in deposit.data" :key="index" class="hover:bg-gray-50 text-center">
                <td class="text-center p-3 align-top">{{ item.member_name }} / {{ item.member_identity }}</td>
                <td class="text-center p-3 align-top">{{ item.jumlah }} / {{ item.keperluan }} / {{ item.sumber_biaya }}</td>
                <td class="text-center p-3 align-top">{{ item.bank_info }}</td>
                <td class="text-center p-3 align-top">
                  <button class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Setujui</button>
                  <button class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Tolak</button>
                </td>
              </tr>
              <tr v-if="deposit.data.length === 0">
                <td :colspan="deposit.totalColumns" class="border p-3 hover:bg-gray-100 text-center text-gray-500 ">
                  Daftar Request Deposit Tidak Ditemukan
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-100 font-bold">
              <Pagination
                :current-page="deposit.currentPage"
                :total-pages="deposit.totalPages"
                :pages="pages(deposit.totalPages)"
                :total-columns="deposit.totalColumns"
                @prev-page="() => prevPage({ ...deposit, fetchData: fetchDepositMemberData })"
                @next-page="() => nextPage({ ...deposit, fetchData: fetchDepositMemberData })"
                @page-now="(page) => handlePageChange({ ...deposit, fetchData: fetchDepositMemberData }, page)"
              />
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
