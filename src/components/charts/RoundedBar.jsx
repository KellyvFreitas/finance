export default function RoundedBar({
    x,
    y,
    width,
    height,
    fill,
    value,
    negative,
    radius = 4,
}) {
    const top = height < 0 ? y + height : y;
    const box = Math.abs(height);

    if (!width || !box) return null;

    const r = Math.min(radius, width / 2, box);
    const raw = Array.isArray(value) ? value[1] - value[0] : value;
    const pointsDown = negative ?? raw < 0;

    const path = pointsDown
        ? `M${x},${top}
           h${width}
           v${box - r}
           a${r},${r} 0 0 1 ${-r},${r}
           h${-(width - r * 2)}
           a${r},${r} 0 0 1 ${-r},${-r}
           Z`
        : `M${x},${top + r}
           a${r},${r} 0 0 1 ${r},${-r}
           h${width - r * 2}
           a${r},${r} 0 0 1 ${r},${r}
           v${box - r}
           h${-width}
           Z`;

    return <path d={path} fill={fill} />;
}
