import WeatherGraph from "./WeatherGraph.jsx";
import styles from './Dashboard.module.css';

export default function Dashboard() {
    function getCurrentDate() {
        const currentDate = new Date();
        const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][currentDate.getDay()];
        return `${weekDay} ${currentDate.getDay()}.${currentDate.getMonth()}.${currentDate.getFullYear()}`;
    }

    return (
        <div className={styles.wrapper}>
            <h1>Hi☀</h1>
            <h2>It's currently 12°C in Adana, {getCurrentDate()}</h2>
            <WeatherGraph />
        </div>
    );
}
