import { Link } from "react-router-dom";
import Navbar from "~/components/Navbar";
import Header from "~/components/Header";
import Button from "~/components/Button";

import "../styles/roadmap.css";

export default function RoadMap() {
  return (
    <div className="roadmap-wrapper">
        <Header title="Lộ trình"></Header>
        <Navbar></Navbar>
    
        <div className="roadmap-inner">
            <div className="roadmap-container">
                <div className="container-top">
                    <h1 className="container-title">Lộ trình học lập trình tại MLearning</h1>
                    <div className="container-desc">
                        <p className="container-desc__item">Việc lựa chọn đúng lộ trình học sẽ giúp bạn tiết kiệm thời gian và học tập hiệu quả hơn.</p>
                        <p className="container-desc__item">Nếu bạn đang hướng đến vị trí lập trình viên Back-end, hãy ưu tiên các kiến thức về cơ sở dữ liệu và ngôn ngữ phía server.</p>
                        <p className="container-desc__item">Bắt đầu với một mục tiêu rõ ràng sẽ giúp bạn không bị rối khi tiếp cận khối lượng kiến thức lớn trong lĩnh vực IT.</p>
                    </div>
                </div>

                <div className="container-content">
                    <div className="content-item">
                        <div className="item-head">
                            <div className="item-info">
                                <h2 className="item-title">
                                    <Link to="/">Lộ trình học Front-end</Link>
                                </h2>
                                <p className="item-desc">
                                    Lập trình viên Front-end là người xây dựng ra giao diện websites. 
                                    Trong phần này MLearn sẽ chia sẻ cho bạn lộ trình để trở thành lập trình viên Front-end nhé.
                                </p>
                            </div>
                        </div>

                        <ul className="item-list">
                            <li className="item-list__card">
                                <img src="/images/nhapmon.png" alt="" className="item-list__img" />
                                <span className="road-map__alt">Kiến thức nhập môn IT.</span>
                            </li>
                            <li className="item-list__card">
                                <img src="/images/html.png" alt="" className="item-list__img" />
                                <span className="road-map__alt">HTML cơ bản đến năng cao.</span>
                            </li>
                            <li className="item-list__card">
                                <img src="/images/css.png" alt="" className="item-list__img" />
                                <span className="road-map__alt">CSS cơ bản đến nâng cao.</span>
                            </li>
                            <li className="item-list__card">
                                <img src="/images/javascript.png" alt="" className="item-list__img" />
                                <span className="road-map__alt">Javascript.</span>
                            </li>
                            <li className="item-list__card">
                                <img src="/images/ubuntu.png" alt="" className="item-list__img" />
                                <span className="road-map__alt">Ubuntu cơ bản.</span>
                            </li>
                            <li className="item-list__card">
                                <img src="/images/react.png" alt="" className="item-list__img" />
                                <span className="road-map__alt">React.js cơ bản.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="content-item">
                        <div className="item-head">
                            <div className="item-info">
                                <h2 className="item-title">
                                    <Link to="/">Lộ trình học Back-end</Link>
                                </h2>
                                <p className="item-desc">
                                Trái với Front-end thì lập trình viên Back-end là người làm việc với dữ liệu, công việc thường nặng tính logic hơn. 
                                Chúng ta sẽ cùng tìm hiểu thêm về lộ trình học Back-end nhé.
                                </p>
                            </div>
                        </div>

                        <ul className="item-list">
                            <li className="item-list__card">
                                <img src="/images/nhapmon.png" alt="" className="item-list__img" />
                                <span className="road-map__alt">Kiến thức nhập môn IT.</span>
                            </li>
                            <li className="item-list__card">
                                <img src="/images/javascript.png" alt="" className="item-list__img" />
                                <span className="road-map__alt">Javascript.</span>
                            </li>
                            <li className="item-list__card">
                                <img src="/images/ubuntu.png" alt="" className="item-list__img" />
                                <span className="road-map__alt">Ubuntu cơ bản.</span>
                            </li>
                            <li className="item-list__card">
                                <img src="/images/node.png" alt="" className="item-list__img" />
                                <span className="road-map__alt">Node.js từ cơ bản đến nâng cao.</span>
                            </li>
                            <li className="item-list__card">
                                <img src="/images/html.png" alt="" className="item-list__img" />
                                <span className="road-map__alt">HTML cơ bản đến năng cao.</span>
                            </li>
                            <li className="item-list__card">
                                <img src="/images/css.png" alt="" className="item-list__img" />
                                <span className="road-map__alt">CSS cơ bản đến nâng cao.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="container-group">
                    <h2 className="item-title">Tham gia cộng đồng học lập trình MLearning.</h2>
                    <p className="item-desc">
                        Hàng nghìn người khác đang học lộ trình giống như bạn. 
                        Hãy tham gia hỏi đáp, chia sẻ và hỗ trợ nhau trong quá trình học nhé.
                    </p>
                    <Button to="https://www.facebook.com/ly.van.minh.500001" type="button" className="btn-join">Tham gia ngay!!!</Button>
                </div>
            </div>
        </div>
    </div>
  );
}
