import {useState, useEffect} from "react";
import {fetchWeatherApi} from "openmeteo";
import WeatherGraph from "./WeatherGraph.jsx";
import styles from './Dashboard.module.css';

const DUMMY_TEMPERATURES = [
    {date: "2021-10-01", weekday: "Fri", temperature: 20, rain: 63},
    {date: "2021-10-02", weekday: "Sat", temperature: 26, rain: 22},
    {date: "2021-10-03", weekday: "Sun", temperature: 29, rain: 100},
    {date: "2021-10-04", weekday: "Mon", temperature: 28, rain: 0},
    {date: "2021-10-05", weekday: "Tue", temperature: 25, rain: 10},
    {date: "2021-10-06", weekday: "Wed", temperature: 22, rain: 0},
    {date: "2021-10-07", weekday: "Thu", temperature: 21, rain: 30},
];

export default function Dashboard() {
    const [weatherData, setWeatherData] = useState(DUMMY_TEMPERATURES);

    useEffect(() => {
        async function fetchWeather() {
            let response = await fetchWeatherApi("https://api.open-meteo.com/v1/forecast", {
                "latitude": 50.0614,
                "longitude": 19.9366,
                "daily": ["temperature_2m_mean", "precipitation_probability_mean", "wind_speed_10m_mean"],
                "timezone": "Europe/Warsaw",
                "past_days": 2,
                "wind_speed_unit": "ms"
            });
            response = response[0];
            const utcOffsetSeconds = response.utcOffsetSeconds();
            const timezone = response.timezone();
            const timezoneAbbreviation = response.timezoneAbbreviation();
            const latitude = response.latitude();
            const longitude = response.longitude();

            const daily = response.daily();

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
            };
            console.log("Weather data fetched:", weatherData);
            setWeatherData(weatherData.daily.time.map((time, index) => ({
                id: index,
                date: time.toISOString().split('T')[0],
                weekday: time.toLocaleDateString('en-US', { weekday: 'short' }),
                temperature: parseInt(weatherData.daily.temperature2m[index].toFixed(0)),
                rain: Math.round(weatherData.daily.precipitationProbability[index] / 5) * 5  || null
            })));
        }

        fetchWeather().catch(console.error);
    }, []);

    function getCurrentDate() {
        const currentDate = new Date();
        const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][currentDate.getDay()];
        return `${weekDay} ${currentDate.getDay()}.${currentDate.getMonth()}.${currentDate.getFullYear()}`;
    }

    return (
        <div className={styles.wrapper}>
            <h1>Hi☀</h1>
            <h2>{getCurrentDate()}</h2>
            <h2>It's currently 12°C in Adana</h2>
            <WeatherGraph weatherData={weatherData}/>
        </div>
    );
}
