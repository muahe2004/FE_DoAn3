import { Link } from "react-router-dom";
import "../styles/course.css";
{/* <link rel="stylesheet" href="../../styles/Admin/admin_course.css" /> */}


interface CourseProps {
    maKhoaHoc: string; 
    tenKhoaHoc: string;
    giaBan: string;
    children: React.ReactNode; 
    hinhAnh: string;
    doKho: string;
    tongSoBaiHoc: number;
}

const Course: React.FC<CourseProps> = ({maKhoaHoc, tenKhoaHoc, giaBan, children, hinhAnh, doKho, tongSoBaiHoc}) => {
  return (
    <div className="course">
      <Link to={`courses/course-details/${maKhoaHoc}`}>
        <img src={hinhAnh} alt={tenKhoaHoc} className="course-image" />
      </Link>

      <section className="course-content">
        <h3 className="course-comp_name">
          <Link to={`courses/course-details/${maKhoaHoc}`}>{tenKhoaHoc}</Link>
        </h3>

        <div className="price-container">
          <span className="old-price">{giaBan}</span>
          <span className="main-price">{giaBan}</span>
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
 