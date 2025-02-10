import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// untuk sidebar
export const useSidebarStore = defineStore('sidebar', () => {
  const isSidebarOpen = ref(false)
  const selected = useStorage('selected', ref('eCommerce'))
  const page = useStorage('page', ref('Dashboard'))

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  return { isSidebarOpen, toggleSidebar, selected, page }
})

// untuk menampung daftar tab yang menu / submenunya di click
export const useSelectedTab = defineStore('selectedTab', {
  state: () => ({
    sharedArray: [], // Array kosong sebagai state awal
  }),
  actions: {
    addItem(item) {
      this.sharedArray.push(item)
    },
    removeItem(index) {
      this.sharedArray.splice(index, 1)
    },
    clearArray() {
      this.sharedArray = []
    },
  },
  getters: {
    getArray: (state) => state.sharedArray,
  },
})

// untuk menampung daftar tab yang menu / submenunya di click

// export const useGlobalStore = defineStore('globalStore', {
//   state: () => ({
//     sharedArray: [], // Array kosong sebagai state awal
//   }),
//   actions: {
//     addItem(item) {
//       this.sharedArray.push(item)
//     },
//     removeItem(index) {
//       this.sharedArray.splice(index, 1)
//     },
//     clearArray() {
//       this.sharedArray = []
//     },
//   },
//   getters: {
//     getArray: (state) => state.sharedArray,
//   },
// })

// menampung seluruh tab secara global
export const useGlobalTab = defineStore('globalTab', {
  state: () => ({
    sharedObject: {} as Record<string, any>, // Object kosong sebagai state awal
  }),
  actions: {
    addItem(key: string, value: any) {
      this.sharedObject[key] = value // Menambahkan atau memperbarui item dalam objek
    },
    removeItem(key: string) {
      delete this.sharedObject[key] // Menghapus item dari objek berdasarkan key
    },
    clearObject() {
      this.sharedObject = {} // Mengosongkan objek
    },
  },
  getters: {
    getObject: (state) => state.sharedObject, // Mengambil nilai objek
  },
})

// menampul string tab yang aktif
export const useGlobalActiveTab = defineStore('globalActiveTab', {
  state: () => ({
    sharedString: '', // Array kosong sebagai state awal
  }),
  actions: {
    setString(item: string) {
      this.sharedString = item // Mengatur nilai sharedString dengan string
    },
    clearString() {
      this.sharedString = '' // Mengosongkan nilai sharedString
    },
  },
  getters: {
    getString: (state) => state.sharedString, // Mengambil nilai sharedString
  },
})

// export const useTabTerpilih = defineStore('TabTerpilih', {
//   state: () => ({
//     sharedString: '' as number, // Array kosong sebagai state awal
//   }),
//   actions: {
//     setString(item: string) {
//       this.sharedString = item // Mengatur nilai sharedString dengan string
//     },
//     clearString() {
//       this.sharedString = '' // Mengosongkan nilai sharedString
//     },
//   },
//   getters: {
//     getString: (state) => state.sharedString, // Mengambil nilai sharedString
//   },
// })

export const useTabTerpilih = defineStore('TabTerpilih', {
  state: () => ({
    sharedNumber: 0 as number, // Menggunakan number sebagai default
  }),
  actions: {
    setNumber(item: number) {
      this.sharedNumber = item // Menetapkan nilai number
    },
    clearNumber() {
      this.sharedNumber = 0 // Reset ke nilai default
    },
  },
  getters: {
    getNumber: (state) => state.sharedNumber, // Getter untuk mengambil nilai
  },
})
