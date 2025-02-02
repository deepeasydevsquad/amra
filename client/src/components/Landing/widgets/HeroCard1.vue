<template>
    <header class="text-white bg-cover bg-no-repeat bg-center min-h-[580px]" :style="{ backgroundImage: `url(${bgUrl})` }">
        <div class="w-1/2 p-[80px]">
            <h1 class="text-3xl font-semibold text-5xl">Kelola Travel Anti Mahal dan Berkualitas</h1>
            <p class="mt-6">Sistem manajemen umrah dan travel terintegrasi dan lengkap</p>
            <p>untuk membantu pengelolaan bisnis.</p>
            <button class="mt-6 bg-white text-sky-700 px-7 py-4 rounded font-bold rounded-full">Coba Sekarang</button>
        </div>
    </header>
</template>

<script setup lang="ts">
import bgUrl from '@/assets/images/Landing/bg1.png'

defineProps<{
    bgUrl: string
}>()
</script>

