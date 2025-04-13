import { Link, useParams } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import LearningHeader from "~/components/Learning-header";
import Button from "~/components/Button";
import ChatBot from "~/components/ChatBot";


import "../styles/learning.css";
import "../styles/Responsive/learning.css";

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



export default function Learning() {
    const { maKhoaHoc } = useParams();
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


    // lấy luôn bài học đầu tiên
    const [baiHoc, setBaiHoc] = useState<any>(null);
    useEffect(() => {
        if (chuongHocList.length > 0 && chuongHocList[0].danhSachBaiHoc.length > 0) {
            setBaiHoc(chuongHocList[0].danhSachBaiHoc[0]);
        }
    }, [chuongHocList]); // Chỉ chạy khi chuongHocList thay đổi


    // Lấy dữ liệu bài học khi click
    const handleClickBaiHoc = async (maBaiHoc: string) => {
        try {
            const res = await fetch(`http://localhost:1000/search-bai-hoc/${maBaiHoc}`);
            if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu bài học!");
    
            const baiHoc = await res.json();
            setBaiHoc(baiHoc);
    
            // Lưu vào localStorage
            localStorage.setItem("lastSelectedLecture", maBaiHoc);
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    // Lấy dữ liệu từ local khi load trang
    useEffect(() => {
        const loadLastLecture = async () => {
            const lastLectureID = localStorage.getItem("lastSelectedLecture");

            if (lastLectureID) {
                const res = await fetch(`http://localhost:1000/search-bai-hoc/${lastLectureID}`);

                if (res.ok) {
                    const lecture = await res.json();
                    setBaiHoc(lecture);
                    return;
                } else {
                    console.log("Lỗi khi lấy thông tin bài học được chọn!");
                }
            }

            if (chuongHocList.length > 0 && chuongHocList[0].danhSachBaiHoc.length > 0) {
                setBaiHoc(chuongHocList[0].danhSachBaiHoc[0]);
            }
        }

        loadLastLecture();
    }, [chuongHocList])
    
    type AnswerMap = {
        [maCauHoi: string]: string;
    };
      
    const [selectedAnswers, setSelectedAnswers] = useState<AnswerMap>({});

    const [listCauHoi, setListCauHoi] = useState<
        { maCauHoi: string; noiDung: string; danhSachDapAn: any[]} []
    >([]);
    
    useEffect(() => {
        const fetchQuestion = async () => {
            const maBaiHoc  = localStorage.getItem("lastSelectedLecture");
            try {
                const res = await fetch(`http://localhost:1000/get-cau-hoi/${maBaiHoc}`);

                if (!res.ok) {console.log("Lỗi khi lấy câu hỏi!");}

                const questions: { maCauHoi: string; noiDung: string; }[] = await res.json(); 

                const questionsInfo = await Promise.all(
                    questions.map(async (question) => {
                        const resAnswer = await fetch(`http://localhost:1000/get-dap-an/${question.maCauHoi}`);
                        let listAnswer = [];
                        
                        if (resAnswer.ok) {
                            listAnswer = await resAnswer.json();
                        }

                        return {
                            maCauHoi: question.maCauHoi,
                            noiDung: question.noiDung,
                            danhSachDapAn: listAnswer,
                        };
                    })
                );
                console.log("Danh sách câu hỏi:", questionsInfo); // ✅ log ra đây
                setListCauHoi(questionsInfo);
                
            } catch (error) {
                console.error("Lỗi:", error);
            }
        }
        fetchQuestion(); // ✅ gọi hàm
    }, [])

    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleOpenChat = () => setIsChatOpen(true);
    const handleCloseChat = () => setIsChatOpen(false);


    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleOpenMenu = () => {
        setIsSidebarOpen(true); // Mở sidebar
        console.log("Mở menu");
    };

    const handleCloseMenu = () => {
        setIsSidebarOpen(false); // Đóng sidebar
    };
      
  return (
    <div className="learning-wrapper">
        <LearningHeader title="Học bài" className="learning-header"></LearningHeader>
        
        {/* Nội dung bài học */}
        <div className="learning-inner">
            <div className="learning-container">
                {baiHoc && (
                    <>
                        <iframe
                            className="learning-iframe"
                            src={baiHoc ? baiHoc.video : "Đang tải video bài học ..."}
                            title="YouTube Video"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        >
                        </iframe>

                        <h2 className="learning-name">{baiHoc.tenBaiHoc}</h2>
                        <p className="learning-desc">{baiHoc.moTaBaiHoc}</p>
                    </>
                )}

                <div className="learning-listQuesion">
                    <h2 className="learning-title">Câu hỏi ôn tập</h2>
                    {listCauHoi.map((cauHoi, index) => (
                        <div className="listQuesion-item" key={cauHoi.maCauHoi}>
                            <p className="listQuesion-item__ques">
                            <strong>Câu {index + 1}: {cauHoi.noiDung}</strong>
                            </p>
                            <ul>
                                {cauHoi.danhSachDapAn.map((dapAn) => {
                                    const selected = selectedAnswers[cauHoi.maCauHoi];
                                    const isSelected = selected === dapAn.maDapAn;
                                    const isCorrect =
                                        typeof dapAn.laDapAnDung === 'object' &&
                                        Array.isArray(dapAn.laDapAnDung.data)
                                            ? dapAn.laDapAnDung.data[0] === 1
                                            : dapAn.laDapAnDung === 1;
                                    const isWrongSelected = isSelected && !isCorrect;
                                    const shouldHighlightCorrect = selected && isCorrect;

                                    return (
                                        <li
                                        key={dapAn.maDapAn}
                                        className={`listQuesion-item__result
                                            ${isSelected ? 'selected' : ''}
                                            ${isWrongSelected ? 'uncorrect' : ''}
                                            ${shouldHighlightCorrect ? 'correct' : ''}
                                        `}
                                        >
                                            <input
                                                className={`listQuesion-item__input
                                                    ${isWrongSelected ? 'input-uncorrect' : ''}
                                                    ${shouldHighlightCorrect ? 'input-correct' : ''}
                                                `}
                                                type="radio"
                                                name={`cauHoi-${index}`}
                                                id={dapAn.maDapAn}
                                                disabled={!!selectedAnswers[cauHoi.maCauHoi]} // khóa chọn lại sau khi chọn
                                                onChange={() =>
                                                setSelectedAnswers((prev) => ({
                                                    ...prev,
                                                    [cauHoi.maCauHoi]: dapAn.maDapAn,
                                                }))
                                                }
                                            />
                                            <label className="listQuesion-item__label" htmlFor={dapAn.maDapAn}>
                                                {dapAn.noiDungDapAn}
                                            </label>
                                        </li>
                                    );
                                })}

                            </ul>
                        </div>
                        ))}

                </div>

            </div>


            {/*  */}
            {/* Side bar */}
            <div className="learning-sidebar ">
                <div className="learning-accordion">
                    <div className="learning-accordion__inner">
                        {chuongHocList.map((chuong, index) => (
                        <div className="learning-accordion__item" key={chuong.maChuongHoc}>
                            <div className="learning-accordion__head">
                                <button type="button" className="learning-accordion__lesson" onClick={() => toggleAccordion(index)}>
                                    {index + 1}. {chuong.tenChuongHoc} 
                                </button>
                            </div>

                            <div className={`learning-accordion__content ${openIndexes.includes(index) ? "open" : ""}`}>
                                <ul className="learning-accordion__list">
                                    {chuong.danhSachBaiHoc.map((baiHoc, baiIndex) => (
                                        <li key={baiHoc.maBaiHoc} className="learning-accordion__list--item">
                                            <button
                                                onClick={() => handleClickBaiHoc(baiHoc.maBaiHoc)}
                                                className="learning-accordion__list--btn"
                                            >
                                                {index + 1}.{baiIndex + 1} {baiHoc.tenBaiHoc}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Side bar mobile*/}
            <div className={`learning-sidebar__mobile ${isSidebarOpen ? 'open' : ''}`}>
                <div className="learning-sidebar__act">
                    <button onClick={handleCloseMenu} className="learning-sidebar__btn">
                        <img className="learning-sidebar__icon" src="/icons/Arrow-left.svg" alt="" />
                    </button>
                </div>
                <div className="learning-accordion">
                    <div className="learning-accordion__inner">
                        {chuongHocListFake.map((chuong, index) => (
                        <div className="learning-accordion__item" key={chuong.maChuongHoc}>
                            <div className="learning-accordion__head">
                                <button type="button" className="learning-accordion__lesson" onClick={() => toggleAccordion(index)}>
                                    {index + 1}. {chuong.tenChuongHoc} 
                                </button>
                            </div>

                            <div className={`learning-accordion__content ${openIndexes.includes(index) ? "open" : ""}`}>
                                <ul className="learning-accordion__list">
                                    {chuong.danhSachBaiHoc.map((baiHoc, baiIndex) => (
                                        <li key={baiHoc.maBaiHoc} className="learning-accordion__list--item">
                                            <button
                                                onClick={() => handleClickBaiHoc(baiHoc.maBaiHoc)}
                                                className="learning-accordion__list--btn"
                                            >
                                                {index + 1}.{baiIndex + 1} {baiHoc.tenBaiHoc}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="learning-action">
            <div className="learning-action__discussion">
                <Button onClick={handleOpenChat} className="learning-action__button--AI" type="button">AI</Button>

                <button className="learning-action__button">
                    <img className="learning-action__icon" src="/icons/Question.svg" alt="" />
                </button>

                <button onClick={handleOpenMenu} className="learning-action__button learning-action__menu">
                    <img className="learning-action__icon" src="/icons/menu.svg" alt="" />
                </button>
            </div>

            <div className="learning-action__timeline">
                <Button type="button" className="button-secondary learning-action__btn">BÀI TRƯỚC</Button>
                <Button type="button" className="learning-action__btn">BÀI TIẾP THEO</Button>
            </div>

            <div className="learning-action__lesson">
                <span className="">Giới thiệu về khóa học</span>
            </div>
        </div>

        <ChatBot className="learning-chatbot" isOpen={isChatOpen} onClose={handleCloseChat} ></ChatBot>
    </div>
  );
}
