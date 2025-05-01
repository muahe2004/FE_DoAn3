import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import Button from "~/components/Button";

import "../styles/Admin/question.css";
import "../styles/Admin/add-course.css";




export default function Question() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<{ maKhoaHoc: string; tenKhoaHoc: string } []>([]);
  const [lessons, setLessons] = useState<{maChuongHoc: string; tenChuongHoc: string} []>([]);
  const [lectures, setLectures] = useState<{maBaiHoc: string; tenBaiHoc: string} []> ([]);
  const [selectedCourse, setSelectedCourse] = useState(""); 
  const [selectedLesson, setSelectedLesson] = useState("");
  const [selectedLecture, setSelectedLecture] = useState("");


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

  const handleBlur = () => {

  }

  const handleResetForm = () => {

  }

  const handleAddQuestion = () => {

  }
  

  return (
    <div className="question__wrapper">
      <Header title="Quản lý câu hỏi" />
      <AdminNav />
      
      <div className="question-inner">
      <form onSubmit={handleAddQuestion} className="course__form">
          <div className="form-inner">
            
            <div className="form-info">
              <div className="form-group">
                <label htmlFor="level" className="form-label">Khóa học</label>
                <select 
                  name="course" className="form-input form-select"
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  value={selectedCourse}
                >
                  <option value="">Chọn khóa học</option>
                  {courses.map((course) => (
                    <option key={course.maKhoaHoc} value={course.maKhoaHoc}>
                      {course.tenKhoaHoc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="level" className="form-label">Chương học</label>
                <select
                  name="lesson" className="form-input form-select"
                  onChange={(e) => setSelectedLesson(e.target.value)}
                  value={selectedLesson}
                >
                  <option value="">Chọn chương</option>
                  {lessons.map((lesson) => (
                    <option key={lesson.maChuongHoc} value={lesson.maChuongHoc}>
                      {lesson.tenChuongHoc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="level" className="form-label">Bài học</label>
                <select
                  name="lecture" className="form-input form-select"
                  onChange={(e) => setSelectedLecture(e.target.value)}
                  value={selectedLecture}
                >
                  <option value="">Chọn bài học</option>
                  {lectures.map((lecture) => (
                    <option key={lecture.maBaiHoc} value={lecture.maBaiHoc}>
                      {lecture.tenBaiHoc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="name" className="form-label">Nội dung</label>
                <input name="name" type="text" className="form-input" onBlur={handleBlur}/>
                <span className="form-text">Vui lòng nhập tên khóa học</span>
              </div>

              <div className="form-group">
                <label htmlFor="name" className="form-label">Đáp án 1</label>
                <input name="answer-1" type="text" className="form-input" onBlur={handleBlur}/>
                <span className="form-text">Vui lòng nhập tên khóa học</span>
              </div>

              <div className="form-group">
                <label htmlFor="name" className="form-label">Đáp án 2</label>
                <input name="answer-2" type="text" className="form-input" onBlur={handleBlur}/>
                <span className="form-text">Vui lòng nhập tên khóa học</span>
              </div>

              <div className="form-group">
                <label htmlFor="name" className="form-label">Đáp án 3</label>
                <input name="answer-3" type="text" className="form-input" onBlur={handleBlur}/>
                <span className="form-text">Vui lòng nhập tên khóa học</span>
              </div>

            </div>
            
          </div>

          <div className="question-form__action"> 
            <Button type="submit" className="btn-add">Thêm câu hỏi</Button>
            <Button className="btn-new button-secondary button" onClick={handleResetForm}>Làm mới</Button>
            <Button className="btn-cancle button-third button">Hủy bỏ</Button>
            <Button className="btn-mQuestion">Quản lý câu hỏi</Button>
            
          </div>

        </form>
      </div>
    </div>
  );
}
