<template>
  <!-- Modal Backdrop -->
  <div
    class="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto flex items-start justify-center p-4 pt-32"
  >
    <!-- Modal Container -->
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="sticky top-0 bg-white z-10 border-b p-6">
        <h2 class="text-2xl font-bold text-gray-700 text-center">Form Update Data Jamaah</h2>
      </div>

      <!-- Modal Content -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Section 1: Identitas Diri -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">Identitas Diri</h3>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Title*</label>
              <select v-model="formData.title" class="input" required>
                <option value="">Pilih Title</option>
                <option value="tuan">Tuan</option>
                <option value="nona">Nona</option>
                <option value="nyonya">Nyonya</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Nama Jamaah*</label>
              <input
                v-model="formData.fullname"
                type="text"
                class="input"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Nama Passport</label>
              <input
                v-model="formData.nama_passport"
                type="text"
                class="input"
                placeholder="Nama di passport"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Nomor Identitas*</label>
              <input
                v-model="formData.identity_number"
                type="text"
                class="input"
                placeholder="NIK/KTP"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Jenis Identitas*</label>
              <select v-model="formData.identity_type" class="input" required>
                <option value="">Pilih jenis</option>
                <option value="ktp">KTP</option>
                <option value="passport">Passport</option>
                <option value="kitas">KITAS</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Kewarganegaraan*</label>
              <select v-model="formData.kewarganegaraan" class="input" required>
                <option value="">Pilih negara</option>
                <option value="wni">WNI</option>
                <option value="wna">WNA</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Jenis Kelamin*</label>
              <select v-model="formData.gender" class="input" required>
                <option value="">Pilih jenis kelamin</option>
                <option value="laki_laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Golongan Darah</label>
              <select v-model="formData.blood_type" class="input">
                <option value="">Pilih golongan darah</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Tempat Lahir*</label>
              <input
                v-model="formData.birth_place"
                type="text"
                class="input"
                placeholder="Kota kelahiran"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Tanggal Lahir*</label>
              <input v-model="formData.birth_date" type="date" class="input" required />
            </div>
          </div>

          <!-- Section 2: Kontak dan Alamat -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">Kontak dan Alamat</h3>
            </div>

            <div class="md:col-span-2 space-y-2">
              <label class="block text-sm font-medium text-gray-700">Alamat Lengkap*</label>
              <textarea
                v-model="formData.alamat"
                class="input h-24"
                placeholder="Jl. Nama Jalan No. XX"
                required
              ></textarea>
            </div>

            <div class="relative space-y-2">
  <label class="block text-sm font-medium text-gray-700">Provinsi*</label>

  <!-- Trigger (kelihatan seperti select box) -->
  <div
    class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 bg-white cursor-pointer flex justify-between items-center"
    @click="isOpenProvinsi = !isOpenProvinsi"
  >
    <span>{{ selectedProvinsi?.name || '-- Pilih Provinsi --' }}</span>
    <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>

  <!-- Dropdown -->
  <div
    v-if="isOpenProvinsi"
    class="absolute z-10 w-full bg-white border border-gray-300 rounded-md max-h-60 overflow-auto shadow-md"
  >
    <input
      type="text"
      class="w-full px-3 py-2 text-sm border-b focus:outline-none text-gray-700"
      v-model="searchProvinsi"
      placeholder="Cari provinsi..."
      @blur="blurDropdown('isOpenProvinsi')"
      @click.stop
    />
    <ul>
      <li
        v-for="provinsi in filteredProvinsi"
        :key="provinsi.id"
        @mousedown.prevent="selectProvinsi(provinsi)"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
      >
        {{ provinsi.name }}
      </li>
      <li v-if="filteredProvinsi.length === 0" class="px-4 py-2 text-gray-400 text-sm">Tidak ditemukan</li>
    </ul>
  </div>
</div>


            <div class="relative space-y-2">
  <label class="block text-sm font-medium text-gray-700">Kabupaten/Kota*</label>

  <!-- Trigger -->
  <div
    class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 bg-white cursor-pointer flex justify-between items-center"
    :class="{ 'opacity-50 cursor-not-allowed': !formData.provinsi_id }"
    @click="formData.provinsi_id && (isOpenKabupaten = !isOpenKabupaten)"
  >
    <span>
      {{ selectedKabupaten?.name || '-- Pilih Kabupaten/Kota --' }}
    </span>
    <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>

  <!-- Dropdown -->
  <div
    v-if="isOpenKabupaten"
    class="absolute z-10 w-full bg-white border border-gray-300 rounded-md max-h-60 overflow-auto shadow-md"
  >
    <input
      type="text"
      class="w-full px-3 py-2 text-sm border-b focus:outline-none text-gray-700"
      v-model="searchKabupaten"
      placeholder="Cari Kabupaten/Kota..."
      @blur="blurDropdown('isOpenKabupaten')"
      @click.stop
    />
    <ul>
      <li
        v-for="kabupaten in filteredKabupaten"
        :key="kabupaten.id"
        @mousedown.prevent="selectKabupaten(kabupaten)"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
      >
        {{ kabupaten.name }}
      </li>
      <li v-if="filteredKabupaten.length === 0" class="px-4 py-2 text-gray-400 text-sm">Tidak ditemukan</li>
    </ul>
  </div>
