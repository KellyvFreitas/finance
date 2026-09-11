import clsx from "clsx";

export default function Button({
    variant = "default",
    icon: Icon,
    iconOnly = false,
    className,
    children,
    ...props
}) {
    return (
        <button
            type="button"
            className={clsx(
                "btn",
                variant !== "default" && `btn--${variant}`,
                iconOnly && "btn--icon",
                className,
            )}
            {...props}
        >
            {Icon && <Icon size={16} aria-hidden="true" />}
            {!iconOnly && children}
        </button>
    );
}
