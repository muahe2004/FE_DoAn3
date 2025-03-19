import { Link } from "react-router-dom";
import "../styles/button.css";

interface ButtonProps {
  to?: string; 
  children: React.ReactNode; 
  type?: "button" | "submit" | "reset"; // Thêm type cho button
  className?: string; // Tuỳ chọn thêm className nếu cần
  onClick?: () => void; 
}

const Button: React.FC<ButtonProps> = ({ to, children, type = "button", className, onClick }) => {
  if (to) {
    return (
      <Link to={to} className={`button-primary ${className || ""}`}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={`button-primary ${className || ""}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
