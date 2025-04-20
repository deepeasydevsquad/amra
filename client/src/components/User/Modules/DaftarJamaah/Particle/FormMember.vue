<template>
    <div
    class="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto flex items-start justify-center p-4 pt-32 pl-20"
  >
    <!-- Modal Container -->
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto pt-20 pl-10"
    >
      <!-- Catatan -->
      <div class="bg-yellow-100 border-l-4 border-yellow-400 p-4 text-sm text-gray-800 rounded-lg">
        <p class="font-medium mb-2">Catatan:</p>
        <ul class="list-disc pl-5 space-y-1">
          <li>Sebelum menyimpan data jamaah, pastikan semua data penting sudah anda isi.</li>
          <li>Pastikan anda mengisi nomor WhatsApp dengan nomor yang masih aktif.</li>
          <li>
            Jika jamaah memiliki agen, anda wajib memilih agen terlebih dahulu sebelum melakukan transaksi. Jika tidak
            mengisi nama agen, maka transaksi yang sudah anda lakukan tidak menambahkan fee kepada Agen.
          </li>
        </ul>
      </div>

      <!-- Foto Jamaah -->
      <h3 class="text-lg font-semibold text-gray-700 mb-8 mt-8">Info Member</h3>
      <div class="w-full flex justify-center">
        <div class="w-40 h-40 rounded-lg overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
          <img
            v-if="defaultData?.photo_url"
            :src="defaultData.photo_url"
            alt="Foto Jamaah"
            class="object-cover w-full h-full"
          />
          <div v-else class="text-gray-400 text-sm">No Photo</div>
        </div>
      </div>

      <!-- Info Jamaah -->
      <div>
        <div class="pt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-gray-700 text-sm">
          <p class="font-semibold text-lg"><span>Nama:</span> {{ defaultData?.fullname || '-' }}</p>
          <p class="font-semibold text-lg"><span>No Identitas:</span> {{ defaultData?.identity_number || '-' }}</p>
          <p class="font-semibold text-lg">
            <span>Jenis Kelamin:</span> 
            {{ defaultData?.gender === 'laki_laki' ? 'Laki - Laki' : 'Perempuan' }}
          </p>
          <p class="font-semibold text-lg"><span>No. WhatsApp:</span> {{ defaultData?.whatsapp_number || '-' }}</p>
          <p class="font-semibold text-lg"><span>Tempat Lahir:</span> {{ defaultData?.birth_place || '-' }}</p>
          <p class="font-semibold text-lg"><span>Tanggal Lahir:</span> {{ formatDate(defaultData?.birth_date) || '-' }}</p>
        </div>
      </div>
            <h3 class="text-lg font-semibold text-gray-700 mb-8 mt-8">Info Jamaah</h3>
      <!-- Form Input -->
      <div class="max-h-[90vh] overflow-y-auto p-4 text-gray-700">


        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Identitas -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700"> Title</label>
              <select v-model="formData.title" class="input" required>
                <option value=""tuan>Tuan</option>
                <option value="nyonya">Nyonya</option>
                <option value="nona">Nona</option>
              </select>
            </div>


               <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Nomor Passport</label>
              <input v-model="formData.nomor_passport" type="text" class="input" placeholder="Masukan Nomor Passport" />
            </div>


            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Tempat Dikeluarkan Passport</label>
              <input v-model="formData.tempat_di_keluarkan_passport" type="text" class="input" placeholder="tempat di kerluarkan Passport"/>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Tanggal Dikeluarkan</label>
              <input v-model="formData.tanggal_di_keluarkan_passport" type="date" class="input" placeholder="tanggal di kerluarkan passport"/>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Masa Berlaku Passport</label>
              <input v-model="formData.masa_berlaku_passport" type="date" class="input" />
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Jenis Identitas*</label>
              <select v-model="formData.identity_type" class="input" required>
                <option value="">Pilih Jenis Identitas</option>
                <option value="ktp">KTP</option>
                <option value="passport">Passport</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Kewarganegaraan*</label>
              <select v-model="formData.kewarganegaraan" class="input" required>
              <option value="">Pilih kewarganegaraan</option>
                <option value="wni">WNI</option>
                <option value="wna">WNA</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Golongan Darah</label>
              <select v-model="formData.blood_type" class="input">
                <option value="">Pilih</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Kode Pos</label>
              <input v-model="formData.kode_pos" type="text" class="input" placeholder="Masukan Kode Poss"/>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Telepon*</label>
              <input v-model="formData.nomor_telephone" type="tel" class="input" placeholder="Masukan Nomor Telepon" required />
            </div>
          </div>

        <!-- Daftar Mahram -->
