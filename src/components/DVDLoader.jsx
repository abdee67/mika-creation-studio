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

const LOADER_BACKGROUND = "#2F2C30";
const getFlashBackground = (color) =>
    `linear-gradient(${color}22, ${color}22), ${LOADER_BACKGROUND}`;

const DVDLoader = ({
    onDone,
    duration = 4000,
    isDone,
    minimumDuration = 1200,
}) => {
    const containerRef = useRef(null);
    const posRef = useRef({ x: 80, y: 80 });
    const velRef = useRef({ x: 2.2, y: 1.8 });
    const colorIdxRef = useRef(0);
    const rafRef = useRef(null);
    const logoRef = useRef(null);
    const wrapperRef = useRef(null);
    const mountedAtRef = useRef(performance.now());
    const doneCalledRef = useRef(false);
    const onDoneRef = useRef(onDone);

    const [color, setColor] = useState(COLORS[0]);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        onDoneRef.current = onDone;
    }, [onDone]);

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
                    wrapperRef.current.style.transition =
                        "background 0.05s, opacity 0.5s ease";
                    wrapperRef.current.style.background = getFlashBackground(
                        COLORS[colorIdxRef.current]
                    );
                    setTimeout(() => {
                        if (wrapperRef.current)
                            wrapperRef.current.style.background = LOADER_BACKGROUND;
                    }, 120);
                }
            }

            posRef.current = { x, y };
            velRef.current = { x: vx, y: vy };

            logo.style.transform = `translate(${x}px, ${y}px)`;
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    useEffect(() => {
        if (doneCalledRef.current) return undefined;

        const isControlledByReady = typeof isDone === "boolean";
        if (isControlledByReady && !isDone) return undefined;

        const elapsed = performance.now() - mountedAtRef.current;
        const fadeDelay = isControlledByReady
            ? Math.max(minimumDuration - elapsed, 0)
            : Math.max(duration - 500, 0);

        const fadeTimer = setTimeout(() => {
            setVisible(false);
        }, fadeDelay);

        const doneTimer = setTimeout(() => {
            doneCalledRef.current = true;
            onDoneRef.current?.();
        }, fadeDelay + 500);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(doneTimer);
        };
    }, [duration, isDone, minimumDuration]);

    return (
        <div
            ref={wrapperRef}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 200,
                background: LOADER_BACKGROUND,
                opacity: visible ? 1 : 0,
                transition: "opacity 0.5s ease",
                overflow: "hidden",
            }}
        >
            {/* Scanline texture */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(16, 16, 16, 0.91) 2px, rgba(12, 12, 11, 1) 4px)",
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            />

            {/* Bouncing logo (oval shape)  */}
            <div ref={containerRef} style={{ position: "absolute", inset: 0, zIndex: 2 }}>
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
                            width: "clamp(170px, 22vw, 320px)",
                            height: "clamp(86px, 10vw, 150px)",
                            padding: "clamp(14px, 2vw, 28px)",
                            border: `3px solid ${color}`,
                            borderRadius: "1000px",
                            transition: "border-color 0.1s, color 0.1s",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "clamp(3px, 0.5vw, 8px)",
                            background:
                                "radial-gradient(ellipse at 50% 30%, rgba(0, 0, 0, 1), transparent 58%), rgba(0, 0, 0, 1)",
                            boxShadow: `inset 0 0 22px ${color}22`,
                        }}
                    >
                        {/* Main logo text */}
                        <span
                            style={{
                                fontSize: "clamp(42px, 7vw, 92px)",
                                fontWeight: 900,
                                fontFamily: "'Arial Black', sans-serif",
                                letterSpacing: 0,
                                color: color,
                                lineHeight: 0.82,
                                transition: "color 0.1s",
                                userSelect: "none",
                            }}
                        >
                            MC
                        </span>
                        <span
                            style={{
                                fontSize: "clamp(8px, 1vw, 13px)",
                                letterSpacing: "0.45em",
                                textTransform: "uppercase",
                                color: color,
                                opacity: 0.8,
                                fontFamily: "monospace",
                                transition: "color 0.1s",
                                userSelect: "none",
                            }}
                        >
                            Mika Creation
                        </span>
                    </div>

                    {/* Glow shadow under logo */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "999px",
                            boxShadow: `0 0 34px 8px ${color}66`,
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
                    fontSize: "29px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontFamily: "monospace",
                    zIndex: 4,
                    userSelect: "none",
                }}
            >
                <h1>Lo<b>a</b><b>d</b><b>i</b><b>n</b><b>g</b><b>...</b></h1>
            </div>
        </div>
    );
};

export default DVDLoader;