</div>


            <div class="relative space-y-2">
  <label class="block text-sm font-medium text-gray-700">Kecamatan*</label>

  <!-- Trigger -->
  <div
    class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 bg-white cursor-pointer flex justify-between items-center"
    :class="{ 'opacity-50 cursor-not-allowed': !formData.kabupaten_id }"
    @click="formData.kabupaten_id && (isOpenKecamatan = !isOpenKecamatan)"
  >
    <span>
      {{ selectedKecamatan?.name || '-- Pilih Kecamatan --' }}
    </span>
    <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>

  <!-- Dropdown -->
  <div
    v-if="isOpenKecamatan"
    class="absolute z-10 w-full bg-white border border-gray-300 rounded-md max-h-60 overflow-auto shadow-md"
  >
    <input
      type="text"
      class="w-full px-3 py-2 text-sm border-b focus:outline-none text-gray-700"
      v-model="searchKecamatan"
      placeholder="Cari Kecamatan..."
      @blur="blurDropdown('isOpenKecamatan')"
      @click.stop
    />
    <ul>
      <li
        v-for="kecamatan in filteredKecamatan"
        :key="kecamatan.id"
        @mousedown.prevent="selectKecamatan(kecamatan)"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
      >
        {{ kecamatan.name }}
      </li>
      <li v-if="filteredKecamatan.length === 0" class="px-4 py-2 text-gray-400 text-sm">Tidak ditemukan</li>
    </ul>
  </div>
</div>


            <div class="relative space-y-2">
  <label class="block text-sm font-medium text-gray-700">Kelurahan*</label>

  <!-- Trigger -->
  <div
    class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 bg-white cursor-pointer flex justify-between items-center"
    :class="{ 'opacity-50 cursor-not-allowed': !formData.kecamatan_id }"
    @click="formData.kecamatan_id && (isOpenKelurahan = !isOpenKelurahan)"
  >
    <span>
      {{ selectedKelurahan?.name || '-- Pilih Kelurahan --' }}
    </span>
    <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>

  <!-- Dropdown -->
  <div
    v-if="isOpenKelurahan"
    class="absolute z-10 w-full bg-white border border-gray-300 rounded-md max-h-60 overflow-auto shadow-md"
  >
    <input
      type="text"
      class="w-full px-3 py-2 text-sm border-b focus:outline-none text-gray-700"
      v-model="searchKelurahan"
      placeholder="Cari Kelurahan..."
      @blur="blurDropdown('isOpenKelurahan')"
      @click.stop
    />
    <ul>
      <li
        v-for="kelurahan in filteredKelurahan"
        :key="kelurahan.id"
        @mousedown.prevent="selectKelurahan(kelurahan)"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
      >
        {{ kelurahan.name }}
      </li>
      <li v-if="filteredKelurahan.length === 0" class="px-4 py-2 text-gray-400 text-sm">Tidak ditemukan</li>
    </ul>
  </div>
