import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import Button from "~/components/Button";

import "../styles/Admin/add-course.css";
import ModelOverlay from "~/components/OverlayModel";


export default function AddCourse() {
  const navigate = useNavigate();

  // State lưu ảnh xem trước
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Xử lý sự kiện chọn ảnh
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; 
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === "string") {
          setImagePreview(e.target.result); 
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add khóa học
  const handleAddCourse = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (!event.currentTarget) return;
  
    const form = event.currentTarget;
  
    const fileInput = form.querySelector<HTMLInputElement>('input[name="file"]');
    if (!fileInput || !fileInput.files?.length) {
      console.log("Vui lòng chọn ảnh minh họa cho khóa học!");
      return;
    }
  
    const file = fileInput.files[0];
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const uploadResponse = await fetch("http://localhost:1000/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!uploadResponse.ok) throw new Error("Lỗi upload ảnh");
  
      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.imageUrl;
  
      const nameInput = form.querySelector<HTMLInputElement>('input[name="name"]');
      const descriptionInput = form.querySelector<HTMLTextAreaElement>('textarea[name="description"]');
      const levelInput = form.querySelector<HTMLSelectElement>('select[name="level"]');
      const priceInput = form.querySelector<HTMLInputElement>('input[name="price"]');
  
      if (!nameInput || !descriptionInput || !levelInput || !priceInput) {
        alert("Vui lòng nhập đầy đủ thông tin khóa học!");
        return;
      }
  
      const body = {
        tenKhoaHoc: nameInput.value,
        moTaKhoaHoc: descriptionInput.value,
        hinhAnh: imageUrl,
        doKho: levelInput.value,
        giaBan: parseFloat(priceInput.value || "0"),
      };
    
      const courseResponse = await fetch("http://localhost:1000/create-khoahoc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      if (!courseResponse.ok) throw new Error("Lỗi khi thêm khóa học");
  
      navigate("/admin");
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };
  
  

  return (
    <div className="add-course__wrapper">
      <Header title="Thêm khóa học" />
      <AdminNav />

      <div className="add-course__inner">
        {/* Form thêm khóa học */}
        <form onSubmit={handleAddCourse} className="course__form">
          <div className="form-inner">
            
            <div className="form-info">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Tên khóa học</label>
                <input name="name" type="text" className="form-input" required />
              </div>

              <div className="form-group group-area">
                <label htmlFor="description" className="form-label label-area">Mô tả</label>
                <textarea name="description" className="form-input form-area" required></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="level" className="form-label">Độ khó</label>
                <select name="level" className="form-input form-select" required>
                  <option value="">-- Chọn độ khó --</option>
                  <option value="Dễ">Dễ</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Khó">Khó</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price" className="form-label">Giá bán</label>
                <input name="price" type="number" className="form-input" required />
              </div>
            </div>

            {/* Phần thêm ảnh */}
            <div className="form-group group-image">
              <label className="form-label label-image">Ảnh khóa học</label>
              <div className="add-course_thumb">
                <label htmlFor="upload-thumb" className="thumb-box">
                  {imagePreview && <img src={imagePreview} alt="Ảnh xem trước" className="thumb-preview" />}
                </label>
                <label htmlFor="upload-thumb" className="custom-thumb-btn">Chọn ảnh</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  id="upload-thumb" 
                  name="file"
                  className="thumb-input" 
                  onChange={handleImageChange} 
                />
              </div>
            </div>

          </div>

          <div className="form-action"> 
            <Button type="submit" className="btn-add">Thêm khóa học</Button>
            <Button className="btn-new button-secondary button">Làm mới</Button>
            <Button type="submit" className="btn-cancle button-third button">Hủy bỏ</Button>
          </div>

        </form>
      </div>


        {/* <ModelOverlay></ModelOverlay> */}
    </div>
  );
}