<div class="border p-4 rounded-xl space-y-2">
  <p class="font-semibold text-gray-700">Daftar Mahram</p>
  <div
    v-for="(mahram, index) in mahramList"
    :key="index"
    class="grid grid-cols-1 md:grid-cols-2 gap-4"
  >
    <div class="relative space-y-2">
      <label class="block text-sm font-medium text-gray-700">Nama Mahram</label>
      <div
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 bg-white cursor-pointer flex justify-between items-center"
        @click="isOpenMahram[index] = !isOpenMahram[index]"
      >
        <span>{{ selectedMahram.fullname || '-- Pilih Nama Mahram --' }}</span>
        <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <!-- Dropdown -->
      <div
        v-if="isOpenMahram[index]"
        class="absolute z-10 w-full bg-white border border-gray-300 rounded-md max-h-60 overflow-auto shadow-md"
      >
        <input
          type="text"
          class="w-full px-3 py-2 text-sm border-b focus:outline-none text-gray-700"
          v-model="searchMahram[index]"
          placeholder="Cari nama mahram..."
          @blur="blurDropdownDynamic(index)"
          @click.stop
        />
        <ul>
          <li
            v-for="person in filteredMahram(index)"
            :key="person.id"
            @mousedown.prevent="selectMahram(person, index)"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
          >
            {{ person.fullname }}
          </li>
          <li v-if="filteredMahram(index).length === 0" class="px-4 py-2 text-gray-400 text-sm">
            Tidak ditemukan
          </li>
        </ul>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Jenis Mahram</label>
      <select v-model="mahram.jenis" class="input w-full">
        <option value="">Pilih jenis</option>
        <option v-for="type in mahramOptions" :key="type.id" :value="type.id">
          {{ type.name }}
        </option>
      </select>
    </div>
  </div>

  <button
    type="button"
    @click="addMahram"
    class="w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700 transition"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>
    Tambah Mahram
  </button>
