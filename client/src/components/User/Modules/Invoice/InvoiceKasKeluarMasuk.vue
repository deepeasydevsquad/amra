<script setup lang="ts">
import Header from '@/components/User/Modules/Invoice/Particle/Header.vue'
import { ref, onMounted, nextTick } from 'vue'
import { kwitansi_trans_hotel } from '@/service/invoice'
import { useRoute } from 'vue-router'

const data = ref<any>(null)
const route = useRoute()
const invoice = route.params.invoice

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

onMounted(async () => {
  try {
    const response = await kwitansi_trans_hotel(invoice)

    const isWrapped = 'data' in response && 'error' in response
    const result = isWrapped ? response.data : response

    data.value = result

    await nextTick()

    // ✅ CEK data aman sebelum nge-print
    if (data.value?.data && data.value.data.length > 0) {
      setTimeout(() => {
        window.print()
      }, 300)
    } else {
      console.warn('❗ Data kosong atau tidak valid:', data.value)
    }
  } catch (error) {
    console.error('❌ Gagal mengambil data invoice:', error)
  }
})
</script>

<template>

  <div class="bg-white max-w-[210mm] mx-auto p-[15mm] font-serif print:p-[10mm] print:m-0 print:shadow-none"
    style="color: black; font-size: 10pt; text-align: justify; line-height: 1.3">
    <Header v-if="data" :data="data.header" />


  </div>

</template>
