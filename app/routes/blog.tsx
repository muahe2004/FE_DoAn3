import React, { useState } from "react";
import MDEditor, { type ICommand, commands } from "@uiw/react-md-editor";
import Header from "~/components/Header";
import "../styles/blog.css";
import Button from "~/components/Button";
import PopUp from "~/components/PopUp";
import { marked } from "marked";

const Blog: React.FC = () => {
    const [content, setContent] = useState<string>("");
    const [title, setTitle] = useState<string>("");

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
            console.log("Tên file đã chọn:", file.name); // 👈 Dòng log tên file

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cloudinary-upload`, {
                    method: "POST",
                    body: formData,
                });
                const data = await response.json();

                if (response.ok) {
                    // render lại ra giao diện
                    const imageHTML = `<img class="blog-image" src="${data.imageUrl}" alt="${file.name}" />`;
                    api.replaceSelection(imageHTML);
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

    // ⚙️ Cấu hình thêm class vào các thẻ
    marked.use({
        renderer: {
            paragraph(token) {
                return `<p class="my-paragraph">${token.text}</p>`;
            },
            image(token) {
                return `<img src="${token.href}" alt="${token.text || ''}" class="blog-image" />`;
            },
            heading(token) {
                return `<h${token.depth} class="my-heading h${token.depth}">${token.text}</h${token.depth}>`;
            }
        }
    });


    const handleAddBlog = async () => {

        if (!title || title === "") {
            console.log("Chưa có tiêu đề cho bài viết.");
            return;
        }

        const htmlContent = marked.parse(content); // <-- CHUYỂN Markdown => HTML

        if (!content || content === "") {
            console.log("Chưa có nội dung cho bài viết.");
            return;
        }

        const userInfoStr = localStorage.getItem("userInfo");
        if (!userInfoStr) {
            console.log("Không tìm thấy thông tin người dùng trong localStorage.");
            return;
        }
        const userInfo = JSON.parse(userInfoStr);
        const maNguoiDung = userInfo.maNguoiDung;

        // ✅ Kiểm tra ảnh trong content
        const containsImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(content) || /!\[.*?\]\((.*?)\)/.test(content);

        // if (!containsImage) {
        //     console.log(" Nội dung KHÔNG chứa ảnh nào.");
        //     return;
        // }

        let firstImageUrl = null;
        const markdownImgMatch = content.match(/!\[.*?\]\((.*?)\)/);
        if (markdownImgMatch) {
            firstImageUrl = markdownImgMatch[1];
        }
        if (!firstImageUrl) {
            const htmlImgMatch = content.match(/<img\s+[^>]*src=["']([^"']+)["']/i);
            if (htmlImgMatch) {
            firstImageUrl = htmlImgMatch[1];
            }
        }
        if (!firstImageUrl) {
            console.log("Không trích xuất được URL ảnh.");
            return;
        }

        const body = {
            tenBaiViet: title,
            noiDung: htmlContent,
            hinhAnh: firstImageUrl,
            maNguoiDung: maNguoiDung
        }

        console.log(htmlContent);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/articles`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
            if (res.ok) {
                handleOpenAddDone();
                setTimeout(() => handleCloseAddDone(), 2300);
                console.log("Thêm bài viết thành công!");
            } else {
                console.error("Lỗi thêm bài viết:", await res.text());
            }
        } catch (error) {
            console.error("Lỗi: ", error);
        }
    }

    // Ẩn hiện PopUp
    const [isClosedAddDone, setIsClosedAddDone] = useState(true);
    const handleOpenAddDone = () => { setIsClosedAddDone(false)};
    const handleCloseAddDone = () => { setIsClosedAddDone(true)};

    // Cần thực hiến nếu người dùng huỷ thêm thì xoá ảnh ở cloudinary
    // cần thêm chức năng lưu bản nháp
    return (
        <div data-color-mode="blog-wrapper">
            <Header className="header-admin" title="Viết blog" />

            <div className="blog-container">
                <input 
                    className="blog-input" 
                    placeholder="Tiêu đề của blog.." 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <MDEditor
                    data-color-mode="light"
                    className="mdediter"
                    value={content}
                    onChange={(val) => setContent(val || "")}
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
                <Button type="button" className="btn-add" onClick={handleAddBlog}>Thêm bài viết</Button>
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

            <PopUp 
                icon={"Successful.svg"} 
                // secondOption={"Hủy bỏ"} 
                title={"Thêm bài viết"} 
                desc={"Thêm bài viết thành công!"} 
                onOpen={handleCloseAddDone}
                isClosed={isClosedAddDone}
                className="popup-done"
                // timeCount={5}
                >
                {/* <Button type="button" onClick={handleCloseUpdateDone}>OK</Button> */}
            </PopUp>
        </div>
    );
};

export default Blog;