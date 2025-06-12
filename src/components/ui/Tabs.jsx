import {useState} from "react";
import styles from "./Tabs.module.css";

export default function Tabs({children}) {
    children = Array.isArray(children) ? children : [children];
    const [activeTab, setActiveTab] = useState(0);

    function handleHeaderClick(event, index) {
        setActiveTab(index);

        event.currentTarget.classList.add(styles.ripple);
        function handleAnimationEnd(e) {
            e.currentTarget.classList.remove(styles.ripple);
            e.currentTarget.removeEventListener("animationend", handleAnimationEnd);
        }
        event.currentTarget.addEventListener("animationend", handleAnimationEnd);
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.headers}>
                {children.map((child, index) => (
                    <button key={index} className={styles.header}
                        onClick={event => handleHeaderClick(event, index)}>
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
                            {child.props.children || child}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}