</div>


            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Kode Pos</label>
              <input v-model="formData.kode_pos" type="text" class="input" placeholder="40134" />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Telephone*</label>
              <input
                v-model="formData.nomor_telephone"
                type="tel"
                class="input"
                placeholder="0812xxxxxx"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">WhatsApp</label>
              <input
                v-model="formData.whatsapp_number"
                type="tel"
                class="input"
                placeholder="0812xxxxxx"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input
                v-model="formData.email"
                type="email"
                class="input"
                placeholder="email@contoh.com"
              />
            </div>
          </div>

          <!-- Section 3: Passport -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">Informasi Passport</h3>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Nomor Passport</label>
              <input
                v-model="formData.nomor_passport"
                type="text"
                class="input"
                placeholder="A12345678"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Tempat Dikeluarkan</label>
              <input
                v-model="formData.tempat_di_keluarkan_passport"
                type="text"
                class="input"
                placeholder="Kantor imigrasi..."
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Tanggal Dikeluarkan</label>
              <input v-model="formData.tanggal_di_keluarkan_passport" type="date" class="input" />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Masa Berlaku</label>
              <input v-model="formData.masa_berlaku_passport" type="date" class="input" />
            </div>
          </div>

          <!-- Section 4: Informasi Keluarga -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">Informasi Keluarga</h3>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Nama Ayah Kandung</label>
              <input
                v-model="formData.nama_ayah"
                type="text"
                class="input"
                placeholder="Nama lengkap ayah"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Nama Keluarga</label>
              <input
                v-model="formData.nama_keluarga"
                type="text"
                class="input"
                placeholder="Nama keluarga"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Telephone Keluarga</label>
              <input
                v-model="formData.telephone_keluarga"
                type="tel"
                class="input"
                placeholder="0812xxxxxx"
              />
            </div>

            <div class="md:col-span-2 space-y-2">
              <label class="block text-sm font-medium text-gray-700">Alamat Keluarga</label>
              <textarea
                v-model="formData.alamat_keluarga"
                class="input h-24"
                placeholder="Alamat keluarga"
              ></textarea>
            </div>
          </div>

          <!-- Section 5: Informasi Mahram -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">Informasi Mahram</h3>
            </div>

             <div class="md:col-span-2 space-y-2 relative">
  <label class="block text-sm font-medium text-gray-700">Nama Mahram</label>

  <!-- Trigger -->
  <div
    class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 bg-white cursor-pointer flex justify-between items-center"
    @click="isOpenMahram = !isOpenMahram"
  >
    <span>
      {{ selectedMahram?.fullname || '-- Pilih Mahram --' }}
    </span>
    <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>

  <!-- Dropdown -->
  <div
    v-if="isOpenMahram"
    class="absolute z-10 w-full bg-white border border-gray-300 rounded-md max-h-60 overflow-auto shadow-md"
  >
    <input
      type="text"
      class="w-full px-3 py-2 text-sm border-b focus:outline-none text-gray-700"
      v-model="searchMahram"
      placeholder="Cari nama mahram..."
      @blur="blurDropdown('isOpenMahram')"
      @click.stop
    />
    <ul>
      <li
        v-for="person in filteredMahram"
        :key="person.id"
        @mousedown.prevent="selectMahram(person)"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
      >
        {{ person.fullname }}
      </li>
      <li v-if="filteredMahram.length === 0" class="px-4 py-2 text-gray-400 text-sm">Tidak ditemukan</li>
    </ul>
  </div>
