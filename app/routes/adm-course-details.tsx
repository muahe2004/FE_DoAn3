import { useEffect, useState } from "react";
import {  Link, useParams, useNavigate } from "react-router-dom";
import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import Button from "~/components/Button";
import PopUp from "~/components/PopUp";


import "../styles/Admin/add-course.css";
import "../styles/Admin/adm-course-details.css";

export default function AdminCourseDetails() {
  const navigate = useNavigate();

  // Load thông tin của khóa học
  const { maKhoaHoc } = useParams();
  const [tenKhoaHoc, setTenKhoaHoc] = useState("");
  const [moTaKhoaHoc, setMoTaKhoaHoc] = useState("");
  const [doKho, setDoKho] = useState("");
  const [giaBan, setGiaBan] = useState("");
  const [hinhAnh, setHinhAnh] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/courses/${maKhoaHoc}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setTenKhoaHoc(data.tenKhoaHoc);
        setMoTaKhoaHoc(data.moTaKhoaHoc);
        setDoKho(data.doKho);
        setGiaBan(data.giaBan);
        setHinhAnh(data.hinhAnh);
        setImagePreview(data.hinhAnh);
      })
      .catch((err) => console.error(err));
  }, [maKhoaHoc]);
  
  // Xử lý phần ảnh
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          setImagePreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle thực hiện sửa thông tin khóa học
  const handleUpdateCourse = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const formData = new FormData();
    const form = event.currentTarget;
  
    const imageInput = form.querySelector<HTMLInputElement>('input[name="file"]');
    let imgURL = hinhAnh; // Mặc định giữ nguyên ảnh cũ
  
    if (imageInput && imageInput.files?.length) {
      const fileImg = imageInput.files[0];
      formData.append("file", fileImg);
  
      try {
        const imgRes = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
          method: "POST",
          body: formData,
        });
  
        if (!imgRes.ok) {
          console.log("Lỗi khi upload ảnh");
          return;
        }
  
        const imgData = await imgRes.json();
        imgURL = imgData.imageUrl; // Cập nhật đường dẫn ảnh mới
      } catch (error) {
        console.log("Lỗi khi upload ảnh: ", error);
        return;
      }
    }
  
    const nameInput = form.querySelector<HTMLInputElement>('input[name="name"]');
    const descInput = form.querySelector<HTMLTextAreaElement>('textarea[name="desc"]');
    const levelInput = form.querySelector<HTMLSelectElement>('select[name="level"]');
    const priceInput = form.querySelector<HTMLInputElement>('input[name="price"]');
  
    const body = {
      tenKhoaHoc: nameInput?.value,
      moTaKhoaHoc: descInput?.value,
      doKho: levelInput?.value,
      giaBan: priceInput?.value,
      hinhAnh: imgURL, // Luôn gửi ảnh cũ nếu không có ảnh mới
    };
  
    try {
      const updateRes = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${maKhoaHoc}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      if (!updateRes.ok) {
        console.log("Lỗi khi cập nhật khóa học");
        return;
      }
  
      if (updateRes.ok) {
        handleCloseUpdate();
        handleOpenUpdateDone(); 
        setTimeout(() => handleCloseUpdateDone(), 2500);
      } else {
        alert("Lỗi khi cập nhật khóa học!");
      }
    } catch (error) {
      console.log("Lỗi khi cập nhật khóa học: ", error);
    }
  };

  // Handle thực hiện xóa khóa học
  const handleDeleteCourse = async () => {
    // Cần kiểm tra xem khoá học đang có học viên hay ko
    // nếu ko có học viên thì mới cho xoá
    const check = await handleCheckStudent(); 
    if (check === true) {
      handleCloseDelete();
      handleOpenCheck();
      setTimeout(() => {
        handleCloseCheck();
      }, 3000);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${maKhoaHoc}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        alert("Lỗi khi xóa khóa học!");
        return;
      }
      handleCloseDelete();
      handleOpenDeleteDone();
      setTimeout(() => navigate("/admin"), 2200);
    } catch (error) {
      console.log("Lỗi khi xóa khóa học: ", error);
    }
  };

  const handleCheckStudent = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/check-student/${maKhoaHoc}`, {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      return data.checked;
      // console.log(data); 
    } else {
      // console.error("Lỗi khi kiểm tra học viên!", response.status);
      return true;
    }
  }

  // Ẩn hiện PopUp
  const [isClosedUpdate, setIsClosedUpdate] = useState(true);
  const handleOpenUpdate = () => { setIsClosedUpdate(false)};
  const handleCloseUpdate = () => { setIsClosedUpdate(true)};

  const [isClosedUpdateDone, setIsClosedUpdateDone] = useState(true);
  const handleOpenUpdateDone = () => { setIsClosedUpdateDone(false)};
  const handleCloseUpdateDone = () => { setIsClosedUpdateDone(true)};

  const [isClosedDelete, setIsClosedDelete] = useState(true);
  const handleOpenDelete = () => { setIsClosedDelete(false)};
  const handleCloseDelete = () => { setIsClosedDelete(true)};

  const [isClosedDeleteDone, setIsClosedDeleteDone] = useState(true);
  const handleOpenDeleteDone = () => { setIsClosedDeleteDone(false)};
  const handleCloseDeleteDone = () => { setIsClosedDeleteDone(true)};

  const [isClosedCheck, setIsClosedCheck] = useState(true);
  const handleOpenCheck = () => { setIsClosedCheck(false)};
  const handleCloseCheck = () => { setIsClosedCheck(true)};

  const handleResetForm = () => {
    setTenKhoaHoc("");
    setMoTaKhoaHoc("");
    setDoKho("Dễ");
    setGiaBan("");

    const form = document.querySelector<HTMLFormElement>(".update-lesson__form");
    if (form) {
        const errorMessages = form.querySelectorAll<HTMLElement>(".lesson-form__text");
        errorMessages.forEach((msg) => {
            msg.style.display = "none";
        });
    } else {
        console.log("Không thấy form");
    }
  };

  const [chuongHocList, setChuongHocList] = useState<
    { maChuongHoc: string; tenChuongHoc: string; danhSachBaiHoc: any[] }[]
  >([]);

  // API load chương, bài học
  useEffect(() => {
      const fetchLessons = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lessons/selection-lessons/${maKhoaHoc}`);
          if (!res.ok) throw new Error("Lỗi khi lấy chương học!");

          const lessons: { maChuongHoc: string; tenChuongHoc: string }[] = await res.json();
          
          const lessonInfo = await Promise.all(
            lessons.map(async (lesson) => {
              const resLecture = await fetch(`${import.meta.env.VITE_API_URL}/api/lectures/by-lesson/${lesson.maChuongHoc}`);
              let danhSachBaiHoc = [];

              if (resLecture.ok) {
                danhSachBaiHoc = await resLecture.json();
              }

              return { 
                maChuongHoc: lesson.maChuongHoc, 
                tenChuongHoc: lesson.tenChuongHoc,
                danhSachBaiHoc 
              };
            })
          );

          setChuongHocList(lessonInfo); 
          // console.log(lessonInfo);
        } catch (error) {
          console.error("Lỗi:", error);
        }
      };

      fetchLessons();
  }, [maKhoaHoc]); 

  // Accordion
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  // Hàm xử lý mở/đóng accordion
  const toggleAccordion = (index: number) => {
    setOpenIndexes((prevIndexes) =>
      prevIndexes.includes(index)
        ? prevIndexes.filter((i) => i !== index) // Nếu đã mở thì xóa khỏi danh sách (đóng lại)
        : [...prevIndexes, index] // Nếu chưa mở thì thêm vào danh sách (mở ra)
    );
  };

  return (
    <div className="update-course__wrapper">
      <Header className="header-admin" title="Thông tin khóa học" />
      <AdminNav />
      {/* Inner */}
      <div className="update-course__inner">
        <form onSubmit={handleUpdateCourse} className="course__form">
          <div className="form-inner">
            <div className="form-info">
              <div className="form-group">
                <label className="form-label">Mã khóa học</label>
                <input name="ID" type="text" className="form-input input-readOnly" readOnly value={maKhoaHoc} />
              </div>
              <div className="form-group">
                <label className="form-label">Tên khóa học</label>
                <input name="name" type="text" className="form-input" required value={tenKhoaHoc} onChange={(e) => setTenKhoaHoc(e.target.value)} />
              </div>
              <div className="form-group group-area">
                <label className="form-label label-area">Mô tả</label>
                <textarea name="desc" className="form-input form-area" required value={moTaKhoaHoc} onChange={(e) => setMoTaKhoaHoc(e.target.value)}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Độ khó</label>
                <select name="level" className="form-input form-select" value={doKho} onChange={(e) => setDoKho(e.target.value)}>
                  <option value="">-- Chọn độ khó --</option>
                  <option value="Dễ">Dễ</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Khó">Khó</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Giá bán</label>
                <input name="price" type="number" className="form-input" required value={giaBan} onChange={(e) => setGiaBan(e.target.value)} />
              </div>
            </div>
            <div className="form-group group-image">
              <div className="course_thumb">
                <label htmlFor="upload-thumb" className="thumb-box">
                  {imagePreview && <img src={imagePreview} alt="Ảnh xem trước" className="thumb-preview" />}
                </label>
                <label htmlFor="upload-thumb" className="custom-thumb-btn">Chọn ảnh</label>
                <input type="file" accept="image/*" id="upload-thumb" name="file" className="thumb-input" onChange={handleImageChange} />
              </div>
            </div>
          </div>

          <PopUp 
            icon={"Question.svg"} 
            secondOption={"Hủy bỏ"} 
            title={"Sửa khóa học"} 
            desc={"Bạn có chắc chắn muốn sửa khóa học không?"} 
            onOpen={handleCloseUpdate}
            isClosed={isClosedUpdate}
            className="popup-update"
            // timeCount={3}
          >
            <Button type="submit">Sửa</Button>
          </PopUp>

          <div className="accordion">
            <h2 className="accordion-title">Nội dung khóa học</h2>
            {/* Nội dung accordion */}
            <div className="accordion-inner">
              {chuongHocList.map((chuong, index) => (
                  <div className="accordion-item" key={chuong.maChuongHoc}>
                      <div className="accordion-head">
                        <button type="button" className="accordion-lesson" onClick={() => toggleAccordion(index)}>
                          {chuong.tenChuongHoc} 
                        </button>
                        <Button to={`/admin-lesson-details/${chuong.maChuongHoc}`} type="button" className=" button-third accordion-btn">
                          <img className="accordion-icon" src="../icons/Update.svg" alt="" />
                        </Button>
                      </div>

                      <div className={`accordion-content ${openIndexes.includes(index) ? "open" : ""}`}>
                        <ul className="accordion-list">
                            {chuong.danhSachBaiHoc.map((baiHoc) => (
                                <li key={baiHoc.maBaiHoc} className="accordion-list_item">
                                  <Link to={`/admin-lecture-details/${baiHoc.maBaiHoc}`} className="accordion-list__link">
                                    {baiHoc.tenBaiHoc}
                                  </Link>
                                </li>
                            ))}
                        </ul>
                      </div>
                  </div>
              ))}
            </div>
          </div>

        </form>
      </div>

      <div className="form-action update-form__action">
        <Button type="button" className="btn-save" onClick={handleOpenUpdate}>Lưu lại</Button>
        <Button type="button" className="btn-new button-secondary button" onClick={handleResetForm}>Làm mới</Button>
        <Button className="btn-cancel button-third button" onClick={handleOpenDelete}>Xóa khóa học</Button>
      </div>


      <PopUp 
        icon={"Question.svg"} 
        secondOption={"Hủy bỏ"} 
        title={"Xóa khóa học"} 
        desc={"Bạn có chắc chắn muốn xóa khóa học không?"} 
        onOpen={handleCloseDelete}
        isClosed={isClosedDelete}
        className="popup-delete"
        timeCount={5}
      >
        <Button type="submit" className="popup-delete_btn" onClick={handleDeleteCourse}>Xóa</Button>
      </PopUp>

      <PopUp 
        icon={"Successful.svg"} 
        // secondOption={"Hủy bỏ"} 
        title={"Sửa khóa học"} 
        desc={"Cập nhật thông tin khóa học thành công!"} 
        onOpen={handleCloseUpdateDone}
        isClosed={isClosedUpdateDone}
        className="popup-done"
        // timeCount={5}
      >
        {/* <Button type="button" onClick={handleCloseUpdateDone}>OK</Button> */}
      </PopUp>

      <PopUp 
        icon={"Successful.svg"} 
        // secondOption={"Hủy bỏ"} 
        title={"Xóa khóa học"} 
        desc={"Xóa thông tin khóa học thành công!"} 
        onOpen={handleCloseDeleteDone}
        isClosed={isClosedDeleteDone}
        className="popup-done"
        // timeCount={5}
      >
        {/* <Button type="button" onClick={handleCloseUpdateDone}>OK</Button> */}
      </PopUp>

      <PopUp 
        icon={"Exclamation.svg"} 
        // secondOption={"Hủy bỏ"} 
        title={"Xóa khóa học"} 
        desc={"Khoá học đang có học viên!"} 
        onOpen={handleCloseCheck}
        isClosed={isClosedCheck}
        className="popup-delete"
        // timeCount={5}
      >
        {/* <Button type="button" onClick={handleCloseUpdateDone}>OK</Button> */}
      </PopUp>
    </div>
  );
}
