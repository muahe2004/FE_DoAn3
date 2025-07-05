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
    <Link to={`/admin-course-details/${maKhoaHoc}`} className="admin-course">

      {/* Mã khóa học */}
      <div className="admin-course_id">
        <span>{maKhoaHoc}</span>
      </div>

      {/* Tên khóa học */}
      <div className="admin-course_name">
        <span>{tenKhoaHoc}</span>
      </div>

      {/* Hình ảnh */}
      <div className="admin-course_image">
        <img src={hinhAnh} alt={tenKhoaHoc} />
      </div>

      {/* Độ khó */}
      <div className="admin-course_level">
        <span>{doKho}</span>
      </div>

      {/* Giá */}
      <div className="admin-course_price">
        <span>{new Intl.NumberFormat('vi-VN').format(Number(giaBan))}</span>
      </div>
    </Link>
  );
};

export default Course;