</div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Jenis Mahram</label>
              <select v-model="formData.mahram.mst_mahram_type_id" class="input">
                <option disabled value="0">Pilih jenis mahram</option>

                <option v-for="jenis in mahramOptions" :key="jenis.id" :value="jenis.id">
                  {{ jenis.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Section 6: Informasi Tambahan -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">Informasi Tambahan</h3>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Status Nikah</label>
              <select v-model="formData.status_nikah" class="input">
                <option value="">Pilih status</option>
                <option value="belum_menikah">Belum Menikah</option>
                <option value="menikah">Menikah</option>
                <option value="cerai">Cerai</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Tanggal Nikah</label>
              <input
                v-model="formData.tanggal_nikah"
                type="date"
                class="input"
                :disabled="formData.status_nikah !== 'menikah'"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Jumlah Anak</label>
              <input
                v-model="formData.jumlah_anak"
                type="number"
                class="input"
                placeholder="Jumlah anak"
                :disabled="formData.status_nikah !== 'menikah'"
              />
            </div>
          </div>

          <!-- Section 7: Pengalaman Haji/Umrah -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">
                Pengalaman Haji/Umrah
              </h3>
            </div>

            <div class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">Pengalaman Haji</label>
  <select v-model="formData.pengalaman_haji" class="input">
    <option v-for="item in dataPengalaman" :key="item.id" :value="item.id">
      {{ item.name }}
    </option>
  </select>
</div>

<div class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">Tahun Haji</label>
  <input
    v-model="formData.tahun_haji"
    type="text"
    class="input"
    placeholder="Tahun haji"
    :disabled="formData.pengalaman_haji == 1"
  />
</div>

<div class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">Pengalaman Umrah</label>
  <select v-model="formData.pengalaman_umrah" class="input">
    <option v-for="item in dataPengalaman" :key="item.id" :value="item.id">
      {{ item.name }}
    </option>
  </select>
</div>

<div class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">Tahun Umrah</label>
  <input
    v-model="formData.tahun_umrah"
    type="text"
    class="input"
    placeholder="Tahun umrah"
    :disabled="formData.pengalaman_umrah == 1"
  />
</div>

          </div>

          <!-- Section 8: Informasi Pekerjaan -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">Informasi Pekerjaan</h3>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Pekerjaan</label>
              <select v-model="formData.mst_pekerjaan_id" class="input">
                <option value="">Pilih pekerjaan</option>
                <option v-for="item in pekerjaanList" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Nama Instansi</label>
              <input
                v-model="formData.profession_instantion_name"
                type="text"
                class="input"
                placeholder="Nama perusahaan/instansi"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Alamat Instansi</label>
              <input
                v-model="formData.profession_instantion_address"
                type="text"
                class="input"
                placeholder="Alamat instansi"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Telephone Instansi</label>
              <input
                v-model="formData.profession_instantion_telephone"
                type="tel"
                class="input"
                placeholder="Nomor telepon kantor"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Pendidikan Terakhir</label>
              <select v-model="formData.last_education" class="input">
                <option value="">Pilih Pendidikan</option>
                <option v-for="item in pendidikanList" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Section 9: Kesehatan -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">Informasi Kesehatan</h3>
            </div>

            <div class="md:col-span-2 space-y-2">
              <label class="block text-sm font-medium text-gray-700">Riwayat Penyakit</label>
              <textarea
                v-model="formData.desease"
                class="input h-24"
                placeholder="Riwayat penyakit yang diderita"
              ></textarea>
            </div>
          </div>

          <!-- Section 10: Agen -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Agen*</label>
            <select v-model="formData.agen_id" class="input" required>
              <option value="">Pilih agen</option>
              <option v-for="agen in dataAgen" :key="agen.id" :value="agen.id">
                {{ agen.Member.fullname }}
              </option>
            </select>
          </div>

          <!-- Section 11: Kelengkapan Dokumen -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">Kelengkapan Dokumen</h3>
            </div>

            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="foto4x6"
                v-model="dokumen.photo_4_6"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="foto4x6" class="block text-sm font-medium text-gray-700"
                >Pas Foto 4x6</label
              >
            </div>

            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="foto3x4"
                v-model="dokumen.photo_3_4"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="foto3x4" class="block text-sm font-medium text-gray-700"
                >Pas Foto 3x4</label
              >
            </div>

            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="fcPassport"
                v-model="dokumen.fc_passport"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="fcPassport" class="block text-sm font-medium text-gray-700"
                >FC Passport</label
              >
            </div>

            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="fcKK"
                v-model="dokumen.fc_kk"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="fcKK" class="block text-sm font-medium text-gray-700">FC KK</label>
            </div>

            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="fcKTP"
                v-model="dokumen.fc_ktp"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="fcKTP" class="block text-sm font-medium text-gray-700">FC KTP</label>
            </div>

            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="bukuNikah"
                v-model="dokumen.buku_nikah"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="bukuNikah" class="block text-sm font-medium text-gray-700"
                >Buku Nikah</label
              >
            </div>

            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="akteLahir"
                v-model="dokumen.akte_lahir"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="akteLahir" class="block text-sm font-medium text-gray-700"
                >Akte Kelahiran</label
              >
            </div>

            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="bukuKuning"
                v-model="dokumen.buku_kuning"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="bukuKuning" class="block text-sm font-medium text-gray-700"
                >Buku Kuning</label
              >
            </div>
          </div>

          <!-- Section 12: Keterangan -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Keterangan</label>
            <textarea
              v-model="formData.keterangan"
              class="input h-24"
              placeholder="Catatan tambahan"
            ></textarea>
          </div>

          <!-- Section 13: Photo -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Ambil Photo Jamaah</label>
            <div class="mt-2 flex items-center gap-4">
              <div v-if="photoPreview" class="relative">
                <img
                  :src="photoPreview"
                  alt="Preview foto jamaah"
                  class="h-32 w-32 rounded-lg object-cover border border-gray-300"
                />
                <button
                  @click="removePhoto"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  title="Hapus foto"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div class="flex flex-col gap-2">
                <label
                  class="cursor-pointer bg-blue-600 text-white text-sm py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition duration-200 inline-flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {{ photoPreview ? 'Ganti Foto' : 'Ambil Foto' }}
                  <input
                    type="file"
                    class="hidden"
                    accept="image/*"
                    capture="user"
                    @change="handlePhotoUpload"
                    ref="photoInput"
                  />
                </label>

                <button
                  v-if="photoPreview"
                  @click="openCamera"
                  class="bg-green-600 text-white text-sm py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition duration-200 inline-flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Ambil Foto Baru
                </button>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="mt-6 flex justify-end gap-4">
            <button
              type="button"
              @click="$emit('close')"
              class="bg-gray-500 text-white py-2 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              class="bg-indigo-500 text-white py-2 px-6 rounded-xl font-semibold hover:bg-indigo-600 transition-colors"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Menyimpan...</span>
              <span v-else>Simpan Data Jamaah</span>
            </button>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="text-red-500 text-sm mt-2">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


import { ref, computed, onMounted, watch } from 'vue'
import {
  daftarProvinsi,
  daftarKabupaten,
  daftarKecamatan,
  daftarKelurahan,
  daftarMahram,
  daftarPekerjaan,
  daftarPendidikan,
  daftarPengalaman
} from '@/service/data_master'



import { getMember } from '@/service/member'

import { editJamaah } from '@/service/daftar_jamaah'

import { daftarAgen} from '@/service/agen'




const dataPengalaman = ref([])
const dataPengalamanUmrah = ref('')
const dataPengalamanHaji = ref('')

const fetchPengalaman = async() => {
  try{
    const response = await daftarPengalaman()
    dataPengalaman.value = response.data 
    console.log('data pengalaman', dataPengalaman.value) 
  }catch(error){
    console.log('error fetch data Pengalaman', error)
  }
}

// Data Form
const formData = ref({
  id: '',
  fullname: '',
  identity_number: '',
  identity_type: 'ktp',
  gender: '',
  birth_place: '',
  birth_date: '',
  whatsapp_number: '',
  password: '',
  kelurahan_id: null,
  agen_id: '',
  title: '',
  nama_ayah: '',
  nama_passport: '',
  nomor_passport: '',
  tanggal_di_keluarkan_passport: '',
  tempat_di_keluarkan_passport: '',
  masa_berlaku_passport: '',
  kode_pos: '',
  nomor_telephone: '',
  pengalaman_haji: '' ,
  tahun_haji: null,
  pengalaman_umrah: '' ,
  tahun_umrah: null,
  desease: '',
  last_education: null,
  blood_type: '',
  mst_pekerjaan_id: null,
  profession_instantion_name: '',
  profession_instantion_address: '',
  profession_instantion_telephone: '',
  nama_keluarga: '',
  alamat_keluarga: '',
  telephone_keluarga: '',
  status_nikah: '',
  tanggal_nikah: null,
  kewarganegaraan: '',
  mahram: {
    mahram_id: null,
    mst_mahram_type_id: 0,
  },
  keterangan: '',
  alamat: '',
  provinsi_id: null,
  kabupaten_id: null,
  kecamatan_id: null,
  email: '',
})

// Dokumen (checkbox)
const dokumen = ref({
  photo_4_6: false,
  photo_3_4: false,
  fc_passport: false,
  fc_kk: false,
  fc_ktp: false,
  buku_nikah: false,
  akte_lahir: false,
  buku_kuning: false,
})

// State untuk loading dan error
const isLoading = ref(false)
const errorMessage = ref('')

// Data Master
const provinsiList = ref([])
const kabupatenList = ref([])
const kecamatanList = ref([])
const kelurahanList = ref([])
const mahramOptions = ref([])
const pekerjaanList = ref([])
const pendidikanList = ref([])
const agenList = ref([])
const memberList = ref([])

// Search dan dropdown state
const searchProvinsi = ref('')
const searchKabupaten = ref('')
const searchKecamatan = ref('')
const searchKelurahan = ref('')
const searchMahram = ref('')
const isOpenProvinsi = ref(false)
const isOpenKabupaten = ref(false)
const isOpenKecamatan = ref(false)
const isOpenKelurahan = ref(false)
const isOpenMahram = ref(false)

// Photo
const photoPreview = ref('')
const photoInput = ref(null)

// Computed untuk filtered data
const filteredProvinsi = computed(() => {
  return provinsiList.value.filter((p) =>
    p.name.toLowerCase().includes(searchProvinsi.value.toLowerCase()),
  )
})

const filteredKabupaten = computed(() => {
  if (!formData.value.provinsi_id) return []

  return kabupatenList.value.filter(
    (kab) =>
      kab.provinsi_id === formData.value.provinsi_id &&
      kab.name.toLowerCase().includes(searchKabupaten.value.toLowerCase()),
  )
})

const filteredKecamatan = computed(() => {
  return kecamatanList.value.filter((p) =>
    p.name.toLowerCase().includes(searchKecamatan.value.toLowerCase()),
  )
})

const filteredKelurahan = computed(() => {
  return kelurahanList.value.filter((p) =>
    p.name.toLowerCase().includes(searchKelurahan.value.toLowerCase()),
  )
})

const filteredMahram = computed(() => {
  return memberList.value.filter((p) =>
    p.fullname.toLowerCase().includes(searchMahram.value.toLowerCase()),
  )
})

// Fungsi untuk memilih data dropdown


const selectedProvinsi = ref('')

const selectProvinsi = (provinsi) => {
  formData.value.provinsi_id = provinsi.id
  searchProvinsi.value = provinsi.name
  selectedProvinsi.value = provinsi
  isOpenProvinsi.value = false
  fetchKabupaten(provinsi.id)
}

const selectedKabupaten = ref('')

const selectKabupaten = (kabupaten) => {
  formData.value.kabupaten_id = kabupaten.id
  searchKabupaten.value = kabupaten.name
  selectedKabupaten.value = kabupaten
  isOpenKabupaten.value = false
  fetchKecamatan(kabupaten.id)
}

const selectedKecamatan = ref('')

const selectKecamatan = (kecamatan) => {
  formData.value.kecamatan_id = kecamatan.id
  searchKecamatan.value = kecamatan.name
  selectedKecamatan.value = kecamatan
  isOpenKecamatan.value = false
  fetchKelurahan(kecamatan.id)
}

const selectedKelurahan = ref('')

const selectKelurahan = (kelurahan) => {
  formData.value.kelurahan_id = kelurahan.id
  searchKelurahan.value = kelurahan.name
  selectedKelurahan.value = kelurahan
  isOpenKelurahan.value = false
}

const selectedMahram = ref('')

const selectMahram = (mahram) => {
  formData.value.mahram.mahram_id = mahram.id
  selectedMahram.value = mahram
  searchMahram.value = mahram.fullname
  isOpenMahram.value = false
}

// Fungsi untuk menutup dropdown dengan delay
const blurDropdown = (dropdownName) => {
  setTimeout(() => {
    if (dropdownName === 'isOpenProvinsi') isOpenProvinsi.value = false
    if (dropdownName === 'isOpenKabupaten') isOpenKabupaten.value = false
    if (dropdownName === 'isOpenKecamatan') isOpenKecamatan.value = false
    if (dropdownName === 'isOpenKelurahan') isOpenKelurahan.value = false
    if (dropdownName === 'isOpenMahram') isOpenMahram.value = false
  }, 200)
}

// Fungsi untuk handle upload foto
const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target.result
      // Di sini Anda bisa mengupload foto ke server jika diperlukan
    }
    reader.readAsDataURL(file)
  }
}

