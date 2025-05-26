import { useState } from "react";
import "../styles/Pagination.css";

interface PaginationProps {
    totalPages: number;
    onPageChange?: (page: number) => void;
}

export default function Pagination({ totalPages, onPageChange }: PaginationProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
        if (onPageChange) onPageChange(page);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            handlePageClick(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            handlePageClick(currentPage + 1);
        }
    };

    const renderPages = () => {
        const pages = [];

        if (totalPages <= 5) {
            // Hiện toàn bộ trang
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <div key={i} className="pagination-group pagination-group__page">
                        <button
                            className={`pagination-button ${currentPage === i ? "pagination-button__focus" : ""}`}
                            onClick={() => handlePageClick(i)}
                        >
                            {i}
                        </button>
                    </div>
                );
            }
        } else {
            // Hiện [1, 2, ..., totalPages]
            for (let i = 1; i <= 2; i++) {
                pages.push(
                    <div key={i} className="pagination-group pagination-group__page">
                        <button
                            className={`pagination-button ${currentPage === i ? "pagination-button__focus" : ""}`}
                            onClick={() => handlePageClick(i)}
                        >
                            {i}
                        </button>
                    </div>
                );
            }

            pages.push(
                <div key="dots" className="pagination-group pagination-group__page">
                    <button className="pagination-button" disabled>
                        ...
                    </button>
                </div>
            );

            pages.push(
                <div key={totalPages} className="pagination-group pagination-group__page">
                    <button
                        className={`pagination-button ${currentPage === totalPages ? "pagination-button__focus" : ""}`}
                        onClick={() => handlePageClick(totalPages)}
                    >
                        {totalPages}
                    </button>
                </div>
            );
        }

        return pages;
    };

    return (
        <div className="pagination">
            <div className="pagination-inner">
                <div className="pagination-group__steps">
                    <button
                        className="pagination-button pagination-button__steps"
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                    >
                        <svg fill="currentColor" className="pagination-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
                        </svg>
                        Trước
                    </button>
                </div>

                {renderPages()}

                <div className="pagination-group__steps pagination-group__steps--next">
                    <button
                        className="pagination-button pagination-button__steps"
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                    >
                        Tiếp
                        <svg fill="currentColor" className="pagination-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
