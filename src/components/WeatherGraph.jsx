import {LineChart } from "@mui/x-charts";
import { useItemTooltip, useMouseTracker } from '@mui/x-charts/ChartsTooltip';
import { chartsTooltipClasses } from '@mui/x-charts/ChartsTooltip';
import styles from './WeatherGraph.module.css';

const DUMMY_TEMPERATURES = [
    { date: "2021-10-01", weekday: "Fri", temperature: 20 },
    { date: "2021-10-02", weekday: "Sat", temperature: 26 },
    { date: "2021-10-03", weekday: "Sun", temperature: 21 },
    { date: "2021-10-04", weekday: "Mon", temperature: 19 },
    { date: "2021-10-05", weekday: "Tue", temperature: 18 },
    { date: "2021-10-06", weekday: "Wed", temperature: 17 },
    { date: "2021-10-07", weekday: "Thu", temperature: 20 },
];


const minimumTemperature = DUMMY_TEMPERATURES.reduce((minimum, current) => Math.min(minimum, current.temperature), Infinity);
const maximumTemperature = DUMMY_TEMPERATURES.reduce((maximum, current) => Math.max(maximum, current.temperature), -Infinity);

function temperatureFormatter(temperature){
    return `${temperature}°C`;
}

function MarkElement({x, y, color}) {
    return (<circle className={styles.mark}  cx={x} cy={y} r={2} fill={color} />);
}

export default function WeatherGraph() {
    if(DUMMY_TEMPERATURES.length > 7)
        return <p>Make sure there's no more than seven days of data</p>;
    return (
        <div className={styles.wrapper}>
            <p>hi</p>
            <LineChart
                dataset={DUMMY_TEMPERATURES}
                yAxis={[{
                    type: "number",
                    dataKey: "temperature",
                    domainLimit: (minimum, maximum) => {return {min: minimum - 5, max: maximum + 5};},
                    tickNumber: (maximumTemperature - minimumTemperature) / 2,
                    valueFormatter: temperatureFormatter
                }]}
                xAxis={[{
                    dataKey: "date",
                    scaleType: "band",
                    valueFormatter: (value, context) => {
                        const record = DUMMY_TEMPERATURES.find((day) => day.date === value);
                        if(context.location === "tooltip") {
                            return record.date;
                        }
                        return `${record.weekday}`;
                    }
                }]}
                series={[{
                    type: "line",
                    dataKey: "temperature",
                    color: "white",
                    valueFormatter: temperatureFormatter
                }]}
                grid={{
                    horizontal: true
                }}
                slots={{
                    mark: MarkElement
                }}
                sx={{
                    '& .MuiLineElement-root': {
                        strokeWidth: 1
                    },
                    '& .MuiChartsAxis-line, & .MuiChartsAxis-tick, & .MuiChartsAxis-root line': {
                        stroke: 'white'
                    },
                    '& .MuiChartsGrid-line': {
                        stroke: '#b0b0b0'
                    },
                    '& .MuiChartsAxis-tickLabel, & .MuiChartsAxis-root text': {
                        fill: 'white'
                    },
                }}
            />
        </div>
    );
}