const removePhoto = () => {
  photoPreview.value = ''
  if (photoInput.value) {
    photoInput.value.value = ''
  }
}

const openCamera = () => {
  if (photoInput.value) {
    photoInput.value.click()
  }
}

// Fungsi untuk fetch data master
const fetchProvinsi = async () => {
  try {
    const response = await daftarProvinsi()
    provinsiList.value = response.data
  } catch (error) {
    console.error('Error fetching provinsi:', error)
  }
}

const fetchKabupaten = async (provinsiId) => {
  try {
    const response = await daftarKabupaten({ provinsi_id: provinsiId })
    kabupatenList.value = response.data
    searchKabupaten.value = ''
    formData.value.kabupaten_id = null
    formData.value.kecamatan_id = null
    formData.value.kelurahan_id = null
  } catch (error) {
    console.error('Error fetching kabupaten:', error)
  }
}

const fetchKecamatan = async (kabupatenId) => {
  try {
    const response = await daftarKecamatan({ kabupaten_id: kabupatenId })
    kecamatanList.value = response.data
    searchKecamatan.value = ''
    formData.value.kecamatan_id = null
    formData.value.kelurahan_id = null
  } catch (error) {
    console.error('Error fetching kecamatan:', error)
  }
}

const fetchKelurahan = async (kecamatanId) => {
  try {
    const response = await daftarKelurahan({ kecamatan_id: kecamatanId })
    kelurahanList.value = response.data
    searchKelurahan.value = ''
    formData.value.kelurahan_id = null
  } catch (error) {
    console.error('Error fetching kelurahan:', error)
  }
}

