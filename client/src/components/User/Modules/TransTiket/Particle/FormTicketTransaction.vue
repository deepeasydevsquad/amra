<template>
    <Form :form-status="showForm" :label="'Form Transaksi Tiket'"  width="w-full max-w-6xl px-4 sm:px-6 lg:px-8" @close="handleCancel" @cancel="handleCancel" @submit="handleSubmit" :submitLabel="'BAYAR'">
      <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-6 text-right">
        <div class="text-red-600 font-bold text-lg">
          NO REGISTER: #{{ form.nomor_register }}
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-0 ">
            <!-- Ticket Rows -->
            <div class="space-y-4">
              <div v-for="(ticket, index) in form.tickets" :key="index" class="grid grid-cols-1 md:grid-cols-8 gap-2 border p-4 rounded-md shadow-sm">
                  <!-- <span class="text-black">{{ ticket.maskapai }}</span> -->
                  <div class="grid grid-cols-1 md:grid-cols-1 gap-1 mb-6 ">
                    <!-- Aksi -->
                    <DangerButton @click="removeTicket(index)" class="p-2 "><DeleteIcon /></DangerButton>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-6 ">
                    <!-- Pax -->
                    <InputText v-model.number="ticket.pax" label="Pax" id="pax" placeholder="Pax" :error="errors.tickets?.[index]?.pax" />
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-6 ">
                    <!-- Maskapai -->
                    <SelectField v-model="ticket.maskapai" id="maskapai" label="Maskapai" placeholder="Pilih Maskapai" :options="maskapaiList" :error="errors.tickets?.[index]?.maskapai" />
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-6 ">
                    <!-- Code Booking -->
                    <InputText v-model="ticket.code_booking" label="Kode Booking" id="code_booking" placeholder="Kode Booking" :error="errors.tickets?.[index]?.code_booking" />
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-6 ">
                  <!-- Departure Date -->
                    <InputDate v-model="ticket.departure_date" id="departure_date" label="Tanggal Berangkat" :error="errors.tickets?.[index]?.departure_date" />
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-6 ">
                    <!-- Travel Price -->
                    <InputText v-model.number="ticket.travel_price" label="Harga Travel" id="travel_price" placeholder="Harga Travel" :error="errors.tickets?.[index]?.travel_price" />
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-6 ">
                    <!-- Customer Price -->
                    <InputText v-model.number="ticket.customer_price" label="Harga Customer" id="customer_price" placeholder="Harga Customer" :error="errors.tickets?.[index]?.customer_price" />
                  </div>
                  <div class="flex flex-col">
                    <label for="total" class="text-sm font-medium text-gray-700 mb-1">Total</label>
                    <div id="total" class="bg-gray-100 text-gray-800 px-3 py-2 rounded border border-gray-300">
                      {{ formatRupiah(ticket.customer_price * ticket.pax) }}
                    </div>
                  </div>
              </div>
              <!-- Add Ticket Button -->
              <div class="flex justify-end">
                  <button type="button" @click="addTicket" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  + Tambah Tiket
                  </button>
              </div>
              <!-- Nomor Invoice -->
              <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-6 text-right">
                <div class="text-red-600 font-bold text-lg">
                  NO INVOICE: #{{ form.invoice }}
                </div>
              </div>
              <!-- Customer Data -->
              <div class="mt-6 border-t pt-4">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <InputText
                      v-model="form.customer.costumer_name"
                      :error="errors.costumer_name"
                      id="costumer_name"
                      label="Nama Pelanggan"
                      placeholder="Nama Pelanggan"
                    />
                  </div>
                  <div>
                    <InputText
                      v-model="form.customer.costumer_identity"
                      :error="errors.costumer_identity"
                      id="costumer_identity"
                      label="Nomor Identitas Pelanggan"
                      placeholder="Nomor Identitas Pelanggan"
                    />
                  </div>
                  <div>
                    <InputText
                      v-model.number="form.customer.dibayar"
                      :error="errors.dibayar"
                      id="dibayar"
                      label="Dibayar"
                      placeholder="Dibayar"
                    />
                  </div>
                  <div class="flex flex-col">
                    <label for="sisa" class="text-sm font-medium text-gray-700 mb-1">Sisa</label>
                    <div id="sisa" class="bg-gray-100 text-gray-800 px-3 py-2 rounded border border-gray-300">
                      {{ formatRupiah(calculateSisa) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </div>

    </Form>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, toRaw, onMounted, computed } from 'vue'
import { add_tiket, generate_nomor_register, generate_nomor_invoice } from '@/service/trans_tiket'
import Form from "@/components/Modal/Form.vue"
import InputText from "@/components/Form/InputText.vue"
import InputDate from "@/components/Form/InputDate.vue"
import SelectField from "@/components/Form/SelectField.vue"
import DangerButton from "@/components/Button/DangerButton.vue"
import DeleteIcon from '@/components/User/Modules/Member/Icon/DeleteIcon.vue'

// ✅ Props dari parent
const props = defineProps<{ showForm: boolean; formData: TicketTransactionForm, maskapaiList : Maskapai[] }>()


export interface TicketTransactionForm {
    id: number;
    tickets: TicketForm[];
    customer: CustomerForm;
    nomor_register: string;
    invoice: string;
}
// Definisikan tipe untuk Maskapai
export interface Maskapai {
    id: number
    name: string
    company_id: number
  }
interface TicketForm {
      pax: number;
      maskapai: Maskapai | null;
      airlines_id: number;
      code_booking: string;
      departure_date: Date | null;
      travel_price: number;
      customer_price: number;
}
interface CustomerForm {
      costumer_name: string;
      costumer_identity: string;
      dibayar: number;
}

interface ErrorFields {
  costumer_name?: string;
  costumer_identity?: string;
  dibayar?: string;
  tickets?: {
    pax?: string;
    maskapai?: string;
    code_booking?: string;
    departure_date?: string;
    travel_price?: string;
    customer_price?: string;
  }[];
}

const errors = ref<ErrorFields>({
  costumer_name: '',
  costumer_identity: '',
  dibayar: '',
  tickets: []
});

// Definisikan tipe untuk form yang sesuai dengan semua field di template
interface FormData {
    id: number;
    tickets: TicketForm[];
    customer: CustomerForm;
    nomor_register: string;
    invoice: string;

}
const emit = defineEmits<{
    (e: 'save', data: FormData): void
    (e: 'cancel'): void
    (e: 'submitted'): void
  }>()
// ✅ Data form yang akan ditampilkan
const form = ref<FormData>({
    id: 0,
    tickets: [],
    customer: {
    costumer_name: '',
    costumer_identity: '',
    dibayar: 0,
    },
    nomor_register: '',
    invoice: '',
})

// Add new ticket row
function addTicket() {
  form.value.tickets.push(createEmptyTicket())
}
// Remove ticket row
function removeTicket(index: number) {
  form.value.tickets.splice(index, 1)
}
function handleCancel() {
  emit('cancel')
    errors.value = {
      costumer_name: '',

    };
}
// Function to create a blank ticket row
function createEmptyTicket(): TicketForm {
  return {
    pax: 1,
    maskapai: null,
    airlines_id: 0,
    code_booking: '',
    departure_date: null,
    travel_price: 0,
    customer_price: 0,
  }
}
function initializeForm(data: TicketTransactionForm) {
  const fixedTickets: TicketForm[] = (data.tickets && data.tickets.length > 0)
    ? data.tickets.map(ticket => ({
        pax: ticket.pax,
        maskapai: ticket.maskapai,
        airlines_id: ticket.airlines_id,
        code_booking: ticket.code_booking ?? '',
        departure_date: null,
        travel_price: ticket.travel_price,
        customer_price: ticket.customer_price,
      }))
    : [createEmptyTicket()]
  form.value = {
    id: 0,
    tickets: fixedTickets,
    customer: {
      costumer_name: data.customer?.costumer_name ?? '',
      costumer_identity: data.customer?.costumer_identity ?? '',
      dibayar: data.customer?.dibayar ?? 0,
    },
    nomor_register: data.nomor_register ?? '',
    invoice: data.invoice ?? '',
  }
}

watch(() => props.showForm, async (val) => {
  if (val) {
    if (!props.formData.nomor_register) {
      try {
        const res = await generate_nomor_register();
        props.formData.nomor_register = res.data.nomor_register
      } catch (error) {
        console.error("Gagal generate nomor register:", error)
      }
    }
    if (!props.formData.invoice) {
      try {
        const res = await generate_nomor_invoice();
        props.formData.invoice = res.data.invoice
      } catch (error) {
        console.error("Gagal generate nomor invoice:", error)
      }
    }
    initializeForm(props.formData)
  }
});
const calculateSisa = computed(() => {
  const totalHarga = form.value.tickets.reduce((sum, t) => {
    return sum + (t.pax * t.customer_price)
  }, 0)
  return totalHarga - form.value.customer.dibayar
})
const validateForm = (): boolean => {
  let isValid = true

  // Reset errors
  errors.value = {
    costumer_name: '',
    costumer_identity: '',
    dibayar: '',
    tickets: []
  }

  // Validate customer fields
  if (!form.value.customer.costumer_name.trim()) {
    errors.value.costumer_name = 'Nama pelanggan wajib diisi'
    isValid = false
  }

  if (!form.value.customer.costumer_identity.trim()) {
    errors.value.costumer_identity = 'Nomor identitas wajib diisi'
    isValid = false
  }

  if (form.value.customer.dibayar < 0) {
    errors.value.dibayar = 'Jumlah dibayar tidak boleh negatif'
    isValid = false
  }

  // Validate each ticket row
  form.value.tickets.forEach((ticket, index) => {
    const ticketErrors: ErrorFields['tickets'][0] = {}

    if (!ticket.pax || ticket.pax <= 0) {
      ticketErrors.pax = 'Jumlah pax wajib lebih dari 0'
      isValid = false
    }

    const maskapaiId = typeof ticket.maskapai === 'object' && ticket.maskapai !== null
      ? ticket.maskapai.id : ticket.maskapai;

    if (!maskapaiId || Number(maskapaiId) === 0) {
      ticketErrors.maskapai = 'Maskapai wajib dipilih';
      isValid = false;
    }


    if (!ticket.code_booking.trim()) {
      ticketErrors.code_booking = 'Kode booking wajib diisi'
      isValid = false
    }

    if (!ticket.departure_date) {
      ticketErrors.departure_date = 'Tanggal berangkat wajib diisi'
      isValid = false
    }

    if (ticket.travel_price <= 0) {
      ticketErrors.travel_price = 'Harga travel wajib lebih dari 0'
      isValid = false
    }

    if (ticket.customer_price <= 0) {
      ticketErrors.customer_price = 'Harga customer wajib lebih dari 0'
      isValid = false
    }

    errors.value.tickets![index] = ticketErrors
  })

  return isValid
}

const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return
    }

    try {
      const transactionData = new FormData()
      if( form.value.id ) {
        transactionData.append('id', form.value.id.toString())
      }
      transactionData.append('tickets', JSON.stringify(form.value.tickets))
      transactionData.append('customer', JSON.stringify(form.value.customer))
      transactionData.append('nomor_register', form.value.nomor_register)
      transactionData.append('invoice', form.value.invoice)

      console.log("-----------------1");
      console.log(form.value.id);
      console.log("-----------------1");
      console.log("Log Form data objek");
      console.log(JSON.stringify(form.value));
      console.log("Log Form data pair");
      for (let pair of transactionData.entries()) {
        console.log(pair[0]+ ': ' + pair[1]);
      }

      const response = await add_tiket(transactionData)
      emit('submitted')

    } catch (error) {
      console.error('Gagal menyimpan data member:', error)
    }
  }

watch(
  () => form.value.tickets,
  (tickets) => {
    tickets.forEach((ticket, index) => {
      if (typeof ticket.maskapai === 'object' && ticket.maskapai !== null) {
        form.value.tickets[index].airlines_id = ticket.maskapai.id
      } else if (typeof ticket.maskapai === 'string' || typeof ticket.maskapai === 'number') {
        form.value.tickets[index].airlines_id = Number(ticket.maskapai)
      }
    })
  },
  { deep: true }
)
const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  }).format(value);
};


</script>
