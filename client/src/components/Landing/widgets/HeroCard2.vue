<template>
  <div class="bg-no-repeat bg-cover flex gap-3" :style="{ backgroundImage: `url(${bgUrl})` }">
    <div class="w-1/2 pr-10">
      <img src='@/assets/images/Landing/bg5.png' width="800" alt="" />
    </div>
    <div class="w-1/2 flex flex-col justify-center">
      <h2 class="text-2xl text-white font-bold">Kembangkan travel Anda </h2>
      <h2 class="text-2xl text-white font-bold">dengan AMRA, solusi lengkap!</h2>
      <div class="mt-4">
        <button class="bg-slate-950 text-white font-bold rounded-full py-2 px-10">Coba Sekarang</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import bgUrl from '@/assets/images/Landing/bg4.png'
</script>
