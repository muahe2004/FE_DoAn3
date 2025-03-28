
import { useEffect, useState } from "react";
import {  Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "~/components/Navbar";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Button from "~/components/Button";

import "../styles/course-details.css";

// Fake dữ liệu
// const chuongHocList = [
//     {
//         maChuongHoc: "CH001",
//         tenChuongHoc: "Giới thiệu về khóa học",
//         danhSachBaiHoc: [
//         {
//             maBaiHoc: "BH001",
//             tenBaiHoc: "Lời khuyên trước khóa học",
//             moTaBaiHoc: "Tổng quan về JavaScript và cách sử dụng.",
//             video: "intro_js.mp4",
//         },
//         {
//             maBaiHoc: "BH002",
//             tenBaiHoc: "Cài đặt môi trường",
//             moTaBaiHoc: "Hướng dẫn thiết lập môi trường lập trình JS.",
//             video: "setup_js.mp4",
//         },
//         {
//             maBaiHoc: "BH003",
//             tenBaiHoc: "Biến và kiểu dữ liệu",
//             moTaBaiHoc: "Giới thiệu về các kiểu dữ liệu trong JavaScript.",
//             video: "variables_js.mp4",
//         },
//         {
//             maBaiHoc: "BH004",
//             tenBaiHoc: "Câu lệnh điều kiện",
//             moTaBaiHoc: "Hướng dẫn sử dụng if-else và switch-case.",
//             video: "conditions_js.mp4",
//         }
//         ]
//     },
//     {
//         maChuongHoc: "CH002",
//         tenChuongHoc: "Giới thiệu về khóa học",
//         danhSachBaiHoc: [
//         {
//             maBaiHoc: "BH001",
//             tenBaiHoc: "Lời khuyên trước khóa học",
//             moTaBaiHoc: "Tổng quan về JavaScript và cách sử dụng.",
//             video: "intro_js.mp4",
//         },
//         {
//             maBaiHoc: "BH002",
//             tenBaiHoc: "Cài đặt môi trường",
//             moTaBaiHoc: "Hướng dẫn thiết lập môi trường lập trình JS.",
//             video: "setup_js.mp4",
//         },
//         {
//             maBaiHoc: "BH003",
//             tenBaiHoc: "Biến và kiểu dữ liệu",
//             moTaBaiHoc: "Giới thiệu về các kiểu dữ liệu trong JavaScript.",
//             video: "variables_js.mp4",
//         },
//         {
//             maBaiHoc: "BH004",
//             tenBaiHoc: "Câu lệnh điều kiện",
//             moTaBaiHoc: "Hướng dẫn sử dụng if-else và switch-case.",
//             video: "conditions_js.mp4",
//         }
//         ]
//     },
// ];


export default function CourseDetails() {

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
            console.log(lessonInfo);
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

  return (
    <div className="course-details__wrapper">
        <Navbar></Navbar>
        <Header title="Thông tin khóa học"></Header>
    
        <div className="course-details__inner">
            <div className="course-container">
                <div className="course-info">
                    <h1 className="course-info__name">{tenKhoaHoc}</h1>
                    <p className="course-info__desc">
                        {moTaKhoaHoc}
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
                    {/* <div className="lecture-video">
                        {videoSrc ? (
                            <iframe 
                            className="video-iframe"
                            src={videoSrc} 
                            title="YouTube Video"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            ></iframe>
                        ) : (
                            <p className="no-video">Video bài học</p>
                        )}
                    </div> */}

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



                    <Button className="thumb-btn" children="Đăng ký ngay" type="button"></Button>

                    <ul className="thumb-list">
                        <li className="thumb-item">
                            <img src="/icons/Code.svg" alt="" className="thumb-icon" />
                            <span>Trình độ cơ bản</span>
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

        <Footer title=""></Footer>
    </div>
    
  );
}
