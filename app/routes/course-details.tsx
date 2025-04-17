
import { useEffect, useState } from "react";
import {  Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "~/components/Navbar";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Button from "~/components/Button";
import ModelOverlay from "~/components/OverlayModel";

import "../styles/course-details.css";
import "../styles/Responsive/course-details.css";
// import { userInfo } from "os";


interface UserInfo {
    maNguoiDung: string;
    email: string;
};

const chuongHocListFake = [
    {
      maChuongHoc: 1,
      tenChuongHoc: "Giới thiệu về JavaScript",
      danhSachBaiHoc: [
        { maBaiHoc: 1, tenBaiHoc: "Lời khuyên trước khóa học" },
        { maBaiHoc: 2, tenBaiHoc: "Cài đặt môi trường" },
        { maBaiHoc: 3, tenBaiHoc: "Giới thiệu về JavaScript" }
      ]
    },
    {
      maChuongHoc: 2,
      tenChuongHoc: "Biến và kiểu dữ liệu",
      danhSachBaiHoc: [
        { maBaiHoc: 4, tenBaiHoc: "Sử dụng biến trong JavaScript" },
        { maBaiHoc: 5, tenBaiHoc: "Các kiểu dữ liệu cơ bản" },
        { maBaiHoc: 6, tenBaiHoc: "Kiểu dữ liệu Object" }
      ]
    },
    {
      maChuongHoc: 3,
      tenChuongHoc: "Câu lệnh điều kiện và vòng lặp",
      danhSachBaiHoc: [
        { maBaiHoc: 7, tenBaiHoc: "Câu lệnh if-else" },
        { maBaiHoc: 8, tenBaiHoc: "Toán tử logic" },
        { maBaiHoc: 9, tenBaiHoc: "Vòng lặp for và while" }
      ]
    },
    {
      maChuongHoc: 4,
      tenChuongHoc: "Functions trong JavaScript",
      danhSachBaiHoc: [
        { maBaiHoc: 10, tenBaiHoc: "Hàm là gì?" },
        { maBaiHoc: 11, tenBaiHoc: "Định nghĩa hàm" },
        { maBaiHoc: 12, tenBaiHoc: "Hàm bậc cao" }
      ]
    }
  ];


export default function CourseDetails() {
    const navigate = useNavigate();

    const { maKhoaHoc } = useParams();
    const [tenKhoaHoc, setTenKhoaHoc] = useState("");
    const [moTaKhoaHoc, setMoTaKhoaHoc] = useState("");
    const [doKho, setDoKho] = useState("");
    const [giaBan, setGiaBan] = useState("");
    const [hinhAnh, setHinhAnh] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // API load thông tin khóa học 
    useEffect(() => {
        fetch(`http://localhost:1000/getByID/${maKhoaHoc}`)
          .then((res) => res.json())
          .then((data) => {
            setTenKhoaHoc(data.tenKhoaHoc);
            setMoTaKhoaHoc(data.moTaKhoaHoc);
            setDoKho(data.doKho);
            setGiaBan(data.giaBan);
            setHinhAnh(data.hinhAnh);
            setImagePreview(data.hinhAnh);
          })
          .catch((err) => console.error(err));
    }, [maKhoaHoc]);

    const [chuongHocList, setChuongHocList] = useState<
        { maChuongHoc: string; tenChuongHoc: string; danhSachBaiHoc: any[] }[]
    >([]);

    // API load chương, bài học
    useEffect(() => {
        const fetchLessons = async () => {
        try {
            const res = await fetch(`http://localhost:1000/selection-chuong-hoc/${maKhoaHoc}`);
            if (!res.ok) throw new Error("Lỗi khi lấy chương học!");

            const lessons: { maChuongHoc: string; tenChuongHoc: string }[] = await res.json();
            
            const lessonInfo = await Promise.all(
                lessons.map(async (lesson) => {
                    const resLecture = await fetch(`http://localhost:1000/listBaiHoc/${lesson.maChuongHoc}`);
                    let danhSachBaiHoc = [];

                    if (resLecture.ok) {
                        danhSachBaiHoc = await resLecture.json();
                    }

                    return { 
                        maChuongHoc: lesson.maChuongHoc, 
                        tenChuongHoc: lesson.tenChuongHoc,
                        danhSachBaiHoc 
                    };
                })
            );

            setChuongHocList(lessonInfo); 
        } catch (error) {
            console.error("Lỗi:", error);
        }
        };

        fetchLessons();
    }, [maKhoaHoc]); 

    // Accordion
    const [openIndexes, setOpenIndexes] = useState<number[]>([]);

    // Hàm xử lý mở/đóng accordion
    const toggleAccordion = (index: number) => {
        setOpenIndexes((prevIndexes) =>
        prevIndexes.includes(index)
            ? prevIndexes.filter((i) => i !== index) // Nếu đã mở thì xóa khỏi danh sách (đóng lại)
            : [...prevIndexes, index] // Nếu chưa mở thì thêm vào danh sách (mở ra)
        );
    };

    const handleRegisterCourse = async () => {
        // Lấy thông tin người dùng từ localStorage
        const userInfoStr = localStorage.getItem("userInfo");
        if (!userInfoStr) {
            console.log("Không tìm thấy thông tin người dùng trong localStorage.");
            return;
        }
        const userInfo = JSON.parse(userInfoStr);
        const maNguoiDung = userInfo.maNguoiDung;
    
        // Kiểm tra khóa học miễn phí
        if (parseFloat(giaBan) === 0) {
            console.log("Đăng ký khóa học thành công (Miễn phí)!");
            await registerCourse(maNguoiDung, parseFloat(giaBan));
            navigate(`/learning/${maKhoaHoc}`);
            return;
        }
    
        // Kiểm tra số dư tài khoản
        try {
            const res = await fetch("http://localhost:1000/balance", { 
                method: "GET",
                credentials: "include",
            });
    
            if (!res.ok) {
                console.error("Lỗi khi lấy số dư: ", res.statusText);
                return;
            }
    
            const data = await res.json();
            const soDu = parseFloat(data.soDu);
    
            if (soDu < parseFloat(giaBan)) {
                handleClose();
                handleNoBalanceOpen();
                // setTimeout(handleNoBalanceClose, 3000)
                return;
            }
    
            // Tiến hành đăng ký khóa học
            await registerCourse(maNguoiDung, parseFloat(giaBan));
            navigate(`/learning/${maKhoaHoc}`);
    
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };
    
    // Hàm đăng ký khóa học
    const registerCourse = async (maNguoiDung: string, giaBan: number) => {
        const body = {
            maKhoaHoc: maKhoaHoc,
            maNguoiDung: maNguoiDung,
            trangThai: "Đang học",
            giaBan: giaBan
        };
    
        try {
            const registerRes = await fetch("http://localhost:1000/courses/resgister", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
    
            if (registerRes.ok) {
                console.log("Đăng ký khóa học thành công!");
            } else {
                console.error("Lỗi khi đăng ký khóa học:", await registerRes.text());
            }
        } catch (error) {
            console.error("Lỗi khi gọi API đăng ký khóa học:", error);
        }
    };
    

    // Ẩn hiện model
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = () => {
        // Lấy thông tin người dùng từ localStorage
        const userInfoStr = localStorage.getItem("userInfo");
        if (!userInfoStr) {
            navigate("/login");
            return;
        }
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    // Ẩn hiện model k đủ tèn
    const [isModalNoBalanceOpen, setIsModalNoBalanceOpen] = useState(false);

    const handleNoBalanceOpen = () => {
        setIsModalNoBalanceOpen(true);
    };

    const handleNoBalanceClose = () => {
        setIsModalNoBalanceOpen(false);
    };
    

  return (
    <div className="course-details__wrapper">
        <Navbar></Navbar>
        <Header title="Thông tin khóa học"></Header>
    
        <div className="course-details__inner">
            <div className="course-container">
                <div className="course-info">
                    <h1 className="course-info__name">{tenKhoaHoc || "Javascriot cơ bản"}</h1>
                    <p className="course-info__desc">
                        {moTaKhoaHoc || "Khóa học giúp người dùng thành thạo Javascript căn bản"} 
                    </p>
                    
                    {/* Danh sách chương. bài học */}
                    <div className="course-accordion">
                        <h2 className="course-accordion__title">Nội dung khóa học</h2>
                        <div className="course-accordion__inner">
                        {chuongHocList.map((chuong, index) => (
                            <div className="course-accordion__item" key={chuong.maChuongHoc}>
                                <div className="course-accordion__head">
                                    <button type="button" className="course-accordion__lesson" onClick={() => toggleAccordion(index)}>
                                        {chuong.tenChuongHoc} 
                                    </button>
                                </div>

                                <div className={`course-accordion__content ${openIndexes.includes(index) ? "open" : ""}`}>
                                    <ul className="course-accordion__list">
                                        {chuong.danhSachBaiHoc.map((baiHoc) => (
                                            <li key={baiHoc.maBaiHoc} className="course-accordion__list--item">
                                                <Link to="" className="course-accordion__list--link">
                                                    {baiHoc.tenBaiHoc}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>

                <div className="course-video__thumb">
                    <iframe
                        className="course-video__iframe"
                        src="https://www.youtube.com/embed/o_VDcEy029M"
                        title="YouTube Video"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    >
                    </iframe>

                    <h3 className="course-details__cost">
                        {Number(giaBan) === 0 ? "Miễn phí" : `${Number(giaBan).toLocaleString("vi-VN")} VNĐ`}
                    </h3>



                    <Button className="thumb-btn" children="Đăng ký ngay" type="button" onClick={handleOpen}></Button>

                    <ul className="thumb-list">
                        <li className="thumb-item">
                            <img src="/icons/Code.svg" alt="" className="thumb-icon" />
                            <span>Độ khó: {doKho}</span>
                        </li>

                        <li className="thumb-item">
                            <img src="/icons/Article.svg" alt="" className="thumb-icon" />
                            <span>Tổng số 100 bài học</span>
                        </li>

                        {/* <li className="thumb-item">
                            <img src="/icons/Code.svg" alt="" className="thumb-icon" />
                            <span>Trình độ cơ bản</span>
                        </li> */}

                        <li className="thumb-item">
                            <img src="/icons/Clock.svg" alt="" className="thumb-icon" />
                            <span>Học mọi lúc mọi nơi</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>


        { isModalOpen && (
            <ModelOverlay 
                icon="Question.svg" 
                title="Thanh toán" 
                desc="Xác nhận thanh toán ?" 
                secondOption="Hủy" 
                onClose={handleClose} 
                className="model-image_second">
                <Button onClick={handleRegisterCourse} type="button">Thanh toán</Button>    
            </ModelOverlay>
        )}

        { isModalNoBalanceOpen && (
            <ModelOverlay 
                icon="Exclamation.svg" 
                title="Thanh toán" 
                desc="Số dư của bạn hiện không đủ" 
                secondOption="Đóng" 
                onClose={handleNoBalanceClose} 
                className="model-image_second">
                <Button to="/payment" type="button">Nạp tiền</Button>    
            </ModelOverlay>
        )}
        <Footer></Footer>
    </div>
  );
}
