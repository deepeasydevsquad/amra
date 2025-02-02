<template>
  <div class="min-h-screen w-full flex flex-col md:flex-row">
    <div class="relative w-full md:w-1/2">
      <img src="/bg.png" alt="Haji Image" class="w-full h-auto object-cover" />
      <div class="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
    </div>

    <!-- Bagian Kanan (Form) dengan Overlap -->
    <div class="w-full md:w-1/2 p-6 flex flex-col justify-center bg-white md:-ml-4 md:pl-16">
      <h2 class="text-3xl font-bold text-center mb-4" style="color: #175690">
        Silahkan Buat Akun Baru!
      </h2>
      <div class="space-y-4 w-full px-4 max-w-lg">
        <CompanyDataForm />
        <PackageSelection />
        <UserDataForm />
        <Button class="w-full" label="Buat Akun" />
        <p class="text-sm text-center" style="color: #175690">
          Dengan masuk, Anda menyetujui
          <span class="font-semibold">Syarat dan Ketentuan & Kebijakan Privasi kami</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import CompanyDataForm from '../components/register/widgets/CompanyDataForm.vue'
import PackageSelection from '../components/register/widgets/PackageSelection.vue'
import UserDataForm from '../components/register/widgets/UserDataForm.vue'
import Button from '../components/register/particles/Button.vue'

export default {
  components: {
    CompanyDataForm,
    PackageSelection,
    UserDataForm,
    Button,
  },
}
</script>

<style scoped>
/* Tidak ada CSS tambahan */
</style>
