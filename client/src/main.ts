// import './assets/main.css'

// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'
// import './assets/main.css'
import './assets/css/satoshi.css'
import './assets/css/style.css'
// import './index.css'
import 'flowbite'

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
// import MaterialTailwind from '@material-tailwind/vue'
// import '@material-tailwind/html/scripts/tabs.js'

// // Import ikon yang dibutuhkan
import {
  faUser,
  faHome,
  faHouseCrack,
  faCaretRight,
  faExchange,
  faBoxOpen,
  faUsers,
  faGlobe,
  faDatabase,
  faChartArea,
  faCogs,
  faBoxOpen,
} from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'

// // Tambahkan ikon ke library
library.add(
  faUser,
  faHome,
  faHouseCrack,
  faCaretRight,
  faCircle,
  faExchange,
  faBoxOpen,
  faUsers,
  faGlobe,
  faDatabase,
  faChartArea,
  faCogs,
  faBoxOpen,
)

const app = createApp(App)

app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.use(VueApexCharts)
// app.use(MaterialTailwind)

app.mount('#app')