</div>


          <!-- Keluarga -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Nama Ayah Kandung</label>
              <input v-model="formData.nama_ayah" type="text" class="input"  placeholder="masukan nama ayah"/>
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Nama Keluarga</label>
              <input v-model="formData.nama_keluarga" type="text" class="input" placeholder="masukan nama keluarga"/>
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Telepon Keluarga</label>
              <input v-model="formData.telephone_keluarga" type="tel" class="input" placeholder="masukan nomor telpon keluarga"/>
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Alamat Keluarga</label>
              <input v-model="formData.alamat_keluarga" type="text" class="input" placeholder="masukan alamat keluarga"/>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <!-- Provinsi -->
  <div class="relative space-y-2">
    <label class="block text-sm font-medium text-gray-700">Provinsi*</label>
    <div
      class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 bg-white cursor-pointer flex justify-between items-center"
      @click="isOpenProvinsi = !isOpenProvinsi"
    >
      <span>{{ selectedProvinsi?.name || '-- Pilih Provinsi --' }}</span>
      <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
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

  <!-- Kabupaten -->
  <div class="relative space-y-2">
    <label class="block text-sm font-medium text-gray-700">Kabupaten/Kota*</label>
    <div
      class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 bg-white cursor-pointer flex justify-between items-center"
      :class="{ 'opacity-50 cursor-not-allowed': !formData?.provinsi_id }"
      @click="formData?.provinsi_id && (isOpenKabupaten = !isOpenKabupaten)"
    >
      <span>{{ selectedKabupaten?.name || '-- Pilih Kabupaten/Kota --' }}</span>
      <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
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

  <!-- Kecamatan -->
  <div class="relative space-y-2">
    <label class="block text-sm font-medium text-gray-700">Kecamatan*</label>
    <div
      class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 bg-white cursor-pointer flex justify-between items-center"
      :class="{ 'opacity-50 cursor-not-allowed': !formData?.kabupaten_id }"
      @click="formData?.kabupaten_id && (isOpenKecamatan = !isOpenKecamatan)"
    >
      <span>{{ selectedKecamatan?.name || '-- Pilih Kecamatan --' }}</span>
      <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
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

  <!-- Kelurahan -->
  <div class="relative space-y-2">
    <label class="block text-sm font-medium text-gray-700">Kelurahan*</label>
    <div
      class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 bg-white cursor-pointer flex justify-between items-center"
      :class="{ 'opacity-50 cursor-not-allowed': !formData?.kecamatan_id }"
      @click="formData?.kecamatan_id && (isOpenKelurahan = !isOpenKelurahan)"
    >
      <span>{{ selectedKelurahan?.name || '-- Pilih Kelurahan --' }}</span>
      <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
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
</div>


          <!-- Status -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Status Pernikahan*</label>
              <select v-model="formData.status_nikah" class="input" required>
                <option value="belum_menikah">Belum Menikah</option>
                <option value="menikah">Menikah</option>
                <option value="cerai">Cerai</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Tanggal Menikah</label>
              <input 
                v-model="formData.tanggal_nikah" 
                type="date" 
                class="input" 
                :disabled="formData.status_nikah !== 'menikah'" 
              />
            </div>
          </div>

          <!-- Pengalaman -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Pengalaman Haji</label>
               <select v-model="formData.pengalaman_haji" class="input">
                <option value="">Pilih Pengalaman</option>
                <option v-for="pengalamanHaji in pengalamanList" :key="pengalamanHaji.id" :value="pengalamanHaji.id">
                  {{ pengalamanHaji.name }}
                </option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Tahun Haji</label>
              <input 
                v-model="formData.tahun_haji" 
                type="text" 
                class="input" 
                
                placeholder="masukan tahun haji"
              />
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Pengalaman Umrah</label>
                <select v-model="formData.pengalaman_umrah" class="input">
                <option value="">Pilih Pengalaman</option>
                <option v-for="pengalamanUmrah in pengalamanList" :key="pengalamanUmrah.id" :value="pengalamanUmrah.id">
                  {{ pengalamanUmrah.name }}
                </option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Tahun Umrah</label>
              <input 
                v-model="formData.tahun_umrah" 
                type="text" 
                class="input" 
                
                placeholder="Masukan Tahun Umrah"
              />
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Berangkat Dari</label>
              <input v-model="formData.berangkat_dari" type="text" class="input" placeholder="berangkat dari ......."/>
            </div>
          </div>

          <!-- Pekerjaan -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Pekerjaan</label>
              <select v-model="formData.mst_pekerjaan_id" class="input">
                <option value="">Pilih pekerjaan</option>
                <option v-for="pekerjaan in pekerjaanList" :key="pekerjaan.id" :value="pekerjaan.id">
                  {{ pekerjaan.name }}
                </option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Nama Instansi Pekerjaan</label>
              <input v-model="formData.profession_instantion_name" type="text" class="input"  placeholder="masukan nama instansi pekerjaan"/>
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Alamat Instansi Pekerjaan</label>
              <input v-model="formData.profession_instantion_address" type="text" class="input" placeholder="masukan alamat instansi pekerjaan"/>
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Telepon Pekerjaan</label>
              <input v-model="formData.profession_instantion_telephone" type="tel" class="input" placeholder="masukan nomor telepon pekerjaan"/>
            </div>
          </div>

          <!-- Pendidikan & Penyakit -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Pendidikan Terakhir</label>
              <select v-model="formData.last_education" class="input">
                <option value="">Pilih pendidikan</option>
                <option v-for="pendidikan in pendidikanList" :key="pendidikan.id" :value="pendidikan.id">
                  {{ pendidikan.name }}
                </option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Riwayat Penyakit</label>
              <input v-model="formData.desease" type="text" class="input" placeholder="Masukan Riwayat Penyakit (BILA ADA)"/>
            </div>
          </div>

          <!-- Agen -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">Agen</label>
            <select v-model="formData.agen_id" class="input">
              <option value="0">Pilih agen</option>
              <option v-for="agen in agenList" :key="agen.id" :value="agen.id">
                {{ agen.Member.fullname }}
              </option>
            </select>
          </div>

          <!-- Upload Foto -->
          <div class="space-y-2">
            <label class="block font-medium text-gray-700">Foto Jamaah</label>
            <input 
              type="file" 
              @change="handleFoto" 
              accept="image/*" 
              class="input" 
            />
            <img 
              v-if="photoPreview" 
              :src="photoPreview" 
              class="w-32 h-32 object-cover rounded border border-gray-300 mt-2" 
            />
          </div>

          <!-- Kelengkapan Dokumen -->
          <div class="border p-4 rounded-xl">
            <p class="font-semibold mb-2 text-gray-700">Kelengkapan Dokumen</p>
            <div class="grid grid-cols-2 gap-2">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="dokumen.pas_foto_4x6" class="h-4 w-4" />
                Pas Foto 4x6
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="dokumen.pas_foto_3x4" class="h-4 w-4" />
                Pas Foto 3x4
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="dokumen.fc_passport" class="h-4 w-4" />
                Fotocopy Passport
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="dokumen.fc_kk" class="h-4 w-4" />
                Fotocopy KK
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="dokumen.fc_ktp" class="h-4 w-4" />
                Fotocopy KTP
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="dokumen.buku_nikah" class="h-4 w-4" />
                Buku Nikah Asli
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="dokumen.akte_lahir" class="h-4 w-4" />
                Akte Kelahiran
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="dokumen.buku_kuning" class="h-4 w-4" />
                Buku Kuning
              </label>
            </div>
            <textarea 
              v-model="dokumen.keterangan" 
              placeholder="Keterangan Tambahan" 
              class="input mt-2 w-full"
            ></textarea>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="text-red-500 text-sm mt-2">
            {{ errorMessage }}
          </div>

          <!-- Tombol Submit -->
          <div class="flex justify-end space-x-4 pt-4">
            <button
              type="submit"
              class="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Menyimpan...</span>
              <span v-else>Simpan Jamaah</span>
            </button>
            <button 
              @click="$emit('close')" 
              class="text-sm text-gray-500 hover:underline"
              :disabled="isLoading"
            >
              Tutup
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import {
  daftarProvinsi,
  daftarKabupaten,
  daftarKecamatan,
  daftarKelurahan,
  daftarMahram,
  daftarPekerjaan,
  daftarPendidikan,
  daftarPengalaman,
} from '../../../../../service/data_master'

