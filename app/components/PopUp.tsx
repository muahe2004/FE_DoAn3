import { useEffect, useState } from "react";
import "../styles/popup.css";

interface ModelOverlayProps {
    icon: string;
    children: React.ReactNode;
    secondOption: string;
    title: string;
    desc: string;
    className?: string;
    onOpen: () => void; 
    isClosed: boolean; 
}

const PopUp: React.FC<ModelOverlayProps> = ({ children, secondOption, title, desc, icon, className, onOpen, isClosed }) => {
    const [varCount, setVarCount] = useState(5);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (!isClosed) {
            // Reset varCount mỗi lần mở
            setVarCount(5);

            intervalId = setInterval(() => {
                setVarCount(prev => {
                    if (prev === 1) {
                        clearInterval(intervalId); // Clear khi còn 1 (vì sau đó về 0)
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(intervalId); 
    }, [isClosed]); 

    return (
        <div id="popup" className={`popup ${isClosed ? "isClosed" : ""}`} onClick={onOpen}>
            <div className={`popup-inner`} onClick={(e) => e.stopPropagation()}>
                <div className={`popup-image ${className || ""}`}>
                    <img src={`/icons/${icon}`} alt="" className="popup-icon" />
                </div>

                <div className="popup-title">
                    <span className="title">{title}</span>
                </div>

                <div className="popup-desc">
                    <span className="desc">{desc}</span>
                </div>

                <div className="popup-action">
                    {secondOption && (
                        <button type="button" className="popup-button" onClick={onOpen}>
                            {secondOption}
                        </button>
                    )}
                    
                    {/* Hiển thị số đếm hoặc children */}
                    {varCount > 0 ? (
                        <button type="button" className="popup-count">
                            {varCount}
                        </button>
                    ) : (
                        children
                    )}
                </div>
            </div>
        </div>
    );
};

export default PopUp;
