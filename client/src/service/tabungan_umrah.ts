import api from "./api";

export const daftar_tabungan_umrah = async (param : any) => {
  try {
    const response = await api.post("/daftar_tabungan_umrah/list", param);
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil paket:", error);
    throw error;
  }
};

export const getPaket = async (id : number) => {
  try {
    const response = await api.post(`/daftar_paket/paketlist`, { id: id });
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil paket:", error);
    throw error;
  }
};

export const addPaket = async (param : any) => {
  try {
    const { data } = await api.post('/daftar_paket', param, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  } catch (error) {
    console.error("Gagal menambahkan paket:", error);
    throw error;
  }
};

export const editPaket = async (id: any, param: any) => {
  try {
    const formData = new FormData();

    // Loop semua key
    for (const key in param) {
      if (param[key] instanceof File) {
        formData.append(key, param[key]); // photo atau file
      } else if (typeof param[key] === "object") {
        formData.append(key, JSON.stringify(param[key])); // array/object
      } else {
        formData.append(key, param[key]); // string/number
      }
    }

    const response = await api.post("/daftar_paket/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Gagal mengedit paket:", error);
    throw error;
  }
};


export const deletePaket = async (id : number) => {
  try {
    const response = await api.post(`/daftar_paket/delete`,{ id : id});
    if (response.status !== 200) {
      throw new Error('Status bukan 200');
    }
    return response.data;
  } catch (error) {
    console.error("Gagal menghapus paket:", error);
    throw error;
  }
};
