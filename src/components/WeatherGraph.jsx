import { LineChart } from "@mui/x-charts";
import styles from './WeatherGraph.module.css';

const DUMMY_TEMPERATURES = [
    { date: "2021-10-01", weekday: "Fri", temperature: 20 },
    { date: "2021-10-02", weekday: "Sat", temperature: 22 },
    { date: "2021-10-03", weekday: "Sun", temperature: 21 },
    { date: "2021-10-04", weekday: "Mon", temperature: 19 },
    { date: "2021-10-05", weekday: "Tue", temperature: 18 },
    { date: "2021-10-06", weekday: "Wed", temperature: 17 },
    { date: "2021-10-07", weekday: "Thu", temperature: 20 },
];

export default function WeatherGraph() {
    return (
        <div className={styles.wrapper}>
            <p>hi</p>
            <LineChart
                dataset={DUMMY_TEMPERATURES}
                yAxis={[{
                    type: "number",
                    dataKey: "temperature",
                    min: 15,
                    max: 25
                }]}
                xAxis={[{
                    dataKey: "weekday",
                    scaleType: "band",
                }]}
                series={[{
                    type: "line",
                    dataKey: "temperature",
                    color: "white",
                }]}
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
                    '& .MuiChartsAxis-tickLabel, & .MuiChartsAxis-root text': {
                        fill: 'white'
                    },
                }}
            />
        </div>
    );
}

function MarkElement({x, y, color}) {
    return (<circle cx={x} cy={y} r={2} fill={color} />);
}
