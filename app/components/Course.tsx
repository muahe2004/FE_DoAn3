import { Link } from "react-router-dom";
import "../styles/course.css";
{/* <link rel="stylesheet" href="../../styles/Admin/admin_course.css" /> */}


interface CourseProps {
    maKhoaHoc: string; 
    tenKhoaHoc: string;
    giaBan: string;
    children: React.ReactNode; 
    hinhAnh: string;
}

const Course: React.FC<CourseProps> = ({maKhoaHoc, tenKhoaHoc, giaBan, children, hinhAnh}) => {
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
          <span className="old-price">{giaBan} VND</span>
          <span className="main-price">{giaBan} VND</span>
        </div>

        <div className="more-info">
            <div className="info-item">
                <img className="avatar-mentor" src="/images/lvm.jpg" alt="" />
                <span>Minh Minh</span>
            </div>

            <div className="info-item">
                <img className="item-icon" src="/icons/Video.svg" alt="" />
                <span>591</span>
            </div>

            <div className="info-item">
                <img className="item-icon" src="/icons/Clock.svg" alt="" />
                <span>116h50p</span>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Course;
 