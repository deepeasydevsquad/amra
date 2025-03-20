<template>
  <!-- Navbar -->
  <nav class="bg-gray-100 text-white p-4 flex justify-between items-center px-4 sm:px-6 md:px-[80px] shadow-md">
    <div class="text-2xl font-bold">
      <img src="/Landing/logo.png" alt="logo" width="114" />
    </div>

    <!-- Menu for larger screens -->
    <div class="hidden sm:flex items-center space-x-4 md:space-x-6 text-lg font-semibold">
      <div class="flex space-x-4 md:space-x-6">
        <a href="#" class="hover:underline text-sky-700">Beranda</a>
        <a href="#" class="hover:underline text-slate-950">Tentang AMRA</a>
        <a href="#" class="hover:underline text-slate-950">Fitur & Layanan</a>
        <a href="#" class="hover:underline text-slate-950">Harga</a>
      </div>
      <span class="border-l border-gray-400 h-6"></span>
      <div class="flex space-x-4">
        <a href="#" class="bg-slate-300 text-sky-800 px-4 py-2 rounded shadow-md">Coba Gratis</a>
        <a href="/login" class="text-sky-800 px-4 py-2 rounded font-semibold">Login</a>
      </div>
    </div>

    <!-- Hamburger Menu for Mobile -->
    <button @click="toggleMenu" class="sm:hidden focus:outline-none">
      <svg class="w-6 h-6 text-sky-800" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>
  </nav>

  <!-- Mobile Menu -->
  <transition name="fade">
    <div v-if="isMenuOpen" class="sm:hidden bg-gray-100 text-black p-4 space-y-4 text-lg shadow-md">
      <a href="#" class="block hover:underline text-sky-700">Beranda</a>
      <a href="#" class="block hover:underline text-slate-950">Tentang AMRA</a>
      <a href="#" class="block hover:underline text-slate-950">Fitur & Layanan</a>
      <a href="#" class="block hover:underline text-slate-950">Harga</a>
      <span class="border-t border-gray-400 block my-2"></span>
      <a href="#" class="block bg-slate-300 text-sky-800 px-4 py-2 rounded shadow-md">Coba Gratis</a>
      <a href="#" class="block text-sky-800 px-4 py-2 rounded font-semibold">Login</a>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>

<style>
/* Transisi untuk menu mobile */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
