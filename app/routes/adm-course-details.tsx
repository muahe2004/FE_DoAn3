import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import Button from "~/components/Button";
import ModelOverlay from "~/components/OverlayModel";

import "../styles/Admin/add-course.css";

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
    fetch(`http://localhost:1000/getByID/${maKhoaHoc}`)
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
        const imgRes = await fetch("http://localhost:1000/upload", {
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
      const updateRes = await fetch(`http://localhost:1000/${maKhoaHoc}/update-khoahoc`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      if (!updateRes.ok) {
        console.log("Lỗi khi cập nhật khóa học");
        return;
      }
  
      if (updateRes.ok) {
        handleClose();
        handleOpenSuccessModel(); 
        setTimeout(() => navigate("/admin"), 2500);
      } else {
        alert("Lỗi khi cập nhật khóa học!");
      }
    } catch (error) {
      console.log("Lỗi khi cập nhật khóa học: ", error);
    }
  };

  // Handle thực hiện xóa khóa học
  const handleDeleteCourse = async () => {
    try {
      const response = await fetch(`http://localhost:1000/${maKhoaHoc}/delete-khoahoc`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        alert("Lỗi khi xóa khóa học!");
        return;
      }
      handleCloseDeleteModel();
      handleOpenDelSuccessModel();
      setTimeout(() => navigate("/admin"), 2200);
    } catch (error) {
      console.log("Lỗi khi xóa khóa học: ", error);
    }
  };
  

  // Ẩn hiện model
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpen = () => {
    console.log("Mở");
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const [isModelDeleteOpen, setIsModelDeleteOpen] = useState(false);
  const handleOpenDeleteModel = () => {
    setIsModelDeleteOpen(true);
  }

  const handleCloseDeleteModel = () => {
    setIsModelDeleteOpen(false);
  }

  const [isModelSuccessfulModelOpen, setIsModelSuccessfulModelOpen] = useState(false);
  const handleOpenSuccessModel = () => {
    setIsModelSuccessfulModelOpen(true);
  }

  const handleCloseSuccessModel = () => {
    setIsModelSuccessfulModelOpen(false);
  }

  const [isModelDelSuccessfullOpen, setIsModelDelSuccessfullOpen] = useState(false);
  const handleOpenDelSuccessModel = () => {
    setIsModelDelSuccessfullOpen(true);
  }

  const handleCloseDelSuccessModel = () => {
    setIsModelDelSuccessfullOpen(false);
  }
  
  return (
    <div className="update-course__wrapper">
      <Header title="Thông tin khóa học" />
      <AdminNav />
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
          <div className="form-action">
            <Button type="button" className="btn-save" onClick={handleOpen}>Lưu lại</Button>
            <Button className="btn-new button-secondary button">Làm mới</Button>
            <Button className="btn-cancel button-third button" onClick={handleOpenDeleteModel}>Xóa khóa học</Button>
          </div>

          {isModalOpen && (
            <ModelOverlay
                className="model-image_second"
                icon="Question.svg"
                secondOption="Hủy bỏ" 
                title="Sửa khóa học"
                desc="Bạn có chắc chắn muốn sửa khóa học không?"
                onClose={handleClose}>
                <Button type="submit">Lưu lại</Button>
            </ModelOverlay>
          )}

          
        </form>
      </div>

      {isModelDeleteOpen && (
        <ModelOverlay
            className="model-image"
            icon="Exclamation.svg"
            secondOption="Hủy bỏ" 
            title="Xóa khóa học"
            desc="Bạn có chắc chắn muốn xóa khóa học không?"
            onClose={handleCloseDeleteModel}>
            <Button type="submit" className="button-delete" onClick={handleDeleteCourse}>Xóa khóa học</Button>
        </ModelOverlay>
      )}

      {isModelSuccessfulModelOpen && (
        <ModelOverlay
          className="model-image_third"
          icon="Successful.svg"
          secondOption=""
          title="Sửa khóa học"
          desc="Cập nhật thông tin khóa học thành công!"
          onClose={handleCloseSuccessModel}
          children="">
        </ModelOverlay>
      )}

      {isModelDelSuccessfullOpen && (
        <ModelOverlay
        className="model-image_third"
        icon="Successful.svg"
        secondOption=""
        title="Xóa khóa học"
        desc="Xóa thông tin khóa học thành công!"
        onClose={handleCloseDelSuccessModel}
        children="">
      </ModelOverlay>
      )}
    </div>
  );
}