import { addJamaah } from '../../../../../service/daftar_jamaah'

import { getMember } from '../../../../../service/member'

import { daftarAgen } from '../../../../../service/agen'

const props = defineProps<{
  defaultData: {
    id?: number
    fullname?: string
    identity_number?: string
    gender?: string
    email?: string
    whatsapp_number?: string
    birth_place?: string
    birth_date?: string
    photo_url?: string
  }
}>()

const emit = defineEmits(['close','success'])

// Format tanggal
const formatDate = (rawDate?: string): string => {
  if (!rawDate) return '-'
  const d = new Date(rawDate)
  return d.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Data form
const formData = reactive({
  memberId: '',
  fullname: '',
  identity_number: '',
  identity_type: '',
  gender: '',
  birth_place: '',
  birth_date: '',
  whatsapp_number: '',
  password: '',
  kelurahan_id: null,
  agen_id: 0,
  title: '',
  nama_ayah: '',
  nama_passport: '',
  nomor_passport: '',
  tanggal_di_keluarkan_passport: '',
  tempat_di_keluarkan_passport: '',
  masa_berlaku_passport: '',
  kode_pos: '',
  nomor_telephone: '',
  pengalaman_haji: '',
  tahun_haji: null,
  pengalaman_umrah: '',
  tahun_umrah: null,
  desease: '',
  last_education: '',
  blood_type: '',
  mst_pekerjaan_id: '',
  profession_instantion_name: '',
  profession_instantion_address: '',
  profession_instantion_telephone: '',
  nama_keluarga: '',
  alamat_keluarga: '',
  telephone_keluarga: '',
  status_nikah: 'belum_menikah',
  tanggal_nikah: null,
  kewarganegaraan: 'wni',
  provinsi_id: null,
  kabupaten_id: null,
  kecamatan_id: null,
  berangkat_dari: '',
  alamat: '',
  email: ''
})

// Data mahram
const mahramList = ref<Array<{id?: number, mahram_id?: number, jenis: string}>>([])
const searchMahram = ref<string[]>([])
const isOpenMahram = ref<boolean[]>([])

// Dokumen
const dokumen = reactive({
  pas_foto_4x6: false,
  pas_foto_3x4: false,
  fc_passport: false,
  fc_kk: false,
  fc_ktp: false,
  buku_nikah: false,
  akte_lahir: false,
  buku_kuning: false,
  keterangan: ''
})

// Foto
const photoPreview = ref('')
const photoFile = ref<File | null>(null)

// Data master
const provinsiList = ref([])
const kabupatenList = ref([])
const kecamatanList = ref([])
const kelurahanList = ref([])
const mahramOptions = ref([])
const pekerjaanList = ref([])
const pendidikanList = ref([])
const pengalamanList = ref([])
const agenList = ref([])
const memberList = ref([])

// Search dropdown
const searchProvinsi = ref('')
const searchKabupaten = ref('')
const searchKecamatan = ref('')
const searchKelurahan = ref('')
const isOpenProvinsi = ref(false)
const isOpenKabupaten = ref(false)
const isOpenKecamatan = ref(false)
const isOpenKelurahan = ref(false)

// Status
const isLoading = ref(false)
const errorMessage = ref('')

// Computed
const filteredProvinsi = computed(() => {
  return provinsiList.value.filter(p => 
    p.name.toLowerCase().includes(searchProvinsi.value.toLowerCase())
  );
});

const filteredKabupaten = computed(() => {
  // Pastikan kabupatenList sudah terisi dan berupa array
  if (!kabupatenList.value || !Array.isArray(kabupatenList.value)) return []
  
  // Jika tidak ada provinsi yang dipilih, return array kosong
  if (!formData.provinsi_id) return []
  
  return kabupatenList.value.filter(kab => 
    kab.provinsi_id === formData.provinsi_id &&
    kab.name.toLowerCase().includes(searchKabupaten.value.toLowerCase())
  )
})

const filteredKecamatan = computed(() => {
  return kecamatanList.value.filter(p => 
    p.name.toLowerCase().includes(searchKecamatan.value.toLowerCase())
  )
})

const filteredKelurahan = computed(() => {
  return kelurahanList.value.filter(p => 
    p.name.toLowerCase().includes(searchKelurahan.value.toLowerCase())
  )
})

const filteredMahram = (index: number) => {
  const term = searchMahram.value[index]?.toLowerCase() || ''
  return memberList.value.filter(p => 
    p.fullname.toLowerCase().includes(term)
  )
}

// Methods
const addMahram = () => {
  mahramList.value.push({ jenis: '' })
  searchMahram.value.push('')
  isOpenMahram.value.push(false)
}

const handleFoto = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    photoFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}


