import {Link} from "react-router-dom";


import "../styles/header.css";

interface HeaderProps {
    title: string,

}


const Header: React.FC<HeaderProps> = ({title}) => {
    return (
        <header className="header">
        
            <div className="header-wrapper">
                <h1 className="header-logo">
                    <Link to="/">
                        <img
                        className="header-image"
                        src="/images/ML.jpg"
                        alt="MLearning Logo"
                        />
                    </Link>
                    <Link className="header-title" to="/">
                        {title}
                    </Link>
                </h1>

                <div className="header-search">
                    <img className="header-icon" src="/icons/Search.svg" alt="" />
                    <input className="header-input" type="text" />
                </div>

                <div className="header-container">
                    <div className="header-menu">
                        <button className="header-button">Khóa học của tôi</button>
                    </div>
                    <img className="header-notify" src="/icons/Bell-ring.svg" alt="" />
                    <Link rel="stylesheet" to="/admin">
                        <img src="/images/lvm.jpg" alt="" className="header-avtar" />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;