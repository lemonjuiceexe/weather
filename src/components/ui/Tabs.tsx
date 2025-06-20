import { useState, isValidElement, type ReactNode, type MouseEvent, type ReactElement } from "react";
import styles from "./Tabs.module.css";

interface TabProps {
    label?: string;
    children?: ReactNode;
}
interface Props {
    children?: ReactElement<TabProps> | ReactElement<TabProps>[];
}

export default function Tabs({ children }: Props) {
    const childrenArray: ReactNode[] = Array.isArray(children) ? children : [children];
    const [activeTab, setActiveTab] = useState(0);

    function handleHeaderClick(event: MouseEvent<HTMLButtonElement>, index: number): void {
        setActiveTab(index);

        (event.currentTarget as HTMLButtonElement).classList.add(styles.ripple);
        function handleAnimationEnd(e: AnimationEvent): void {
            (e.currentTarget as HTMLButtonElement)?.classList.remove(styles.ripple);
            (e.currentTarget as HTMLButtonElement)?.removeEventListener("animationend", handleAnimationEnd);
        }
        event.currentTarget.addEventListener("animationend", handleAnimationEnd);
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.headers}>
                {childrenArray.map((child, index) => {
                    const label  =
                        isValidElement(child) && "props" in child && "label" in (child as ReactElement<TabProps>).props ?
                            (child as ReactElement<TabProps>).props.label : `Tab ${index + 1}`;

                    return (
                        <button key={index} className={styles.header}
                            onClick={event => handleHeaderClick(event, index)}>
                            {label}
                        </button>
                    );
                })}
            </div>
            <div className={styles.content}>
                {childrenArray.map((child: ReactNode, index) => {
                    if (index !== activeTab) {
                        return null;
                    }
                    const tabContent: ReactNode =
                        isValidElement(child) && "props" in child && "children" in (child as ReactElement<TabProps>).props ?
                            (child as ReactElement<TabProps>).props.children : child;
                    return (
                        <div key={index} className={styles.tabContent}>
                            {tabContent}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}