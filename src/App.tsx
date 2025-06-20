import Dashboard from "./components/Dashboard.tsx";
import styles  from "./App.module.css";

function App() {
    return (
        <>
            <div className={styles.wrapper}>
                <Dashboard />
            </div>
        </>
    );
}

export default App;
