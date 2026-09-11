import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

export default function Pagination({ page, pageCount, onPageChange }) {
    if (pageCount <= 1) return null;

    return (
        <div className="pagination">
            <Button
                variant="ghost"
                iconOnly
                icon={ChevronLeft}
                aria-label="Página anterior"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
            />
            <span className="pagination__page">
                {page} de {pageCount}
            </span>
            <Button
                variant="ghost"
                iconOnly
                icon={ChevronRight}
                aria-label="Próxima página"
                disabled={page === pageCount}
                onClick={() => onPageChange(page + 1)}
            />
        </div>
    );
}
