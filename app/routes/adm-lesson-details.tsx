import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import Button from "~/components/Button";

import "../styles/Admin/add-lesson.css";
import "../styles/Admin/adm-lesson-details.css";

import { useParams } from "react-router";
import PopUp from "~/components/PopUp";

export default function AdminLessonDetails() {
    const navigate = useNavigate();

    const {maChuongHoc} = useParams();
    const [tenChuongHoc, setTenChuongHoc] = useState("");
    const [maKhoaHoc, setMaKhoaHoc] = useState("");
    const [tenKhoaHoc, setTenKhoaHoc] = useState("");
    

    // thông tin chương học
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/lessons/${maChuongHoc}`)
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
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lessons/${maChuongHoc}`, {
                method: "PUT",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(body)
            });

            if (res.ok) {
                handleCloseUpdate();
                handleOpenUpdateDone();
                setTimeout(() => handleCloseUpdateDone(), 2300);
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/lessons/${maChuongHoc}`, {
                method: "DELETE",
            });
        
            if (response.ok) {
                console.log("Xóa thành công");
                handleCloseDelete();
                handleOpenDeleteDone();
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

    return (
        <div className="update-lesson__wrapper">
            <Header className="header-admin" title="Thông tin chương"></Header>
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

                    <div className="lesson-form__action lesson-details__form--action "> 
                        <Button type="button" className="btn-add" onClick={handleOpenUpdate}>Lưu lại</Button>
                        <Button type="button" className="btn-new button-secondary button" onClick={handleResetForm}>Làm mới</Button>
                        <Button type="button" className="btn-cancle button-third button" onClick={handleOpenDelete}>Xóa chương</Button>
                    </div>

                    <PopUp 
                        icon={"Question.svg"} 
                        secondOption={"Hủy bỏ"} 
                        title={"Sửa chương học"} 
                        desc={"Bạn có chắc chắn muốn sửa chương học không?"} 
                        onOpen={handleCloseUpdate}
                        isClosed={isClosedUpdate}
                        className="popup-update"
                        // timeCount={3}
                    >
                        <Button type="submit">Sửa</Button>
                    </PopUp>
                </form>
            </div>

            <PopUp 
                icon={"Question.svg"} 
                secondOption={"Hủy bỏ"} 
                title={"Xóa chương học"} 
                desc={"Bạn có chắc chắn muốn xóa chương học không?"} 
                onOpen={handleCloseDelete}
                isClosed={isClosedDelete}
                className="popup-delete"
                timeCount={5}
            >
                <Button type="submit" className="popup-delete_btn" onClick={handleDeleteLesson}>Xóa</Button>
            </PopUp>

            <PopUp 
                icon={"Successful.svg"} 
                // secondOption={"Hủy bỏ"} 
                title={"Sửa chương học"} 
                desc={"Cập nhật thông tin chương học thành công!"} 
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
                title={"Xóa chương học"} 
                desc={"Xóa thông tin chương học thành công!"} 
                onOpen={handleCloseDeleteDone}
                isClosed={isClosedDeleteDone}
                className="popup-done"
                // timeCount={5}
            >
                {/* <Button type="button" onClick={handleCloseUpdateDone}>OK</Button> */}
            </PopUp>
        </div>
    );
}