<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg text-center">
      <h2 class="text-xl font-bold mb-4 text-gray-700">Tambah Jamaah Dari Member</h2>

      <!-- Custom searchable dropdown -->
      <div class="relative text-left mb-6">
        <button
          @click="dropdownOpen = !dropdownOpen"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span>{{ selectedMember?.fullname || 'Pilih Member' }}</span>
          <svg
            class="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown & Search -->
        <div
          v-if="dropdownOpen"
          class="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-auto"
        >
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama member..."
            class="w-full px-4 py-2 text-sm border-b border-gray-200 text-gray-700 focus:outline-none"
          />
          <ul>
            <li
              v-for="member in filteredMembers"
              :key="member.id"
              @click="selectMember(member)"
              class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {{ member.fullname }}
            </li>
            <li v-if="filteredMembers.length === 0" class="px-4 py-2 text-sm text-gray-400 italic">Ga nemu nama 😢</li>
          </ul>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="flex justify-end space-x-4 mt-6">
        <button  @click="handleNextStep" class="bg-sky-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-sky-800 transition">
          Selanjutnya
        </button>
        <button @click="$emit('close')" class="text-sm text-gray-500 hover:underline">
          Tutup
        </button>
      </div>

    </div>
  </div>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg text-center">
      <h2 class="text-xl font-bold mb-4 text-gray-700">Tambah Jamaah Dari Member</h2>

      <!-- Custom searchable dropdown -->
      <div class="relative text-left mb-6">
        <button
          @click="dropdownOpen = !dropdownOpen"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span>{{ selectedMember?.fullname || 'Pilih Member' }}</span>
          <svg
            class="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown & Search -->
        <div
          v-if="dropdownOpen"
          class="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-auto"
        >
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama member..."
            class="w-full px-4 py-2 text-sm border-b border-gray-200 text-gray-700 focus:outline-none"
          />
          <ul>
            <li
              v-for="member in filteredMembers"
              :key="member.id"
              @click="selectMember(member)"
              class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {{ member.fullname }}
            </li>
            <li v-if="filteredMembers.length === 0" class="px-4 py-2 text-sm text-gray-400 italic">Ga nemu nama 😢</li>
          </ul>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="flex justify-end space-x-4 mt-6">
        <button  @click="handleNextStep" class="bg-sky-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-sky-800 transition">
          Selanjutnya
        </button>
        <button @click="$emit('close')" class="text-sm text-gray-500 hover:underline">
          Tutup
        </button>
      </div>

    </div>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['close', 'next']) // Emit event to parent component

import { ref, computed, onMounted } from 'vue'
import { getMember } from '@/service/member' // Service to get all members
import { daftarJamaah } from '@/service/daftar_jamaah' // Service to get all jamaah

// Handle next step logic and emit data
const handleNextStep = () => {
  if (!selectedMember.value) return alert('Pilih dulu member-nya ya 🥲')

  const formData = {
    memberId: selectedMember.value.id,
    fullname: selectedMember.value.fullname,
    identity_number: selectedMember.value.identity_number,
    birth_place: selectedMember.value.birth_place,
    birth_date: selectedMember.value.birth_date,
    gender: selectedMember.value.gender,
    email: selectedMember.value.email,
    address: selectedMember.value.address,
    whatsapp_number: selectedMember.value.whatsapp_number,
    tipe: selectedMember.value.tipe,
  }

  // Emit the formData to parent component
  emit('next', formData)
}

const memberList = ref<any[]>([]) // List of members
const selectedMember = ref<any>(null) // Selected member
const searchQuery = ref('') // Search query for filtering members
const dropdownOpen = ref(false) // State for dropdown visibility

// Fetch all members and filter those not yet part of Jamaah
const fetchMember = async () => {
  try {
    const response = await getMember()
    const allMembers = response.data

    const daftarJamaahResponse = await daftarJamaah()

    // Pastikan data-nya array, kalau ga, fallback ke []
    const daftarJamaahData = Array.isArray(daftarJamaahResponse?.data)
      ? daftarJamaahResponse.data
      : Array.isArray(daftarJamaahResponse)
        ? daftarJamaahResponse
        : []

    const memberIdsInJamaah = daftarJamaahData.map((jamaah: any) => jamaah.member_id)

    memberList.value = allMembers.filter(
      (member) => !memberIdsInJamaah.includes(member.id)
    )

    console.log('data member yang belum menjadi jamaah', memberList.value)
  } catch (error) {
    console.log('error fetch member', error)
  }
}


// Computed property for filtering members based on search query
const filteredMembers = computed(() => {
  return memberList.value.filter((member) =>
    member.fullname.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Set the selected member and close the dropdown
const selectMember = (member: any) => {
  selectedMember.value = member
  dropdownOpen.value = false
  searchQuery.value = '' // Reset search query when member is selected
}

// Fetch member list when component is mounted
onMounted(fetchMember)
</script>
