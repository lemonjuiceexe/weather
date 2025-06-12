import {LineChart} from "@mui/x-charts";
import styles from './WeatherGraph.module.css';

function temperatureFormatter(temperature) {
    return `${temperature}°C`;
}

function rainFormatter(rain) {
    return `${rain} %`;
}

function MarkElement({x, y, color}) {
    return (<circle className={styles.mark} cx={x} cy={y} r={2} fill={color}/>);
}

export default function WeatherGraph({weatherData}) {
    console.log("Weather data:", weatherData);

    const minimumTemperature = weatherData.reduce((minimum, current) => Math.min(minimum, current.temperature), Infinity);
    const maximumTemperature = weatherData.reduce((maximum, current) => Math.max(maximum, current.temperature), -Infinity);

    return (
        <div className={styles.wrapper}>
            <LineChart
                dataset={weatherData}
                leftAxis="temperatureAxis"
                rightAxis="rainAxis"
                yAxis={[{
                    id: "temperatureAxis",
                    type: "number",
                    dataKey: "temperature",
                    domainLimit: (minimum, maximum) => {
                        return {min: minimum - 5, max: maximum + 5};
                    },
                    tickNumber: (maximumTemperature - minimumTemperature) / 2,
                    valueFormatter: temperatureFormatter
                }, {
                    id: "rainAxis",
                    type: "number",
                    dataKey: "rain",
                    domainLimit: () => {
                        return {min: 0, max: 100};
                    },
                    tickNumber: 5,
                    valueFormatter: rainFormatter
                }]}
                xAxis={[{
                    dataKey: "id",
                    scaleType: "band",
                    valueFormatter: (value, context) => {
                        const record = weatherData.find(record => record.id === value);
                        if (context.location === "tooltip") {
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
                    color: "#74bdff",
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
