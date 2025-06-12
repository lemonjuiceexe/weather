import {useState} from "react";
import styles from "./Tabs.module.css";

export default function Tabs({children}) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className={styles.wrapper}>
            <div className={styles.tabs}>
                {children.map((child, index) => (
                    <button key={index} className={styles.tab} onClick={() => setActiveTab(index)}>
                        {child.props.label || `Tab ${index + 1}`}
                    </button>
                ))}
            </div>
            <div className={styles.content}>
                {children.map((child, index) => {
                    if (index !== activeTab) {
                        return null;
                    }
                    return (
                        <div key={index} className={styles.tabContent}>
                            {child.props.children}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}