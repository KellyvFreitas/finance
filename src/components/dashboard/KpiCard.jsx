import clsx from "clsx";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import Sparkline from "../charts/Sparkline";
import Skeleton from "../ui/Skeleton";
import { formatDelta } from "../../lib/format";

function deltaTone(delta, higherIsBetter) {
    if (delta === null || Math.abs(delta) < 0.05) return "flat";
    const isGood = delta > 0 ? higherIsBetter : !higherIsBetter;
    return isGood ? "up" : "down";
}

export function KpiCardSkeleton() {
    return (
        <div className="kpi">
            <div className="kpi__top">
                <Skeleton width={90} height={13} />
                <Skeleton width={30} height={30} radius="10px" />
            </div>
            <Skeleton width={140} height={28} />
            <Skeleton width="100%" height={34} radius="6px" />
        </div>
    );
}

export default function KpiCard({
    label,
    value,
    delta = null,
    higherIsBetter = true,
    hint = "vs. período anterior",
    deltaUnit = "%",
    numericValue,
    icon: Icon,
    sparkData,
    sparkColor,
}) {
    const tone = deltaTone(delta, higherIsBetter);
    const DeltaIcon = tone === "flat" ? Minus : delta > 0 ? ArrowUpRight : ArrowDownRight;

    return (
        <article className="kpi">
            <div className="kpi__top">
                <h3 className="kpi__label">{label}</h3>
                {Icon && (
                    <span className="kpi__icon" aria-hidden="true">
                        <Icon size={16} />
                    </span>
                )}
            </div>

            <p className={clsx("kpi__value", numericValue < 0 && "kpi__value--negative")}>
                {value}
            </p>

            <div className="kpi__footer">
                {delta === null ? (
                    <span className="kpi__hint">Sem base de comparação</span>
                ) : (
                    <>
                        <span className={clsx("kpi__delta", `kpi__delta--${tone}`)}>
                            <DeltaIcon size={14} aria-hidden="true" />
                            {formatDelta(delta, { unit: deltaUnit })}
                        </span>
                        <span className="kpi__hint">{hint}</span>
                    </>
                )}
            </div>

            {sparkData?.length > 1 && <Sparkline data={sparkData} color={sparkColor} />}
        </article>
    );
}
