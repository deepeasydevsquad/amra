import { defineStore } from 'pinia';

// Definisikan store untuk invoiceData dan simpan data ke dalam InvoiceData
export const useInvoiceStore = defineStore('invoiceData', {
  state: () => ({
    paketId: null as number | null,
    fasilitasId: null as number | null,
  }),
  actions: {
    setInvoiceData(paketId: number, fasilitasId: number) {
      this.paketId = paketId;
      this.fasilitasId = fasilitasId;
    },
  },
});
