import { useNavigate } from "react-router-dom";
import "../styles/blogCard.css";
import type { articles } from "../types/articles";
import { convert } from "html-to-text";

// ✅ Hàm xử lý HTML an toàn cho SSR
const extractTextFromHtml = (html: string, maxLength: number = 150): string => {
  const plainText = convert(html, {
    wordwrap: false,
    selectors: [
      { selector: "img", format: "skip" } // bỏ ảnh
    ],
  });

  return plainText.length > maxLength ? plainText.slice(0, maxLength) + "..." : plainText;
};

const BlogCard: React.FC<articles> = ({
  maBaiViet,
  hinhAnh,
  tenBaiViet,
  noiDung,
  tenNguoiDung,
}) => {
  const navigate = useNavigate();

  const handleArticlesClick = () => {
    navigate(`/read-blog/${maBaiViet}`);
  };

  return (
    <div className="blog-card" onClick={handleArticlesClick}>
      <img src={hinhAnh} alt="thumbnail" className="blog-thumb" />

      <div className="blog-container">
        <h2 className="blog-title">{tenBaiViet}</h2>

        <p className="blog-demo">{extractTextFromHtml(noiDung)}</p>
      </div>
    </div>
  );
};

export default BlogCard;
