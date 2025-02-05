// import './assets/main.css'

// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'
// import './assets/main.css'
import './assets/css/satoshi.css'
import './assets/css/style.css'
// import '../node_modules/jsvectormap/dist/css/jsvectormap.min.css'
// import 'jsvectormap/dist/css/jsvectormap.min.css'
// import '../node_modules/flatpickr/dist/flatpickr.min.css'

// import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// // Import ikon yang dibutuhkan
import {
  faUser,
  faHome,
  faHouseCrack,
  faCaretRight,
  faExchange,
  faBoxOpen,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'

// // Tambahkan ikon ke library
library.add(faUser, faHome, faHouseCrack, faCaretRight, faCircle, faExchange, faBoxOpen, faUsers)

const app = createApp(App)

app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.use(VueApexCharts)

app.mount('#app')
