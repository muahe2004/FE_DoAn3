import React, { useState } from "react";
import MDEditor, { type ICommand, commands } from "@uiw/react-md-editor";
import Header from "~/components/Header";

import "../styles/blog.css";

const Blog: React.FC = () => {
    const [value, setValue] = useState<string>("");

    const customImageCommand: ICommand = {
        ...commands.image, // kế thừa toàn bộ icon và keyCommand
        execute: (state, api) => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = () => {
            const file = input.files?.[0];
            if (file) {
                api.replaceSelection(`**[Đã chọn ảnh: ${file.name}]**`);
            }
            };
            input.click();
        },
    };

    return (
        <div data-color-mode="blog-wrapper">
            <Header className="header-admin" title="Quản lý người dùng" />


            <div className="blog-container">
                <input className="blog-input" placeholder="Tiêu đề của blog.." type="text" />
                <MDEditor data-color-mode="light"
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
        </div>
    );
};

export default Blog;
