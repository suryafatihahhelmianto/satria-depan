export const dataL1 = [
  { isSubtitle: true, label: "Amonia (NH3) (ppm)" },
  { isSubtitle: true, label: "Desa Kerticala" },

  {
    label: "Pengukuran 1",
    inputType: "number",
    value: formData.amoniaDesaA1,
    onChange: (e) =>
      handleInputChange("amoniaDesaA1", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("amoniaDesaA1", formData.amoniaDesaA1),
  },
  {
    label: "Pengukuran 2",
    inputType: "number",
    value: formData.amoniaDesaA2,
    onChange: (e) =>
      handleInputChange("amoniaDesaA2", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("amoniaDesaA2", formData.amoniaDesaA2),
  },
  { isSubtitle: true, label: "Desa Sumber Kulon" },
  {
    label: "Pengukuran 1",
    inputType: "number",
    value: formData.amoniaDesaB1,
    onChange: (e) =>
      handleInputChange("amoniaDesaB1", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("amoniaDesaB1", formData.amoniaDesaB1),
  },
  {
    label: "Pengukuran 2",
    inputType: "number",
    value: formData.amoniaDesaB2,
    onChange: (e) =>
      handleInputChange("amoniaDesaB2", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("amoniaDesaB2", formData.amoniaDesaB2),
  },
  { isSubtitle: true, label: "Hidrogen Sulfida (H2S) (ppm)" },
  { isSubtitle: true, label: "Desa Kerticala" },
  {
    label: "Pengukuran 1",
    inputType: "number",
    value: formData.sulfidaDesaA1,
    onChange: (e) =>
      handleInputChange("sulfidaDesaA1", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("sulfidaDesaA1", formData.sulfidaDesaA1),
  },
  {
    label: "Pengukuran 2",
    inputType: "number",
    value: formData.sulfidaDesaA2,
    onChange: (e) =>
      handleInputChange("sulfidaDesaA2", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("sulfidaDesaA2", formData.sulfidaDesaA2),
  },
  { isSubtitle: true, label: "Desa Sumber Kulon" },
  {
    label: "Pengukuran 1",
    inputType: "number",
    value: formData.sulfidaDesaB1,
    onChange: (e) =>
      handleInputChange("sulfidaDesaB1", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("sulfidaDesaB1", formData.sulfidaDesaB1),
  },
  {
    label: "Pengukuran 2",
    inputType: "number",
    value: formData.sulfidaDesaB2,
    onChange: (e) =>
      handleInputChange("sulfidaDesaB2", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("sulfidaDesaB2", formData.sulfidaDesaB2),
  },
];

export const dataL2 = [
  { isSubtitle: true, label: "Desa Kerticala" },

  {
    label: "Pengukuran 1",
    inputType: "number",
    value: formData.debuDesaA1,
    onChange: (e) =>
      handleInputChange("debuDesaA1", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("debuDesaA1", formData.debuDesaA1),
  },
  {
    label: "Pengukuran 2",
    inputType: "number",
    value: formData.debuDesaA2,
    onChange: (e) =>
      handleInputChange("debuDesaA2", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("debuDesaA2", formData.debuDesaA2),
  },
  { isSubtitle: true, label: "Desa Sumber Kulon" },
  {
    label: "Pengukuran 1",
    inputType: "number",
    value: formData.debuDesaB1,
    onChange: (e) =>
      handleInputChange("debuDesaB1", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("debuDesaB1", formData.debuDesaB1),
  },
  {
    label: "Pengukuran 2",
    inputType: "number",
    value: formData.debuDesaB2,
    onChange: (e) =>
      handleInputChange("debuDesaB2", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("debuDesaB2", formData.debuDesaB2),
  },
];

export const dataL3 = [
  {
    label: "Konsumsi Listrik (Kwh/Ton Tebu)",
    inputType: "number",
    value: formData.konsumsiListrik,
    onChange: (e) =>
      handleInputChange("konsumsiListrik", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("konsumsiListrik", formData.konsumsiListrik),
  },
  {
    label: "Jumlah Tebu (Ton)",
    inputType: "number",
    value: formData.jumlahTonTebu,
    onChange: (e) =>
      handleInputChange("jumlahTonTebu", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("jumlahTonTebu", formData.jumlahTonTebu),
  },
  {
    label: "SHS (%Tebu)",
    inputType: "number",
    value: formData.shs,
    onChange: (e) => handleInputChange("shs", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("shs", formData.shs),
  },
];

export const dataL4 = [
  { isSubtitle: true, label: "Kebisingan Ruang Produksi" },
  {
    label: "Pengukuran 1",
    inputType: "number",
    value: formData.bisingProduksi1,
    onChange: (e) =>
      handleInputChange("bisingProduksi1", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("bisingProduksi1", formData.bisingProduksi1),
  },
  {
    label: "Pengukuran 2",
    inputType: "number",
    value: formData.bisingProduksi2,
    onChange: (e) =>
      handleInputChange("bisingProduksi2", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("bisingProduksi2", formData.bisingProduksi2),
  },
  { isSubtitle: true, label: "Kebisingan Lokal" },
  { isSubtitle: true, label: "Desa Kerticala" },
  {
    label: "Pengukuran 1",
    inputType: "number",
    value: formData.bisingDesaA1,
    onChange: (e) =>
      handleInputChange("bisingDesaA1", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("bisingDesaA1", formData.bisingDesaA1),
  },
  {
    label: "Pengukuran 2",
    inputType: "number",
    value: formData.bisingDesaA2,
    onChange: (e) =>
      handleInputChange("bisingDesaA2", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("bisingDesaA2", formData.bisingDesaA2),
  },
  { isSubtitle: true, label: "Desa Sumber Kulon" },
  {
    label: "Pengukuran 1",
    inputType: "number",
    value: formData.bisingDesaB1,
    onChange: (e) =>
      handleInputChange("bisingDesaB1", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("bisingDesaB1", formData.bisingDesaB1),
  },
  {
    label: "Pengukuran 2",
    inputType: "number",
    value: formData.bisingDesaB2,
    onChange: (e) =>
      handleInputChange("bisingDesaB2", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("bisingDesaB2", formData.bisingDesaB2),
  },
];

export const dataL5 = [
  {
    label: "Total Residu Terlarut (mg/L)",
    inputType: "number",
    value: formData.totalResidu,
    onChange: (e) =>
      handleInputChange("totalResidu", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("totalResidu", formData.totalResidu),
  },
  {
    label: "BOD5 (mg/L)",
    inputType: "number",
    value: formData.bod,
    onChange: (e) => handleInputChange("bod", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("bod", formData.bod),
  },
  {
    label: "COD (mg/L)",
    inputType: "number",
    value: formData.cod,
    onChange: (e) => handleInputChange("cod", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("cod", formData.cod),
  },
  {
    label: "Sulfida (mg/L)",
    inputType: "number",
    value: formData.sulfida,
    onChange: (e) => handleInputChange("sulfida", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("sulfida", formData.sulfida),
  },
];

export const dataL6 = [
  {
    label: "Sulfur dioksida (µg/Nm3)",
    inputType: "number",
    value: formData.sulfur,
    onChange: (e) => handleInputChange("sulfur", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("sulfur", formData.sulfur),
  },
  {
    label: "Karbon monoksida (µg/Nm3)",
    inputType: "number",
    value: formData.karbon,
    onChange: (e) => handleInputChange("karbon", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("karbon", formData.karbon),
  },
  {
    label: "Nitrogen dioksida (µg/Nm3)",
    inputType: "number",
    value: formData.nitrogen,
    onChange: (e) => handleInputChange("nitrogen", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("nitrogen", formData.nitrogen),
  },
  {
    label: "Oksida (µg/Nm3)",
    inputType: "number",
    value: formData.oksida,
    onChange: (e) => handleInputChange("oksida", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("oksida", formData.oksida),
  },
];

export const dataL7 = [
  {
    label: "NH3",
    inputType: "number",
    value: formData.amoniaKerja,
    onChange: (e) =>
      handleInputChange("amoniaKerja", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("amoniaKerja", formData.amoniaKerja),
  },
  {
    label: "Debu (TSP)",
    inputType: "number",
    value: formData.debuKerja,
    onChange: (e) => handleInputChange("debuKerja", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("debuKerja", formData.debuKerja),
  },
  {
    label: "NO2",
    inputType: "number",
    value: formData.nitrogenKerja,
    onChange: (e) =>
      handleInputChange("nitrogenKerja", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("nitrogenKerja", formData.nitrogenKerja),
  },
  {
    label: "SO2",
    inputType: "number",
    value: formData.sulfurKerja,
    onChange: (e) =>
      handleInputChange("sulfurKerja", parseFloat(e.target.value)),
    onSubmit: () => handleUpdate("sulfurKerja", formData.sulfurKerja),
  },
];
