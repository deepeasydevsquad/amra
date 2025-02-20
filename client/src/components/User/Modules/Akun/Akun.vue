<script setup lang="ts">
import { ref } from "vue";

const accounts = ref([
  { nomor: 1, nama: "Kas", tipe: "Asset", saldoAwal: 100000, saldoAkhir: 150000 },
  { nomor: 2, nama: "Piutang", tipe: "Asset", saldoAwal: 50000, saldoAkhir: 30000 },
  { nomor: 3, nama: "Utang", tipe: "Liability", saldoAwal: 20000, saldoAkhir: 10000 },
]);

const editAccount = (index: number) => {
  console.log("Edit account:", accounts.value[index]);
};

const deleteAccount = (index: number) => {
  accounts.value.splice(index, 1);
};
</script>
<template>
    <div class="p-4">
      <table class="w-full border border-gray-300 shadow-md">
        <thead class="bg-white text-black">
          <tr>
            <th class="border p-2">Nomor</th>
            <th class="border p-2">Nama Akun</th>
            <th class="border p-2">Tipe</th>
            <th class="border p-2">Saldo Awal</th>
            <th class="border p-2">Saldo Akhir</th>
            <th class="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(account, index) in accounts" :key="index" class="hover:bg-gray-100">
            <td class="border p-2 text-center">{{ account.nomor }}</td>
            <td class="border p-2">{{ account.nama }}</td>
            <td class="border p-2">{{ account.tipe }}</td>
            <td class="border p-2 text-right">Rp {{ account.saldoAwal.toLocaleString() }}</td>
            <td class="border p-2 text-right">Rp {{ account.saldoAkhir.toLocaleString() }}</td>
            <td class="border p-2 text-center">
              <button @click="editAccount(index)" class="bg-blue-500 text-white px-2 py-1 rounded mr-1">
                Edit
              </button>
              <button @click="deleteAccount(index)" class="bg-red-500 text-white px-2 py-1 rounded">
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
<style scoped></style>
