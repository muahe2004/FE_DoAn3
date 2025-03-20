import { Link } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import "../../styles/Admin/admin_course.css";


interface CourseProps {
  maKhoaHoc: string;
  tenKhoaHoc: string;
  moTaKhoaHoc: string;
  giaBan: string;
  hinhAnh: string;
  doKho: string;
}

const Course: React.FC<CourseProps> = ({ maKhoaHoc, tenKhoaHoc, doKho, hinhAnh, giaBan }) => {
  return (
    <Link to={`/admin-course-details/${maKhoaHoc}`} className="course">
      {/* Check box */}
      <div className="course-check">
        <input type="checkbox" />
      </div>

      {/* Mã khóa học */}
      <div className="course-id">
        <span>{maKhoaHoc}</span>
      </div>

      {/* Tên khóa học */}
      <div className="course-name">
        <span>{tenKhoaHoc}</span>
      </div>

      {/* Hình ảnh */}
      <div className="course-image">
        <img src={hinhAnh} alt={tenKhoaHoc} />
      </div>

      {/* Độ khó */}
      <div className="course-level">
        <span>{doKho}</span>
      </div>

      {/* Giá */}
      <div className="course-price">
        <span>{giaBan}</span>
      </div>

      {/* Sửa - Chỉ phần này có Link */}
      <div className="course-update">
        <Link className="update-link" to={`/admin-course-details/${maKhoaHoc}`}>
          {/* <img className="course-icon" src="../../public/icons/Update.svg" alt="Chỉnh sửa" /> */}
        </Link>
      </div>

      <div className="course-delete">
        {/* <img className="course-icon" src="../../public/icons/Delete.svg" alt="Xóa" /> */}
      </div>
    </Link>
  );
};

export default Course;
