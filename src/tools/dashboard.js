export const DIMENSIONS = [
  {
    key: "dimensiSDAM",
    label: "Sumber Daya (D)",
    short: "Sumber Daya",
    color: "#9425d6",
    count: 10,
  },
  {
    key: "dimensiEkonomi",
    label: "Ekonomi (E)",
    short: "Ekonomi",
    color: "#098bff",
    count: 6,
  },
  {
    key: "dimensiLingkungan",
    label: "Lingkungan (L)",
    short: "Lingkungan",
    color: "#ff7718",
    count: 7,
  },
  {
    key: "dimensiSosial",
    label: "Sosial (S)",
    short: "Sosial",
    color: "#ffb400",
    count: 6,
  },
];
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
export function formatValue(value, digits = 2) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    !Number.isFinite(Number(value))
  )
    return "—";
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(value));
}
export function sustainabilityCategory(value) {
  if (value == null || !Number.isFinite(Number(value))) return "Belum tersedia";
  if (value <= 25) return "Tidak Berkelanjutan";
  if (value <= 50) return "Kurang Berkelanjutan";
  if (value <= 75) return "Cukup Berkelanjutan";
  return "Berkelanjutan";
}
export function monthlyPredictionData(data = []) {
  return MONTHS.map((bulan, index) => ({
    bulan,
    prediksi:
      data.find((item) => Number(item.bulan) === index + 1)?.prediksi ?? null,
  }));
}

// The database stores administrative areas, rather than exact factory coordinates.
// Known factories use their surrounding locality for Open-Meteo geocoding.
export function weatherLocality(factory) {
  const name = (factory?.namaPabrik || "").toLowerCase().replace(/\s+/g, "");
  if (name.includes("jatitujuh")) return "Jatitujuh";
  if (name.includes("tersana")) return "Tersana";
  if (name.includes("sindanglaut")) return "Sindanglaut";
  const area = (factory?.kecamatanPabrik || factory?.kabupatenPabrik || "")
    .replace(/^(kecamatan|kabupaten|kota)\s+/i, "")
    .trim();
  return area || factory?.namaPabrik || "";
}
export function weatherRegion(factory) {
  const name = (factory?.namaPabrik || "").toLowerCase().replace(/\s+/g, "");
  if (name.includes("jatitujuh")) return "Majalengka";
  if (name.includes("tersana") || name.includes("sindanglaut"))
    return "Cirebon";
  const region = (factory?.kabupatenPabrik || "")
    .replace(/^(kabupaten|kota)\s+/i, "")
    .trim();
  return region.length > 2 ? region : "";
}
export function selectWeatherLocation(results = [], factory) {
  const region = weatherRegion(factory).toLowerCase();
  // Never select a same-named locality in another regency for a known location.
  if (region)
    return results.find((item) =>
      (item.admin2 || "").toLowerCase().includes(region),
    );
  return results[0];
}
export function weatherDescription(code) {
  if (code === 0)
    return {
      text: "Cerah",
      icon: "sun",
    };
  if (code === 1 || code === 2)
    return {
      text: "Cerah Berawan",
      icon: "cloud-sun",
    };
  if (code === 3)
    return {
      text: "Berawan",
      icon: "cloud",
    };
  if (code === 45 || code === 48)
    return {
      text: "Berkabut",
      icon: "cloud",
    };
  if ([51, 53, 55, 56, 57].includes(code))
    return {
      text: "Gerimis",
      icon: "rain",
    };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return {
      text: "Hujan",
      icon: "rain",
    };
  if ([71, 73, 75, 77, 85, 86].includes(code))
    return {
      text: "Salju",
      icon: "cloud",
    };
  if ([95, 96, 97, 99].includes(code))
    return {
      text: "Hujan Petir",
      icon: "storm",
    };
  return {
    text: "Cuaca tidak diketahui",
    icon: "cloud",
  };
}
