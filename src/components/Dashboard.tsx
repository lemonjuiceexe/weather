import { useState, useEffect } from "react";
import { fetchWeatherApi } from "openmeteo";
import WeatherGraph from "./WeatherGraph.jsx";
import type { DailyWeatherData, HourlyWeatherData } from "../types.ts";
import Tabs from "./ui/Tabs.tsx";
import styles from "./Dashboard.module.css";

const DUMMY_DAILY_TEMPERATURES: DailyWeatherData[] = [
    { date: "2021-10-01", weekday: "Fri", temperature: 20, rain: 63 },
    { date: "2021-10-02", weekday: "Sat", temperature: 26, rain: 22 },
    { date: "2021-10-03", weekday: "Sun", temperature: 29, rain: 100 },
    { date: "2021-10-04", weekday: "Mon", temperature: 28, rain: 0 },
    { date: "2021-10-05", weekday: "Tue", temperature: 25, rain: 10 },
    { date: "2021-10-06", weekday: "Wed", temperature: 22, rain: 0 },
    { date: "2021-10-07", weekday: "Thu", temperature: 21, rain: 30 }
];
const DUMMY_HOURLY_TEMPERATURES: HourlyWeatherData[] = [
    { date: "2021-10-01T00:00:00Z", temperature: 20, rain: 63, isDay: false },
    { date: "2021-10-01T01:00:00Z", temperature: 19, rain: 60, isDay: false },
    { date: "2021-10-01T02:00:00Z", temperature: 18, rain: 58, isDay: false },
    { date: "2021-10-01T03:00:00Z", temperature: 17, rain: 55, isDay: false },
    { date: "2021-10-01T04:00:00Z", temperature: 16, rain: 50, isDay: false },
    { date: "2021-10-01T05:00:00Z", temperature: 15, rain: 45, isDay: true },
    { date: "2021-10-01T06:00:00Z", temperature: 14, rain: 40, isDay: true },
    { date: "2021-10-01T07:00:00Z", temperature: 13, rain: 35, isDay: true }
];

export default function Dashboard() {
    const PAST_DAYS: number = 2;

    const [dailyWeatherData, setDailyWeatherData] = useState(DUMMY_DAILY_TEMPERATURES);
    const [hourlyWeatherData, setHourlyWeatherData] = useState(DUMMY_HOURLY_TEMPERATURES);

    const [timezone, setTimezone] = useState("GMT+0");
    const [currentTemperature, setCurrentTemperature] = useState(12);
    const [currentlyDay, setCurrentlyDay] = useState(true);

    const currentDate = new Date();
    const time: string = currentDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

    function getDateString(currentDate: Date): string {
        const weekDay: string = currentDate.toLocaleDateString("en-US", { weekday: "long" });
        const day: string = currentDate.getDate().toString().padStart(2, "0");
        const month: string = currentDate.getMonth().toString().padStart(2, "0");
        const year: string = currentDate.getFullYear().toString();

        return `${weekDay}, ${day}.${month}.${year}`;
    }

    useEffect(() => {
        async function fetchWeather() {
            const responses = await fetchWeatherApi("https://api.open-meteo.com/v1/forecast", {
                "latitude": 50.0614,
                "longitude": 19.9366,
                "daily": ["temperature_2m_mean", "precipitation_probability_mean", "wind_speed_10m_mean"],
                "hourly": ["temperature_2m", "precipitation_probability", "wind_speed_10m", "is_day"],
                "timezone": "Europe/Warsaw",
                "past_days": PAST_DAYS,
                "wind_speed_unit": "ms"
            });
            const response = responses[0];
            const utcOffsetSeconds = response.utcOffsetSeconds();
            const timezoneAbbreviation = response.timezoneAbbreviation();
            setTimezone(`${timezoneAbbreviation}`);

            const daily = response.daily()!;
            const hourly = response.hourly()!;

            // Note: The order of weather variables in the URL query and the indices below need to match!
            const weatherData = {
                daily: {
                    time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
                        (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
                    ),
                    temperature2m: daily.variables(0)!.valuesArray()!,
                    precipitationProbabilityMean: daily.variables(1)!.valuesArray()!,
                    windSpeed10m: daily.variables(2)!.valuesArray()!
                },
                hourly: {
                    time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
                        (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
                    ),
                    temperature2m: hourly.variables(0)!.valuesArray()!,
                    precipitationProbability: hourly.variables(1)!.valuesArray()!,
                    windSpeed10m: hourly.variables(2)!.valuesArray()!,
                    isDay: hourly.variables(3)!.valuesArray()!
                }
            };
            console.log("Weather data fetched:", weatherData);
            setDailyWeatherData(weatherData.daily.time.map((time, index) => {
                let rain: (number | null) = weatherData.daily.precipitationProbabilityMean[index];
                rain = rain < 5 ? null : Math.round(rain);
                return {
                    id: index,
                    date: time.toISOString().split("T")[0],
                    weekday: time.toLocaleDateString("en-US", { weekday: "short" }),
                    temperature: parseInt(weatherData.daily.temperature2m[index].toFixed(0)),
                    rain: rain || null
                };
            }));
            setHourlyWeatherData(
                weatherData.hourly.time.map((time, index) =>
                    ({
                        id: index,
                        date: time.toISOString(),
                        temperature: parseInt(weatherData.hourly.temperature2m[index].toFixed(0)),
                        rain: Math.round(weatherData.hourly.precipitationProbability[index] / 5) * 5 || null,
                        isDay: !!weatherData.hourly.isDay[index]
                    } as HourlyWeatherData)
                )
            );
        }

        fetchWeather().catch(console.error);
    }, []);

    useEffect(() => {
        if (hourlyWeatherData.length < PAST_DAYS * 24) return;
        const currentHour = new Date().getHours();
        setCurrentTemperature(hourlyWeatherData[PAST_DAYS * 24 + currentHour].temperature);
        setCurrentlyDay(hourlyWeatherData[PAST_DAYS * 24 + currentHour].isDay);
        console.log("Hourly: ", hourlyWeatherData);
    }, [hourlyWeatherData]);

    return (
        <div className={styles.wrapper}>
            <h1>Hi{currentlyDay ? "☀️" : "🌙"}</h1>
            <h2>at {time} on {getDateString(currentDate)}</h2>
            <h2>it's currently {currentTemperature}°C in Adana, {timezone}</h2>

            <Tabs>
                <WeatherGraph label="Weekly forecast" weatherData={dailyWeatherData} pastDays={PAST_DAYS} />
            </Tabs>
        </div>
    );
}
