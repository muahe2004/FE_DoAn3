// import type { Route } from "./+types/home";
// import { Welcome } from "../welcome/welcome";

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "New React Router App" },
//     { name: "description", content: "Welcome to React Router!" },
//   ];
// }

import { Link } from "react-router-dom";
import Navbar from "~/components/Navbar";
import Header from "~/components/Header";

import "../styles/roadmap.css";


export default function RoadMap() {
  return (
    <div className="roadmap-wrapper">
        <Navbar></Navbar>
        <Header title="Lộ trình"></Header>
    
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

                            <div className="item-thumb">
                                <Link to="/" className="thumb-link">
                                    <img src="./public/images/FE.png" alt="" className="item-img" />
                                </Link>
                            </div>
                        </div>

                    </div>

                    <div className="content-item">
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    
  );
}
