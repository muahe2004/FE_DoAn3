
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import AdminCourse from "~/components/Admin/Course";
import Button from "~/components/Button";

import "../styles/Admin/admin.css";
import "../styles/Admin/add-lesson.css";



export default function AddLesson() {

  const handleSubmit = () => {
    console.log("Submit form");
  }

  const handleBlur = () => {
    console.log("Blur input");
  }

  const handleResetForm= () => {
    console.log("Reset form");
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
              <select id="lesson-select" name="course" className="lesson-form__input leson-form__select">
                <option value="html & css pro">HTML & CSS Pro</option>
                <option value="javascript">Javascript</option>
                <option value="sass">Sass</option>
              </select>
            </div>
                  
            <div className="lesson-form__group">
              <label htmlFor="name" className="lesson-form__label">Tên chương</label>
              <input name="name" type="text" className="lesson-form__input" onBlur={handleBlur}/>
              <span className="lesson-form__text">Vui lòng nhập tên khóa học</span>
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
