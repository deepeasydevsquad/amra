<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar'
import { ref } from 'vue'

const sidebarStore = useSidebarStore()

const props = defineProps(['items'])
const items = ref(props.items)

const handleItemClick = (index: number) => {
  const pageName =
    sidebarStore.selected === props.items[index].label ? '' : props.items[index].label
  sidebarStore.selected = pageName
}
</script>

<template></template>
