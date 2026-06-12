// src/pages/Admin/Admin/UniComps/CountUp.jsx
import React, { useState, useEffect } from "react";

export default function CountUp({ end, duration = 2000, prefix = "", suffix = "", decimals = 0 }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        const endValue = parseFloat(end.toString().replace(/,/g, ""));

        const step = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Easing function (easeOutExpo) for smooth deceleration
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setCount(endValue * easeProgress);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [end, duration]);

    const formattedNumber = Number(count).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });

    return <span>{prefix}{formattedNumber}{suffix}</span>;
}