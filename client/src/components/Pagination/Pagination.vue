<template>
  <tr>
    <td class="px-4 py-4 text-center border min-h-[200px]" :colspan="totalColumns">
      <nav class="flex mt-0">
        <ul class="inline-flex items-center -space-x-px">
          <!-- Tombol Previous -->
          <li>
            <button
              @click="$emit('prev-page')"
              :disabled="currentPage === 1"
              class="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg
                hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
          </li>

          <!-- Nomor Halaman -->
          <li v-for="page in pages" :key="page">
            <button
              @click="$emit('page-now', page)"
              class="px-3 py-2 leading-tight border"
              :class="currentPage === page
                ? 'text-white bg-[#3a477d] border-[#3a477d]'
                : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'"
            >
              {{ page }}
            </button>
          </li>

          <!-- Tombol Next -->
          <li>
            <button
              @click="$emit('next-page')"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg
                hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </td>
  </tr>
</template>

<script setup>
defineProps({
  currentPage: Number,
  totalPages: Number,
  pages: Array,
  totalColumns: Number
})

defineEmits(['prev-page', 'next-page', 'page-now'])
</script>
