import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import Button from "~/components/Button";

import "../styles/Admin/question.css";
import "../styles/Admin/add-course.css";
import PopUp from "~/components/PopUp";

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
    // const [maBaiHoc, setMaBaiHoc] = useState("");
    // const [maChuongHoc, setMaChuongHoc] = useState("");
    // const [maKhoaHoc, setMaKhoaHoc] = useState("");

    const [courses, setCourses] = useState<{ maKhoaHoc: string; tenKhoaHoc: string } []>([]);
    const [lessons, setLessons] = useState<{maChuongHoc: string; tenChuongHoc: string} []>([]);
    const [lectures, setLectures] = useState<{maBaiHoc: string; tenBaiHoc: string} []> ([]);

    const [selectedCourse, setSelectedCourse] = useState(""); 
    const [selectedLesson, setSelectedLesson] = useState("");
    const [selectedLecture, setSelectedLecture] = useState("");

    // Lấy dữ liệu của câu hỏi
    useEffect(() => {
        fetch(`http://localhost:1000/api/questions/by-id/${maCauHoi}`)
            .then(res => res.json())
            .then(data => {
                setNoiDung(data.noiDung);
                setSelectedLecture(data.maBaiHoc);
                setSelectedLesson(data.maChuongHoc);
                setSelectedCourse(data.maKhoaHoc);
            })
            .catch(err => console.error(err));
    }, [maCauHoi]);
    
    useEffect(() => {
        fetch(`http://localhost:1000/api/answers/${maCauHoi}`)
          .then((res) => res.json())
          .then((data) => {
            // Giả sử API trả về dữ liệu có trường `laDapAnDung` là kiểu Buffer
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
            const response = await fetch("http://localhost:1000/selection-khoahoc"); 
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
            const res = await fetch(`http://localhost:1000/selection-chuong-hoc/${selectedCourse}`);
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
            const res = await fetch(`http://localhost:1000/api/lectures/${selectedLesson}`);
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

    const handleResetForm = () => {

    }

    // Xóa validator
    const clearError = (target: EventTarget & HTMLSelectElement) => {
        const formText = target.parentElement?.querySelector<HTMLElement>(".question-form__text");
        if (formText) {
        formText.innerText = "";
        formText.style.display = "none";
        }
        target.style.borderColor = "#ccc";
    };
  

    // Hàm thêm câu hỏi
    const handleAddQuestion = async (event: React.FormEvent<HTMLFormElement>) => {
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

        // Xem đã chọn đáp án đúng chưa
        if (!validateCorrectAnswer()) {
        return;
        }

        const bodyQues = {
        maBaiHoc: lecture?.value,
        noiDung: question?.value
        }

        try {
        // Thêm câu hỏi
        const resQues = await fetch(``, {
            method: "POST",
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyQues)
        });
    
        const data = await resQues.json();

        // Thêm các đáp án
        if (data.maCauHoi && data.noiDung && data.maBaiHoc) { 
            const listAnswers = [
            { noiDungDapAn: answer_first?.value.trim(), laDapAnDung: correctAnswers.answer1, maCauHoi: data.maCauHoi },
            { noiDungDapAn: answer_second?.value.trim(), laDapAnDung: correctAnswers.answer2, maCauHoi: data.maCauHoi },
            { noiDungDapAn: answer_third?.value.trim(), laDapAnDung: correctAnswers.answer3, maCauHoi: data.maCauHoi },
            ];
        
            for (let i=0; i<listAnswers.length; i++) {
            const currentAnswer = listAnswers[i];

            const bodyAnswer = {
                noiDungDapAn: currentAnswer.noiDungDapAn,
                laDapAnDung: currentAnswer.laDapAnDung,
                maCauHoi: currentAnswer.maCauHoi,
            };

            try {
                const res = await fetch(``, {
                method: "POST",
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
            // Mở popup thêm thành công
            handleOpenAddDone();
            setTimeout(handleCloseAddDone, 5000);
        } else {
            console.error('Dữ liệu không đầy đủ trong phản hồi API:', data);
        }
    
        } catch (error) {
        console.error('Có lỗi khi gửi dữ liệu:', error);
        }
    }

    const validateCorrectAnswer = () => {
        const values = Object.values(correctAnswers); 
        const hasCorrect = values.includes(1); 
    
        if (!hasCorrect) {
        console.error("Phải chọn ít nhất một đáp án đúng!");
        // handleOpenCorrect();
        return false;
        } else {
        return true;
        }
    };
    
    const [answers, setAnswers] = useState([
        { noiDungDapAn: '', laDapAnDung: 0 }, // answer 1
        { noiDungDapAn: '', laDapAnDung: 0 }, // answer 2
        { noiDungDapAn: '', laDapAnDung: 0 }, // answer 3
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
    
    // Ẩn hiện PopUp
    const [isClosedAddDone, setIsClosedAddDone] = useState(true);
    const handleOpenAddDone = () => { setIsClosedAddDone(false)};
    const handleCloseAddDone = () => { setIsClosedAddDone(true)};

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
        <form onSubmit={handleAddQuestion} className="course__form">
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
                <Button type="submit">Sửa</Button>
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
            onOpen={handleCloseAddDone}
            isClosed={isClosedAddDone}
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
            <Button type="submit" className="popup-delete_btn" >Xóa</Button>  
        </PopUp>

        {/* xóa thành công */}
        <PopUp 
            icon={"Successful.svg"} 
            // secondOption={"Hủy bỏ"} 
            title={"Xóa câu hỏi"} 
            desc={"Xóa câu hỏi thành công!"} 
            onOpen={handleCloseAddDone}
            isClosed={isClosedAddDone}
            className="popup-done"
            // timeCount={5}
        >
            {/* <Button type="button" onClick={handleCloseUpdateDone}>OK</Button> */}
        </PopUp>
        
        </div>
    );
}
