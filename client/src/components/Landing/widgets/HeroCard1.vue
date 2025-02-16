<template>
  <header class="text-white bg-cover bg-no-repeat bg-center min-h-[670px] flex items-start pt-12" :style="{ backgroundImage: `url(${bgUrl})` }">
      <div class="w-full max-w-2xl p-6 md:p-12 lg:w-1/2">
          <h1 class="text-3xl font-semibold md:text-4xl lg:text-5xl text-center md:text-left">
              Kelola Travel Anti Mahal dan Berkualitas
          </h1>
          <p class="mt-4 text-lg text-center md:text-left">Sistem manajemen umrah dan travel terintegrasi dan lengkap</p>
          <p class="text-lg text-center md:text-left">untuk membantu pengelolaan bisnis.</p>
          <div class="mt-6 flex justify-center md:justify-start">
              <button class="bg-white text-sky-700 px-6 py-3 md:px-7 md:py-4 rounded font-bold rounded-full">
                  Coba Sekarang
              </button>
          </div>
      </div>
  </header>
</template>

<script setup lang="ts">
import bgUrl from '/Landing/bg1.png'

defineProps<{ bgUrl: string }>()
</script>
