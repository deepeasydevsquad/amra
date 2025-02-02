<template>
  <label
    class="group flex flex-col items-center justify-between w-full px-5 py-1 text-sky-700 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:text-white peer-checked:bg-sky-700 hover:text-white hover:bg-sky-700 text-sky-700"
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
