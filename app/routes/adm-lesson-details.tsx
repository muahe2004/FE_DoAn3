import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import Button from "~/components/Button";
import ModelOverlay from "~/components/OverlayModel";

import "../styles/Admin/adm-lesson-details.css";
import "../styles/Admin/add-lesson.css";
import { useParams } from "react-router";

export default function AdminLessonDetails() {
    const navigate = useNavigate();

    const {maChuongHoc} = useParams();
    const [tenChuongHoc, setTenChuongHoc] = useState("");
    const [maKhoaHoc, setMaKhoaHoc] = useState("");
    const [tenKhoaHoc, setTenKhoaHoc] = useState("");
    

    // thông tin chương học
    useEffect(() => {
        fetch(`http://localhost:1000/lesson-details/${maChuongHoc}`)
            .then((res) => res.json())
            .then((data) => {
                setTenChuongHoc(data.tenChuongHoc);
                setTenKhoaHoc(data.tenKhoaHoc);
                setMaKhoaHoc(data.maKhoaHoc);
            })
            .catch((err) => console.error(err));
    }, [maChuongHoc]); 
    
    // submit
    const handleUpdateLesson = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
      
        const form = event.currentTarget;
        const nameInput = form.querySelector<HTMLInputElement>('input[name="nameLesson"]');

        const showError = (input: HTMLInputElement | null, message: string) => {
            if (input) {
              const formErr = input.parentElement?.querySelector(".lesson-form__text") as HTMLElement | null;
              if (formErr) {
                formErr.innerText = message;
                formErr.style.display = "block";
              }
              input.focus();
            }
        }

        if (!nameInput?.value.trim()) {
            showError(nameInput, "Vui lòng nhập tên chương!");
            return;
        }

        const body = {
            // maChuongHoc: maChuongHoc,
            maKhoaHoc: maKhoaHoc,
            tenChuongHoc: nameInput?.value.trim(),
        }

        try {
            const res = await fetch(`http://localhost:1000/update-lesson/${maChuongHoc}`, {
                method: "PUT",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(body)
            });

            if (res.ok) {
                handleClose();
                handleOpenSuccessModel();
                setTimeout(() => handleCloseSuccessModel(), 2300);
            } else {
                console.log("Sửa thất bại!");
            }

        } catch (error) {
            console.log("Lỗi: ", error);
        }

    };

    // Xóa
    const handleDeleteLesson = async () => {

        console.log("Xóa chương");

        try {
            const response = await fetch(`http://localhost:1000/delete-lesson/${maChuongHoc}`, {
                method: "DELETE",
            });
        
            if (response.ok) {
                console.log("Xóa thành công");
                handleCloseDeleteModel();
                handleOpenDelSuccessModel();
                setTimeout(() => navigate(`/admin-course-details/${maKhoaHoc}`), 2200);
            } else {
                console.log("Lỗi khi xóa chương");
                return; 
            }
        } catch (error) {
            console.log("Lỗi: ", error);
        }
    }

    // blur
    const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const input = event.target;
        const formErr = input.parentElement?.querySelector(".lesson-form__text") as HTMLElement | null;

        if (formErr) {
            formErr.style.display = input.value.trim() ?  "none" : "block";
        }
    }
    
    // reset
    const handleResetForm = () => {
        setTenChuongHoc(""); 
    
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
    
    // Ẩn hiện model
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const [isModelSuccessfulModelOpen, setIsModelSuccessfulModelOpen] = useState(false);
    const handleOpenSuccessModel = () => {
        setIsModelSuccessfulModelOpen(true);
    }

    const handleCloseSuccessModel = () => {
        setIsModelSuccessfulModelOpen(false);
    }

    const [isModelDeleteOpen, setIsModelDeleteOpen] = useState(false);
    const handleOpenDeleteModel = () => {
        setIsModelDeleteOpen(true);
    }

    const handleCloseDeleteModel = () => {
        setIsModelDeleteOpen(false);
    }

    const [isModelDelSuccessfullOpen, setIsModelDelSuccessfullOpen] = useState(false);
    const handleOpenDelSuccessModel = () => {
        setIsModelDelSuccessfullOpen(true);
    }

    const handleCloseDelSuccessModel = () => {
        setIsModelDelSuccessfullOpen(false);
    }
    
    return (
        <div className="update-lesson__wrapper">
            <Header title="Thông tin chương"></Header>
            <AdminNav></AdminNav>

            <div className="update-lesson__inner">
                <form onSubmit={handleUpdateLesson} action="" className="update-lesson__form">
                    <div className="lesson-form__inner">
                        <div className="lesson-form__group">
                            <label htmlFor="ID" className="lesson-form__label">Mã chương</label>
                            <input name="ID" type="text" className="lesson-form__input input-readOnly" required readOnly onBlur={handleBlur} value={maChuongHoc}/>
                        </div>
                            
                        <div className="lesson-form__group">
                            <label htmlFor="nameCourse" className="lesson-form__label">Khóa học</label>
                            <input name="nameCourse" type="text" className="lesson-form__input input-readOnly" required readOnly onBlur={handleBlur} value={tenKhoaHoc} onChange={(e) => setTenKhoaHoc(e.target.value)}/>
                        </div>

                        <div className="lesson-form__group">
                            <label htmlFor="nameLesson" className="lesson-form__label">Tên chương</label>
                            <input name="nameLesson" type="text" className="lesson-form__input" onBlur={handleBlur} value={tenChuongHoc} onChange={(e) => setTenChuongHoc(e.target.value)}/>
                            <span className="lesson-form__text">Vui lòng nhập tên chương</span>
                        </div>
                    </div>

                    <div className="lesson-form__action"> 
                        <Button type="button" className="btn-add" onClick={handleOpen}>Lưu lại</Button>
                        <Button type="button" className="btn-new button-secondary button" onClick={handleResetForm}>Làm mới</Button>
                        <Button type="button" className="btn-cancle button-third button" onClick={handleOpenDeleteModel}>Xóa chương</Button>
                    </div>

                    {isModalOpen && (
                        <ModelOverlay
                            className="model-image_second"
                            icon="Question.svg"
                            secondOption="Hủy bỏ" 
                            title="Sửa tên chương"
                            desc="Bạn có chắc chắn muốn sửa tên chương không?"
                            onClose={handleClose}>
                            <Button type="submit">Lưu lại</Button>
                        </ModelOverlay>
                    )}
                </form>
            </div>

            {isModelSuccessfulModelOpen && (
                <ModelOverlay
                    className="model-image_third"
                    icon="Successful.svg"
                    secondOption=""
                    title="Sửa tên chương"
                    desc="Cập nhật tên chương thành công!"
                    onClose={handleCloseSuccessModel}
                    children="">
                </ModelOverlay>
            )}

            {isModelDeleteOpen && (
                <ModelOverlay
                    className="model-image"
                    icon="Exclamation.svg"
                    secondOption="Hủy bỏ" 
                    title="Xóa chương"
                    desc="Bạn có chắc chắn muốn xóa chương không?"
                    onClose={handleCloseDeleteModel}>
                    <Button type="submit" className="button-delete" onClick={handleDeleteLesson}>Xóa chương</Button>
                </ModelOverlay>
            )}

            {isModelDelSuccessfullOpen && (
                <ModelOverlay
                    className="model-image_third"
                    icon="Successful.svg"
                    secondOption=""
                    title="Xóa chương"
                    desc="Xóa thông tin chương thành công!"
                    onClose={handleCloseDelSuccessModel}
                    children="">
                </ModelOverlay>
            )}
        </div>
    );
}