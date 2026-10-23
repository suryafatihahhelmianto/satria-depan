"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarDays,
  Calculator,
  Factory,
  Info,
  Leaf,
  RefreshCw,
  Sprout,
  TrendingUp,
  Users,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { fetchData } from "@/tools/api";
import { getCookie } from "@/tools/getCookie";
import {
  DIMENSIONS,
  formatValue,
  sustainabilityCategory,
} from "@/tools/dashboard";
import FactoryWeather from "@/components/dashboard/FactoryWeather";
import {
  DimensionRadar,
  PredictionTrend,
  SustainabilityTrend,
} from "@/components/dashboard/DashboardCharts";
import styles from "@/components/dashboard/Dashboard.module.css";
const roleNames = {
  KEPALAPABRIK: "Kepala Pabrik",
  QUALITYCONTROL: "Quality Control",
  SDM: "SDM dan Umum",
  INSTALASI: "Instalasi",
  FABRIKASI: "Fabrikasi",
  TANAMAN: "Tanaman",
  TUK: "TUK",
};
const dimensionIcons = [Sprout, BarChart3, Leaf, Users];
const headers = () => ({
  Authorization: `Bearer ${getCookie("token")}`,
});
function StatCard({
  icon: Icon,
  color,
  title,
  value,
  caption,
  badge,
  badgeColor,
  change,
  href,
  loading,
}) {
  return (
    <article className={styles.statCard} aria-busy={loading}>
      <span className={`${styles.statIcon} ${styles[color]}`}>
        <Icon size={31} strokeWidth={2.5} />
      </span>
      <div className={styles.statBody}>
        <h2>{title}</h2>
        <div className={styles.statValue}>
          {loading ? (
            <span className={styles.skeletonValue} />
          ) : (
            <strong>{value}</strong>
          )}
          {change != null && (
            <span className={change >= 0 ? styles.positive : styles.negative}>
              {change >= 0 ? "+" : ""}
              {formatValue(change, 1)} pp
            </span>
          )}
        </div>
        <div className={styles.statCaption}>
          <span>{caption}</span>
          {badge && (
            <span
              className={`${styles.badge} ${styles[badgeColor || "badgeBlue"]}`}
            >
              {badge}
            </span>
          )}
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className={styles.cardLink}
          aria-label={`Lihat ${title}`}
        />
      )}
    </article>
  );
}
export default function HomePage() {
  const router = useRouter();
  const { role, loading: userLoading } = useUser();
  const [factories, setFactories] = useState([]);
  const [factoryId, setFactoryId] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [factoriesLoading, setFactoriesLoading] = useState(true);
  const [yearsLoading, setYearsLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  useEffect(() => {
    if (!userLoading && role === "DIREKSI")
      router.replace("/executive-dashboard");
  }, [role, userLoading, router]);
  useEffect(() => {
    if (userLoading || !role || role === "DIREKSI") return;
    let active = true;
    setFactoriesLoading(true);
    setError("");
    fetchData("/api/pabrik", {
      headers: headers(),
    })
      .then((response) => {
        if (!active) return;
        const list = Array.isArray(response) ? response : [];
        setFactories(list);
        setFactoryId((previous) =>
          list.some((item) => String(item.id) === previous)
            ? previous
            : String(list[0]?.id || ""),
        );
      })
      .catch(() => {
        if (active)
          setError(
            "Daftar pabrik belum dapat dimuat. Periksa koneksi lalu coba lagi.",
          );
      })
      .finally(() => {
        if (active) setFactoriesLoading(false);
      });
    return () => {
      active = false;
    };
  }, [role, userLoading, retry]);
  useEffect(() => {
    if (!factoryId) return;
    let active = true;
    setYearsLoading(true);
    setDashboard(null);
    setError("");
    fetchData(`/api/sesi/tahun?pabrikId=${factoryId}`, {
      headers: headers(),
    })
      .then((response) => {
        if (!active) return;
        const years = [...new Set((response.data || []).map(Number))]
          .filter(
            (year) => Number.isInteger(year) && year >= 1970 && year <= 3000,
          )
          .sort((a, b) => b - a);
        setAvailableYears(years);
        setSelectedYear((previous) =>
          years.includes(Number(previous))
            ? String(previous)
            : String(years[0] || ""),
        );
      })
      .catch(() => {
        if (active) {
          setAvailableYears([]);
          setSelectedYear("");
          setError("Periode data belum dapat dimuat.");
        }
      })
      .finally(() => {
        if (active) setYearsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [factoryId, retry]);
  useEffect(() => {
    if (!factoryId || !selectedYear || yearsLoading) {
      setDashboardLoading(false);
      return;
    }
    let active = true;
    setDashboardLoading(true);
    setDashboard(null);
    setError("");
    const query = new URLSearchParams({
      tahun: selectedYear,
      startDate: `${selectedYear}-01-01`,
      endDate: `${selectedYear}-12-31`,
    });
    fetchData(`/api/dashboard/${factoryId}?${query}`, {
      headers: headers(),
    })
      .then((response) => {
        if (active) setDashboard(response);
      })
      .catch(() => {
        if (active)
          setError("Data dashboard belum dapat dimuat. Silakan coba lagi.");
      })
      .finally(() => {
        if (active) setDashboardLoading(false);
      });
    return () => {
      active = false;
    };
  }, [factoryId, selectedYear, yearsLoading, retry]);
  const selectedFactory = factories.find(
    (factory) => String(factory.id) === factoryId,
  );
  const loading =
    userLoading || factoriesLoading || yearsLoading || dashboardLoading;
  const selectedData = dashboard?.nilaiKinerjaKeberlanjutan?.find(
    (item) => Number(item.tahun) === Number(selectedYear) && item.tahun != null,
  );
  const history = (dashboard?.dataHistogram || []).filter((item) =>
    availableYears.includes(Number(item.year)),
  );
  const previousData = history
    .filter((item) => Number(item.year) < Number(selectedYear))
    .sort((a, b) => b.year - a.year)[0];
  const change =
    selectedData && previousData
      ? selectedData.nilaiKinerja - previousData["Index Total"]
      : null;
  const totalIndicators = DIMENSIONS.reduce(
    (total, dimension) => total + dimension.count,
    0,
  );
  const predictionCount = dashboard?.jumlahPrediksiRendemen ?? 0;
  const prediction = predictionCount > 0 ? dashboard?.rataRataRendemen : null;
  const notifications = [
    ...(selectedData
      ? [
          {
            text: `Data keberlanjutan PG ${selectedFactory?.namaPabrik} tahun ${selectedYear} tersedia.`,
            detail:
              selectedData.status === "FINAL" ? "Selesai" : "Dalam pengisian",
            color: "greenDot",
          },
        ]
      : []),
    ...(dashboard
      ? [
          {
            text:
              predictionCount > 0
                ? `${predictionCount} perhitungan prediksi rendemen tersedia pada tahun ${selectedYear}.`
                : `Belum ada prediksi rendemen untuk tahun ${selectedYear}.`,
            detail: "Rendemen",
            color: "blueDot",
          },
        ]
      : []),
    ...(dashboard?.informasi || []).map((item) => ({
      text: `${roleNames[item.role] || item.role}: ${item.unfilledColumns?.length || 0} masukan belum dikunci.`,
      detail: "Perlu dilengkapi",
      color: "orangeDot",
    })),
    {
      text: `Terdapat ${totalIndicators} indikator keberlanjutan dalam empat dimensi penilaian.`,
      detail: "Indikator",
      color: "orangeDot",
    },
    {
      text: "Data cuaca area pabrik bersumber dari Open-Meteo.",
      detail: "Cuaca terkini",
      color: "mutedDot",
    },
  ];
  async function handleDetail() {
    if (!selectedData || detailLoading) return;
    setDetailLoading(true);
    try {
      const result = await fetchData(
        `/api/sesi/sesiByPabrikId?tahun=${selectedYear}&pabrikId=${factoryId}`,
        {
          headers: headers(),
        },
      );
      if (result.id) router.push(`/detail/${result.id}/hasil`);
      else setError("Sesi pengisian untuk periode ini belum tersedia.");
    } catch {
      setError("Detail kinerja belum dapat dibuka. Silakan coba lagi.");
    } finally {
      setDetailLoading(false);
    }
  }
  function handleFactoryChange(event) {
    setDashboard(null);
    setSelectedYear("");
    setAvailableYears([]);
    setFactoryId(event.target.value);
  }
  if (userLoading || role === "DIREKSI")
    return (
      <div className={styles.accessLoading}>
        <RefreshCw className={styles.spin} size={24} /> Memeriksa akses
        pengguna...
      </div>
    );
  return (
    <div className={styles.dashboard}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <Sprout size={25} strokeWidth={2.4} /> SATRIA-KEREN
          </div>
          <h1>
            Data dan Prediksi Rendemen Tebu
            <br className={styles.heroBreak} /> untuk Masa Depan yang
            Berkelanjutan
          </h1>
          <p>
            Pantau kinerja keberlanjutan rantai pasok, prediksi rendemen,
            <br className={styles.heroBreak} /> dan dukung pengambilan keputusan
            berbasis data.
          </p>
          <div className={styles.heroActions}>
            <Link
              href={
                ["ADMIN", "QUALITYCONTROL"].includes(role)
                  ? "/rendemen"
                  : "/kalkulator"
              }
              className={styles.primaryButton}
            >
              <TrendingUp size={21} /> Prediksi Rendemen
            </Link>
            <Link href="/kalkulator" className={styles.secondaryButton}>
              <Calculator size={20} /> Kalkulator Prediksi
            </Link>
          </div>
        </div>
        <FactoryWeather factory={selectedFactory} />
      </section>

      {error && (
        <div className={styles.error} role="alert">
          <Info size={18} />
          <span>{error}</span>
          <button onClick={() => setRetry((value) => value + 1)}>
            <RefreshCw size={15} /> Coba lagi
          </button>
        </div>
      )}

      <section className={styles.filters} aria-label="Filter dashboard">
        <div className={styles.filterCard}>
          <label htmlFor="dashboard-factory">
            <Factory size={25} /> Pabrik
          </label>
          <div>
            <select
              id="dashboard-factory"
              value={factoryId}
              onChange={handleFactoryChange}
              disabled={factoriesLoading || factories.length === 0}
            >
              {!factories.length && (
                <option value="">
                  {factoriesLoading ? "Memuat pabrik..." : "Belum ada pabrik"}
                </option>
              )}
              {factories.map((factory) => (
                <option key={factory.id} value={factory.id}>
                  {factory.namaPabrik}
                </option>
              ))}
            </select>
            <p>
              {factories.length
                ? `Pilih pabrik: ${factories.map((factory) => factory.namaPabrik).join(", ")}`
                : "Data pabrik sesuai akses akun Anda"}
            </p>
          </div>
        </div>
        <div className={styles.filterCard}>
          <label htmlFor="dashboard-year">
            <CalendarDays size={25} /> Periode Data
          </label>
          <div>
            <select
              id="dashboard-year"
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              disabled={yearsLoading || !availableYears.length}
            >
              {!availableYears.length && (
                <option value="">
                  {yearsLoading ? "Memuat periode..." : "Belum ada periode"}
                </option>
              )}
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <p>Pilih tahun data yang ingin ditampilkan</p>
          </div>
        </div>
      </section>

      <section className={styles.stats} aria-label="Ringkasan data">
        <StatCard
          icon={Sprout}
          color="greenIcon"
          title={
            <>
              Nilai Keberlanjutan
              <br />
              Rantai Pasok
            </>
          }
          value={
            selectedData
              ? `${formatValue(selectedData.nilaiKinerja)}%`
              : "\u2014"
          }
          caption={selectedYear ? `Tahun ${selectedYear}` : "Belum ada periode"}
          badge={sustainabilityCategory(selectedData?.nilaiKinerja)}
          badgeColor={
            !selectedData
              ? "badgeGray"
              : selectedData.nilaiKinerja > 75
                ? "badgeGreen"
                : selectedData.nilaiKinerja <= 50
                  ? "badgeRed"
                  : "badgeYellow"
          }
          change={change}
          loading={loading}
        />
        <StatCard
          icon={BarChart3}
          color="purpleIcon"
          title="Prediksi Rendemen"
          value={prediction != null ? `${formatValue(prediction)}%` : "\u2014"}
          caption={
            selectedYear
              ? `Rata-rata tahun ${selectedYear}`
              : "Perhitungan prediksi"
          }
          badge={
            prediction == null
              ? "Belum tersedia"
              : prediction <= 4
                ? "Rendah"
                : prediction <= 8
                  ? "Sedang"
                  : "Tinggi"
          }
          badgeColor={
            prediction == null
              ? "badgeGray"
              : prediction <= 4
                ? "badgeRed"
                : "badgeGreen"
          }
          href={
            ["ADMIN", "QUALITYCONTROL"].includes(role)
              ? "/rendemen"
              : "/kalkulator"
          }
          loading={loading}
        />
        <StatCard
          icon={BarChart3}
          color="blueIcon"
          title="Jumlah Indikator"
          value={totalIndicators}
          caption="Indikator keberlanjutan"
          badge="4 Dimensi"
          badgeColor="badgeGreen"
        />
        <StatCard
          icon={Users}
          color="orangeIcon"
          title="Periode Data"
          value={selectedYear || "\u2014"}
          caption="Data tersedia"
          badge={`${availableYears.length} Tahun`}
          badgeColor="badgeBlue"
          loading={yearsLoading || factoriesLoading}
        />
      </section>

      <div className={styles.trendGrid}>
        <section className={styles.panel}>
          <h2>
            <TrendingUp size={25} /> Tren Kinerja Keberlanjutan Rantai Pasok
            {selectedFactory ? ` PG ${selectedFactory.namaPabrik}` : ""}
          </h2>
          {loading ? (
            <div className={styles.chartLoading}>Memuat data kinerja...</div>
          ) : (
            <SustainabilityTrend data={history} />
          )}
        </section>
        <section className={styles.panel}>
          <h2>
            <TrendingUp className={styles.purpleText} size={25} /> Tren Prediksi
            Rendemen{" "}
            <span
              title="Rata-rata prediksi per bulan pada tahun terpilih. Data realisasi belum tersedia."
              className={styles.infoIcon}
            >
              <Info size={15} />
            </span>
          </h2>
          {loading ? (
            <div className={styles.chartLoading}>Memuat data prediksi...</div>
          ) : (
            <PredictionTrend data={dashboard?.trenRendemen} />
          )}
          <p className={styles.chartNote}>
            Rata-rata bulanan {selectedYear || "\u2014"} &middot; Data realisasi
            belum tersedia
          </p>
        </section>
      </div>

      <div className={styles.bottomGrid}>
        <section className={styles.panel}>
          <h2>
            <Info size={24} /> Nilai per Dimensi Keberlanjutan{" "}
            {selectedYear ? `(${selectedYear})` : ""}
          </h2>
          <div className={styles.dimensionContent}>
            <DimensionRadar data={loading ? null : selectedData} />
            <div className={styles.dimensionTableWrap}>
              <table className={styles.dimensionTable}>
                <thead>
                  <tr>
                    <th>Dimensi</th>
                    <th>Nilai (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {DIMENSIONS.map((dimension, index) => {
                    const Icon = dimensionIcons[index];
                    return (
                      <tr key={dimension.key}>
                        <td>
                          <Icon size={17} />
                          {dimension.label}
                        </td>
                        <td
                          className={
                            dimension.key === "dimensiEkonomi"
                              ? styles.orangeText
                              : styles.greenText
                          }
                        >
                          {selectedData && !loading
                            ? formatValue(selectedData[dimension.key])
                            : "\u2014"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total Nilai Kinerja</th>
                    <th>
                      {selectedData && !loading
                        ? formatValue(selectedData.nilaiKinerja)
                        : "\u2014"}
                    </th>
                  </tr>
                </tfoot>
              </table>
              <button
                className={styles.textLink}
                onClick={handleDetail}
                disabled={!selectedData || detailLoading || loading}
              >
                {detailLoading ? "Membuka detail..." : "Lihat detail kinerja"}
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </section>
        <section className={styles.panel} id="informasi">
          <h2>
            <Bell size={23} /> Informasi &amp; Notifikasi
          </h2>
          <ul className={styles.notifications}>
            {(showAllNotifications
              ? notifications
              : notifications.slice(0, 4)
            ).map((item) => (
              <li key={item.text}>
                <span
                  className={`${styles.notificationDot} ${styles[item.color]}`}
                />
                <p>{item.text}</p>
                <span className={styles.notificationMeta}>{item.detail}</span>
              </li>
            ))}
          </ul>
          <button
            className={styles.textLink}
            onClick={() => setShowAllNotifications((value) => !value)}
          >
            {showAllNotifications
              ? "Ringkas notifikasi"
              : "Lihat semua notifikasi"}
            <ArrowRight size={15} />
          </button>
        </section>
      </div>
    </div>
  );
}
