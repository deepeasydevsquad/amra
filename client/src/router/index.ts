import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import UserView from '@/views/UserView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import KwitansiView from '@/views/KwitansiView.vue'
import InvoicePaketLa from '@/components/User/Modules/Invoice/InvoicePaketLa.vue'
import InvoiceDeposit from '@/components/User/Modules/Invoice/InvoiceDeposit.vue'
import InvoiceKwitansiTerakhir from '@/components/User/Modules/Invoice/InvoiceKwitansiTerakhir.vue'
import InvoicePembayranPerbulan from '../components/User/Modules/Invoice/InvoicePembayranPerbulan.vue'
import KwitansiTabunganUmrah from '@/components/User/Modules/Invoice/KwitansiTabunganUmrah.vue'
import CetakSurat from '@/components/User/Modules/DaftarSuratMenyurat/widgets/CetakSurat.vue'
import KwitansiHandoverFasilitas from '@/components/User/Modules/Invoice/KwitansiHandoverFasilitas.vue'
import CetakDataJamaah from '@/components/User/Modules/TabunganUmrah/Widget/CetakDataJamaah.vue'
import KwitansiHandoverBarang from '@/components/User/Modules/Invoice/KwitansiHandoverBarang.vue'
import KwitansiPengembalianBarang from '@/components/User/Modules/Invoice/KwitansiPengembalianBarang.vue'
import TransaksiVisa from '@/components/User/Modules/TransaksiVisa/TransaksiVisa.vue'
import CetakKwitansiVisa from '@/components/User/Modules/Invoice/InvoiceTransaksiVisa.vue'
import InvoicePembayaranFeeAgen from '@/components/User/Modules/Invoice/InvoicePembayaranFeeAgen.vue'
import KwitansiPembayaranTransaksiPaket from '@/components/User/Modules/Invoice/KwitansiPembayaranTransaksiPaket.vue'
import InvoiceTransHotel from '@/components/User/Modules/Invoice/InvoiceTransHotel.vue'
import TransaksiPassport from '@/components/User/Modules/TransaksiPassport/TransaksiPassport.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/Login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/Register',
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
      path: '/invoice-paket-la/:id',
      name: 'invoice-paket-la',
      component: InvoicePaketLa,
    },
    {
      path: '/invoice-deposit/:id',
      name: 'invoice-deposit',
      component: InvoiceDeposit,
    },
    {
      path: '/kwitansi-terakhir/:invoice',
      name: 'kwitansi-terakhir',
      component: InvoiceKwitansiTerakhir,
    },
    {
      path: '/kwitansi-tabungan-umrah/:invoice',
      name: 'kwitansi-tabungan-umrah',
      component: KwitansiTabunganUmrah,
    },
    {
      path: '/invoice-pembayaran/:invoice',
      name: 'invoice-pembayran',
      component: InvoicePembayranPerbulan,
    },
    {
      path: '/kwitansi-handover-fasilitas/:invoice',
      name: 'kwitansi-handover-fasilitas',
      component: KwitansiHandoverFasilitas,
    },
    {
      path: '/cetak_surat/:jenis_surat',
      name: 'invoice-pembayran',
      component: CetakSurat,
    },
    {
      path: '/daftar-tabungan-umrah/cetak-data-jamaah/:id/cetak',
      name: 'cetak-jamaah',
      component: CetakDataJamaah,
    },
    {
      path: '/kwitansi-handover-barang/:invoice',
      name: 'kwitansi-handover-barang',
      component: KwitansiHandoverBarang,
    },
    {
      path: '/kwitansi-pengembalian-handover-barang/:invoice',
      name: 'kwitansi-pengembalian-handover-barang',
      component: KwitansiPengembalianBarang,
    },
    {
      path: '/transaksi-visa',
      name: 'transaksi-visa',
      component: TransaksiVisa,
    },
    {
      path: '/cetak-kwitansi-visa/:invoice',
      name: 'cetak-kwitansi-visa',
      component: CetakKwitansiVisa,
    },
    {
      path: '/kwitansi-pembayaran-fee-agen/:invoice',
      name: 'kwitansi-pembayaran-fee-agen',
      component: InvoicePembayaranFeeAgen,
    },
    {
      path: '/kwitansi-pembayaran-transaksi-paket/:invoice',
      name: 'kwitansi-pembayaran-transaksi-paket',
      component: KwitansiPembayaranTransaksiPaket,
    },
    {
      path: '/kwitansi-trans-hotel/:invoice',
      name: 'kwitansi-trans-hotel',
      component: InvoiceTransHotel,
    },
    {
      path: '/transaksi-passport',
      name: 'transaksi-passport',
      component: TransaksiPassport,
    },
  ],
})

export default router
