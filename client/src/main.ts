import './assets/css/satoshi.css'
import './assets/css/style.css'
import 'flowbite'

import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import { createApp } from 'vue'
import { createHead } from '@vueuse/head';
import App from './App.vue'
import router from './router'
// import { createMetaManager } from 'vue-meta';

// Import FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


// Import ikon yang dibutuhkan
import { faUser, faHome, faHouseCrack, faCaretRight, faExchange, faBoxOpen, faUsers, faGlobe, faDatabase,
  faChartArea, faCogs, faBackward, faForward, faBook, faArrowRight, faPlus, faMoneyBill, faPencil, faTimes, faBox, faMoneyBillAlt, faUndoAlt, faListAlt } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'


// Tambahkan ikon ke library
library.add( faUser, faHome, faHouseCrack, faCaretRight, faCircle, faExchange, faBoxOpen, faUsers, faGlobe, faDatabase,
  faChartArea, faCogs, faBackward, faForward, faBook, faArrowRight, faPlus, faMoneyBill, faPencil, faTimes, faBox, faMoneyBillAlt, faUndoAlt, faListAlt);

const app = createApp(App)
const head = createHead();

app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.use(VueApexCharts)
app.use(head);
// app.use(createMetaManager());

app.mount('#app')
