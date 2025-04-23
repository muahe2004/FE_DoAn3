import {Link} from "react-router-dom";


import "../styles/footer.css";
import "../styles/Responsive/Components/Footer.css";


interface FooterProps {
    className?: string; // Tuỳ chọn thêm className nếu cần
}


const Footer: React.FC<FooterProps> = ({className}) => {
    return (
        <footer className={`footer ${className || ""}`}>
            <div className="footer-inner">
                {/* Cột 1 */}
                <div className="footer-column footer-column_first">
                    <div className="column-top">
                        <Link to="/">
                            <img className="footer-img" src="/images/ML.jpg" alt="MLearning Logo"/>
                        </Link>
                        <h2 className="column-title column-title__top">MLearning</h2>
                    </div>
                    <ul className="list-item">
                        <li className="column-item column-desc">
                            <b>Điện thoại :</b> 033426636
                        </li>
                        <li className="column-item column-desc">
                            <b>Email :</b> lyvanminh280504@gmail.com
                        </li>
                        <li className="column-item column-desc">
                            <b>Điạ chỉ :</b> Cẩm Xá, TX.Mỹ Hào, Hưng Yên, Việt Nam
                        </li>
                        
                    </ul>
                </div>

                {/* Cột 2 */}
                <div className="footer-column">
                    <h2 className="column-title">SẢN PHẨM</h2>
                    <ul className="list-item">
                        <li className="column-item">
                            <Link to="/">Game Nester</Link>
                        </li>
                        <li className="column-item">
                            <Link to="/">Game CSS Diner</Link>
                        </li>
                        <li className="column-item">
                            <Link to="/">Game CSS Selectors</Link>
                        </li>
                        <li className="column-item">
                            <Link to="/">Game Froggy</Link>
                        </li>
                        <li className="column-item">
                            <Link to="/">Game Froggy Pro</Link>
                        </li>
                        <li className="column-item">
                            <Link to="/">Game Scoops</Link>
                        </li>
                    </ul>
                </div>

                {/* Cột 3 */}
                <div className="footer-column">
                    <h2 className="column-title">CÔNG CỤ</h2>
                    <ul className="list-item">
                        <li className="column-item">
                            <Link to="/">Tạo CV xin việc</Link>
                        </li>
                        <li className="column-item">
                            <Link to="/">Rút gọn liên kết</Link>
                        </li>
                        <li className="column-item">
                            <Link to="/">Clip-path maker</Link>
                        </li>
                        <li className="column-item">
                            <Link to="/">Snippet generator</Link>
                        </li>
                        <li className="column-item">
                            <Link to="/">Snippet generator</Link>
                        </li>
                        <li className="column-item">
                            <Link to="/">Cảnh báo sờ tay lên mặt</Link>
                        </li>
                    </ul>
                </div>

                {/* Cột 4 */}
                <div className="footer-column">
                    <h2 className="column-title">HỖ TRỢ</h2>
                    <ul className="list-item">
                        <li className="column-item">
                            <Link to="/all-courses">Khóa học</Link>
                        </li>
                        <li className="column-item">
                            <Link to="/">Điều kiện giao dịch chung</Link>
                        </li>
                        <li className="column-item">
                            <Link to="/">Quy trình sử dụng dịch vụ</Link>
                        </li>
                        <li className="column-item">
                            <Link to="/">Chính sách bảo hành</Link>
                        </li>
                        <li className="column-item">
                            <Link to="/">Chính sách hoàn trả hàng</Link>
                        </li>
                        <li className="column-item">
                            <Link to="/">Chính sách bảo mật</Link>
                        </li>
                    </ul>
                </div>

                {/* Cột 5 */}
                <div className="footer-column footer-column_last">
                    <h2 className="column-title">CÔNG TY CP CÔNG NGHỆ GIÁO DỤC MLEARNING</h2>
                    <ul className="list-item">
                        <li className="column-item column-desc">
                            <Link to="/"><b>Lĩnh vực hoạt động:</b> Giáo dục, công nghệ - lập trình. 
                                Chúng tôi tập trung xây dựng và phát triển các sản phẩm 
                                mang lại giá trị cho cộng đồng lập trình viên Việt Nam.
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="footer-paragraph">© 2018 - 2025 MLearning. Nền tảng học lập trình hàng đầu Việt Nam</p>
                <div className="list-link">
                    <Link to="">
                        <img className="footer-icon" src="/icons/Facebook.svg" alt="" />
                    </Link>
                    <Link to="">
                        <img className="footer-icon" src="/icons/Youtube.svg" alt="" />
                    </Link>
                    <Link to="">
                        <img className="footer-icon" src="/icons/Tiktok.svg" alt="" />
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;