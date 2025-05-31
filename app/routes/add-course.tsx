import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import Button from "~/components/Button";

import "../styles/Admin/add-course.css";
import PopUp from "~/components/PopUp";

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

  // Xử lý blur
  const handleBlur = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const input = event.target;
    const formText = input.parentElement?.querySelector(".form-text") as HTMLElement | null;
  
    if (input.value.trim()) {
      // Nếu hợp lệ: ẩn thông báo và reset border
      if (formText) {
        formText.style.display = "none";
      }
      input.style.borderColor = "#ccc"; // hoặc "initial"
    } else {
      // Nếu không hợp lệ: hiển thị thông báo và border đỏ
      if (formText) {
        formText.style.display = "block";
      }
      input.style.borderColor = "red";
    }
  };
  
  
  // Add khóa học
  const handleAddCourse = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    const nameInput = form.querySelector<HTMLInputElement>('input[name="name"]');
    const descriptionInput = form.querySelector<HTMLTextAreaElement>('textarea[name="description"]');
    const levelInput = form.querySelector<HTMLSelectElement>('select[name="level"]');
    const priceInput = form.querySelector<HTMLInputElement>('input[name="price"]');
    const fileInput = form.querySelector<HTMLInputElement>('input[name="file"]');
  
    const showError = (input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null, message: string) => {
      if (input) {
        const formText = input.parentElement?.querySelector<HTMLElement>(".form-text");
        if (formText) {
          formText.innerText = message;
          formText.style.display = "block";
        }
        input.style.borderColor = "red";
        input.focus();
      }
    };
  
    if (!nameInput?.value.trim()) {
      showError(nameInput, "Vui lòng nhập tên khóa học!");
      return;
    }
    if (!descriptionInput?.value.trim()) {
      showError(descriptionInput, "Vui lòng nhập mô tả khóa học!");
      return;
    }
    if (!priceInput?.value.trim()) {
      showError(priceInput, "Vui lòng nhập giá bán!");
      return;
    }
  
    let imageUrl = `${import.meta.env.VITE_API_URL}/uploads/COURSE.png`; 

    if (fileInput?.files?.length) {
      const formData = new FormData();
      formData.append("file", fileInput.files[0]);
  
      try {
        const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
          method: "POST",
          body: formData,
        });
  
        if (!uploadResponse.ok) throw new Error("Lỗi upload ảnh");
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl;
      } catch (error) {
        console.error("Lỗi upload ảnh:", error);
        return; 
      }
    }
  
    const body = {
      tenKhoaHoc: nameInput.value,
      moTaKhoaHoc: descriptionInput.value,
      hinhAnh: imageUrl,
      doKho: levelInput?.value,
      giaBan: parseFloat(priceInput.value) || 0,
      maGiangVien: 'ND001', // can update lai: lay ma nguoi dung tu local
    };
  
    try {
      const courseResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      if (courseResponse.ok) {
        handleOpenAddDone();
        setTimeout(() => navigate("/admin"), 2500);
      } else {
        console.error("Lỗi tạo khóa học:", await courseResponse.text());
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };
  
  // Ẩn hiện PopUp
  const [isClosedAddDone, setIsClosedAddDone] = useState(true);
  const handleOpenAddDone = () => { setIsClosedAddDone(false)};
  const handleCloseAddDone = () => { setIsClosedAddDone(true)};

  // Làm mới
  const handleResetForm = () => {
    const form = document.querySelector<HTMLFormElement>(".course__form");
    if (form) {
      form.reset(); 
      
      setImagePreview(null);
  
      const errorMessages = form.querySelectorAll<HTMLElement>(".form-text");
      errorMessages.forEach((msg) => {
        msg.style.display = "none";
      });
    }
  };
  
  return (
    <div className="add-course__wrapper">
      <Header className="header-admin" title="Thêm khóa học" />
      <AdminNav />
      
      <div className="add-course__inner">
        {/* Form thêm khóa học */}
        <form onSubmit={handleAddCourse} className="course__form">
          <div className="form-inner">
            
            <div className="form-info">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Tên khóa học</label>
                <input name="name" type="text" className="form-input" onBlur={handleBlur}/>
                <span className="form-text">Vui lòng nhập tên khóa học</span>
              </div>

              <div className="form-group group-area">
                <label htmlFor="description" className="form-label label-area">Mô tả</label>
                <textarea name="description" className="form-input form-area" onBlur={handleBlur}></textarea>
                <span className="form-text form-text_desc">Vui lòng nhập mô tả cho khóa học</span>
              </div>

              <div className="form-group">
                <label htmlFor="level" className="form-label">Độ khó</label>
                <select name="level" className="form-input form-select">
                  <option value="Dễ">Dễ</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Khó">Khó</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price" className="form-label">Giá bán</label>
                <input name="price" type="number" className="form-input" onBlur={handleBlur}/>
                <span className="form-text">Vui lòng nhập giá bán</span>
              </div>
            </div>

            {/* Phần thêm ảnh */}
            <div className="form-group group-image">
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
            <Button className="btn-new button-secondary button" onClick={handleResetForm}>Làm mới</Button>
            <Button className="btn-cancle button-third button">Hủy bỏ</Button>
          </div>

        </form>
      </div>

      <PopUp 
        icon={"Successful.svg"} 
        // secondOption={"Hủy bỏ"} 
        title={"Thêm khóa học"} 
        desc={"Thêm khóa học thành công!"} 
        onOpen={handleCloseAddDone}
        isClosed={isClosedAddDone}
        className="popup-done"
        // timeCount={5}
      >
        {/* <Button type="button" onClick={handleCloseUpdateDone}>OK</Button> */}
      </PopUp>
    </div>
  );
}
