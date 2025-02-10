<script setup lang="ts">
// import HeaderArea from '@/components/User/Particle/Header/HeaderArea.vue'
import HeaderArea from './Particle/Header/HeaderArea.vue'
import SidebarArea from './Particle/Sidebar/SidebarArea.vue'
// import UserView from '@/components/User/UserViews.vue'
// import UserViewS from '@/components/User/Particle/Header/HeaderArea.vue'
// import SidebarArea from '../Particle/Sidebar/SidebarArea.vue'
</script>

<template>
  <!-- ===== Page Wrapper Start ===== -->
  <div class="flex h-screen overflow-hidden">
    <!-- ===== Sidebar Start ===== -->
    <SidebarArea />
    <!-- ===== Sidebar End ===== -->

    <!-- ===== Content Area Start ===== -->
    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- ===== Header Start ===== -->
      <HeaderArea />
      <!-- ===== Header End ===== -->

      <!-- ===== Main Content Start ===== -->
      <main>
        <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <slot></slot>
        </div>
      </main>
      <!-- ===== Main Content End ===== -->
    </div>
  </div>
  <!-- ===== Page Wrapper End ===== -->
</template>