const selectedProvinsi = ref('')

const selectProvinsi = (provinsi) => {
  formData.provinsi_id = provinsi.id
  selectedProvinsi.value = provinsi
  searchProvinsi.value = provinsi.name
  isOpenProvinsi.value = false
  fetchKabupaten(provinsi.id)
}

const selectedKabupaten = ref(null)

const selectKabupaten = (kabupaten) => {
  formData.kabupaten_id = kabupaten.id
  selectedKabupaten.value = kabupaten
  searchKabupaten.value = kabupaten.name
  isOpenKabupaten.value = false
  fetchKecamatan(kabupaten.id)
}

const selectedKecamatan = ref('')

const selectKecamatan = (kecamatan) => {
  formData.kecamatan_id = kecamatan.id
  selectedKecamatan.value = kecamatan
  searchKecamatan.value = kecamatan.name
  isOpenKecamatan.value = false
  fetchKelurahan(kecamatan.id)
}

const selectedKelurahan = ref('')

const selectKelurahan = (kelurahan) => {
  formData.kelurahan_id = kelurahan.id
  selectedKelurahan.value = kelurahan
  searchKelurahan.value = kelurahan.name
  isOpenKelurahan.value = false
}

const selectedMahram = ref('')

const selectMahram = (person, index) => {
  mahramList.value[index].mahram_id = person.id
  selectedMahram.value = person
  searchMahram.value[index] = person.fullname
  isOpenMahram.value[index] = false
}

// Fetch data
const fetchDataMaster = async () => {
  try {
    const [
      provinsiRes,
      pekerjaanRes,
      pendidikanRes,
      agenRes,
      mahramRes,
      memberRes,
      pengalamanRes,
    ] = await Promise.all([
      daftarProvinsi(),
      daftarPekerjaan(),
      daftarPendidikan(),
      daftarAgen(),
      daftarMahram(),
      getMember(),
      daftarPengalaman(),
    ])

    provinsiList.value = provinsiRes.data
    pekerjaanList.value = pekerjaanRes.data
    pendidikanList.value = pendidikanRes.data
    agenList.value = agenRes.data
    mahramOptions.value = mahramRes.data
    memberList.value = memberRes.data
    pengalamanList.value = pengalamanRes.data

     console.log('Provinsi:', provinsiList.value)
    console.log('Pekerjaan:', pekerjaanList.value)
    console.log('Pendidikan:', pendidikanList.value)
    console.log('Agen:', agenList.value)
    console.log('Mahram:', mahramOptions.value)
    console.log('Member:', memberList.value)
  } catch (error) {
    console.error('Error fetching data master:', error)
  }
}

