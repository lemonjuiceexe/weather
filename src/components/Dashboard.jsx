import {useState, useEffect} from "react";
import {fetchWeatherApi} from "openmeteo";
import WeatherGraph from "./WeatherGraph.jsx";
import styles from './Dashboard.module.css';
import Tabs from "./ui/Tabs.jsx";

const DUMMY_DAILY_TEMPERATURES = [
    {date: "2021-10-01", weekday: "Fri", temperature: 20, rain: 63},
    {date: "2021-10-02", weekday: "Sat", temperature: 26, rain: 22},
    {date: "2021-10-03", weekday: "Sun", temperature: 29, rain: 100},
    {date: "2021-10-04", weekday: "Mon", temperature: 28, rain: 0},
    {date: "2021-10-05", weekday: "Tue", temperature: 25, rain: 10},
    {date: "2021-10-06", weekday: "Wed", temperature: 22, rain: 0},
    {date: "2021-10-07", weekday: "Thu", temperature: 21, rain: 30},
];
const DUMMY_HOURLY_TEMPERATURES = [
    {date: "2021-10-01T00:00:00Z", temperature: 18, rain: 0},
    {date: "2021-10-01T01:00:00Z", temperature: 17, rain: 0},
    {date: "2021-10-01T02:00:00Z", temperature: 16, rain: 0},
    {date: "2021-10-01T03:00:00Z", temperature: 15, rain: 0},
    {date: "2021-10-01T04:00:00Z", temperature: 14, rain: 0},
    {date: "2021-10-01T05:00:00Z", temperature: 13, rain: 0},
    {date: "2021-10-01T06:00:00Z", temperature: 12, rain: 0},
];

export default function Dashboard() {
    const PAST_DAYS = 2;

    const [dailyWeatherData, setDailyWeatherData] = useState(DUMMY_DAILY_TEMPERATURES);
    const [hourlyWeatherData, setHourlyWeatherData] = useState([]);
    const [timezone, setTimezone] = useState("GMT+0");
    const [currentTemperature, setCurrentTemperature] = useState(12);
    const [currentlyDay, setCurrentlyDay] = useState(true);

    useEffect(() => {
        async function fetchWeather() {
            let response = await fetchWeatherApi("https://api.open-meteo.com/v1/forecast", {
                "latitude": 50.0614,
                "longitude": 19.9366,
                "daily": ["temperature_2m_mean", "precipitation_probability_mean", "wind_speed_10m_mean"],
                "hourly": ["temperature_2m", "precipitation_probability", "wind_speed_10m", "is_day"],
                "timezone": "Europe/Warsaw",
                "past_days": PAST_DAYS,
                "wind_speed_unit": "ms"
            });
            response = response[0];
            const utcOffsetSeconds = response.utcOffsetSeconds();
            const timezoneAbbreviation = response.timezoneAbbreviation();
            setTimezone(`${timezoneAbbreviation}`);

            const daily = response.daily();
            const hourly = response.hourly();

            // Note: The order of weather variables in the URL query and the indices below need to match!
            const weatherData = {
                daily: {
                    time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
                        (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
                    ),
                    temperature2m: daily.variables(0).valuesArray(),
                    relativeHumidity2m: daily.variables(1).valuesArray(),
                    precipitationProbability: daily.variables(2).valuesArray(),
                    windSpeed10m: daily.variables(3).valuesArray(),
                },
                hourly: {
                    time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
                        (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
                    ),
                    temperature2m: hourly.variables(0).valuesArray(),
                    precipitationProbability: hourly.variables(1).valuesArray(),
                    windSpeed10m: hourly.variables(2).valuesArray(),
                    isDay: hourly.variables(3).valuesArray(),
                },
            };
            console.log("Weather data fetched:", weatherData);
            setDailyWeatherData(weatherData.daily.time.map((time, index) => ({
                id: index,
                date: time.toISOString().split('T')[0],
                weekday: time.toLocaleDateString('en-US', {weekday: 'short'}),
                temperature: parseInt(weatherData.daily.temperature2m[index].toFixed(0)),
                rain: Math.round(weatherData.daily.precipitationProbability[index] / 5) * 5 || null
            })));
            setHourlyWeatherData(weatherData.hourly.time.map((time, index) => ({
                id: index,
                date: time.toISOString(),
                temperature: parseInt(weatherData.hourly.temperature2m[index].toFixed(0)),
                rain: Math.round(weatherData.hourly.precipitationProbability[index] / 5) * 5 || null,
                isDay: weatherData.hourly.isDay[index]
            })));
        }

        fetchWeather().catch(console.error);
    }, []);
    useEffect(() => {
        if (hourlyWeatherData.length < PAST_DAYS * 24) return;
        setCurrentTemperature(hourlyWeatherData[PAST_DAYS * 24].temperature);
        setCurrentlyDay(hourlyWeatherData[PAST_DAYS * 24].isDay);
        console.log("Hourly: ", hourlyWeatherData);
    }, [hourlyWeatherData]);

    function getCurrentDate() {
        const currentDate = new Date();
        const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][currentDate.getDay()];
        return `${weekDay} ${currentDate.getDay()}.${currentDate.getMonth()}.${currentDate.getFullYear()}`;
    }

    return (
        <div className={styles.wrapper}>
            <h1>Hi{currentlyDay ? "☀️" : "🌙"}</h1>
            <h2>{getCurrentDate()}</h2>
            <h2>It's currently {currentTemperature}°C in Adana, {timezone}</h2>

            <Tabs>
                <WeatherGraph label="Week forecast" weatherData={dailyWeatherData} pastDays={PAST_DAYS} />
            </Tabs>
        </div>
    );
}
