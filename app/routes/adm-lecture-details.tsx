import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import Button from "~/components/Button";

import "../styles/Admin/adm-lecture-details.css";
import "../styles/Admin/add-lecture.css";
import { useParams } from "react-router";
import PopUp from "~/components/PopUp";

export default function AdminLectureDetails() {
    const navigate = useNavigate();

    const {maBaiHoc} = useParams();
    
    const [lessons, setLessons] = useState<{maChuongHoc: string; tenChuongHoc: string} []>([]);

    const [lesson, setLesson] = useState("");
    const [tenBaiHoc, setTenBaiHoc] = useState("");
    const [moTaBaiHoc, setMoTaBaiHoc] = useState("");
    const [video, setVideo] = useState("");
    const [maKhoaHoc, setMaKhoaHoc] = useState("");



    useEffect(() => {
        const fetchLecture = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lectures/${maBaiHoc}`);
                if (res.ok) {
                    const data = await res.json();
                    // console.log(data);
                    setTenBaiHoc(data.tenBaiHoc);
                    setMoTaBaiHoc(data.moTaBaiHoc);
                    setVideo(data.video);
                    setLesson(data.maChuongHoc);
                    setMaKhoaHoc(data.maKhoaHoc);
                } else {
                    console.log("Lỗi khi lấy thông tin bài học!");
                } 
            } catch (error) {
                console.error("Lỗi: ", error);
            }
        };
        fetchLecture();
    }, [maBaiHoc]);
    

    // selection chương
    useEffect(() => {
        const fetchLessons = async () => {
    
          try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/selection-lessons-byLecture/${maBaiHoc}`);
            if (res.ok) {
              const data = await res.json();
              setLessons(data);
            } else {
              console.error("Lỗi khi lấy các chương của khóa học!");
            }
          } catch (error) {
            console.error("Lỗi: ", error);
          }
        };
        fetchLessons();
    }, [maBaiHoc]); 

    // Video
    const handleVideoSrc = (event: React.ChangeEvent<HTMLInputElement>) => {
        const url = event.target.value;
        
        if (url.includes("youtube.com/watch?v=")) {
            const videoId = url.split("v=")[1]?.split("&")[0];
            setVideo(`https://www.youtube.com/embed/${videoId}`);
        } else if (url.includes("youtu.be/")) {
            const videoId = url.split("youtu.be/")[1]?.split("?")[0];
            setVideo(`https://www.youtube.com/embed/${videoId}`);
        } else if (url.includes("youtube.com/embed/")) {
            setVideo(url);
        } else if (!url) {
            setVideo("");
        }
    };
    
    // submit
    const handleUpdateLesson = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
      
        const form = event.currentTarget;
        const lesson = form.querySelector<HTMLSelectElement>('select[name="lesson"]');
        const name = form.querySelector<HTMLInputElement>('input[name="name"]');
        const desc = form.querySelector<HTMLTextAreaElement>('textarea[name="description"]');
        const video = form.querySelector<HTMLInputElement>('input[name="video"]');



        const showError = (input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null, message: string) => {
            if (input) {
              const formErr = input.parentElement?.querySelector(".lecture-form__text") as HTMLElement | null;
              if (formErr) {
                formErr.innerText = message;
                formErr.style.display = "block";
              }
              input.focus();
            }
        }

        if (!lesson?.value.trim()) {
            showError(lesson, "Vui lòng chọn chương!");
            handleCloseUpdate();
            return;
        }

        if (!name?.value.trim()) {
            showError(name, "Vui lòng nhập tên bài học!");
            handleCloseUpdate();
            return;
        }

        if (!desc?.value.trim()) {
            showError(desc, "Vui lòng nhập mô tả bài học!");
            handleCloseUpdate();
            return;
        }

        if (!video?.value.trim()) {
            showError(video, "Vui lòng nhập link video bài học!");
            handleCloseUpdate();
            return;
        }
        

        const body = {
            maChuongHoc: lesson?.value.trim(),
            tenBaiHoc: name.value.trim(),
            moTaBaiHoc: desc?.value.trim(),
            video: video?.value.trim(),
        }
        
        // console.log(body);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lectures/${maBaiHoc}`, {
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
    const handleDeleteLecture = async () => {

        // console.log("Xóa bài học");
        // console.log(maKhoaHoc);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/lectures/${maBaiHoc}`, {
                method: "DELETE",
            });
        
            if (response.ok) {
                handleCloseDelete();
                handleOpenDeleteDone();
                setTimeout(() => navigate(`/admin-course-details/${maKhoaHoc}`), 2300);
            } else {
                console.log("Lỗi khi xóa bài học");
                return; 
            }
        } catch (error) {
            console.log("Lỗi: ", error);
        }
    }

    // blur
    const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const input = event.target;
        const formErr = input.parentElement?.querySelector(".lecture-form__text") as HTMLElement | null;

        if (formErr) {
            formErr.style.display = input.value.trim() ?  "none" : "block";
        }
    }
    
    // reset
    const handleResetForm = () => {
        setTenBaiHoc(""); 
        setMoTaBaiHoc("");
        setVideo("");
        setLesson("");
    
        const form = document.querySelector<HTMLFormElement>(".update-lecture__form");
        if (form) {
            const errorMessages = form.querySelectorAll<HTMLElement>(".lecture-form__text");
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
        <div className="update-lecture__wrapper">
            <Header className="header-admin" title="Thông tin bài học"></Header>
            <AdminNav></AdminNav>

            <div className="update-lecture__inner">
                <form onSubmit={handleUpdateLesson} action="" className="update-lecture__form">
                    <div className="lecture-form__inner">

                        {/* Mã bài học */}
                        <div className="lecture-form__group">
                            <label htmlFor="ID" className="lecture-form__label">Mã bài học</label>
                            <input name="ID" type="text" className="lecture-form__input input-readOnly" readOnly  value={maBaiHoc} />
                            {/* <span className="lecture-form__text">Tên bài học không được để trống</span> */}
                        </div>

                        {/* Chọn chương */}
                        <div className="lecture-form__group">
                            <label htmlFor="lesson" className="lecture-form__label">Chương</label>
                            <select name="lesson" className="lecture-form__input lecture-form__select" value={lesson} onChange={(e) => setLesson(e.target.value)}>
                                <option value="">Chọn chương</option>
                                {lessons.map((lesson) => (
                                    <option key={lesson.maChuongHoc} value={lesson.maChuongHoc}>
                                    {lesson.tenChuongHoc}
                                    </option>
                                ))}
                            </select>
                            <span className="lecture-form__text">Vui lòng chọn chương</span>
                        </div>

                        {/* Tên bài học */}
                        <div className="lecture-form__group">
                            <label htmlFor="name" className="lecture-form__label">Tên bài học</label>
                            <input name="name" type="text" className="lecture-form__input" onBlur={handleBlur} value={tenBaiHoc} onChange={(e) => setTenBaiHoc(e.target.value)}/>
                            <span className="lecture-form__text">Tên bài học không được để trống</span>
                        </div>

                        {/* Mô tả bài học */}
                        <div className="lecture-form__group group-area">
                            <label htmlFor="description" className="lecture-form__label label-area">Mô tả</label>
                            <textarea name="description" className="lecture-form__input form-area" value={moTaBaiHoc} onChange={(e) => setMoTaBaiHoc(e.target.value)} onBlur={handleBlur}></textarea>
                            <span className="lecture-form__text form-text_desc">Vui lòng nhập mô tả cho khóa học</span>
                        </div>

                        {/* Video bài học */}
                        <div className="lecture-form__group">
                            <label htmlFor="video" className="lecture-form__label">Video bài học</label>
                            <input
                                name="video"
                                type="text"
                                className="lecture-form__input input-video"
                                onBlur={handleBlur}
                                value={video}
                                onChange={(e) => {
                                    setVideo(e.target.value);
                                    handleVideoSrc(e);
                                }}
                            />

                            <span className="lecture-form__text">Vui lòng nhập đường dẫn video cho bài học!</span>
                        </div>
                    </div>

                    {/* Video demo */}
                    <div className="update-lecture__video">
                        {video ? (
                            <iframe 
                            className="video-iframe"
                            src={video} 
                            title="YouTube Video"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            ></iframe>
                        ) : (
                            <p className="no-video">Video bài học</p>
                        )}
                    </div>



                    {/* Action */}
                    <div className="lecture-form__action"> 
                        <Button type="button" className="btn-add" onClick={handleOpenUpdate}>Lưu lại</Button>
                        <Button type="button" className="btn-new button-secondary button" onClick={handleResetForm}>Làm mới</Button>
                        <Button type="button" className="btn-cancle button-third button" onClick={handleOpenDelete}>Xóa bài học</Button>
                    </div>

                    <PopUp 
                        icon={"Question.svg"} 
                        secondOption={"Hủy bỏ"} 
                        title={"Sửa bài học"} 
                        desc={"Bạn có chắc chắn muốn sửa bài học không?"} 
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
                title={"Xóa bài học"} 
                desc={"Bạn có chắc chắn muốn xóa bài học không?"} 
                onOpen={handleCloseDelete}
                isClosed={isClosedDelete}
                className="popup-delete"
                timeCount={5}
            >
                <Button type="submit" className="popup-delete_btn" onClick={handleDeleteLecture}>Xóa</Button>
            </PopUp>

            <PopUp 
                icon={"Successful.svg"} 
                // secondOption={"Hủy bỏ"} 
                title={"Sửa bài học"} 
                desc={"Cập nhật thông tin bài học thành công!"} 
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
                title={"Xóa bài học"} 
                desc={"Xóa thông tin bài học thành công!"} 
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