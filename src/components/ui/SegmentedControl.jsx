import clsx from "clsx";

export default function SegmentedControl({ options, value, onChange, label }) {
    return (
        <div className="segmented" role="radiogroup" aria-label={label}>
            {options.map((option) => {
                const isActive = option.value === value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        title={option.title}
                        className={clsx(
                            "segmented__option",
                            isActive && "segmented__option--active",
                        )}
                        onClick={() => onChange(option.value)}
                    >
                        {option.icon ? <option.icon size={15} aria-hidden="true" /> : option.label}
                        {option.icon && <span className="sr-only">{option.label}</span>}
                    </button>
                );
            })}
        </div>
    );
}
