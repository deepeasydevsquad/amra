<template>
  <label
    class="flex flex-col items-center justify-between p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-sky-700 hover:text-white"
  >
    <input type="radio" :name="name" :value="value" class="hidden peer" required />
    <span>{{ label }}</span>
    <span class="text-lg font-bold">{{ price }}</span>
  </label>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
}
</script>
