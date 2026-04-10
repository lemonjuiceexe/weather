import {
    ResponsiveContainer,
    ComposedChart,
    XAxis,
    YAxis,
    Line, Bar, Cell,
    CartesianGrid,
    ReferenceLine,
    Label,
    Tooltip,
} from "recharts";
import type { DailyWeatherData, HourlyWeatherData } from "../types.ts";
import styles from "./WeatherGraph.module.css";
import {useEffect, useState} from "react";

interface ChartDailyWeatherData {
    id?: number,
    date: string;
    temperature: number | null;
    pastTemperature: number | null;
    rain: number | null;
    weekday: string;
}
interface ChartHourlyWeatherData {
    id?: number,
    date: string;
    temperature: number | null;
    pastTemperature: number | null;
    rain: number | null;
    isDay: boolean;
}

function temperatureFormatter(temperature: number | string): string {
    return `${temperature}°C`;
}
function rainFormatter(rain: number | string): string {
    return `${rain}%`;
}

interface TooltipRecord {
    date: string;
    temperature: number | null;
    pastTemperature: number | null;
    rain: number | null;
    weekday?: string;
}
function TooltipElement({ active, payload, isHourly }: { active?: boolean; payload?: any[]; isHourly: boolean }) {
    if(active && payload && payload.length) {
        const record = payload[0].payload as TooltipRecord;
        return (
            <div className={styles.tooltip}>
                <p className={styles.label}>
                    {isHourly ? record.date.split("T")[0] + " " + record.date.split("T")[1].slice(0, 5) :
                     `${record.date} (${record.weekday ?? ""})`}
                </p>
                <p className={styles.value}>
                    {record.temperature !== undefined && record.temperature !== null ? record.temperature : record.pastTemperature}°C
                </p>
                <p className={styles.value}>{record.rain !== null ? `${record.rain}%` : "No rain"}</p>
            </div>
        );
    }
    return null;
}

interface Props {
    label?: string;
    weatherData: DailyWeatherData[] | HourlyWeatherData[];
    pastDays: number;
    isHourly: boolean; // false - daily data
}

export default function WeatherGraph({ weatherData, pastDays, isHourly }: Props) {
    const pastHours = 2 * pastDays; // arbitrary value
    const minimumTemperature = weatherData.reduce((minimum, current) =>
        Math.min(minimum, current.temperature), Infinity);
    const maximumTemperature = weatherData.reduce((maximum, current) =>
        Math.max(maximum, current.temperature), -Infinity);

    const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());

    useEffect(() => {
        setInterval(() => {
            setCurrentHour(new Date().getHours());
        }, 1000 * 60 * 15);
    }, []);

    let chartData: ChartDailyWeatherData[] | ChartHourlyWeatherData[];
    if(!isHourly) {
        chartData = (weatherData as DailyWeatherData[]).map((day: DailyWeatherData, index): ChartDailyWeatherData => ({
            ...day,
            temperature: index < pastDays ? null : day.temperature,
            pastTemperature: index <= pastDays ? day.temperature : null
        }));
    } else {
        chartData = (weatherData as HourlyWeatherData[]).slice((pastDays - 1) * 24 + (currentHour - pastHours)).map((day: HourlyWeatherData, index): ChartHourlyWeatherData => ({
            ...day,
            temperature: index < pastHours ? null : day.temperature,
            pastTemperature: index <= pastHours ? day.temperature : null
        }));
    }

    console.log("Weather data:", chartData);

    return (
        <div className={styles.wrapper}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                    <XAxis xAxisId="dateAxis" dataKey="date" stroke={"#fff"}
                        tickFormatter={date => {
                            if(!isHourly)
                                return new Date(date).toLocaleDateString("en-US", { weekday: "short" });
                            return date.split("T")[1].slice(0, 2);
                        }}
                    />
                    <YAxis yAxisId="temperatureAxis" dataKey="temperature" orientation="left" stroke={"#fff"}
                        domain={[minimumTemperature - 5, maximumTemperature + 5]}
                        tickFormatter={temperatureFormatter}
                    />
                    <YAxis yAxisId="rainAxis" dataKey="rain" orientation="right" stroke={"#fff"}
                        domain={[0, 100]}
                        tickFormatter={rainFormatter}
                    />
                    <CartesianGrid vertical={false} stroke={"#737373"} />
                    <ReferenceLine xAxisId="dateAxis" yAxisId="temperatureAxis" stroke={"#a1a1a1"} strokeDasharray="5 3"
                        x={chartData[isHourly ? pastHours : pastDays].date}>
                        <Label position="insideTop" value={isHourly ? "Now" : "Today"} fill={"rgba(255, 255, 255, 0.9)"} fontSize="14" />
                    </ReferenceLine>
                    <Bar yAxisId="rainAxis" xAxisId="dateAxis" dataKey="rain" type="monotone" fill={"#71b5fa"}>
                        {weatherData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={index >= pastDays ? "#71b5fa" : "#a1a1a1"} />
                        ))}
                    </Bar>
                    <Line yAxisId="temperatureAxis" xAxisId="dateAxis" dataKey="temperature"
                        type="monotone" stroke={"#fff"} dot={false}
                    />
                    <Line yAxisId="temperatureAxis" xAxisId="dateAxis" dataKey="pastTemperature"
                        type="monotone" stroke={"#a1a1a1"} dot={false}
                    />
                    <Tooltip content={(props) => <TooltipElement {...props} isHourly={isHourly} />} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
