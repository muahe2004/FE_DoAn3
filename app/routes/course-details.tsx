import { useEffect, useState } from "react";
import {  Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "~/components/Navbar";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Button from "~/components/Button";

import "../styles/course-details.css";
import "../styles/Responsive/course-details.css";
import PopUp from "~/components/PopUp";
import { useCreateBillsMutation } from "~/services/apiBills";

import type { bills } from "~/types/bills";

interface UserInfo {
    maNguoiDung: string;
    email: string;
};

export default function CourseDetails() {
    const navigate = useNavigate();

    const { maKhoaHoc } = useParams();
    const [tenKhoaHoc, setTenKhoaHoc] = useState("");
    const [moTaKhoaHoc, setMoTaKhoaHoc] = useState("");
    const [doKho, setDoKho] = useState("");
    const [giaBan, setGiaBan] = useState("");
    const [hinhAnh, setHinhAnh] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [soDu, setSoDu] = useState(0);
    const [firstLecture, setFirstLecture] = useState("https://www.youtube.com/embed/o_VDcEy029M");

    // Lấy bài học đầu tiên
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/lectures/get-first-lecture/${maKhoaHoc}`)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setFirstLecture(data?.video);
          })
          .catch((err) => console.error(err));
    }, [maKhoaHoc])


    // API load thông tin khóa học 
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/courses/${maKhoaHoc}`)
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

    const [listLecture, setListLecture] = useState<string[]>([]);

    // API load chương, bài học
    useEffect(() => {
        const fetchLessons = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lessons/selection-lessons/${maKhoaHoc}`);
            if (!res.ok) throw new Error("Lỗi khi lấy chương học!");

            const lessons: { maChuongHoc: string; tenChuongHoc: string }[] = await res.json();

            
            const lessonInfo = await Promise.all(
                lessons.map(async (lesson) => {
                    const resLecture = await fetch(`${import.meta.env.VITE_API_URL}/api/lectures/by-lesson/${lesson.maChuongHoc}`);
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

            const lectureList = lessonInfo.flatMap((ch) =>
                ch.danhSachBaiHoc.map((bh: any) => bh.maBaiHoc)
            );
            setListLecture(lectureList);

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

    // Lấy số dư của người dùng
    const handleBalanceFromChild = (balance: number) => { setSoDu(balance); };

    // Đăng ký khóa học
    const handleRegisterCourse = async () => {
        const userInfoStr = localStorage.getItem("userInfo");
        if (!userInfoStr) {
            console.log("Không tìm thấy thông tin người dùng trong localStorage.");
            return;
        }
        const userInfo = JSON.parse(userInfoStr);
        const maNguoiDung = userInfo.maNguoiDung;
    
        if (parseFloat(giaBan) === 0) {
            console.log("Đăng ký khóa học thành công (Miễn phí)!");
            await registerCourse(maNguoiDung, parseFloat(giaBan));
            navigate(`/learning/${maKhoaHoc}`);
            return;
        }
    
        // Kiểm tra số dư tài khoản
        try {
            if (soDu < parseFloat(giaBan)) {
                handleClosePay();
                handleOpenNoBalance();
                return;
            }
            
            await registerCourse(maNguoiDung, parseFloat(giaBan));
            // sẽ gọi hàm thêm hóa đơn thanh toán vào đây
            insertBill();
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
            const registerRes = await fetch(`${import.meta.env.VITE_API_URL}/api/register-courses`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
    
            if (registerRes.ok) {
                await insertTienDoHoc(maNguoiDung);
            } else {
                console.error("Lỗi khi đăng ký khóa học:", await registerRes.text());
            }
        } catch (error) {
            console.error("Lỗi khi gọi API đăng ký khóa học:", error);
        }
    };

    // Thêm tiến độ
    const insertTienDoHoc = async (maNguoiDung: string) => {
        try {

            if (!listLecture || listLecture.length === 0) {
                console.log("Khoá học này chưa có bài học nào!");
                return;
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/insert-progress`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    maNguoiDung,
                    baiHocList: listLecture, 
                }),
            });
    
            if (!res.ok) {
                throw new Error("Lỗi khi thêm tiến độ học!");
            }
    
            const result = await res.json();
            console.log("Thêm tiến độ học thành công:", result);

        } catch (error) {
            console.error("Lỗi khi gọi insertTienDo:", error);
        }
    };

    const [createBill] = useCreateBillsMutation();

    // Thêm hóa đơn thanh toán sau khi thanh toán
    const insertBill = async () => { 
        const userInfoStr = localStorage.getItem("userInfo");
        if (!userInfoStr) {
            console.log("Không tìm thấy thông tin người dùng trong localStorage.");
            return;
        }
        const userInfo = JSON.parse(userInfoStr);
        const maNguoiDung = userInfo.maNguoiDung;

        const newBill: bills = {
            maNguoiDung: maNguoiDung,
            loaiThanhToan: "Thanh toán khóa học",
            soTien: Number(giaBan),
            trangThai: "Thành công"
        }

        try {
            await createBill(newBill);
        } catch (err) {
            console.error("Lỗi khi tạo hóa đơn thanh toán.", err);
        }
    };

    // Ẩn hiện popup
    const [isClosedPay, setIsClosedPay] = useState(true);
    const handleOpenPay = () => { 
        const userInfoStr = localStorage.getItem("userInfo");
        if (!userInfoStr) {
            navigate("/login");
            return;
        }
        setIsClosedPay(false)
    };
    const handleClosePay = () => { setIsClosedPay(true)};
    
    const [isClosedNoBalance, setIsClosedNoBalance] = useState(true);
    const handleOpenNoBalance = () => { setIsClosedNoBalance(false)};
    const handleCloseNoBalance = () => { setIsClosedNoBalance(true)};

    return (
        <div className="course-details__wrapper">
            <Navbar></Navbar>
            <Header
                sendBalanceToParent={handleBalanceFromChild}
                title="Thông tin khóa học"></Header>
        
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
                            src={firstLecture}
                            title="YouTube Video"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        >
                        </iframe>

                        <h3 className="course-details__cost">
                            {Number(giaBan) === 0 ? "Miễn phí" : `${Number(giaBan).toLocaleString("vi-VN")} VNĐ`}
                        </h3>

                        <Button
                            className="thumb-btn"
                            children="Đăng ký ngay"
                            type="button"
                            onClick={() => {
                                if (parseFloat(giaBan) <= 0) {
                                    console.log("Khoá học free");
                                    handleRegisterCourse();
                                } else {
                                    console.log("Khoá học mất tiền");
                                    handleOpenPay();
                                }
                            }}
                            />

                        <ul className="thumb-list">
                            <li className="thumb-item">
                                <img src="/icons/Code.svg" alt="" className="thumb-icon" />
                                <span>Độ khó: {doKho}</span>
                            </li>

                            <li className="thumb-item">
                                <img src="/icons/Article.svg" alt="" className="thumb-icon" />
                                <span>Tổng số 100 bài học</span>
                            </li>

                            <li className="thumb-item">
                                <img src="/icons/Clock.svg" alt="" className="thumb-icon" />
                                <span>Học mọi lúc mọi nơi</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <PopUp 
                icon={"Question.svg"} 
                secondOption={"Hủy bỏ"} 
                title={"Thanh toán"} 
                desc={"Xác nhận thanh toán ?"} 
                onOpen={handleClosePay}
                isClosed={isClosedPay}
                className="popup-update"
                // timeCount={3}
            >
                <Button type="button" onClick={handleRegisterCourse}>Thanh toán</Button>
            </PopUp>

            <PopUp 
                icon={"Question.svg"} 
                secondOption={"Hủy bỏ"} 
                title={"Thanh toán"} 
                desc={"Số dư không đủ, nạp tiền ?"} 
                onOpen={handleCloseNoBalance}
                isClosed={isClosedNoBalance}
                className="popup-update"
                // timeCount={3}
            >
                <Button type="button" to="/payment">Nạp tiền</Button>
            </PopUp>
            <Footer></Footer>
        </div>
    );
}
