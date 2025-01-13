import { memo } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    startEntry: number;
    endEntry: number;
    totalCount: number;
}

const Pagination = memo(({
    currentPage,
    totalPages,
    onPageChange,
    startEntry,
    endEntry,
    totalCount,
}: PaginationProps) => (
    <div className="flex justify-between items-center mt-4 px-4">
        <div className="text-sm">
            Showing {startEntry}-{endEntry} of {totalCount}
        </div>
        <div className="flex gap-2">
            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <LuChevronLeft className="w-5 h-5" />
            </button>
            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <LuChevronRight className="w-5 h-5" />
            </button>
        </div>
    </div>
));

Pagination.displayName = "Pagination";

export default Pagination; 