
import { Link } from "react-router-dom";
import Navbar from "~/components/Navbar";
import Header from "~/components/Header";

import "../styles/roadmap.css";


export default function RoadMap() {
  return (
    <div className="roadmap-wrapper">
        <Header title="Lộ trình"></Header>
        <Navbar></Navbar>
    
        <div className="roadmap-inner">
            <div className="roadmap-container">
                <div className="container-top">
                    <h1 className="container-title">Lộ trình học</h1>
                    <div className="container-desc">
                        <p>Để bắt đầu một cách thuận lợi, bạn nên tập trung vào một lộ trình học. 
                            Ví dụ: Để đi làm với vị trí "Lập trình viên Front-end" bạn nên tập trung vào lộ trình "Front-end".
                        </p>
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

                            {/* <div className="item-thumb">
                                <Link to="/" className="thumb-link">
                                    <img src="./public/images/FE.png" alt="" className="item-img" />
                                </Link>
                            </div> */}
                        </div>

                        <ul className="item-list">
                            <li className="item-list__card">
                                <img src="/images/nhapmon.png" alt="" className="item-list__img" />
                            </li>
                            <li className="item-list__card">
                                <img src="/images/html.png" alt="" className="item-list__img" />
                            </li>
                            <li className="item-list__card">
                                <img src="/images/css.png" alt="" className="item-list__img" />
                            </li>
                            <li className="item-list__card">
                                <img src="/images/javascript.png" alt="" className="item-list__img" />
                            </li>
                            <li className="item-list__card">
                                <img src="/images/ubuntu.png" alt="" className="item-list__img" />
                            </li>
                            <li className="item-list__card">
                                <img src="/images/react.png" alt="" className="item-list__img" />
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

                            {/* <div className="item-thumb">
                                <Link to="/" className="thumb-link">
                                    <img src="./public/images/FE.png" alt="" className="item-img" />
                                </Link>
                            </div> */}
                        </div>

                        <ul className="item-list">
                            <li className="item-list__card">
                                <img src="/images/nhapmon.png" alt="" className="item-list__img" />
                            </li>
                            <li className="item-list__card">
                                <img src="/images/javascript.png" alt="" className="item-list__img" />
                            </li>
                            <li className="item-list__card">
                                <img src="/images/ubuntu.png" alt="" className="item-list__img" />
                            </li>
                            <li className="item-list__card">
                                <img src="/images/node.png" alt="" className="item-list__img" />
                            </li>
                            <li className="item-list__card">
                                <img src="/images/html.png" alt="" className="item-list__img" />
                            </li>
                            <li className="item-list__card">
                                <img src="/images/css.png" alt="" className="item-list__img" />
                            </li>
                        </ul>

                    </div>
                </div>
            </div>
        </div>
    </div>
    
  );
}
