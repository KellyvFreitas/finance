import { Search, X } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder = "Buscar...", label }) {
    return (
        <div className="search">
            <Search size={15} className="search__icon" aria-hidden="true" />
            <input
                type="search"
                className="input"
                value={value}
                aria-label={label ?? placeholder}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
            />
            {value && (
                <button
                    type="button"
                    className="search__clear"
                    aria-label="Limpar busca"
                    onClick={() => onChange("")}
                >
                    <X size={14} aria-hidden="true" />
                </button>
            )}
        </div>
    );
}