const dataAgen = ref('')

const fetchAgen = async()=>{
  
  try{
    const response = await daftarAgen()
    dataAgen.value = response.data
    console.log("data agen", dataAgen.value)
  }catch(error){
      console.log("error agen", error)
  }
}


const fetchMahramTypes = async () => {
  try {
    const response = await daftarMahram()
    mahramOptions.value = response.data
  } catch (error) {
    console.error('Error fetching mahram types:', error)
  }
}

const fetchPekerjaan = async () => {
  try {
    const response = await daftarPekerjaan()
    pekerjaanList.value = response.data
  } catch (error) {
    console.error('Error fetching pekerjaan:', error)
  }
}

const fetchPendidikan = async () => {
  try {
    const response = await daftarPendidikan()
    pendidikanList.value = response.data
  } catch (error) {
    console.error('Error fetching pendidikan:', error)
  }
}


const fetchMember = async () => {
  try {
    const response = await getMember()
    memberList.value = response.data
  } catch (error) {
    console.error('Error fetching member:', error)
  }
}



const props = defineProps<{
  jamaah: any
}>()

watch(() => props.jamaah, (newVal) => {
  console.log('🔥 new jamaah:', newVal);
  console.log('📦 new jamaah (type):', Array.isArray(newVal) ? 'Array' : 'Object');

  if (!newVal) {
    console.log('🔴 newVal is null or undefined');
    return;
  }

  // Sync data with formData
  if (Array.isArray(newVal)) {
    const jamaahData = newVal[0];  // Assuming data is in the first item
formData.value = {
  ...formData.value,
  id: newVal.id,
  birth_date: newVal.birth_date?.slice(0, 10),
  birth_place: newVal.birth_place,
  fullname: newVal.nama_jamaah,
  nama_agen: newVal.nama_agen,
  identity_number: newVal.nomor_identitas,
  tempat_tanggal_lahir: newVal.tempat_tanggal_lahir,
  identity_type: newVal.identity_type,
  gender: newVal.gender,
  photo: newVal.photo,
  nomor_passport: newVal.nomor_passport,
  whatsapp_number: newVal.whatsapp_number,
  nama_ayah: newVal.nama_ayah,
  nama_passport: newVal.nama_passport,
  tanggal_di_keluarkan_passport: newVal.tanggal_di_keluarkan_passport?.slice(0, 10),
  tempat_di_keluarkan_passport: newVal.tempat_di_keluarkan_passport,
  masa_berlaku_passport: newVal.masa_berlaku_passport?.slice(0, 10),
  kode_pos: newVal.kode_pos,
  nomor_telephone: newVal.nomor_telephone,
  pengalaman_haji: newVal.pengalaman_haji,
  tahun_haji: newVal.tahun_haji,
  pengalaman_umrah: newVal.pengalaman_umrah,
  tahun_umrah: newVal.tahun_umrah,
  desease: newVal.desease,
  last_education: newVal.last_education,
  blood_type: newVal.blood_type,
  photo_4_6: newVal.photo_4_6,
  photo_3_4: newVal.photo_3_4,
  fc_passport: newVal.fc_passport,
  mst_pekerjaan_id: newVal.mst_pekerjaan_id,
  profession_instantion_name: newVal.profession_instantion_name,
  profession_instantion_address: newVal.profession_instantion_address,
  profession_instantion_telephone: newVal.profession_instantion_telephone,
  fc_kk: newVal.fc_kk === 'ada' ? true : false,
  fc_ktp: newVal.fc_ktp === 'ada' ? true : false,
  buku_nikah: newVal.buku_nikah === 'ada' ? true : false,
  akte_lahir: newVal.akte_lahir === 'ada' ? true : false,
  buku_kuning: newVal.buku_kuning === 'ada' ? true : false,
  keterangan: newVal.keterangan,
  nama_keluarga: newVal.nama_keluarga,
  alamat_keluarga: newVal.alamat_keluarga,
  telephone_keluarga: newVal.telephone_keluarga,
  status_nikah: newVal.status_nikah,
  tanggal_nikah: newVal.tanggal_nikah,
  kewarganegaraan: newVal.kewarganegaraan,
  title: newVal.title,
};

  } else {
    // If it's a single object, map directly to formData
    formData.value = {
  ...formData.value,
  id: newVal.id,
  birth_date: newVal.birth_date?.slice(0, 10),
  birth_place: newVal.birth_place,
  fullname: newVal.nama_jamaah,
  nama_agen: newVal.nama_agen,
  identity_number: newVal.nomor_identitas,
  tempat_tanggal_lahir: newVal.tempat_tanggal_lahir,
  identity_type: newVal.identity_type,
  gender: newVal.gender,
  photo: newVal.photo,
  nomor_passport: newVal.nomor_passport,
  whatsapp_number: newVal.whatsapp_number,
  nama_ayah: newVal.nama_ayah,
  nama_passport: newVal.nama_passport,
  tanggal_di_keluarkan_passport: newVal.tanggal_di_keluarkan_passport?.slice(0, 10),
  tempat_di_keluarkan_passport: newVal.tempat_di_keluarkan_passport,
  masa_berlaku_passport: newVal.masa_berlaku_passport?.slice(0, 10),
  kode_pos: newVal.kode_pos,
  nomor_telephone: newVal.nomor_telephone,
  pengalaman_haji: newVal.pengalaman_haji,
  tahun_haji: newVal.tahun_haji,
  pengalaman_umrah: newVal.pengalaman_umrah,
  tahun_umrah: newVal.tahun_umrah,
  desease: newVal.desease,
  last_education: newVal.last_education,
  blood_type: newVal.blood_type,
  photo_4_6: newVal.photo_4_6,
  photo_3_4: newVal.photo_3_4,
  fc_passport: newVal.fc_passport,
  mst_pekerjaan_id: newVal.mst_pekerjaan_id,
  profession_instantion_name: newVal.profession_instantion_name,
  profession_instantion_address: newVal.profession_instantion_address,
  profession_instantion_telephone: newVal.profession_instantion_telephone,
  fc_kk: newVal.fc_kk === 'ada' ? true : false,
  fc_ktp: newVal.fc_ktp === 'ada' ? true : false,
  buku_nikah: newVal.buku_nikah === 'ada' ? true : false,
  akte_lahir: newVal.akte_lahir === 'ada' ? true : false,
  buku_kuning: newVal.buku_kuning === 'ada' ? true : false,
  keterangan: newVal.keterangan,
  nama_keluarga: newVal.nama_keluarga,
  alamat_keluarga: newVal.alamat_keluarga,
  telephone_keluarga: newVal.telephone_keluarga,
  status_nikah: newVal.status_nikah,
  tanggal_nikah: newVal.tanggal_nikah?.slice(0, 10),
  kewarganegaraan: newVal.kewarganegaraan,
  title: newVal.title,
};

  }

  // Sync dokumen if available
  if (newVal.dokumen) {
    dokumen.value = {
      ...dokumen.value,
      ...newVal.dokumen
    };
  }
}, { immediate: true });



