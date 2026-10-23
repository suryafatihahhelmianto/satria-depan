"use client";

import { useEffect, useState } from "react";
import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSun,
  MapPin,
  RefreshCw,
  Sun,
} from "lucide-react";
import {
  formatValue,
  selectWeatherLocation,
  weatherDescription,
  weatherLocality,
  weatherRegion,
} from "@/tools/dashboard";
import styles from "./Dashboard.module.css";
const locationCache = new Map();
const weatherCache = new Map();
const icons = {
  sun: Sun,
  "cloud-sun": CloudSun,
  cloud: Cloud,
  rain: CloudRain,
  storm: CloudLightning,
};
async function readJson(url, signal) {
  const response = await fetch(url, {
    signal,
  });
  if (!response.ok) throw new Error("Layanan cuaca tidak merespons.");
  return response.json();
}
export default function FactoryWeather({ factory }) {
  const [state, setState] = useState({
    loading: true,
  });
  const [retry, setRetry] = useState(0);
  const locality = weatherLocality(factory);
  const region = weatherRegion(factory);
  const cacheKey = `${locality}|${region}`;
  useEffect(() => {
    if (!locality) {
      setState({
        loading: false,
      });
      return;
    }
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 15000);
    async function load() {
      setState({
        loading: true,
      });
      try {
        let location = locationCache.get(cacheKey);
        if (!location) {
          const params = new URLSearchParams({
            name: locality,
            count: "100",
            language: "id",
            countryCode: "ID",
          });
          const result = await readJson(
            `https://geocoding-api.open-meteo.com/v1/search?${params}`,
            controller.signal,
          );
          location = selectWeatherLocation(result.results, {
            kabupatenPabrik: region,
          });
          if (!location) throw new Error("Lokasi cuaca belum ditemukan.");
          locationCache.set(cacheKey, location);
        }
        const cached = weatherCache.get(cacheKey);
        let weather = cached?.expires > Date.now() ? cached.weather : null;
        if (!weather) {
          const params = new URLSearchParams({
            latitude: String(location.latitude),
            longitude: String(location.longitude),
            current:
              "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
            daily: "precipitation_sum",
            timezone: "Asia/Jakarta",
            forecast_days: "1",
            wind_speed_unit: "kmh",
            precipitation_unit: "mm",
          });
          weather = await readJson(
            `https://api.open-meteo.com/v1/forecast?${params}`,
            controller.signal,
          );
          if (
            !weather.current ||
            !Number.isFinite(weather.current.temperature_2m)
          )
            throw new Error("Data cuaca belum tersedia.");
          weatherCache.set(cacheKey, {
            weather,
            expires: Date.now() + 10 * 60 * 1000,
          });
        }
        if (active && !controller.signal.aborted)
          setState({
            loading: false,
            weather,
            location,
          });
      } catch (error) {
        // A timeout is shown as an error; a request canceled by a factory change is ignored.
        if (active) {
          setState({
            loading: false,
            error: "Cuaca belum dapat dimuat.",
          });
        }
      } finally {
        clearTimeout(timeout);
      }
    }
    load();
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [locality, region, cacheKey, retry]);
  useEffect(() => {
    const interval = setInterval(
      () => setRetry((value) => value + 1),
      10 * 60 * 1000,
    );
    return () => clearInterval(interval);
  }, []);
  const current = state.weather?.current;
  const description = weatherDescription(current?.weather_code);
  const WeatherIcon = icons[description.icon];
  const date = state.weather?.daily?.time?.[0];
  const dateLabel = date
    ? new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }).format(new Date(`${date}T12:00:00+07:00`))
    : "Cuaca saat ini";
  return (
    <aside
      className={styles.weather}
      aria-label="Cuaca di area pabrik"
      aria-live="polite"
    >
      <div className={styles.weatherHeading}>
        <span>
          <MapPin size={17} /> PG {factory?.namaPabrik || "—"}
        </span>
        <span>{dateLabel}</span>
      </div>
      {state.loading ? (
        <div className={styles.weatherPlaceholder}>
          <CloudSun size={44} />
          <span>Memuat cuaca terkini...</span>
        </div>
      ) : state.error ? (
        <div className={styles.weatherPlaceholder}>
          <Cloud size={38} />
          <span>{state.error}</span>
          <button
            onClick={() => setRetry((value) => value + 1)}
            aria-label="Muat ulang cuaca"
          >
            <RefreshCw size={16} /> Coba lagi
          </button>
        </div>
      ) : current ? (
        <>
          <div className={styles.weatherCurrent}>
            <WeatherIcon
              className={styles.weatherIcon}
              size={64}
              strokeWidth={1.6}
            />
            <div>
              <strong>{formatValue(current.temperature_2m, 0)}°C</strong>
              <p>{description.text}</p>
            </div>
            <span className={styles.wind}>
              Kecepatan angin
              <br />
              <b>{formatValue(current.wind_speed_10m, 0)} km/jam</b>
            </span>
          </div>
          <div className={styles.weatherMetrics}>
            <span>
              Prakiraan hujan hari ini{" "}
              <b>
                {formatValue(state.weather.daily?.precipitation_sum?.[0], 1)} mm
              </b>
            </span>
            <span>
              Kelembapan <b>{formatValue(current.relative_humidity_2m, 0)}%</b>
            </span>
          </div>
        </>
      ) : (
        <p>Pilih pabrik untuk melihat cuaca.</p>
      )}
      <a
        className={styles.weatherSource}
        href="https://open-meteo.com/"
        target="_blank"
        rel="noreferrer"
      >
        Open-Meteo
        {state.location
          ? ` · Area ${state.location.name} · ${current?.time?.slice(11, 16) || ""} WIB`
          : ""}
      </a>
    </aside>
  );
}
