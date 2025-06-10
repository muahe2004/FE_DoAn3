import React, { useState } from "react";
import MDEditor, { type ICommand, commands } from "@uiw/react-md-editor";
import Header from "~/components/Header";
import "../styles/blog.css";

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
    </div>
  );
};

export default Blog;