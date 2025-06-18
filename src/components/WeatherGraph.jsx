import {Bar, ComposedChart, Line, ResponsiveContainer, Tooltip, YAxis} from "recharts";
import styles from './WeatherGraph.module.css';

function temperatureFormatter(temperature) {
    return `${temperature}°C`;
}

function rainFormatter(rain) {
    return `${rain} %`;
}

function TooltipElement({active, payload, _}) {
    if(active && payload && payload.length) {
        const record = payload[0].payload;
        return (
            <div className={styles.tooltip}>
                <p className={styles.label}>{record.date} ({record.weekday})</p>
                <p className={styles.value}>{record.temperature}°C</p>
                <p className={styles.value}>{record.rain ? `${record.rain}%` : 'No rain'}</p>
            </div>
        );
    }
}

export default function WeatherGraph({weatherData, pastDays}) {
    console.log("Weather data:", weatherData);

    const minimumTemperature = weatherData.reduce((minimum, current) => Math.min(minimum, current.temperature), Infinity);
    const maximumTemperature = weatherData.reduce((maximum, current) => Math.max(maximum, current.temperature), -Infinity);

    return (
        <div className={styles.wrapper}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={weatherData}>
                    <YAxis yAxisId="temperature" datakey="temperature" orientation="left" domain={[minimumTemperature - 5, maximumTemperature + 5]} tickFormatter={temperatureFormatter} stroke={"#fff"} />
                    <YAxis yAxisId="rain" dataKey="rain" orientation="right" domain={[0, 100]} tickFormatter={rainFormatter} stroke={"#fff"} />
                    <Line yAxisId="temperature" type="monotone" dataKey="temperature" stroke="#fff" />
                    <Bar yAxisId="rain" type="monotone" dataKey="rain" stroke="#00f" />
                    <Tooltip content={TooltipElement} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
