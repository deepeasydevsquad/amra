<template>
  <input
    :type="type"
    :placeholder="placeholder"
    class="w-full p-2 border border-gray-300 rounded-lg input-field"
  />
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
})
</script>
