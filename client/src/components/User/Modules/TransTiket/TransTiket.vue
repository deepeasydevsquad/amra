<template>
  <div class="p-4">
      <!-- Button to open the dialog -->
    <Button class="!bg-[#455494] !text-white px-4 py-2 rounded-lg hover:!bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2 w-full md:w-auto justify-center"  size="small" label="Memulai Transaksi Tiket" icon="pi pi-plus" @click="showTicketTransactionDialog = true" />

    <div class="card mt-4">
    <DataTable
      :value="ticketsPaginated"
      :paginator="true"
      :rows="1"
      @page="onPage"
      :rowsPerPageOptions="[1, 2, 3]"
      responsiveLayout="scroll"
      stripedRows
    >
      <Column bodyStyle="text-align: center;" field="register" headerClass="text-xs text-center">
          <template #header>
               <div class="flex-1 text-center"><strong>No Register</strong></div>
          </template>
          <template #body="{ data }">
          <div class="font-bold text-xs">{{ data.nomor_register }}</div>
          <div class="text-xs text-gray-500">{{ dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}</div>
          </template>
      </Column>
      <Column bodyStyle="text-align: center;" headerClass="text-xs">
        <template #header>
               <div class="flex-1 text-center"><strong>Info Tiket</strong></div>
          </template>
        <template #body="{ data }">
          <div class="flex flex-wrap gap-2">
            <div v-for="(detail, index) in data.ticket_details" :key="index" class="border p-2 rounded">
              <div class="grid grid-cols-2 gap-x-4 text-xs">
                <div class="space-y-1">
                  <p class="flex items-center space-x-1">
                    <span class="min-w-[90px]">PAX</span>
                    <span>:</span>
                    <span>{{ detail.pax }}</span>
                  </p>
                  <p class="flex items-center space-x-1">
                    <span class="min-w-[90px]">Kode Booking</span>
                    <span>:</span>
                    <span>{{ detail.code_booking }}</span>
                  </p>
                  <p class="flex items-center space-x-1">
                    <span class="min-w-[90px]">Airlines</span>
                    <span>:</span>
                    <span>{{ detail.airlines_name }}</span>
                  </p>
                </div>
                <div class="space-y-1">
                  <p class="flex items-center space-x-1">
                    <span class="min-w-[90px]">Tgl Berangkat</span>
                    <span>:</span>
                    <span>{{ detail.departure_date }}</span>
                  </p>
                  <p class="flex items-center space-x-1">
                    <span class="min-w-[90px]">Harga Travel</span>
                    <span>:</span>
                    <span>Rp {{ detail.travel_price }}</span>
                  </p>
                  <p class="flex items-center space-x-1">
                    <span class="min-w-[90px]">Harga Kostumer</span>
                    <span>:</span>
                    <span>Rp {{ detail.costumer_price }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        
        </template>
      </Column>
      <Column headerClass="text-xs">
        <template #header>
               <div class="flex-1 text-center"><strong>Info Pembayaran</strong></div>
          </template>
        <template #body="{ data }">
          <p class="flex items-center space-x-1 text-xs">
                    <span class="min-w-[90px]">TOTAL TRANSAKSI TIKET</span>
                    <span>:</span>
                    <span>{{ calculateTotalTransaksiTiket(data.ticket_details) }}</span>
          </p>
          <p class="flex items-center space-x-1 text-xs">
                    <span class="min-w-[90px]">TOTAL PEMBAYARAN</span>
                    <span>:</span>
                    <span>{{ calculateTotalPayment(data.payment_histories) }}</span>
          </p>
          
          <p class="text-xs"><span>SISA PEMBAYARAN:</span> Rp {{ calculateSisaPembayaran(data.ticket_details, data.payment_histories) }}</p>
          <p class="mt-2 text-xs font-semibold text-gray-800">
            Riwayat Pembayaran <span class="text-red-600">(Tiga Transaksi Terakhir)</span>
          </p>
        
          <div v-for="(payment, index) in data.payment_histories.slice(0,3)" :key="index" class="mb-2 border p-2 rounded">
          <ul class="text-xs text-gray-600 list-disc ml-5">
            <li>
              Tanggal Transaksi {{ dayjs(payment.updatedAt).format('YYYY-MM-DD HH:mm:ss') }} | No Invoice: 
              <span class="text-red-600 font-bold text-xs">{{ payment.invoice }}</span><br />
              Nama Petugas: {{ payment.petugas }} | Nama Pelanggan: {{ payment.costumer_name }} | Nomor Identitas : {{ payment.costumer_identity }}
            </li>
          </ul>
        </div>
      </template>
      </Column>
      <Column bodyStyle="text-align: center;" headerClass="text-xs" >
        <template #header>
               <div class="flex-1 text-center"><strong>Aksi</strong></div>
        </template>
        <template #body>
        <div class="flex flex-col gap-2">
          <Button class="!bg-[#455494] !text-white px-4 py-2 rounded-lg hover:!bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2 w-full md:w-auto justify-center" size="small" icon="pi pi-refresh" rounded/>
          <Button class="!bg-[#455494] !text-white px-4 py-2 rounded-lg hover:!bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2 w-full md:w-auto justify-center" size="small" icon="pi pi-calendar" rounded />
          <Button class="!bg-[#455494] !text-white px-4 py-2 rounded-lg hover:!bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2 w-full md:w-auto justify-center" size="small" icon="pi pi-list" rounded />
          <Button size="small" icon="pi pi-times" rounded severity="danger" />
        </div>
      </template>
      </Column>
    </DataTable>
  </div>
      
      <Dialog @hide="onDialogHide" position="topright" :draggable="false" v-model:visible="showTicketTransactionDialog" :modal="true" header="Form Transaksi Tiket" :style="{ width: '80vw' }" :breakpoints="{ '960px': '95vw' }">
            <div class="p-6 max-w-6xl mx-auto bg-white rounded shadow">
              <div class="mb-2 text-right text-red-600 font-semibold">
                NO REGISTER : #{{ registerNumber }}
              </div>
          
              <!-- DataTable for Ticket Rows -->
              <DataTable :value="tickets" class="mb-1" responsiveLayout="scroll">
                <Column headerClass="text-xs" bodyClass="text-center align-middle">
                  <template #header>
                        <div class="flex-1 text-center"><strong>Aksi</strong></div>
                  </template>
                  
                  <template #body="slotProps">
                    <Button outlined size="small" icon="pi pi-times" severity="danger" @click="removeTicket(slotProps.index)" />
                  </template>
                </Column>
          
                <Column field="pax" headerClass="text-xs" bodyClass="text-center align-middle">
                  <template #header>
                        <div class="flex-1 text-center"><strong>Pax</strong></div>
                  </template>
                  <template #body="slotProps">
                    <InputNumber size="small" v-model="slotProps.data.pax" inputClass="w-12" />
                  </template>
                  
                </Column>
          
                <Column field="maskapai" headerClass="text-xs" bodyClass="text-center align-middle">
                  <template #header>
                        <div class="flex-1 text-center"><strong>Maskapai</strong></div>
                  </template>
                  <template #body="slotProps">
                    <Dropdown
                      size="small"
                      v-model="slotProps.data.maskapai.id"
                      :options="airlinesList"
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Pilih Maskapai"
                      class="w-32"
                    />
                  </template>
                </Column>
          
                <Column field="code_booking" headerClass="text-xs" bodyClass="text-center align-middle">
                  <template #header>
                        <div class="flex-1 text-center"><strong>Kode Booking</strong></div>
                  </template>
                  <template #body="slotProps">
                    <InputText size="small" v-model="slotProps.data.code_booking" class="w-20" />
                  </template>
                </Column>
          
                <Column field="departure_date" headerClass="text-xs" bodyClass="text-center align-middle">
                  <template #header>
                        <div class="flex-1 text-center"><strong>Tanggal Berangkat</strong></div>
                  </template>
                  <template #body="slotProps">
                    <Calendar showIcon class="w-34" size="small" v-model="slotProps.data.departure_date" dateFormat="yy-mm-dd" />
                  </template>
                </Column>
          
                <Column field="travel_price" headerClass="text-xs" bodyClass="text-center align-middle">
                  <template #header>
                        <div class="flex-1 text-center"><strong>Harga Travel</strong></div>
                  </template>
                  <template #body="slotProps">
                    <InputNumber placeholder="Rp 0" :minFractionDigits="0" :maxFractionDigits="0" class="w-32" size="small" v-model="slotProps.data.travel_price" mode="currency" currency="IDR" locale="id-ID" />
                  </template>
                </Column>
          
                <Column field="customer_price" headerClass="text-xs" bodyClass="text-center align-middle">
                  <template #header>
                        <div class="flex-1 text-center"><strong>Harga Kostumer</strong></div>
                  </template>
                  <template #body="slotProps">
                    <InputNumber placeholder="Rp 0" :minFractionDigits="0" :maxFractionDigits="0" class="w-32" size="small" v-model="slotProps.data.customer_price" mode="currency" currency="IDR" locale="id-ID" />
                  </template>
                </Column>
          
                <Column headerClass="text-xs" bodyClass="text-center align-middle">
                  <template #header>
                        <div class="flex-1 text-center"><strong>Total</strong></div>
                  </template>
                  <template #body="slotProps">
                    <span class="text-sm">
                      Rp {{ formatRupiah(slotProps.data.pax * slotProps.data.customer_price) }}
                    </span>
                  </template>
                </Column>
              </DataTable>
          
              <Button class="!bg-[#455494] !text-white px-4 py-2 rounded-lg hover:!bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2 w-full md:w-auto justify-center" size="small" label="Tambah Row" icon="pi pi-plus" outlined @click="addTicket" />
          
              <div class="text-right text-sm font-semibold mb-6">
                TOTAL: Rp {{ formatRupiah(grandTotal) }}
              </div>
          
              <div class="mb-2 text-right text-red-600 font-semibold">
                NO INVOICE : #{{ invoiceNumber }}
              </div>
          
              <!-- Customer Info -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="col-span-1">
                  <label class="block text-sm text-gray-700 font-medium mb-1">Nama Pelanggan</label>
                  <InputText size="small" v-model="customer.costumer_name" class="w-64" />
                </div>
                <div class="col-span-1">
                  <label class="block text-sm text-gray-700 font-medium mb-1">Nomor Identitas Pelanggan</label>
                  <InputText size="small" v-model="customer.costumer_identity" class="w-64" />
                </div>
                <div class="col-span-1 col-start-3">
                  <label class="block text-sm text-gray-700 font-medium mb-1">Dibayar</label>
                  <InputNumber placeholder="Rp 0" :minFractionDigits="0" :maxFractionDigits="0" size="small" v-model="customer.dibayar" mode="currency" currency="IDR" locale="id-ID" class="w-32" />
                </div>
                <div class="col-span-1">
                  <label class="block text-sm text-gray-700 font-medium mb-1">Sisa</label>
                  <InputNumber disabled placeholder="Rp 0" :minFractionDigits="0" :maxFractionDigits="0" size="small" v-model="sisaBayar" mode="currency" currency="IDR" locale="id-ID" class="w-32" />
                </div>
              </div>
          
              <!-- Buttons -->
              <div class="flex justify-end space-x-2">
                <Button @click="showTicketTransactionDialog=false" size="small" label="CANCEL" severity="secondary" outlined />
                <Button 
                :disabled="!isFormValid"
                class="!bg-[#455494] !text-white px-4 py-2 rounded-lg hover:!bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2 w-full md:w-auto justify-center" size="small" label="BAYAR" @click="submitBayar" outlined/>
              </div>
            </div>
      </Dialog>
  </div>
  </template>
  
  <script setup lang="ts">
  import dayjs from 'dayjs'
  import { reactive, computed, ref, onMounted, watchEffect } from 'vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import InputText  from 'primevue/inputtext'
  import InputNumber from 'primevue/inputnumber'
  import Calendar from 'primevue/calendar'
  import Dropdown from 'primevue/dropdown'
  import Button from 'primevue/button'
  import Dialog from 'primevue/dialog'
  import Swal from 'sweetalert2';
  // Import API
  import {daftarAirlines} from '@/service/data_master'
  import { add_tiket, get_transactions } from '@/service/trans_tiket'

  const ticketsPaginated = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadTickets(page = 1, perPage = 10) {
        loading.value = true;
        error.value = null;

        try {
          const response = await get_transactions();
          ticketsPaginated.value = response.data;  // adjust depending on your API response shape
          console.log('paginated ticket data:', ticketsPaginated.value);
        } catch (err) {
          console.log('error tiket:', err);
          //error.value = err.toString();
        } finally {
          loading.value = false;
        }
  }

  const showTicketTransactionDialog = ref(false)

  const registerNumber = ref('')
  const invoiceNumber = ref('')

  function generateRegisterNumber() {
      // Generate 2 random uppercase letters (A-Z)
      const letters = Array.from({ length: 2 }, () =>
          String.fromCharCode(65 + Math.floor(Math.random() * 26))
      ).join('');

      // Generate 8-digit random number, padded with zeros
      const number = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');

      return `${letters}${number}`; // e.g., AB12345678
  }

  const airlinesList = ref<Airline[]>([])
 
  interface Airline {
       id: number;
       company_id: number;
       name: string;
  }
  const fetchAirlines = async () => {
      try {
        const response = await daftarAirlines()
        airlinesList.value = response.data
        
      } catch (error) {
        console.error('Error fetching airlines:', error)
      }
  }
  // initialize data
  onMounted(() => {
     registerNumber.value = generateRegisterNumber()
     invoiceNumber.value = generateRegisterNumber()
     fetchAirlines()
     loadTickets();
  })
  function onPage(event : any) {
      // event.page is zero-based page index
      const page = event.page + 1;
      const perPage = event.rows;
      loadTickets(page, perPage);
}


  interface TicketTransaction {
    tickets: Ticket[];
    customer: Customer;
    nomor_register: string;
    invoice: string;
  }
  interface Ticket {
      pax: number;
      maskapai: {id: number; name: string; company_id: number};
      airlines_id: number;
      code_booking: string;
      departure_date: Date;
      travel_price: number;
      customer_price: number;
  }
  interface Customer {
      costumer_name: string;
      costumer_identity: string;
      dibayar: number;
  }
  const tickets = reactive<Ticket[]>([
      {
        pax: 0,
        maskapai: { id: 0, name: 'Garuda', company_id: 0 },
        airlines_id: 0,
        code_booking: '',
        departure_date: new Date(),
        travel_price: 0,
        customer_price: 0
      }
  ])
  const resetTickets = () => {
      tickets.splice(0, tickets.length); // clear the array
      tickets.push({
        pax: 0,
        maskapai: { id: 0, name: 'Garuda', company_id: 0 },
        airlines_id: 0,
        code_booking: '',
        departure_date: new Date(),
        travel_price: 0,
        customer_price: 0
      });
  };
  
  const bayar = async(ticketTransaction : TicketTransaction) => {
      try {
        const response = await add_tiket(ticketTransaction);
        if (response?.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Transaksi Berhasil',
            text: response.message || 'Data berhasil disimpan.',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Transaksi Gagal',
            text: response?.message || 'Terjadi kesalahan saat menyimpan data.',
            confirmButtonText: 'OK'
          });
        }
      }
      catch(error : any) {
          Swal.fire({
          icon: 'error',
          title: 'Kesalahan Server',
          text: error.message || 'Gagal menyimpan transaksi.',
          confirmButtonText: 'Tutup'
    });
      }
  };

  function submitBayar() {
      const tiketTransaksi: TicketTransaction = {
        invoice: invoiceNumber.value,
        nomor_register: registerNumber.value,

        tickets: tickets.map(t => ({
          pax: t.pax,
          maskapai: t.maskapai,
          airlines_id: t.maskapai.id,
          code_booking: t.code_booking,
          departure_date: t.departure_date,
          travel_price: t.travel_price,
          customer_price: t.customer_price
        })),
        customer: {
          costumer_name: customer.costumer_name,
          costumer_identity: customer.costumer_identity,
          dibayar: customer.dibayar
        }
      }
      bayar(tiketTransaksi)
      showTicketTransactionDialog.value = false
      loadTickets() // refresh
  }
  watchEffect(() => {
    tickets.forEach(ticket => {
      if (typeof ticket.maskapai.id === 'number') {
        const match = airlinesList.value.find(a => a.id === ticket.maskapai.id)
        if (match) ticket.maskapai = match
      }
    })
  })
  
  function addTicket() {
    tickets.push({
      pax: 0,
      maskapai: {id : 0, name: '', company_id: 0},
      airlines_id: 0,
      code_booking: '',
      departure_date: new Date(),
      travel_price: 0,
      customer_price: 0
    })
  }
  
  function removeTicket(index: any) {
    tickets.splice(index, 1)
  }
  
  const customer = reactive({
    costumer_name: '',
    costumer_identity: '',
    dibayar: 0
  })
  
  const grandTotal = computed(() =>
    tickets.reduce((sum, t) => sum + (t.pax * t.customer_price), 0)
  )
  
  const sisaBayar = computed(() => Math.max(0, grandTotal.value - customer.dibayar))
  
  function formatRupiah(amount : any) {
    return amount.toLocaleString('id-ID')
  }
  function calculateTotalTransaksiTiket(ticketDetails: any) {
    return ticketDetails.reduce((total : number, detail : any) => {
      const pax = Number(detail.pax) || 0;
      const price = Number(detail.costumer_price) || 0;
      return total + (pax * price);
    }, 0);
  }
  function calculateTotalPayment(paymentHistory: any) {
    console.log(paymentHistory);
    return paymentHistory.reduce((total : number, payment : any) => {
      const nominal = Number(payment.nominal) || 0;
      return total + nominal;
    }, 0);
  }
  function calculateSisaPembayaran(ticketDetails: any[], paymentHistory: any[]): number {
      const totalTransaksi = calculateTotalTransaksiTiket(ticketDetails);
      const totalPayment = calculateTotalPayment(paymentHistory);
      return totalTransaksi - totalPayment;
  }
  
  const isFormValid = computed(() => {
  if (!customer.costumer_name || !customer.costumer_identity || customer.dibayar === null) {
    return false;
  }

  for (const ticket of tickets) {
    if (
      ticket.pax <= 0 ||
      !ticket.maskapai.id ||
      !ticket.code_booking ||
      !ticket.departure_date ||
      !ticket.travel_price ||
      !ticket.customer_price
    ) {
      return false;
    }
  }

  return true;
});
const resetDialogState = () => {
  resetTickets();
  customer.costumer_name = '';
  customer.costumer_identity = '';
  customer.dibayar = 0;
  // reset other reactive states as needed
}
const onDialogHide = () => {
  resetDialogState();
}

  
</script>

 
  