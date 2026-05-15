import { useEffect, useRef, useState } from "react";

const COLORS = [
    "#FF4D4D", // red
    "#FFD93D", // yellow
    "#6BCB77", // green
    "#4D96FF", // blue
    "#FF6BFF", // purple
    "#FF9F43", // orange
    "#00FFDD", // cyan
];

const DVDLoader = ({ onDone, duration = 4000 }) => {
    const containerRef = useRef(null);
    const posRef = useRef({ x: 80, y: 80 });
    const velRef = useRef({ x: 2.2, y: 1.8 });
    const colorIdxRef = useRef(0);
    const rafRef = useRef(null);
    const logoRef = useRef(null);
    const wrapperRef = useRef(null);

    const [color, setColor] = useState(COLORS[0]);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const container = containerRef.current;
        const logo = logoRef.current;
        if (!container || !logo) return;

        const animate = () => {
            const cw = container.clientWidth;
            const ch = container.clientHeight;
            const lw = logo.offsetWidth;
            const lh = logo.offsetHeight;

            let { x, y } = posRef.current;
            let { x: vx, y: vy } = velRef.current;

            x += vx;
            y += vy;

            let hitCorner = false;
            let bounced = false;

            if (x <= 0) { x = 0; vx = Math.abs(vx); bounced = true; }
            if (x + lw >= cw) { x = cw - lw; vx = -Math.abs(vx); bounced = true; }
            if (y <= 0) { y = 0; vy = Math.abs(vy); bounced = true; }
            if (y + lh >= ch) { y = ch - lh; vy = -Math.abs(vy); bounced = true; }

            // corner hit = both axes bounced in same frame
            if (
                (x <= 0 || x + lw >= cw) &&
                (y <= 0 || y + lh >= ch)
            ) hitCorner = true;

            if (bounced) {
                colorIdxRef.current = (colorIdxRef.current + 1) % COLORS.length;
                setColor(COLORS[colorIdxRef.current]);

                // corner flash
                if (hitCorner && wrapperRef.current) {
                    wrapperRef.current.style.transition = "background 0.05s";
                    wrapperRef.current.style.background = COLORS[colorIdxRef.current] + "22";
                    setTimeout(() => {
                        if (wrapperRef.current)
                            wrapperRef.current.style.background = "#000";
                    }, 120);
                }
            }

            posRef.current = { x, y };
            velRef.current = { x: vx, y: vy };

            logo.style.transform = `translate(${x}px, ${y}px)`;
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        // fade out and unmount after duration
        const fadeTimer = setTimeout(() => {
            setVisible(false);
        }, duration - 500);

        const doneTimer = setTimeout(() => {
            onDone?.();
        }, duration);

        return () => {
            cancelAnimationFrame(rafRef.current);
            clearTimeout(fadeTimer);
            clearTimeout(doneTimer);
        };
    }, [duration, onDone]);

    return (
        <div
            ref={wrapperRef}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 200,
                background: "#000",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.5s ease",
                overflow: "hidden",
            }}
        >
            <img
                src="/img/noise.png"
                alt=""
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.85,
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            />

            {/* Scanline texture */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
                    pointerEvents: "none",
                    zIndex: 2,
                }}
            />

            {/* Bouncing logo (oval shape)  */}
            <div ref={containerRef} style={{ position: "absolute", inset: 0, zIndex: 3 }}>
                <div
                    ref={logoRef}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        willChange: "transform",
                    }}
                >
                    {/* The logo box */}
                    <div
                        style={{
                            padding: "10px 18px",
                            border: `2px solid ${color}`,
                            borderRadius: "6px",
                            transition: "border-color 0.1s, color 0.1s",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "2px",
                        }}
                    >
                        {/* Main logo text — replace with your actual logo/name */}
                        <span
                            style={{
                                fontSize: "28px",
                                fontWeight: 900,
                                fontFamily: "'Arial Black', sans-serif",
                                letterSpacing: "-0.03em",
                                color: color,
                                lineHeight: 1,
                                transition: "color 0.1s",
                                userSelect: "none",
                            }}
                        >
                            OAR
                        </span>
                        <span
                            style={{
                                fontSize: "7px",
                                letterSpacing: "0.35em",
                                textTransform: "uppercase",
                                color: color,
                                opacity: 0.7,
                                fontFamily: "monospace",
                                transition: "color 0.1s",
                                userSelect: "none",
                            }}
                        >
                            On A Rebel
                        </span>
                    </div>

                    {/* Glow shadow under logo */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "6px",
                            boxShadow: `0 0 24px 4px ${color}55`,
                            transition: "box-shadow 0.1s",
                            pointerEvents: "none",
                        }}
                    />
                </div>
            </div>

            {/* Corner flash indicator dots */}
            {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
                <div
                    key={pos}
                    style={{
                        position: "absolute",
                        ...(pos.includes("top") ? { top: 16 } : { bottom: 16 }),
                        ...(pos.includes("left") ? { left: 16 } : { right: 16 }),
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        zIndex: 4,
                    }}
                />
            ))}

            {/* Bottom label */}
            <div
                style={{
                    position: "absolute",
                    bottom: 28,
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "rgba(255,255,255,0.15)",
                    fontSize: "9px",
                    letterSpacing: "0.4em",
                    textTransform: "uppercase",
                    fontFamily: "monospace",
                    zIndex: 4,
                    userSelect: "none",
                }}
            >
                Loading…
            </div>
        </div>
    );
};

export default DVDLoader;
