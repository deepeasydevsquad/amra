<script setup lang="ts">

  import { paramCabang, paramAkun, paramPeriode  } from '@/service/param_cabang'; // Import function POST
  import { dataNeracaLajurAPI  } from '@/service/neraca_lajur'; // Import function POST
  import IconDownload from '@/components/Icons/IconDownload.vue'
  import PrimaryButton from '@/components/Button/PrimaryButton.vue'
  import { ref, onMounted, computed } from 'vue';

  interface filterCabang {
    id: number;
    name: string;
  }

  interface filterPeriode {
    id: number;
    name: string;
  }

  interface NeracaLajur {
    id: number;
    akun: string;
    nama_akun: string;
    debet_saldo_awal: string;
    kredit_saldo_awal: string;
    debet_penyesuaian: string;
    kredit_penyesuaian: string;
    debet_saldo_disesuaikan: string;
    kredit_saldo_disesuaikan: string;
    debet_neraca: string;
    kredit_neraca: string;
    debet_laba_rugi: string;
    kredit_laba_rugi: string;
  }


  const optionFilterCabang = ref<filterCabang[]>([]);
  const selectedOptionCabang = ref(0);
  const optionFilterPeriode = ref<filterPeriode[]>([]);
  const selectedOptionPeriode = ref(0);
  const dataNeracaLajur = ref<NeracaLajur[]>([]);


  const fetchFilterData = async() => {
    const responseCabang = await paramCabang();
    const responseAkun = await paramAkun();
    const responsePeriode = await paramPeriode();

    optionFilterCabang.value = responseCabang.data;
    selectedOptionCabang.value = responseCabang.data[0].id;

    optionFilterPeriode.value = responsePeriode.data;
    selectedOptionPeriode.value = responsePeriode.data[0].id;

    await fetchData();
  }

   const fetchData = async() => {
    const response = await dataNeracaLajurAPI({
      periode:selectedOptionPeriode.value,
      cabang:selectedOptionCabang.value});
      // totalPages.value = Math.ceil(response.total / itemsPerPage)
    dataNeracaLajur.value = response.data.list;
    // total_debet.value = response.data.total_debet;
    // total_kredit.value = response.data.total_kredit;
    // saldo_akhir.value = response.data.saldo_akhir;
  }



  onMounted(async () => {
    await fetchFilterData();
    // totalColumns.value = 5
  });

