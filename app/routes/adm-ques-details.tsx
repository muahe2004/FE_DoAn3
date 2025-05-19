import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import Button from "~/components/Button";
import PopUp from "~/components/PopUp";


import "../styles/Admin/question.css";
import "../styles/Admin/add-course.css";

interface Answer {
    maDapAn: string;
    maCauHoi: string;
    noiDungDapAn: string;
    laDapAnDung: any;
}
  
export default function QuestionDetails() {
    const navigate = useNavigate();

    const {maCauHoi} = useParams();
    const [noiDung, setNoiDung] = useState("");

    const [courses, setCourses] = useState<{ maKhoaHoc: string; tenKhoaHoc: string } []>([]);
    const [lessons, setLessons] = useState<{maChuongHoc: string; tenChuongHoc: string} []>([]);
    const [lectures, setLectures] = useState<{maBaiHoc: string; tenBaiHoc: string} []> ([]);

    const [selectedCourse, setSelectedCourse] = useState(""); 
    const [selectedLesson, setSelectedLesson] = useState("");
    const [selectedLecture, setSelectedLecture] = useState("");

    // Lấy dữ liệu của câu hỏi
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/questions/by-id/${maCauHoi}`, {
            method: "GET"
        })
            .then(res => res.json())
            .then(data => {
                console.log("Nội dung câu hỏi: ",data);
                console.log("Nội dung câu hỏi: ",data.noiDung);
                setNoiDung(data.noiDung);
                setSelectedLecture(data.maBaiHoc);
                setSelectedLesson(data.maChuongHoc);
                setSelectedCourse(data.maKhoaHoc);
            })
            .catch(err => console.error(err));
    }, [maCauHoi]);

    const [answers, setAnswers] = useState([
        { maDapAn: "", noiDungDapAn: '', laDapAnDung: 0 }, // answer 1
        { maDapAn: "", noiDungDapAn: '', laDapAnDung: 0 }, // answer 2
        { maDapAn: "", noiDungDapAn: '', laDapAnDung: 0 }, // answer 3
    ]);
    
    const [correctAnswers, setCorrectAnswers] = useState({
        answer1: 0,
        answer2: 0,
        answer3: 0,
    });
    
    const handleCorrectAnswerChange = (selected: string) => {
        setCorrectAnswers({
            answer1: selected === "answer1" ? 1 : 0,
            answer2: selected === "answer2" ? 1 : 0,
            answer3: selected === "answer3" ? 1 : 0,
        });
    };
    
    // Lấy các đáp án
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/answers/${maCauHoi}`)
          .then((res) => res.json())
          .then((data) => {

            setAnswers(data);
      
            // Kiểm tra đáp án đúng dựa trên trường `data` trong `laDapAnDung`
            const indexCorrect = data.findIndex((a: Answer) => a.laDapAnDung.data[0] === 1);
      
            if (indexCorrect !== -1) {
              setCorrectAnswers({
                answer1: indexCorrect === 0 ? 1 : 0,
                answer2: indexCorrect === 1 ? 1 : 0,
                answer3: indexCorrect === 2 ? 1 : 0,
              });
            }
          })
          .catch((err) => console.error(err));
    }, [maCauHoi]);

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

    // Blur
    const handleBlur = (
        event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const input = event.target;
        const formText = input.parentElement?.querySelector(".question-form__text") as HTMLElement | null;
    
        if (input.value.trim()) {
        if (formText) {
            formText.style.display = "none";
        }
        input.style.borderColor = "#ccc"; 
        } else {
        if (formText) {
            formText.style.display = "block";
        }
        input.style.borderColor = "red";
        }
    };

    // Reset form
    const handleResetForm = () => {};

    // Xóa validator
    const clearError = (target: EventTarget & HTMLSelectElement) => {
        const formText = target.parentElement?.querySelector<HTMLElement>(".question-form__text");
        if (formText) {
            formText.innerText = "";
            formText.style.display = "none";
        }
        target.style.borderColor = "#ccc";
    };
  
    // Hàm sửa câu hỏi
    const handleUpdateQuestion = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;

        const course = form.querySelector<HTMLSelectElement>('select[name="course"]');
        const lesson = form.querySelector<HTMLSelectElement>('select[name="lesson"]');
        const lecture = form.querySelector<HTMLSelectElement>('select[name="lecture"]');

        const question = form.querySelector<HTMLInputElement>('input[name="question"]');

        const answer_first = form.querySelector<HTMLInputElement>('input[name="answer-1"]');
        const answer_second = form.querySelector<HTMLInputElement>('input[name="answer-2"]');
        const answer_third = form.querySelector<HTMLInputElement>('input[name="answer-3"]');

        const showError = (input: HTMLInputElement | HTMLSelectElement | null, message: string) => {
            if (input) {
                const formText = input.parentElement?.querySelector<HTMLElement>(".question-form__text");
                if (formText) {
                    formText.innerText = message;
                    formText.style.display = "block";
                }
                input.style.borderColor = "red";
                input.focus();
            }
        };

        if (!course?.value.trim()) {
            showError(course, "Vui lòng chọn khóa học!");
            return;
        }

        if (!lesson?.value.trim()) {
            showError(lesson, "Vui lòng chọn chương học!");
            return;
        }

        if (!lecture?.value.trim()) {
            showError(lecture, "Vui lòng chọn bài học!");
            return;
        }

        if (!question?.value.trim()) {
            showError(question, "Vui lòng nhập nội dung câu hỏi!");
            return;
        }

        if (!answer_first?.value.trim()) {
            showError(answer_first, "Vui lòng nhập đáp án!");
            return;
        }

        if (!answer_second?.value.trim()) {
            showError(answer_second, "Vui lòng nhập đáp án!");
            return;
        }

        if (!answer_third?.value.trim()) {
            showError(answer_third, "Vui lòng nhập đáp án!");
            return;
        }

        const bodyQues = {
            maBaiHoc: lecture?.value,
            noiDung: question?.value
        }

        try {
            console.log(bodyQues);
            // Sửa câu hỏi
            await fetch(`${import.meta.env.VITE_API_URL}/api/questions/${maCauHoi}`, {
                method: "PUT",
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyQues)
            });
        
            // Sửa các đáp án
            const listAnswers = [
                { maDapAn: answer_first.dataset.madapan, noiDungDapAn: answer_first?.value.trim(), laDapAnDung: correctAnswers.answer1, maCauHoi: maCauHoi },
                { maDapAn: answer_second.dataset.madapan, noiDungDapAn: answer_second?.value.trim(), laDapAnDung: correctAnswers.answer2, maCauHoi: maCauHoi },
                { maDapAn: answer_third.dataset.madapan, noiDungDapAn: answer_third?.value.trim(), laDapAnDung: correctAnswers.answer3, maCauHoi: maCauHoi },
            ];
            
            for (let i=0; i<listAnswers.length; i++) {
                const currentAnswer = listAnswers[i];

                const bodyAnswer = {
                    noiDungDapAn: currentAnswer.noiDungDapAn,
                    laDapAnDung: currentAnswer.laDapAnDung,
                    maCauHoi: currentAnswer.maCauHoi,
                };

                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/answers/${currentAnswer.maDapAn}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bodyAnswer),
                    });

                    const result = await res.json();
                    console.log(`Dữ liệu phản hồi từ API cho đáp án ${i + 1}:`, result);
                } catch (error) {
                    console.error(`Có lỗi khi gửi dữ liệu cho đáp án ${i + 1}:`, error);
                }
            }

            // Mở popup sửa thành công
            handleOpenUpdateDone();
            setTimeout(handleCloseUpdateDone, 5000);
    
        } catch (error) {
            console.error('Có lỗi khi gửi dữ liệu:', error);
        }
    }

    // Hàm xóa câu hỏi
    const deleteQues = async () => {
        try {
            // Xoá đáp án trước
            for (let i = 0; i < answers.length; i++) {
                const responseAnswer = await fetch(`${import.meta.env.VITE_API_URL}/api/answers/${answers[i].maDapAn}`, {
                    method: "DELETE",
                });
    
                if (responseAnswer.ok) {
                    console.log("Đã xoá đáp án:", answers[i].maDapAn);
                } else {
                    console.warn("Xoá đáp án thất bại:", answers[i].maDapAn);
                }
            }
    
            // Xóa câu hỏi 
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/questions/${maCauHoi}`, {
                method: "DELETE",
            });
    
            if (response.ok) {
                console.log("Xoá câu hỏi thành công:", maCauHoi);
                handleCloseDelete();
                handleOpenDeletedone();
                setTimeout(() => navigate(`/admin-lecture-details/${selectedLecture}`), 2300);
            } else {
                console.error("Xoá câu hỏi thất bại:", maCauHoi);
            }
    
        } catch (error) {
            console.log("Lỗi khi xoá câu hỏi hoặc đáp án:", error);
        }
    };
    
    // Ẩn hiện PopUp
    const [isClosedUpdateDone, setIsClosedUpdateDone] = useState(true);
    const handleOpenUpdateDone = () => { setIsClosedUpdateDone(false)};
    const handleCloseUpdateDone = () => { setIsClosedUpdateDone(true)};

    const [isClosedDeletedone, setIsClosedDeletedone] = useState(true);
    const handleOpenDeletedone = () => { setIsClosedDeletedone(false)};
    const handleCloseDeletedone = () => { setIsClosedDeletedone(true)};

    const [isClosedUpdate, setIsClosedUpdate] = useState(true);
    const handleOpenUpdate = () => { setIsClosedUpdate(false)};
    const handleCloseUpdate = () => { setIsClosedUpdate(true)};

    const [isClosedDelete, setIsClosedDelete] = useState(true);
    const handleOpenDelete = () => { setIsClosedDelete(false)};
    const handleCloseDelete = () => { setIsClosedDelete(true)};

    return (
        <div className="question__wrapper">
        <Header className="header-admin" title="Quản lý câu hỏi" />
        <AdminNav />
        
        <div className="question-inner">
        <form onSubmit={handleUpdateQuestion} className="course__form">
            <div className="form-inner">
                
                <div className="form-info">
                    <div className="form-group">
                        <label htmlFor="level" className="form-label">Khóa học</label>
                        <select 
                        name="course" className="form-input form-select"
                        onChange={(e) => {
                            setSelectedCourse(e.target.value)
                            clearError(e.target);}}
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

                    <div className="form-group">
                        <label htmlFor="level" className="form-label">Chương học</label>
                        <select
                        name="lesson" className="form-input form-select"
                        onChange={(e) => {
                            setSelectedLesson(e.target.value)
                            clearError(e.target);}}
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

                    <div className="form-group">
                        <label htmlFor="level" className="form-label">Bài học</label>
                        <select
                        name="lecture" className="form-input form-select"
                        onChange={(e) => {
                            setSelectedLecture(e.target.value)
                            clearError(e.target);}}
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

                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Nội dung</label>
                        <input 
                            name="question" type="text" className="form-input" 
                            onBlur={handleBlur} placeholder="Nội dung câu hỏi..."
                            value={noiDung} onChange={(e) => setNoiDung(e.target.value)}/>
                        <span className="question-form__text">Vui lòng nhập nội dung câu hỏi</span>
                        
                    </div>

                    {/* Đáp án 1 */}
                    <div className="form-group question-form__group">
                    <div className="answer-group">
                        <label className="form-label">Đáp án 1</label>
                        <input
                        data-madapan={answers[0]?.maDapAn || ''}
                        name="answer-1"
                        type="text"
                        className="form-input answer-input"
                        onBlur={handleBlur}
                        value={answers[0]?.noiDungDapAn || ''}
                        onChange={(e) => {
                            const newAnswers = [...answers];
                            newAnswers[0].noiDungDapAn = e.target.value;
                            setAnswers(newAnswers);
                        }}
                        />
                        <span className="question-form__text">Vui lòng nhập đáp án</span>
                    </div>
                    <label className="correct-answer-label">
                        <input
                        type="radio"
                        name="correctAnswer"
                        className="form-radio"
                        checked={correctAnswers.answer1 === 1}
                        onChange={() => handleCorrectAnswerChange('answer1')}
                        />
                        Đáp án đúng
                    </label>
                    </div>

                    {/* Đáp án 2 */}
                    <div className="form-group question-form__group">
                    <div className="answer-group">
                        <label className="form-label">Đáp án 2</label>
                        <input
                        data-madapan={answers[1]?.maDapAn || ''}
                        name="answer-2"
                        type="text"
                        className="form-input answer-input"
                        onBlur={handleBlur}
                        value={answers[1]?.noiDungDapAn || ''}
                        onChange={(e) => {
                            const newAnswers = [...answers];
                            newAnswers[1].noiDungDapAn = e.target.value;
                            setAnswers(newAnswers);
                        }}
                        />
                        <span className="question-form__text">Vui lòng nhập đáp án</span>
                    </div>
                    <label className="correct-answer-label">
                        <input
                        type="radio"
                        name="correctAnswer"
                        className="form-radio"
                        checked={correctAnswers.answer2 === 1}
                        onChange={() => handleCorrectAnswerChange('answer2')}
                        />
                        Đáp án đúng
                    </label>
                    </div>

                    {/* Đáp án 3 */}
                    <div className="form-group question-form__group">
                        <div className="answer-group">
                            <label className="form-label">Đáp án 3</label>
                            <input
                            data-madapan={answers[2]?.maDapAn || ''}
                            name="answer-3"
                            type="text"
                            className="form-input answer-input"
                            onBlur={handleBlur}
                            value={answers[2]?.noiDungDapAn || ''}
                            onChange={(e) => {
                                const newAnswers = [...answers];
                                newAnswers[2].noiDungDapAn = e.target.value;
                                setAnswers(newAnswers);
                            }}
                            />
                            <span className="question-form__text">Vui lòng nhập đáp án</span>
                        </div>
                        <label className="correct-answer-label">
                            <input
                            type="radio"
                            name="correctAnswer"
                            className="form-radio"
                            checked={correctAnswers.answer3 === 1}
                            onChange={() => handleCorrectAnswerChange('answer3')}
                            />
                            Đáp án đúng
                        </label>
                    </div>

                </div>
                
            </div>

            <PopUp 
                icon={"Question.svg"} 
                secondOption={"Hủy bỏ"} 
                title={"Sửa câu hỏi"} 
                desc={"Bạn có chắc chắn muốn sửa câu hỏi không?"} 
                onOpen={handleCloseUpdate}
                isClosed={isClosedUpdate}
                className="popup-update"
                timeCount={3}
            >
                <Button type="submit" onClick={handleCloseUpdate}>Sửa</Button>
            </PopUp>

            <div className="question-form__action"> 
                <Button type="button" onClick={handleOpenUpdate} className="btn-add">Lưu lại</Button>
                {/* <Button className="btn-new button-secondary button" onClick={handleResetForm}>Làm mới</Button> */}
                <Button onClick={handleOpenDelete} className="btn-cancle button-third button">Xóa câu hỏi</Button>
            </div>

            </form>
        </div>

        {/* sửa thành công */}
        <PopUp 
            icon={"Successful.svg"} 
            // secondOption={"Hủy bỏ"} 
            title={"Sửa câu hỏi"} 
            desc={"Sửa câu hỏi thành công!"} 
            onOpen={handleCloseUpdateDone}
            isClosed={isClosedUpdateDone}
            className="popup-done"
            // timeCount={5}
        >
            {/* <Button type="button" onClick={handleCloseUpdateDone}>OK</Button> */}
        </PopUp>

        <PopUp 
            icon={"Question.svg"} 
            secondOption={"Hủy bỏ"} 
            title={"Xóa câu hỏi"} 
            desc={"Bạn có chắc chắn muốn xóa câu hỏi không?"} 
            onOpen={handleCloseDelete}
            isClosed={isClosedDelete}
            className="popup-delete"
            timeCount={3}
        >
            {/* // thêm onClick  để thực hiện xóa*/}
            <Button onClick={deleteQues} type="button" className="popup-delete_btn" >Xóa</Button>  
        </PopUp>

        {/* xóa thành công */}
        <PopUp 
            icon={"Successful.svg"} 
            // secondOption={"Hủy bỏ"} 
            title={"Xóa câu hỏi"} 
            desc={"Xóa câu hỏi thành công!"} 
            onOpen={handleCloseDeletedone}
            isClosed={isClosedDeletedone}
            className="popup-done"
            // timeCount={5}
        >
            {/* <Button type="button" onClick={handleCloseUpdateDone}>OK</Button> */}
        </PopUp>
        </div>
    );
}
