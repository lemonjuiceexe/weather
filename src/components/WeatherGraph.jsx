import {
    ResponsiveContainer,
    ComposedChart,
    XAxis,
    YAxis,
    Line, Bar, Cell,
    CartesianGrid,
    ReferenceLine,
    Label,
    Tooltip
} from "recharts";
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
                    <XAxis xAxisId="dateAxis" dataKey="date" stroke={"#fff"}
                        tickFormatter={date => new Date(date).toLocaleDateString('en-US', {weekday: 'short'})}
                    />
                    <YAxis yAxisId="temperatureAxis" datakey="temperature" orientation="left" stroke={"#fff"}
                        domain={[minimumTemperature - 5, maximumTemperature + 5]}
                        tickFormatter={temperatureFormatter}
                    />
                    <YAxis yAxisId="rainAxis" dataKey="rain" orientation="right" stroke={"#fff"}
                        domain={[0, 100]}
                        tickFormatter={rainFormatter}
                    />
                    <CartesianGrid vertical={false} stroke={"#a1a1a1"} />
                    <ReferenceLine xAxisId="dateAxis" yAxisId="temperatureAxis" stroke={"#a1a1a1"} strokeDasharray="5 3"
                        x={weatherData[pastDays].date}>
                        <Label position="insideTop" value="Today" fill={"rgba(255, 255, 255, 0.9)"} fontSize="14" />
                    </ReferenceLine>
                    <Line yAxisId="temperatureAxis" xAxisId="dateAxis" dataKey="temperature"
                        type="monotone" stroke={"#fff"} dot={false}
                    />
                    <Line yAxisId="temperatureAxis" xAxisId="dateAxis" dataKey="pastTemperature"
                        type="monotone" stroke={"#a1a1a1"} dot={false}
                    />
                    <Bar yAxisId="rainAxis" xAxisId="dateAxis" dataKey="rain" type="monotone" fill={"#71b5fa"}>
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
