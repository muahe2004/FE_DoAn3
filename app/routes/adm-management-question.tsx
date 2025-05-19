import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import Button from "~/components/Button";


import "../styles/Admin/question.css";
import "../styles/Admin/add-course.css";
import "../styles/Admin/adm-m-ques.css";


export default function QuestionDetails() {
    const navigate = useNavigate();

    const [courses, setCourses] = useState<{ maKhoaHoc: string; tenKhoaHoc: string } []>([]);
    const [lessons, setLessons] = useState<{maChuongHoc: string; tenChuongHoc: string} []>([]);
    const [lectures, setLectures] = useState<{maBaiHoc: string; tenBaiHoc: string} []> ([]);

    const [selectedCourse, setSelectedCourse] = useState(""); 
    const [selectedLesson, setSelectedLesson] = useState("");
    const [selectedLecture, setSelectedLecture] = useState("");

    const [questions, setQuestions] = useState<{maCauHoi: string; noiDung: string} []> ([]);

    // Lấy các khóa học
    useEffect(() => {
        const fetchCourses = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/selection-courses`); 
            if (response.ok) {
            const data = await response.json();
            setCourses(data); 
            } else {
            console.error("Lỗi khi lấy danh sách khóa học");
            }
        } catch (error) {
            console.error("Lỗi: ", error);
        }
        };
        fetchCourses();
    }, []);

    // Lấy các chương
    useEffect(() => {
        const fetchLessons = async () => {
        if (!selectedCourse) return; 

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lessons/selection-lessons/${selectedCourse}`);
            if (res.ok) {
            const data = await res.json();
            setLessons(data);
            } else {
            console.error("Lỗi khi lấy các chương của khóa học!");
            }
        } catch (error) {
            console.error("Lỗi: ", error);
        }
        };
        fetchLessons();
    }, [selectedCourse]); 

    // Lấy các bài
    useEffect(() => {
        const fetchLectures = async () => {
        if (!selectedLesson) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lectures/by-lesson/${selectedLesson}`);
            if (res.ok) {
            const data = await res.json();
            setLectures(data);
            } else {
            console.error("Lỗi khi lấy các chương của khóa học!");
            }
        } catch (error) {
            console.error("Lỗi: ", error);
        }
        };
        fetchLectures();
    }, [selectedLesson])

    // Lấy các câu hỏi
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/questions/${selectedLecture}`)
            .then(res => res.json())
            .then(data => {
                setQuestions(data);
            })
            .catch(err => console.error(err));
    }, [selectedLecture]) 

    return (
        <div className="question__wrapper">
            <Header className="header-admin" title="Quản lý câu hỏi" />
            <AdminNav />
            
            <div className="management-question__inner">
                <form className="management-ques__form">
                    <div className="form-inner m-ques_inner">
                        <div className="form-info">
                            {/* Chọn khóa học */}
                            <div className="form-group">
                                <label htmlFor="level" className="form-label">Khóa học</label>
                                <select 
                                name="course" className="form-input form-select"
                                onChange={(e) => {
                                    setSelectedCourse(e.target.value)
                                }}
                                value={selectedCourse}
                                >
                                <option value="">Chọn khóa học</option>
                                {courses.map((course) => (
                                    <option key={course.maKhoaHoc} value={course.maKhoaHoc}>
                                    {course.tenKhoaHoc}
                                    </option>
                                ))}
                                </select>
                                <span className="question-form__text">Vui lòng chọn khóa học</span>
                            </div>
                            
                            {/* Chọn chương */}
                            <div className="form-group">
                                <label htmlFor="level" className="form-label">Chương học</label>
                                <select
                                name="lesson" className="form-input form-select"
                                onChange={(e) => {
                                    setSelectedLesson(e.target.value)
                                    }}
                                value={selectedLesson}
                                >
                                <option value="">Chọn chương</option>
                                {lessons.map((lesson) => (
                                    <option key={lesson.maChuongHoc} value={lesson.maChuongHoc}>
                                    {lesson.tenChuongHoc}
                                    </option>
                                ))}
                                </select>
                                <span className="question-form__text">Vui lòng chọn chương học</span>
                            </div>
                            
                            {/* Chọn bài */}
                            <div className="form-group">
                                <label htmlFor="level" className="form-label">Bài học</label>
                                <select
                                name="lecture" className="form-input form-select"
                                onChange={(e) => {
                                    setSelectedLecture(e.target.value)
                                    }}
                                value={selectedLecture}
                                >
                                <option value="">Chọn bài học</option>
                                {lectures.map((lecture) => (
                                    <option key={lecture.maBaiHoc} value={lecture.maBaiHoc}>
                                    {lecture.tenBaiHoc}
                                    </option>
                                ))}
                                </select>
                                <span className="question-form__text">Vui lòng chọn bài học</span>
                            </div>
                        </div>
                    </div>
                </form>

                
            </div>

            <div className="list-question">
                <h2 className="list-question__title">Danh sách câu hỏi</h2>

                {
                    questions.map((ques, index) => (
                        <div className="list-question__item" key={ques.maCauHoi}>
                            <Link to={`/admin-question-details/${ques.maCauHoi}`} className="list-question__link">
                                Câu {index + 1}: {ques.noiDung}
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