const emit = defineEmits(['update'])


// Handle submit form
const handleSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    // Validasi data wajib
    if (
      !formData.value.fullname ||
      !formData.value.identity_number ||
      !formData.value.nomor_telephone
    ) {
      throw new Error('Harap isi semua field yang wajib diisi')
    }

    // Format data dokumen sesuai kebutuhan backend
    const dokumenPayload = {
      photo_4_6: dokumen.value.photo_4_6 ? 'ada' : 'tidak_ada',
      photo_3_4: dokumen.value.photo_3_4 ? 'ada' : 'tidak_ada',
      fc_passport: dokumen.value.fc_passport ? 'ada' : 'tidak_ada',
      fc_kk: dokumen.value.fc_kk ? 'ada' : 'tidak_ada',
      fc_ktp: dokumen.value.fc_ktp ? 'ada' : 'tidak_ada',
      buku_nikah: dokumen.value.buku_nikah ? 'ada' : 'tidak_ada',
      akte_lahir: dokumen.value.akte_lahir ? 'ada' : 'tidak_ada',
      buku_kuning: dokumen.value.buku_kuning ? 'ada' : 'tidak_ada',
    }

    // Gabungkan semua data
    const payload = {
      ...formData.value,
      ...dokumenPayload,
      // Jika ada field tanggal yang perlu format khusus
      tanggal_di_keluarkan_passport: formData.value.tanggal_di_keluarkan_passport
        ? `${formData.value.tanggal_di_keluarkan_passport} 00:00:00`
        : null,
      masa_berlaku_passport: formData.value.masa_berlaku_passport
        ? `${formData.value.masa_berlaku_passport} 00:00:00`
        : null,
      // Jika ada photo yang perlu diupload
      photo: photoPreview.value,
    }

    console.log('Data yang akan dikirim:', payload)
    console.log('FormData Sebelum Kirim:', formData.value)
    // Uncomment untuk kirim ke API
    const response = await editJamaah(payload)
    console.log('Response:', response)

    emit('update')
    // this.$emit('close') // Uncomment untuk tutup modal setelah submit
  } catch (error) {
    console.error('Error submitting form:', error)
    errorMessage.value = error.message || 'Terjadi kesalahan saat menyimpan data'
  } finally {
    isLoading.value = false
  }
}

// Fetch data master saat komponen mounted
onMounted(() => {
  fetchProvinsi()
  fetchMahramTypes()
  fetchPekerjaan()
  fetchPendidikan()
  fetchPengalaman()
  fetchMember()
  fetchAgen()
  fetchPengalaman()
})
</script>

<style scoped>
.input {
  @apply w-full border text-gray-700 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors;
}
</style>
