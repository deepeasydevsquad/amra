<script setup lang="ts">
import HeaderArea from './Particle/Header/HeaderArea.vue'
import SidebarArea from './Particle/Sidebar/SidebarArea.vue'
import ContentViews from './Particle/Content/ContentViews.vue'
import api from '../../service/api' // Impor file API
import { ref, onMounted } from 'vue'

// useGlobalTab
import { useGlobalTab, useGlobalActiveTab, useSelectedTab } from '../../stores/sidebar'

// State error dan loading
const isError = ref(false)
const isLoading = ref(true)

const globalTab = useGlobalTab() // menampung seluruh tab secara global
const selectedTab = useSelectedTab()
// const activeTab = useGlobalActiveTab()

// Interface yang sesuai dengan data dari server
interface MenuItem {
  id: number
  name: string
  path: string
  icon: string
  tab: null | any
}

interface MenuInfo {
  menu: Record<string, MenuItem>
  submenu: Record<string, any>
  tab: Record<string, any>
  default_tab: Record<string, any>
}

interface UserInfo {
  company_code: string
  username: string
  type: string
}

interface ServerResponse {
  error: boolean
  error_msg: string
  menu_info: MenuInfo
  user_info: UserInfo
}

const activeDefaultTab = ref('')

// Variabel untuk menyimpan data yang diambil dari API
const menu_info = ref<MenuInfo | null>(null)
const user_info = ref<UserInfo | null>(null)
const tabAwal = ref()

// Mengambil data dari API
const fetchUsers = async () => {
  try {
    const response = await api.get<ServerResponse>('/user') // Panggil API dan gunakan tipe yang benar
    if (response.status === 404) {
      isError.value = true
    } else {
      console.log('ddddd--------------')
      console.log(response.data.menu_info)
      console.log('ddddd--------------')
      // Menyimpan data ke dalam state
      menu_info.value = response.data.menu_info
      user_info.value = response.data.user_info

      globalTab.clearObject()
      for (const x in response.data.menu_info.tab) {
        globalTab.addItem(x, response.data.menu_info.tab[x])
      }

      const menu = response.data.menu_info.menu
      const submenu = response.data.menu_info.submenu
      const tab = response.data.menu_info.tab

      const menuPertama = Object.values(menu)[0]
      // let tabAwal = ''
      selectedTab.clearArray()
      if (menuPertama.path == '#') {
      } else {
        console.log('----------------Tab')
        console.log(tab)
        console.log(menuPertama.tab)
        console.log(menuPertama.tab[0])
        console.log('----------------Tab')
        if (menuPertama.tab !== null) {
          // tabAwal.value = menuPertama.tab
          for (const x in menuPertama.tab) {
            selectedTab.addItem(menuPertama.tab[x])
          }
        }
      }
      console.log('++++++++++++++menu')
      console.log(menu)
      console.log(menuPertama)
      console.log(tabAwal)
      // console.log(tab[tabAwal.value.id].path)
      console.log('++++++++++++++menu')

      // activeDefaultTab.value = tab[tabAwal.value.id].path
      // const subMenuClick = (menuname: string, name: string, path: string, tab: any) => {
      // const menuClick = (name: string, path: string, tab: any) => {

      isError.value = false // Reset error state jika berhasil
    }
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    isError.value = true
    console.error('Gagal mengambil data:', error)
  }
}

setTimeout(() => {
  if (isLoading.value) {
    isLoading.value = false
  }
}, 1000)

// Menunggu saat pertama kali mount
onMounted(fetchUsers)
</script>

<template>
  <div class="loading-container" :style="{ display: isLoading ? 'block' : 'none' }">
    <div class="loading-spinner"></div>
  </div>
  <div>
    <div v-if="isError" class="h-screen flex items-center justify-center"></div>
    <div v-else class="flex h-screen overflow-hidden">
      <SidebarArea :menu_info="menu_info" />
      <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <HeaderArea />
        <main>
          <div class="mx-auto max-w-screen p-4 md:p-6 2xl:p-10">
            <ContentViews :default="activeDefaultTab" :tabAwal="tabAwal"></ContentViews>
            <div
              class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5"
            ></div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
