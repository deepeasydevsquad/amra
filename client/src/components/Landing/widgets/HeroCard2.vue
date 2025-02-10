<template>
  <div class="bg-no-repeat bg-cover flex flex-col md:flex-row gap-6 items-center md:items-stretch p-6 md:p-12 lg:p-16" :style="{ backgroundImage: `url(${bgUrl})` }">
    <div class="w-full md:w-1/2 flex justify-center md:justify-start">
      <img src='/Landing/bg5.png' class="w-3/4 md:w-full max-w-xs md:max-w-lg" alt="" />
    </div>
    <div class="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
      <h2 class="text-xl md:text-2xl lg:text-3xl text-white font-bold">Kembangkan travel Anda</h2>
      <h2 class="text-xl md:text-2xl lg:text-3xl text-white font-bold">dengan AMRA, solusi lengkap!</h2>
      <div class="mt-4">
        <button class="bg-slate-950 text-white font-bold rounded-full py-2 px-6 md:px-10 text-sm md:text-base lg:text-lg">Coba Sekarang</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import bgUrl from '/Landing/bg4.png'
</script>
