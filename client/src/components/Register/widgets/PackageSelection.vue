<template>
  <div>
    <p class="text-sky-700 font-bold mb-2">Pilih Paket Anda</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <RadioButton name="paket" value="a" label="Paket 1 Bulan" price="Rp 200.000" />
      <RadioButton name="paket" value="b" label="Paket 3 Bulan" price="Rp 400.000" />
      <RadioButton name="paket" value="c" label="Paket 12 Bulan" price="Rp 1.000.000" />
      <RadioButton name="paket" value="d" label="Paket 6 Bulan" price="Rp 500.000" />
    </div>
  </div>
</template>

<script>
import RadioButton from '../particles/RadioButton.vue'

export default {
  components: {
    RadioButton,
  },
}
</script>
