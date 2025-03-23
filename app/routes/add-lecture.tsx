import { useEffect, useState } from "react";

import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import ModelOverlay from "~/components/OverlayModel";
import Button from "~/components/Button";


import "../styles/Admin/add-lecture.css";



export default function AddLecture() {
  const [videoSrc, setVideoSrc] = useState("");
  const [courses, setCourses] = useState<{ maKhoaHoc: string; tenKhoaHoc: string } []>([]);
  const [lessons, setLessons] = useState<{maChuongHoc: string; tenChuongHoc: string} []>([]);
  const [selectedCourse, setSelectedCourse] = useState(""); 

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
  

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const input = event.target;
    const formErr = input.parentElement?.querySelector(".lecture-form__text") as HTMLElement | null;

    if (formErr) {
      formErr.style.display = input.value.trim() ?  "none" : "block";
    }
  }

  const handleResetForm= () => {
    const form = document.querySelector<HTMLFormElement>(".add-lecture__form")
    const formError = document.querySelectorAll<HTMLElement>(".lecture-form__text");

    if (form) {
      form.reset();
    }

    if (formError) {
      formError.forEach((mess)  => {
        mess.style.display = "none";
      })
    }
    setVideoSrc("");
  }

  const handleVideoSrc = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0]; 
      setVideoSrc(`https://www.youtube.com/embed/${videoId}`);
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      setVideoSrc(`https://www.youtube.com/embed/${videoId}`);
    } else if (!url) {
      setVideoSrc("");
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    const course = form.querySelector<HTMLSelectElement>('select[name="course"]');
    const lesson = form.querySelector<HTMLSelectElement>('select[name="lesson"]');
    const nameInput = form.querySelector<HTMLInputElement>('input[name="name"]');
    const descriptionInput = form.querySelector<HTMLTextAreaElement>('textarea[name="description"]');
    const videoInput = form.querySelector<HTMLInputElement>('input[name="clip"]');

    const showError = (input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null, message: string) => {
      if (input) {
        const formText = input.parentElement?.querySelector<HTMLElement>(".lecture-form__text");
        if (formText) {
          formText.innerText = message;
          formText.style.display = "block";
        }
        input.focus();
      }
    };

    if (!course?.value.trim()) {
      showError(course, "Vui lòng chọn khóa học!");
      return;
    }

    if (!lesson?.value.trim()) {
      showError(lesson, "Vui lòng chọn chương!");
      return;
    }

    if (!nameInput?.value.trim()) {
      showError(nameInput, "Vui lòng nhập tên bài học!");
      return;
    }
    
    if (descriptionInput?.value.trim() === "" && !descriptionInput.value.trim()) {
      showError(descriptionInput, "Vui lòng nhập mô tả cho bài học!");
      return;
    }
    
    if (!videoInput?.value.trim() || videoInput?.value.trim() === "") {
      showError(videoInput, "Vui lòng nhập đường dẫn video cho bài học!");
      return;
    }
    
    const body = {
      maChuongHoc: lesson?.value,
      tenBaiHoc: nameInput?.value.trim(),
      moTaBaiHoc: descriptionInput?.value.trim(),
      video: videoSrc.trim(),
    }

    try {
      const res = await fetch("http://localhost:1000/create-bai-hoc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        handleResetForm();
        handleOpenModel();
        setTimeout(() => handleCloseDelSuccessModel(), 2300);
      } else {
        console.error("Lỗi tạo khóa học:", await res.text());
      }
    } catch (error) {
      console.error("Lỗi: ", error);
    }
  }

  const [isModelOpen, setIsModelOpen] = useState(false);
  const handleOpenModel = () => {
    setIsModelOpen(true);
  }

  const handleCloseDelSuccessModel = () => {
    setIsModelOpen(false);
  }

  return (
    <div className="add-lecture__wrapper">
        <Header title="Thêm bài học"></Header>
        <AdminNav></AdminNav>
      
        <div className="add-lecture__inner">
          <form onSubmit={handleSubmit} action="" className="add-lecture__form">
            <div className="lecture-form__inner">
              {/* Chọn khóa học */}
              <div className="lecture-form__group">
                <label htmlFor="course" className="lecture-form__label">
                  Khóa học
                </label>
                <select
                  name="course"
                  className="lecture-form__input lecture-form__select"
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
                <span className="lecture-form__text">Vui lòng chọn khóa học</span>
              </div>

              {/* Chọn chương */}
              <div className="lecture-form__group">
                <label htmlFor="lesson" className="lecture-form__label">Chương</label>
                <select name="lesson" className="lecture-form__input lecture-form__select">
                  <option value="">Chọn chương</option>
                  {lessons.map((lesson) => (
                    <option key={lesson.maChuongHoc} value={lesson.maChuongHoc}>
                      {lesson.tenChuongHoc}
                    </option>
                  ))}
                </select>
                <span className="lecture-form__text">Vui lòng chọn chương</span>
              </div>

              {/* Tên bài học */}
              <div className="lecture-form__group">
                <label htmlFor="name" className="lecture-form__label">Tên bài học</label>
                <input name="name" type="text" className="lecture-form__input" onBlur={handleBlur}/>
                <span className="lecture-form__text">Tên bài học không được để trống</span>
              </div>

              {/* Mô tả bài học */}
              <div className="lecture-form__group group-area">
                <label htmlFor="description" className="lecture-form__label label-area">Mô tả</label>
                <textarea name="description" className="lecture-form__input form-area" onBlur={handleBlur}></textarea>
                <span className="lecture-form__text form-text_desc">Vui lòng nhập mô tả cho khóa học</span>
              </div>

              {/* Video bài học */}
              <div className="lecture-form__group">
                <label htmlFor="clip" className="lecture-form__label">Video bài học</label>
                <input name="clip" type="text" className="lecture-form__input input-video" onBlur={handleBlur} onChange={handleVideoSrc}/>
                <span className="lecture-form__text">Vui lòng nhập đường dẫn video cho bài học!</span>
              </div>
            </div>

            <div className="lecture-video">
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
            </div>


            <div className="form-action"> 
              <Button type="submit" className="btn-add">Thêm bài học</Button>
              <Button className="btn-new button-secondary button" onClick={handleResetForm}>Làm mới</Button>
              <Button className="btn-cancle button-third button">Hủy bỏ</Button>
            </div>
          </form>
        </div>

        {isModelOpen && (
          <ModelOverlay
            className="model-image_third"
            icon="Successful.svg"
            secondOption=""
            title="Thêm bài học"
            desc="Thêm bài học thành công!"
            onClose={handleCloseDelSuccessModel}
            children="">
          </ModelOverlay>
        )}
    </div>
  );
}
