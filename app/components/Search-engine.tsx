import { useEffect, useRef, useState } from "react";

import "../styles/search-engine.css";

type SearchEngineProps<T> = {
    placeholder?: string;
    getData: (query: string) => void;
    data: T[];
    renderItem: (item: T) => React.ReactNode;
};

function SearchEngine<T>({ placeholder, getData, data, renderItem }: SearchEngineProps<T>) {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);
    const [showResult, setShowResult] = useState(false);

    // debounce gọi API khi người dùng gõ
    useEffect(() => {
        if (!inputValue.trim()) {
            setShowResult(false);
            return;
        }

        const timeout = setTimeout(() => {
            getData(inputValue);
        }, 300);

        return () => clearTimeout(timeout);
    }, [inputValue]);

    // tự động show khi có data trả về
    useEffect(() => {
        if (data.length > 0) {
            setShowResult(true);
        } else {
            setShowResult(false);
        }
    }, [data]);

    // ẩn khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                resultRef.current &&
                !resultRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowResult(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="search-engine">
            <div className="search-engine__inner">
                <input 
                    className="search-engine__input" 
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    ref={inputRef}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => {
                        if (inputValue.trim()) {
                            setShowResult(true);
                        }
                    }}
                />
                <svg className="search-engine__icon" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                </svg>
            </div>

            <div className={`search-engine__result ${showResult ? 'show' : ''}`} ref={resultRef}>
                {
                    data.length > 0 ? (
                        data.map(renderItem)
                    ) : (
                        <div className="search-engine__empty">Không tìm thấy kết quả nào.</div>
                    )}
            </div>

        </div>
    );
}



export default SearchEngine;
