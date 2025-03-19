import { useState, useEffect } from "react";
import "../styles/overlaymodel.css";

interface ModelOverlayProps {
    icon: string;
    children: React.ReactNode;
    secondOption: string;
    title: string;
    desc: string;
    className?: string;
    onClose: () => void; // Thêm prop này để xử lý đóng modal
}

const ModelOverlay: React.FC<ModelOverlayProps> = ({ children, secondOption, title, desc, icon, className, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true); // Bắt đầu hiệu ứng đóng modal
    };

    useEffect(() => {
        if (isClosing) {
            const timer = setTimeout(() => {
                onClose(); // Gọi hàm onClose() từ component cha để đóng modal
                setIsClosing(false); // Reset trạng thái đóng
            }, 300); // 300ms khớp với animation CSS

            return () => clearTimeout(timer);
        }
    }, [isClosing, onClose]);

    return (
        <div id="overlay-model" className={`overlay-model ${isClosing ? "fade-out" : ""}`} onClick={handleClose}>
            <div className="model-inner" onClick={(e) => e.stopPropagation()}>
                <div className={`model-image ${className || ""}`}>
                    <img src={`/icons/${icon}`} alt="" className="model-icon" />
                </div>

                <div className="model-title">
                    <span className="title">{title}</span>
                </div>

                <div className="model-desc">
                    <span className="desc">{desc}</span>
                </div>

                <div className="model-action">
                    <button className="model-button" onClick={handleClose}>{secondOption}</button>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ModelOverlay;
