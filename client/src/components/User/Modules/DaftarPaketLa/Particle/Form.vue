<template>
  <div class="mx-auto p-6 bg-white shadow-md rounded-md text-gray-900">
    <h2 class="text-2xl font-bold text-center mb-6">
      {{ PaketLa?.id ? "Form Edit Paket La" : "Form Tambah Paket La Baru" }}
    </h2>

    <form @submit.prevent="saveData" class="grid grid-cols-2 gap-4 justify-center">
      <!-- Daftar Kostumer -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Daftar Kostumer</label>
        <select v-model="PaketLa.kostumer_paket_la_id" class="w-full rounded-md border-gray-300 p-2 shadow-sm focus:ring-blue-500">
          <option disabled value="">Pilih kostumer...</option>
          <option v-for="customer in customers" :key="customer.id" :value="customer.id">
            {{ customer.name }}
          </option>
        </select>
        <p v-if="errors.kostumer_paket_la_id" class="text-sm text-red-600">{{ errors.kostumer_paket_la_id }}</p>
      </div>

      <!-- Diskon -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Diskon (%)</label>
        <input v-model.number="PaketLa.discount" type="number" min="0" max="100"
          class="w-full rounded-md border-gray-300 p-2 shadow-sm focus:ring-blue-500"
          placeholder="Masukkan diskon (0-100%)">
        <p v-if="errors.discount" class="text-sm text-red-600">{{ errors.discount }}</p>
      </div>

      <!-- Tanggal Keberangkatan -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Tanggal Keberangkatan</label>
        <input v-model="PaketLa.departure_date" type="date" :min="minDepartureDate"
          class="w-full rounded-md border-gray-300 p-2 shadow-sm focus:ring-blue-500">
        <p v-if="errors.departure_date" class="text-sm text-red-600">{{ errors.departure_date }}</p>
      </div>

      <!-- Jumlah Jamaah -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Jumlah Jamaah</label>
        <input v-model.number="PaketLa.total_jamaah" type="number"
          class="w-full rounded-md border-gray-300 p-2 shadow-sm focus:ring-blue-500"
          placeholder="Masukkan jumlah jamaah">
        <p v-if="errors.total_jamaah" class="text-sm text-red-600">{{ errors.total_jamaah }}</p>
      </div>

      <!-- Tanggal Kepulangan -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Tanggal Kepulangan</label>
        <input v-model="PaketLa.arrival_date" type="date" :min="minArrivalDate"
          class="w-full rounded-md border-gray-300 p-2 shadow-sm focus:ring-blue-500">
        <p v-if="errors.arrival_date" class="text-sm text-red-600">{{ errors.arrival_date }}</p>
      </div>

      <!-- Tombol -->
      <div class="flex justify-end space-x-3">
        <button type="button" @click="$emit('cancel')"
          class="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400">Batal</button>
        <button type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {{ PaketLa?.id ? "Simpan Perubahan" : "Tambah" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    PaketLa: Object,
    errors: Object,
    customers: Array,
  },
  computed: {
    minDepartureDate() {
      return this.PaketLa?.departure_date
        ? this.formatDate(this.PaketLa.departure_date)
        : this.formatDate(new Date());
    },
    minArrivalDate() {
      if (this.PaketLa?.arrival_date) {
        return this.formatDate(this.PaketLa.arrival_date);
      }
      return this.PaketLa?.departure_date
        ? this.formatDate(this.PaketLa.departure_date)
        : this.minDepartureDate;
    },
  },
  methods: {
    saveData() {
      this.$emit("save", { ...this.PaketLa });
    },
    formatDate(date) {
      const parsedDate = new Date(date);
      return isNaN(parsedDate) ? new Date().toISOString().split("T")[0] : parsedDate.toISOString().split("T")[0];
    },
  },
};
</script>
