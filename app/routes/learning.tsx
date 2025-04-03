import { Link, useParams } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import LearningHeader from "~/components/Learning-header";
import Button from "~/components/Button";

import "../styles/learning.css";

const valueQuestion = [
    {
        maCauHoi: "CH001",
        noiDung: "HTML là viết tắt của cụm từ nào?",
        dapAn: [ 
            {
                maDapAn: "DA001",
                noiDung: "Hyper Text Markup Language",
                laDapAnDung: true 
            },
            {
                maDapAn: "DA002",
                noiDung: "High Technology Modern Language",
                laDapAnDung: false
            },
            {
                maDapAn: "DA003",
                noiDung: "Home Tool Markup Language",
                laDapAnDung: false
            }
        ],
    },
    {
        maCauHoi: "CH002",
        noiDung: "Trong CSS, thuộc tính nào dùng để thay đổi màu chữ?",
        dapAn: [ 
            {
                maDapAn: "DA004",
                noiDung: "font-color",
                laDapAnDung: false 
            },
            {
                maDapAn: "DA005",
                noiDung: "text-color",
                laDapAnDung: false
            },
            {
                maDapAn: "DA006",
                noiDung: "color",
                laDapAnDung: true
            }
        ],
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
    

  return (
    <div className="learning-wrapper">
      <LearningHeader title="Học bài" className="learning-header"></LearningHeader>
      
      {/* Nội dung bài học */}
      <div className="learning-inner">
        <div className="learning-container">
            

            {baiHoc && (
                <>
                    {/* Video */}
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
                {valueQuestion.map((cauHoi, index) => (
                    <div className="listQuesion-item" key={cauHoi.maCauHoi}>
                        <p className="listQuesion-item__ques"><strong>Câu {index + 1}: {cauHoi.noiDung}</strong></p>
                        <ul>
                            {cauHoi.dapAn.map((dapAn) => (
                                <li key={dapAn.maDapAn} className="listQuesion-item__result">
                                    <input className="listQuesion-item__input" type="radio" name={`cauHoi-${index}`} id={dapAn.maDapAn} />
                                    <label htmlFor={dapAn.maDapAn}>{dapAn.noiDung}</label>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

        </div>

        {/* Side bar */}
        <div className="learning-sidebar">
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
      </div>

      <div className="learning-action">
            <div className="learning-action__discussion">
                <button className="learning-action__button">
                    <img className="learning-action__icon" src="./icons/Question.svg" alt="" />
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
    </div>
  );
}