const fetchKabupaten = async (provinsiId) => {
  try {
    const response = await daftarKabupaten({ provinsi_id: provinsiId })
    kabupatenList.value = response.data
    formData.kabupaten_id = null
    formData.kecamatan_id = null
    formData.kelurahan_id = null
    searchKabupaten.value = ''
    searchKecamatan.value = ''
    searchKelurahan.value = ''
  } catch (error) {
    console.error('Error fetching kabupaten:', error)
  }
}

const fetchKecamatan = async (kabupatenId) => {
  try {
    const response = await daftarKecamatan({ kabupaten_id: kabupatenId })
    kecamatanList.value = response.data
    formData.kecamatan_id = null
    formData.kelurahan_id = null
    searchKecamatan.value = ''
    searchKelurahan.value = ''
  } catch (error) {
    console.error('Error fetching kecamatan:', error)
  }
}

const fetchKelurahan = async (kecamatanId) => {
  try {
    const response = await daftarKelurahan({ kecamatan_id: kecamatanId })
    kelurahanList.value = response.data
    formData.kelurahan_id = null
    searchKelurahan.value = ''
  } catch (error) {
    console.error('Error fetching kelurahan:', error)
  }
}

// Submit form
const handleSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    // Ambil mahram pertama (karena backend minta 1 object, bukan array)
    const mahram = mahramList.value.length > 0 ? {
      mahram_id: mahramList.value[0].mahram_id,
      mst_mahram_type_id: mahramList.value[0].jenis
    } : null

    // Siapkan payload JSON
    const payload: any = {
      ...formData,
      memberId: props.defaultData?.id || undefined,
      photo_4_6: dokumen.pas_foto_4x6 ? 'ada' : 'tidak_ada',
      photo_3_4: dokumen.pas_foto_3x4 ? 'ada' : 'tidak_ada',
      fc_passport: dokumen.fc_passport ? 'ada' : 'tidak_ada',
      fc_kk: dokumen.fc_kk ? 'ada' : 'tidak_ada',
      fc_ktp: dokumen.fc_ktp ? 'ada' : 'tidak_ada',
      buku_nikah: dokumen.buku_nikah ? 'ada' : 'tidak_ada',
      akte_lahir: dokumen.akte_lahir ? 'ada' : 'tidak_ada',
      buku_kuning: dokumen.buku_kuning ? 'ada' : 'tidak_ada',
      keterangan: dokumen.keterangan,
      mahram: mahram,
    }

    // Handle tanggal kosong/null biar gak error
    if (!formData.tanggal_nikah) payload.tanggal_nikah = null
    if (!formData.tahun_haji) payload.tahun_haji = null
    if (!formData.tahun_umrah) payload.tahun_umrah = null

    // Ubah birth_date ke format YYYY-MM-DD
    if (payload.birth_date) {
      payload.birth_date = new Date(payload.birth_date).toISOString().split('T')[0]
    }

    // Kirim ke API
    const response = await addJamaah(payload) // make sure addJamaah handle JSON not FormData
    console.log('Response:', response)

    emit('success')

  } catch (error) {
    console.error('Error:', error)
    errorMessage.value = error.message || 'Terjadi kesalahan saat menyimpan data'
  } finally {
    isLoading.value = false
  }
}



// Init data
onMounted(() => {
  fetchDataMaster()

  // Jika ada data default, isi form
  if (props.defaultData) {
    Object.assign(formData, {
      MemberId: props.defaultData.memberId || '',
      fullname: props.defaultData.fullname || '',
      identity_number: props.defaultData.identity_number || '',
      gender: props.defaultData.gender || 'laki_laki',
      whatsapp_number: props.defaultData.whatsapp_number || '',
      birth_place: props.defaultData.birth_place || '',
      birth_date: props.defaultData.birth_date || '',
      email: props.defaultData.email || ''
    })
  }
})
</script>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors;
}
</style>