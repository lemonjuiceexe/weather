import {Bar, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
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

    const minimumTemperature = weatherData.reduce((minimum, current) => Math.min(minimum, current.temperature), Infinity);
    const maximumTemperature = weatherData.reduce((maximum, current) => Math.max(maximum, current.temperature), -Infinity);

    weatherData = weatherData.map((day, index) => ({
        ...day,
        temperature: index < pastDays ? null : day.temperature,
        pastTemperature: index <= pastDays ? day.temperature : null,
    }));

    console.log("Weather data:", weatherData);

    return (
        <div className={styles.wrapper}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={weatherData}>
                    <XAxis dataKey="date" stroke={"#fff"} tickFormatter={date => new Date(date).toLocaleDateString('en-US', {weekday: 'short'})} />
                    <YAxis yAxisId="temperature" datakey="temperature" orientation="left" domain={[minimumTemperature - 5, maximumTemperature + 5]} tickFormatter={temperatureFormatter} stroke={"#fff"} />
                    <YAxis yAxisId="rain" dataKey="rain" orientation="right" domain={[0, 100]} tickFormatter={rainFormatter} stroke={"#fff"} />
                    <CartesianGrid vertical={false} stroke={"#a1a1a1"} />
                    <Line yAxisId="temperature" type="monotone" dataKey="temperature" stroke={"#fff"} dot={false} />
                    <Line yAxisId="temperature" type="monotone" dataKey="pastTemperature" stroke={"#a1a1a1"} dot={false} />
                    <Bar yAxisId="rain" type="monotone" dataKey="rain" fill={"#71b5fa"}>
                        {weatherData.map((day, index) => (
                            <Cell key={`cell-${index}`} fill={index >= pastDays ? '#71b5fa' : '#a1a1a1'} />
                        ))}
                    </Bar>
                    <Tooltip content={TooltipElement} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
