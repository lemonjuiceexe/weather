interface WeatherData {
    id?: number,
    date: string;
    temperature: number;
    rain: number | null;
}
export interface DailyWeatherData extends WeatherData {
    weekday: string;
}
export interface HourlyWeatherData extends WeatherData {
    isDay: boolean;
}