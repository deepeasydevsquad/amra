<template>
  <div class="min-h-[420px] relative flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-24">
    <img src="/Landing/bg6.png" class="absolute inset-0 w-full h-full object-cover" alt="">
    <div class="relative py-16 text-center flex flex-col items-center">
      <img src="/Landing/logo.png" class="mb-3 w-24 sm:w-28 md:w-32" alt="">
      <p class="text-base sm:text-lg text-gray-800">Sistem manajemen umrah dan travel terintegrasi</p>
      <p class="text-base sm:text-lg text-gray-800">dan lengkap untuk membantu pengelolaan bisnis.</p>
      <div class="flex flex-col sm:flex-row gap-3 mt-3 text-gray-700">
        <p class="flex gap-2 items-center"><img src="/Landing/ic_round-phone.svg" class="w-5" alt="">08123-45-67</p>
        <p class="flex gap-2 items-center"><img src="/Landing/material-symbols_mail-rounded.svg" class="w-5" alt="">admin@satuapps.com</p>
      </div>
      <ul class="mt-4 list-none flex flex-wrap justify-center gap-4 text-gray-800 text-sm sm:text-base">
        <li class="hover:underline cursor-pointer">Tentang Kami</li>
        <li class="hover:underline cursor-pointer">Paket</li>
        <li class="hover:underline cursor-pointer">Fitur & Layanan</li>
        <li class="hover:underline cursor-pointer">Hubungi Kami</li>
      </ul>
    </div>
  </div>
  <!-- Footer -->
  <footer class="bg-sky-700 text-white text-center p-3 mt-6 text-sm sm:text-base">
    <div class="container mx-auto px-4">
      <p>&copy; 2023 AMRA. All rights reserved.</p>
      <div class="flex flex-wrap justify-center gap-4 mt-2">
        <a href="#" class="hover:underline">Privacy Policy</a>
        <a href="#" class="hover:underline">Terms of Service</a>
        <a href="#" class="hover:underline">Contact Us</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
