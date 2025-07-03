import './assets/css/satoshi.css'
import './assets/css/style.css'
import 'flowbite'

import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'
import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import { createApp } from 'vue'
import { createHead } from '@vueuse/head';
import App from './App.vue'
import router from './router'
// @ts-ignore
// import rupiahPlugin from './plugins/rupiahPlugin'
// import { createMetaManager } from 'vue-meta';

// Import FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// fa-image
import { faUser, faUserCheck, faHome, faHouseCrack, faCaretRight, faExchange, faBoxOpen, faUsers, faGlobe, faDatabase,
  faChartArea, faCogs, faBackward, faForward, faBook, faArrowRight, faPlus, faMoneyBill, faPencil, faTimes, faBox,
  faMoneyBillAlt, faUndoAlt, faListAlt, faImage, faTicket, faCircleArrowRight, faQrcode, faCalendar, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faCircle, faClock, faUser as farUser } from '@fortawesome/free-regular-svg-icons'

library.add(faUser, farUser, faUserCheck, faHome, faHouseCrack, faCaretRight, faCircle, faExchange, faBoxOpen, faUsers, faGlobe, faDatabase,
  faChartArea, faCogs, faBackward, faForward, faBook, faArrowRight, faPlus, faMoneyBill, faPencil, faTimes, faBox,
  faMoneyBillAlt, faUndoAlt, faListAlt, faImage, faTicket, faCircleArrowRight, faQrcode, faCalendar, faClock, faArrowLeft)

const app = createApp(App)
const head = createHead();

app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.use(VueApexCharts)
// app.use(rupiahPlugin)
app.use(head);
// app.use(createMetaManager());
app.use(PrimeVue, {
  theme: {
      preset: Aura
  }
});

app.mount('#app')
