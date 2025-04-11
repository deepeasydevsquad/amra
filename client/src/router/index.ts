import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import UserView from '@/views/UserView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import KwitansiView from '@/views/KwitansiView.vue'
import InvoicePaketLa from '@/components/User/Modules/Invoice/InvoicePaketLa.vue'
import InvoiceDeposit from '@/components/User/Modules/Invoice/InvoiceDeposit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/kwitansi',
      name: 'kwitansi',
      component: KwitansiView,
    },
    {
      path: '/tab-tes',
      name: 'tab-tes',
      component: () => import('../views/MemberAreaView.vue'),
    },
    {
      path: '/user',
      name: 'user',
      meta: {
        title: 'Home - My Website',
        description: 'Ini adalah deskripsi halaman Home',
      },
      component: UserView,
    },
    {
      path: '/invoice-paket-la',
      name: 'invoice-paket-la',
      component: InvoicePaketLa,
    },
    {
      path: '/invoice-deposit/:id',
      name: 'invoice-deposit',
      component: InvoiceDeposit,
    },
  ],
})

export default router
