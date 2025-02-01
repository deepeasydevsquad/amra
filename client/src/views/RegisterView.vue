<template>
  <div class="bg-gray-100 flex items-center justify-center min-h-screen p-4">
    <div
      class="bg-white shadow-lg rounded-lg w-full max-w-4xl flex flex-col md:flex-row overflow-hidden"
    >
      <!-- Bagian Kiri (Gambar) -->
      <div class="w-full md:w-1/2 relative">
        <div class="aspect-w-16 aspect-h-9">
          <img src="/bg.png" alt="Haji Image" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Bagian Kanan (Form) -->
      <div class="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center overflow-y-auto">
        <h2 class="text-3xl font-bold text-center mb-4" style="color: #175690">
          Silahkan Buat Akun Baru!
        </h2>
        <div class="space-y-6">
          <CompanyDataForm />
          <PackageSelection />
          <UserDataForm />
          <Button label="Buat Akun" />
          <p class="text-sm text-center" style="color: #175690">
            Dengan masuk, Anda menyetujui
            <span class="font-semibold">Syarat dan Ketentuan & Kebijakan Privasi kami</span>
          </p>
        </div>
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
