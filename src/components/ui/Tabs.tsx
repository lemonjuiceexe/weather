import {useState, isValidElement, type ReactNode, type MouseEvent, type ReactElement, useEffect} from "react";
import styles from "./Tabs.module.css";

interface RippleAnimationState {
    event: MouseEvent<HTMLButtonElement> | null;
    button: HTMLButtonElement | null;
    radius: number;
    active: boolean;
}

interface TabProps {
    label?: string;
    children?: ReactNode;
}
interface Props {
    children?: ReactElement<TabProps> | ReactElement<TabProps>[] | ReactNode;
}

export default function Tabs({ children }: Props) {
    const childrenArray: ReactNode[] = Array.isArray(children) ? children : [children];
    const [activeTab, setActiveTab] = useState(0);
    const [rippleAnimation, setRippleAnimation] = useState<RippleAnimationState>({
        event: null,
        button: null,
        radius: 0,
        active: false
    });

    function handleHeaderClick(event: MouseEvent<HTMLButtonElement>, index: number): void {
        setActiveTab(index);
        console.log(event.currentTarget)
        setRippleAnimation({
            event: event,
            button: event.currentTarget,
            radius: Math.max(event.currentTarget.clientWidth, event.currentTarget.clientHeight) / 2,
            active: true
        });
    }

    useEffect(() => {
        if (!rippleAnimation.active || !rippleAnimation.event) {
            return;
        }
        document.querySelectorAll(`.${styles.ripple}`).forEach((element) => {
            const circle = element as HTMLSpanElement;
            const event: MouseEvent<HTMLButtonElement> = rippleAnimation.event!;
            const button: HTMLButtonElement = rippleAnimation.button!;

            circle.style.width = circle.style.height = `${rippleAnimation.radius * 2}px`;
            circle.style.left = `${event!.clientX - (button.offsetLeft + rippleAnimation.radius)}px`;
            circle.style.top = `${event!.clientY - (button.offsetTop + rippleAnimation.radius)}px`;
            circle.classList.add("ripple");
            circle.className = styles.ripple;
            button.appendChild(circle);
            circle.addEventListener("animationend", () => {
                circle.classList.remove("ripple");
                setRippleAnimation({
                    active: false,
                    event: null,
                    button: null,
                    radius: 0
                });
            });
        })
    }, [rippleAnimation]);

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
                            {rippleAnimation && <span className={styles.ripple}></span>}
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