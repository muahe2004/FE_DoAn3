import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import Button from "~/components/Button";
import ModelOverlay from "~/components/OverlayModel";

import "../styles/Admin/question.css";
import "../styles/Admin/add-course.css";




export default function Question() {
  const navigate = useNavigate();

  const handleBlur = () => {

  }

  const handleResetForm = () => {

  }
  

  return (
    <div className="question__wrapper">
      <Header title="Quản lý câu hỏi" />
      <AdminNav />
      
      <div className="question-inner">
      <form className="course__form">
          <div className="form-inner">
            
            <div className="form-info">
              <div className="form-group">
                <label htmlFor="level" className="form-label">Khóa học</label>
                <select name="level" className="form-input form-select">
                  <option value="Dễ">Dễ</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Khó">Khó</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="level" className="form-label">Chương học</label>
                <select name="level" className="form-input form-select">
                  <option value="Dễ">Dễ</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Khó">Khó</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="level" className="form-label">Bài học</label>
                <select name="level" className="form-input form-select">
                  <option value="Dễ">Dễ</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Khó">Khó</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="name" className="form-label">Nội dung</label>
                <input name="name" type="text" className="form-input" onBlur={handleBlur}/>
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
