<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  useSelectedTab,
  useGlobalTab,
  useGlobalActiveTab,
  useTabTerpilih,
} from '../../../../stores/sidebar'
import 'flowbite'

import BerandaUtama from '../../Modules/BerandaUtama/BerandaUtama.vue'
import TransPaket from '../../Modules/TransPaket/TransPaket.vue'
import DaftarKota from '../../Modules/DaftarKota/DaftarKota.vue'
import DaftarFasilitas from '../../Modules/DaftarFasilitas/DaftarFasilitas.vue'
import DaftarHotel from '../../Modules/DaftarHotel/DaftarHotel.vue'
import JenisMobil from '../../Modules/JenisMobil/JenisMobil.vue'
import Cabang from '../../Modules/Cabang/Cabang.vue'
import Airlines from '../../Modules/Airlines/Airlines.vue'
import Pengaturan from '../../Modules/Pengaturan/Pengaturan.vue'
import SistemLog from '../../Modules/SistemLog/SistemLog.vue'
import DaftarBandara from '../../Modules/DaftarBandara/DaftarBandara.vue'
import DaftarAsuransi from '../../Modules/DaftarAsuransi/DaftarAsuransi.vue'
import DaftarProviderVisa from '../../Modules/DaftarProviderVisa/DaftarProviderVisa.vue'
import DaftarBank from '../../Modules/DaftarBank/DaftarBank.vue'
import DaftarTipePaket from '../../Modules/DaftarTipePaket/DaftarTipePaket.vue'
import Grup from '../../Modules/Grup/Grup.vue'
import Supplier from '../../Modules/Supplier/Supplier.vue'
import Akun from '../../Modules/Akun/Akun.vue'
import DaftarMember from '../../Modules/Member/DaftarMember.vue'
import Pengguna from '../../Modules/Pengguna/Pengguna.vue'
import KostumerPaketLa from '../../Modules/KostumerPaketLa/KostumerPaketLa.vue'
import DaftarPaketLa from '../../Modules/DaftarPaketLa/DaftarPaketLa.vue'
import LevelAgen from '../../Modules/LevelAgen/LevelAgen.vue'

const tabComponents = {
  beranda_utama: BerandaUtama,
  trans_paket: TransPaket,
  daftar_kota: DaftarKota,
  daftar_fasilitas: DaftarFasilitas,
  daftar_mobil: JenisMobil,
  daftar_cabang: Cabang,
  pengaturan: Pengaturan,
  daftar_hotel: DaftarHotel,
  airlines: Airlines,
  daftar_bandara: DaftarBandara,
  daftar_asuransi: DaftarAsuransi,
  daftar_provider_visa: DaftarProviderVisa,
  daftar_bank: DaftarBank,
  system_log: SistemLog,
  daftar_grup: Grup,
  daftar_tipe_paket: DaftarTipePaket,
  supplier: Supplier,
  akun: Akun,
  daftar_member: DaftarMember,
  kostumer_paket_la: KostumerPaketLa,
  daftar_paket_la: DaftarPaketLa,
  pengguna: Pengguna,
  level_agen: LevelAgen,
}

const selectedTab = useSelectedTab() // untuk menampung daftar tab yang menu / submenunya di click
const tab = useGlobalTab()
const activeTab = useGlobalActiveTab()
const tabTerpilih = useTabTerpilih()

//const props = defineProps<{ default: string; tabAwal: any }>()
const mulaiPilihTab = ref(false)

const selectTab = (tabPath: string, key: number) => {
  // tabTerpilih.value = key
  tabTerpilih.setNumber(key)
  activeTab.setString(tabPath) // Menandai tab yang dipilih
  mulaiPilihTab.value = true
}
</script>

<template>
  <!--  -->
  <div class="mb-0 dark:border-gray-700">
    <ul
      class="flex flex-wrap -mb-px text-sm font-medium text-center text-graydark"
      id="default-tab"
      data-tabs-toggle="#default-tab-content"
      role="tablist"
    >
      <li
        class="me-2"
        role="presentation"
        v-for="(item, key) in selectedTab.sharedArray"
        :key="key"
      >
        <button
          class="inline-block p-4 rounded-t-lg rrr"
          :id="`${tab.sharedObject[item.id].path}-tab`"
          :data-tabs-target="`#${tab.sharedObject[item.id].path}`"
          type="button"
          role="tab"
          :aria-controls="`${tab.sharedObject[item.id].path}`"
          :aria-selected="
            activeTab.sharedString === tab.sharedObject[item.id].path ||
            (tabTerpilih.sharedNumber === 0 && key === 0)
              ? 'true'
              : 'false'
          "
          @click="selectTab(tab.sharedObject[item.id].path, key)"
          :class="
            activeTab.sharedString === tab.sharedObject[item.id].path ||
            (tabTerpilih.sharedNumber === 0 && key === 0)
              ? 'AAA bg-white !text-[#3a477d] font-bold hover:text-[#3a477d] dark:text-[#3a477d] dark:hover:text-[#3a477d] border-[#3a477d] dark:border-[#3a477d]'
              : 'BBB inline-block p-4 rounded-t-lg dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300'
          "
        >
          <font-awesome-icon :icon="tab.sharedObject[item.id].icon" />
          {{ tab.sharedObject[item.id].name }}
        </button>
      </li>
    </ul>
  </div>

  <div id="default-tab-content ">
    <div
      v-for="(item, key) in selectedTab.sharedArray"
      :key="key"
      class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 min-h-[500px]"
      :class="
        (activeTab.sharedString === tab.sharedObject[item.id].path ||
        (tabTerpilih.sharedNumber === 0 && key === 0)
          ? ''
          : 'hidden') + (key === 0 ? ' rounded-tl-none' : '')
      "
      :id="tab.sharedObject[item.id].path"
      role="tabpanel"
      :aria-labelledby="`${tab.sharedObject[item.id].path}-tab`"
    >
      <p
        class="px-5 mb-5 text-sm text-gray-900 dark:text-white"
        v-html="tab.sharedObject[item.id].desc"
      ></p>
      <component :is="tabComponents[tab.sharedObject[item.id].path]" class="tab"></component>
    </div>
  </div>
</template>

<style scoped></style>
