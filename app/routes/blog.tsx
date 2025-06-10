import React, { useState } from "react";
import MDEditor, { type ICommand, commands } from "@uiw/react-md-editor";
import Header from "~/components/Header";
import "../styles/blog.css";
import Button from "~/components/Button";
import PopUp from "~/components/PopUp";

const Blog: React.FC = () => {
    const [value, setValue] = useState<string>("");

    const customImageCommand: ICommand = {
        ...commands.image,
        execute: (state, api) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                // cần thay thế thành cái apii_domain ở .env
                const response = await fetch("http://localhost:1000/api/cloudinary-upload", {
                method: "POST",
                body: formData,
                });
                const data = await response.json();

                if (response.ok) {
                    // render lại ra giao diện
                    const imageMarkdown = `![${file.name}](${data.imageUrl})`;
                    api.replaceSelection(imageMarkdown); 
                } else {
                console.log("Upload thất bại: ", data.message);
                }
            } catch (error) {
                console.error("Lỗi khi upload ảnh:", error);
            }
            }
        };
        input.click();
        },
    };

    const [isClosedDelete, setIsClosedDelete] = useState(true);
    const handleOpenDelete = () => { setIsClosedDelete(false)};
    const handleCloseDelete = () => { setIsClosedDelete(true)};

    const [isClosedReWrite, setIsClosedReWrite] = useState(true);
    const handleOpenReWrite = () => { setIsClosedReWrite(false)};
    const handleCloseReWrite = () => { setIsClosedReWrite(true)};

    // Cần thực hiến nếu người dùng huỷ thêm thì xoá ảnh ở cloudinary
    // cần thêm chức năng lưu bản nháp
    return (
        <div data-color-mode="blog-wrapper">
            <Header className="header-admin" title="Viết blog" />

            <div className="blog-container">
                <input className="blog-input" placeholder="Tiêu đề của blog.." type="text" />
                <MDEditor
                data-color-mode="light"
                className="mdediter"
                value={value}
                onChange={(val) => setValue(val || "")}
                commands={[
                    commands.bold,
                    commands.italic,
                    commands.strikethrough,
                    commands.hr,
                    commands.title,
                    commands.divider,
                    commands.quote,
                    commands.code,
                    commands.link,
                    customImageCommand,
                    commands.unorderedListCommand,
                    commands.orderedListCommand,
                    commands.checkedListCommand,
                ]}
                />
                
            </div>

            <div className="blog-actions">
                <Button type="submit" className="btn-add">Thêm bài viết</Button>
                <Button className="btn-new button-secondary button" onClick={handleOpenReWrite}>Viết lại</Button>
                <Button className="btn-cancle button-third button" onClick={handleOpenDelete}>Hủy bỏ</Button>
            </div>

            <PopUp 
                icon={"Question.svg"} 
                secondOption={"Viết tiếp"} 
                title={"Huỷ viết blog"} 
                desc={"Bạn có chắc chắc muốn huỷ viết blog không?"} 
                onOpen={handleCloseDelete}
                isClosed={isClosedDelete}
                className="popup-delete"
                timeCount={5}
            >
                <Button type="button" className="popup-delete_btn">Huỷ viết</Button>
            </PopUp>

            <PopUp 
                icon={"Question.svg"} 
                secondOption={"Viết tiếp"} 
                title={"Viết lại bài viết"} 
                desc={"Bạn có chắc chắn muốn viết lại bài viết không?"} 
                onOpen={handleCloseReWrite}
                isClosed={isClosedReWrite}
                className="popup-update"
                timeCount={3}
            >
                <Button type="submit">Viết lại</Button>
            </PopUp>
        </div>
    );
};

export default Blog;