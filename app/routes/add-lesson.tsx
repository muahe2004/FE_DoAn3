import { useEffect, useState } from "react";
import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import Button from "~/components/Button";
import ModelOverlay from "~/components/OverlayModel";

import "../styles/Admin/admin.css";
import "../styles/Admin/add-lesson.css";



export default function AddLesson() {
  const [courses, setCourses] = useState<{ maKhoaHoc: string; tenKhoaHoc: string }[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:1000/selection-khoahoc"); 
        if (response.ok) {
          const data = await response.json();
          setCourses(data); 
          console.log(data);
        } else {
          console.error("Lỗi khi lấy danh sách khóa học");
        }
      } catch (error) {
        console.error("Lỗi: ", error);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    const course = form.querySelector<HTMLSelectElement>('select[name="course"]');
    const nameInput = form.querySelector<HTMLInputElement>('input[name="name"]');

    const showError = (input: HTMLInputElement | HTMLSelectElement | null, message: string) => {
      if (input) {
        const formErr = input.parentElement?.querySelector(".lesson-form__text") as HTMLElement | null;
        if (formErr) {
          formErr.innerText = message;
          formErr.style.display = "block";
        }
        input.focus();
      }
    }

    if(!course?.value.trim()) {
      console.log("Vui lòng chọn khóa học");
      return;
    }

    if (!nameInput?.value.trim()) {
      console.log("Vui lòng nhập tên chương");
      return;
    }

    const body = {
      tenChuongHoc: nameInput?.value.trim(),
      maKhoaHoc: course?.value.trim(),
    }

    try {
      console.log(body);
      const lessonRes = await fetch("http://localhost:1000/create-chuong-hoc", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(body)
      });

      if (lessonRes.ok) {
        handleOpenModel();
        setTimeout(() => handleCloseDelSuccessModel(), 2300);
        handleResetForm();
      } else {
        console.log("Lỗi khi thêm chương học", Error);
      }
    }
    catch(error) {
      console.log("Lỗi: ", error);
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const input = event.target;
    const formErr = input.parentElement?.querySelector(".lesson-form__text") as HTMLElement | null;

    if (formErr) {
      formErr.style.display = input.value.trim() ?  "none" : "block";
    }
  }

  const handleResetForm= () => {
    const form = document.querySelector<HTMLFormElement>(".lesson-form")
    const formError = document.querySelectorAll<HTMLElement>(".lesson-form__text");

    if (form) {
      form.reset();
    }

    if (formError) {
      formError.forEach((mess)  => {
        mess.style.display = "none";
      })
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
    <div className="add-lesson__wrapper">
      <Header title="Thêm chương học"></Header>
      <AdminNav></AdminNav>

      <div className="add-lesson__inner">
        <form onSubmit={handleSubmit} action="" className="lesson-form">
          <div className="lesson-form__inner">
            <div className="lesson-form__group">
              <label htmlFor="course" className="lesson-form__label">Khóa học</label>
              <select name="course" className="lesson-form__input lesson-form__select">
                <option value="">Chọn khóa học</option>
                {courses.map((course) => (
                  <option key={course.maKhoaHoc} value={course.maKhoaHoc}>
                    {course.tenKhoaHoc}
                  </option>
                ))}
              </select>
            </div>
                  
            <div className="lesson-form__group">
              <label htmlFor="name" className="lesson-form__label">Tên chương</label>
              <input name="name" type="text" className="lesson-form__input" onBlur={handleBlur}/>
              <span className="lesson-form__text">Vui lòng nhập tên chương</span>
            </div>
          </div>

          <div className="lesson-form__action"> 
            <Button type="submit" className="btn-add">Thêm chương</Button>
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
            title="Thêm chương"
            desc="Thêm chương thành công!"
            onClose={handleCloseDelSuccessModel}
            children="">
          </ModelOverlay>
        )}
    </div>
  );
}
