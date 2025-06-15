import { Link, useNavigate } from "react-router-dom";
import "../styles/course.css";
import "../styles/Responsive/Components/course.css";
import type { courses } from '../types/courses';


interface CourseProps {
  maKhoaHoc: string; 
  tenKhoaHoc: string;
  giaBan: number;
  children: React.ReactNode; 
  hinhAnh: string;
  doKho: string;
  tongSoBaiHoc?: number;
  className?: string;
}

const Course: React.FC<CourseProps> = ({maKhoaHoc, tenKhoaHoc, giaBan, hinhAnh, doKho, tongSoBaiHoc, className}) => {
  const navigate = useNavigate(); // Hook để điều hướng người dùng

  const handleCourseClick = () => {
    const myCourses = localStorage.getItem("myCourses");

    if (myCourses) {
      const listCourses = JSON.parse(myCourses);

      // Kiểm tra xem maKhoaHoc có trong listCourses hay không
      const courseExists = listCourses.some((course: { maKhoaHoc: string }) => course.maKhoaHoc === maKhoaHoc);

      // Nếu có, chuyển hướng đến trang /learning/:maKhoaHoc, nếu không, đến /course-details/:maKhoaHoc
      if (courseExists) {
        navigate(`/learning/${maKhoaHoc}`);
      } else {
        navigate(`/courses/course-details/${maKhoaHoc}`);
      }
    } else {
      console.log("No courses found in localStorage");
      navigate(`/courses/course-details/${maKhoaHoc}`);
    }
  };

  const handleCourseClickFake = () => {
    navigate(`/learning/KH002`);
  };

  return (
    <div className={`course ${className || ""}`}>
      {/* Sự kiện onClick để điều hướng khi click vào khóa học */}
      <div onClick={handleCourseClick}>
        <img src={hinhAnh} alt={tenKhoaHoc} className="course-image" />
      </div>

      <section className="course-content">
        <h3 className="course-comp_name">
          <span onClick={handleCourseClick}>{tenKhoaHoc}</span>
        </h3>

        <div className="price-container">
          {giaBan !== 0 && (
            <span className="old-price">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0
              }).format(giaBan*1.9)}
            </span>
          )}
          <span className="main-price">
            {giaBan === 0
              ? "Miễn phí"
              : new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0
                }).format(giaBan)}
          </span>
        </div>



        <div className="more-info">
            <div className="info-item">
                <img className="info-icon" src="/images/ML.jpg" alt="MLearning" />
                <span>MLearning</span>
            </div>

            <div className="info-item">
                <img className="item-icon" src="/icons/Video.svg" alt="Tổng số bài học" />
                <span>{tongSoBaiHoc}</span>
            </div>

            <div className="info-item">
                <img className="item-icon" src="/icons/Code.svg" alt="Độ khó" />
                <span>{doKho}</span>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Course;