</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Tambah data dan Search -->
    <div class="flex justify-between mb-4">
      <PrimaryButton >
          <IconDownload />
          Download Data Neraca Lajur
      </PrimaryButton>
      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Filter</label>
        <div class="inline-flex rounded-md shadow-xs" role="group">
          <!-- <input type="text" id="search" class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-s-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            v-model="search" @change="fetchData()" placeholder="Cari data..." /> -->
          <select  v-model="selectedOptionPeriode" style="width: 300px;" @change="fetchData()" class="border-t border-b border-e bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-s-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option v-for="optionA in optionFilterPeriode" :key="optionA.id" :value="optionA.id">
                {{ optionA.name }}
              </option>
          </select>
          <select  v-model="selectedOptionCabang" style="width: 300px;" @change="fetchData()" class="border-t border-b border-e bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-e-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option v-for="optionC in optionFilterCabang" :key="optionC.id" :value="optionC.id">
                {{ optionC.name }}
              </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table data -->
    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-[7%]  px-6 py-4  border font-bold text-gray-900 text-center align-bottom" rowspan="2">Kode Akun</th>
            <th class="w-[23%] px-6 py-4  border font-bold text-gray-900 text-center align-bottom" rowspan="2">Nama Akun</th>
            <th class="w-[14%] px-6 py-4  border font-bold text-gray-900 text-center align-bottom" colspan="2">Saldo Awal</th>
            <th class="w-[14%] px-6 py-4  border font-bold text-gray-900 text-center align-bottom" colspan="2">Penyesuaian</th>
            <th class="w-[14%] px-6 py-4  border font-bold text-gray-900 text-center align-bottom" colspan="2">Saldo Disesuaikan</th>
            <th class="w-[14%] px-6 py-4  border font-bold text-gray-900 text-center align-bottom" colspan="2">Neraca</th>
            <th class="w-[14%] px-6 py-4  border font-bold text-gray-900 text-center align-bottom" colspan="2">Laba Rugi</th>
          </tr>
          <tr>
            <th class="w-[7%] px-6 py-4  border font-bold text-gray-900 text-center" >
              Debet
            </th>
            <th class="w-[7%] px-6 py-4  border font-bold text-gray-900 text-center" >
              Kredit
            </th>
            <th class="w-[7%] px-6 py-4  border font-bold text-gray-900 text-center" >
              Debet
            </th>
            <th class="w-[7%] px-6 py-4  border font-bold text-gray-900 text-center" >
              Kredit
            </th>
            <th class="w-[7%] px-6 py-4  border font-bold text-gray-900 text-center" >
              Debet
            </th>
            <th class="w-[7%] px-6 py-4  border font-bold text-gray-900 text-center" >
              Kredit
            </th>
            <th class="w-[7%] px-6 py-4  border font-bold text-gray-900 text-center" >
              Debet
            </th>
            <th class="w-[7%] px-6 py-4  border font-bold text-gray-900 text-center" >
              Kredit
            </th>
            <th class="w-[7%] px-6 py-4 border font-bold text-gray-900 text-center" >
              Debet
            </th>
            <th class="w-[7%] px-6 py-4 font-bold border font-bold text-gray-900 text-center" >
              Kredit
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <template v-if="dataNeracaLajur && dataNeracaLajur.length > 0">
            <tr v-for="bb in dataNeracaLajur" :key="bb.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-center font-bold">{{ bb.akun }}</td>
              <td class="px-6 py-4 text-left font-bold">{{ bb.nama_akun }}</td>
              <td class="px-6 py-4 text-center">{{ bb.debet_saldo_awal }}</td>
              <td class="px-6 py-4 text-center">{{ bb.kredit_saldo_awal }}</td>
              <td class="px-6 py-4 text-center">{{ bb.debet_penyesuaian }}</td>
              <td class="px-6 py-4 text-center">{{ bb.kredit_penyesuaian }}</td>
              <td class="px-6 py-4 text-center">{{ bb.debet_saldo_disesuaikan }}</td>
              <td class="px-6 py-4 text-center">{{ bb.kredit_saldo_disesuaikan }}</td>
              <td class="px-6 py-4 text-center">{{ bb.debet_neraca }}</td>
              <td class="px-6 py-4 text-center">{{ bb.kredit_neraca }}</td>
              <td class="px-6 py-4 text-center">{{ bb.debet_laba_rugi }}</td>
              <td class="px-6 py-4 text-center">{{ bb.kredit_laba_rugi }}</td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="12" class="px-6 py-4 text-center text-base text-gray-600">Data Neraca Lajur tidak ditemukan.</td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-100 font-bold">
          <!-- <tr  v-if="dataBukuBesar && dataBukuBesar.length > 0">
            <td colspan="3" class="py-4 font-bold text-right">Total</td>
            <td class="text-center">{{ total_debet }}</td>
            <td class="text-center">{{ total_kredit }}</td>
            <td class="text-center">{{ saldo_akhir }}</td>
          </tr>
          <tr v-else>
            <td colspan="12" class="py-4 text-center text-base text-gray-600"> Data Neraca Lajur Tidak Ditemukan </td>
          </tr> -->
        </tfoot>
      </table>
    </div>
    <!--
    <FormAddUpdate :isModalOpen="isModalOpen" :formData="formData" @close="isModalOpen = false; removeFormData() ; fetchData()"></FormAddUpdate>
    <Confirmation  :showConfirmDialog="showConfirmDialog"  :confirmTitle="confirmTitle" :confirmMessage="confirmMessage" >
      <button @click="confirmAction && confirmAction()"
        class="inline-flex w-full justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
      >
        Ya
      </button>
      <button
        @click="showConfirmDialog = false"
        class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
      >
        Tidak
      </button>
    </Confirmation>
    -->
  </div>
  <!-- Notification Popup -->
  <!-- <Notification  :showNotification="showNotification"  :notificationType="notificationType" :notificationMessage="notificationMessage" @close="showNotification = false"  ></Notification> -->
</template>
