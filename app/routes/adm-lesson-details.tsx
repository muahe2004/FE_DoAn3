import { useEffect, useState } from "react";

import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import Button from "~/components/Button";

import "../styles/Admin/adm-lesson-details.css";
import "../styles/Admin/add-lesson.css";
import { useParams } from "react-router";

export default function AdminLessonDetails() {
    const {maChuongHoc} = useParams();
    const [tenChuongHoc, setTenChuongHoc] = useState("");
    const [tenKhoaHoc, setTenKhoaHoc] = useState("");

    useEffect(() => {
        fetch(`http://localhost:1000/lesson-details/${maChuongHoc}`)
            .then((res) => res.json())
            .then((data) => {
                setTenChuongHoc(data.tenChuongHoc);
                setTenKhoaHoc(data.tenKhoaHoc);
                console.log(data.maChuongHoc);
            })
            .catch((err) => console.error(err));
    }, [maChuongHoc]); 
    

    const handleSubmit = () => {
        console.log("Submit");
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const input = event.target;
        const formErr = input.parentElement?.querySelector(".lesson-form__text") as HTMLElement | null;

        if (formErr) {
            formErr.style.display = input.value.trim() ?  "none" : "block";
        }
    }
    
    const handleResetForm= () => {
        const form = document.querySelector<HTMLFormElement>(".update-lesson__form")
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

    
    return (
        <div className="update-lesson__wrapper">
            <Header title="Thông tin chương"></Header>
            <AdminNav></AdminNav>

            <div className="update-lesson__inner">
                <form onSubmit={handleSubmit} action="" className="update-lesson__form">
                    <div className="lesson-form__inner">
                        <div className="lesson-form__group">
                            <label htmlFor="ID" className="lesson-form__label">Mã chương</label>
                            <input name="ID" type="text" className="lesson-form__input input-readOnly" required readOnly onBlur={handleBlur} value={maChuongHoc}/>
                        </div>
                            
                        <div className="lesson-form__group">
                            <label htmlFor="nameCourse" className="lesson-form__label">Khóa học</label>
                            <input name="nameCourse" type="text" className="lesson-form__input input-readOnly" required readOnly onBlur={handleBlur} value={tenKhoaHoc} onChange={(e) => setTenKhoaHoc(e.target.value)}/>
                        </div>

                        <div className="lesson-form__group">
                            <label htmlFor="nameLesson" className="lesson-form__label">Tên chương</label>
                            <input name="nameLesson" type="text" className="lesson-form__input" onBlur={handleBlur} value={tenChuongHoc} onChange={(e) => setTenChuongHoc(e.target.value)}/>
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
        </div>
    );
}