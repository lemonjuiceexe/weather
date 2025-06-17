import {ChartContainer, ChartsGrid, LinePlot, MarkPlot} from "@mui/x-charts";
import {ChartsXAxis} from "@mui/x-charts/ChartsXAxis";
import {ChartsYAxis} from "@mui/x-charts/ChartsYAxis";
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

export default function WeatherGraph({weatherData, pastDays}) {
    console.log("Weather data:", weatherData);

    const minimumTemperature = weatherData.reduce((minimum, current) => Math.min(minimum, current.temperature), Infinity);
    const maximumTemperature = weatherData.reduce((maximum, current) => Math.max(maximum, current.temperature), -Infinity);

    const pastTemperatures = weatherData.map((record, index) => index < pastDays ? record.temperature : null);
    const temperatures = weatherData.map((record, index) => index >= pastDays ? record.temperature : null);
    const pastRain = weatherData.map((record, index) => index < pastDays ? record.rain : null);
    const rain = weatherData.map((record, index) => index >= pastDays ? record.rain : null);

    return (
        <div className={styles.wrapper}>
            <ChartContainer
                dataset={weatherData}
                xAxis={[{
                    scaleType: 'band',
                    position: 'bottom',
                    data: weatherData.map(record => record.id),
                    id: 'xAxis',
                    label: 'Date',
                    valueFormatter: (value, context) => {
                        const record = weatherData.find(record => record.id === value);
                        if (context.location === "tooltip") {
                            return record.date;
                        }
                        return `${record.weekday}`;
                    }
                }]}
                yAxis={[
                    { id: 'temperatureAxis', position: 'right' },
                    { id: 'rainAxis', position: 'left' },
                ]}
                series={
                    [
                        {
                            id: 'temperature',
                            type: 'line',
                            xAxisId: 'xAxis',
                            yAxisId: 'temperatureAxis',
                            data: pastTemperatures,
                            markElement: MarkElement,
                            color: '#ff9800',
                            connectNulls: true,
                        },
                        {
                            id: 'rain',
                            type: 'line',
                            xAxisId: 'xAxis',
                            yAxisId: 'rainAxis',
                            data: pastRain,
                            markElement: MarkElement,
                            color: '#2196f3',
                            connectNulls: true,
                        },
                        {
                            id: 'currentTemperature',
                            type: 'line',
                            xAxisId: 'xAxis',
                            yAxisId: 'temperatureAxis',
                            data: temperatures,
                            markElement: MarkElement,
                            color: '#f44336',
                            connectNulls: true,
                        },
                        {
                            id: 'currentRain',
                            type: 'line',
                            xAxisId: 'xAxis',
                            yAxisId: 'rainAxis',
                            data: rain,
                            markElement: MarkElement,
                            color: '#4caf50',
                            connectNulls: true,
                        },
                        {
                            id: 'testRain',
                            type: 'line',
                            xAxisId: 'xAxis',
                            yAxisId: 'rainAxis',
                            data: weatherData.map(() => 10), // All 10s
                            color: '#00ff00',
                            connectNulls: true,
                        }
                    ]
                }
                sx={{
                    '& .MuiLineElement-root': { strokeWidth: 1 },
                    '& .MuiChartsAxis-line, & .MuiChartsAxis-tick, & .MuiChartsAxis-root line': { stroke: 'white' },
                    '& .MuiChartsGrid-line': { stroke: '#b0b0b0' },
                    '& .MuiChartsAxis-tickLabel, & .MuiChartsAxis-root text': { fill: 'white' },
                }}
            >
                <ChartsXAxis axisId="xAxis" label="Date" />
                <ChartsYAxis axisId="temperatureAxis" label="Temperature" />
                <ChartsYAxis axisId="rainAxis" label="Rain" />
                <LinePlot />
                <MarkPlot />
            </ChartContainer>
        </div>
    );
}

