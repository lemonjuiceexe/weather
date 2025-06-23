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
    type TooltipProps
} from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { DailyWeatherData, HourlyWeatherData } from "../types.ts";
import styles from "./WeatherGraph.module.css";

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

function TooltipElement({ active, payload }: TooltipProps<ValueType, NameType>) {
    if(active && payload && payload.length) {
        const record = payload[0].payload;
        return (
            <div className={styles.tooltip}>
                <p className={styles.label}>{record.date} ({record.weekday})</p>
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
}

export default function WeatherGraph({ weatherData, pastDays }: Props) {
    const minimumTemperature = weatherData.reduce((minimum, current) =>
        Math.min(minimum, current.temperature), Infinity);
    const maximumTemperature = weatherData.reduce((maximum, current) =>
        Math.max(maximum, current.temperature), -Infinity);

    let chartData: ChartDailyWeatherData[] | ChartHourlyWeatherData[];
    if ("weekday" in weatherData[0]) {
        chartData = (weatherData as DailyWeatherData[]).map((day: DailyWeatherData, index): ChartDailyWeatherData => ({
            ...day,
            temperature: index < pastDays ? null : day.temperature,
            pastTemperature: index <= pastDays ? day.temperature : null
        }));
    } else {
        chartData = (weatherData as HourlyWeatherData[]).map((day: HourlyWeatherData, index): ChartHourlyWeatherData => ({
            ...day,
            temperature: index < pastDays ? null : day.temperature,
            pastTemperature: index <= pastDays ? day.temperature : null
        }));
    }

    console.log("Weather data:", chartData);

    return (
        <div className={styles.wrapper}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                    <XAxis xAxisId="dateAxis" dataKey="date" stroke={"#fff"}
                        tickFormatter={date => new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                    />
                    <YAxis yAxisId="temperatureAxis" dataKey="temperature" orientation="left" stroke={"#fff"}
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
                    <Tooltip content={TooltipElement} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
