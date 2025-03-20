<script setup lang="ts">
  const props = defineProps<{ showStatus: boolean, title: string, action: () => void  }>()

  const handleClick = () => {

    // console.log("masuk Sini");
    // console.log("masuk Sini");
    // props.action();
    console.log("Klik tombol modal!");
    if (typeof props.action === "function") {
      props.action();
    } else {
      console.warn("Error: props.action tidak diberikan atau bukan fungsi!");
    }
  };
</script>

<!-- <template>
  <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="showStatus" class="fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm">
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 relative">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">


              <div v-if="notificationType === 'success'" class="bg-green-100 rounded-full p-2">
                <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div v-else class="bg-red-100 rounded-full p-2">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>


            </div>
            <div class="flex-1">
              <h3 class="text-2xl font-medium" :class="notificationType === 'success' ? 'text-green-900' : 'text-red-900'">
                {{ notificationType === 'success' ? 'Berhasil' : 'Gagal' }}
              </h3>
              <p class="mt-1 text-lg text-gray-500">{{ notificationMessage }}</p>
            </div>
          </div>
          <button
            @click="handleClick"
            class="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
          >
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
</template> -->



<template>

<Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="showStatus" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showStatus = false"></div>
          <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
          <div class="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-2xl flex justify-center font-bold leading-6 text-gray-900 mb-4">
                {{ title }}
              </h3>

              <content>
                <slot name="content"></slot>
              </content>
              <!--
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kode</label>
                  <input
                    v-model="selectedKota.kode"
                    type="text"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal" placeholder="Kode Kota"
                  />
                  <p v-if="errors.kode" class="mt-1 text-sm text-red-600">{{ errors.kode }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input
                    v-model="selectedKota.name"
                    type="text"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal" placeholder="Nama Kota"
                  />
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>
              </div> -->
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <footer>
                <slot name="footer"></slot>
              </footer>

            </div>
          </div>
        </div>
      </div>
    </Transition>

  <!-- <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="showStatus" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <span class="hidden sm:inline-block sm:h-screen sm:align-middle" :click="action" aria-hidden="true">&#8203;</span>
          <div class="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-center">
                <h3 class="text-2xl flex justify-center font-bold leading-6 text-gray-900 mb-4" id="modal-title">{{ title }}</h3>
              </div>
              <div class="sm:flex sm:items-start">
                <!-- <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div> -->


                <!-- <h3 class="text-2xl flex justify-center font-bold leading-6 text-gray-900 mb-4">
                  {{ selectedKota.id ? "Edit Data Kota" : "Tambah Kota Baru" }}
                </h3> -->
              <!-- </div>
              <button @click="handleClick" class="absolute top-2 right-2 text-gray-400 hover:text-gray-500" >
                <span class="sr-only">Close</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <content>
                <slot name="content"></slot>
              </content>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"> -->
              <!-- <button
                @click="saveData"
                class="inline-flex w-full justify-center rounded-md border border-transparent bg-[#333a48] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {{ selectedKota.id ? "Simpan Perubahan" : "Tambah" }}
              </button>
              <button
                @click="isModalOpen = false"
                class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Batal
              </button> -->
            <!-- </div>
          </div>
        </div>

      </div>
    </Transition>  -->
</template>


