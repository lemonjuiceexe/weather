import {LineChart } from "@mui/x-charts";
import styles from './WeatherGraph.module.css';

const DUMMY_TEMPERATURES = [
    { date: "2021-10-01", weekday: "Fri", temperature: 20, rain: 63 },
    { date: "2021-10-02", weekday: "Sat", temperature: 26, rain: 22 },
    { date: "2021-10-03", weekday: "Sun", temperature: 29, rain: 100 },
    { date: "2021-10-04", weekday: "Mon", temperature: 28, rain: 0 },
    { date: "2021-10-05", weekday: "Tue", temperature: 25, rain: 10 },
    { date: "2021-10-06", weekday: "Wed", temperature: 22, rain: 0 },
    { date: "2021-10-07", weekday: "Thu", temperature: 21, rain: 30 },
];


const minimumTemperature = DUMMY_TEMPERATURES.reduce((minimum, current) => Math.min(minimum, current.temperature), Infinity);
const maximumTemperature = DUMMY_TEMPERATURES.reduce((maximum, current) => Math.max(maximum, current.temperature), -Infinity);

function temperatureFormatter(temperature){
    return `${temperature}°C`;
}
function rainFormatter(rain) {
    return `${rain} %`;
}

function MarkElement({x, y, color}) {
    return (<circle className={styles.mark}  cx={x} cy={y} r={2} fill={color} />);
}

export default function WeatherGraph() {
    if(DUMMY_TEMPERATURES.length > 7)
        return <p>Make sure there's no more than seven days of data</p>;
    return (
        <div className={styles.wrapper}>
            <LineChart
                dataset={DUMMY_TEMPERATURES}
                leftAxis="temperatureAxis"
                rightAxis="rainAxis"
                yAxis={[{
                    id: "temperatureAxis",
                    type: "number",
                    dataKey: "temperature",
                    domainLimit: (minimum, maximum) => {return {min: minimum - 5, max: maximum + 5};},
                    tickNumber: (maximumTemperature - minimumTemperature) / 2,
                    valueFormatter: temperatureFormatter
                }, {
                    id: "rainAxis",
                    type: "number",
                    dataKey: "rain",
                    domainLimit: {min: 0, max: 100},
                    tickNumber: 5,
                    valueFormatter: rainFormatter
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
                    yAxisId: "temperatureAxis",
                    color: "white",
                    valueFormatter: temperatureFormatter
                }, {
                    type: "line",
                    dataKey: "rain",
                    yAxisId: "rainAxis",
                    color: "#4c9ce3",
                    valueFormatter: rainFormatter
                }]
                }
                grid={{
                    horizontal: true
                }}
                slots={{
                    mark: MarkElement,
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
