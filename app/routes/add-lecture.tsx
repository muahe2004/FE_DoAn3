

import { useEffect, useState } from "react";
import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import AdminCourse from "~/components/Admin/Course";
import ModelOverlay from "~/components/OverlayModel";

import "../styles/Admin/admin.css";

import { Link } from "react-router-dom";
import Button from "~/components/Button";


export default function AddLecture() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
        <Header title="Thêm bài học"></Header>
        <AdminNav></AdminNav>
      
        <ModelOverlay 
          icon="Exclamation.svg"
          secondOption="Giữ lại."
          title="Xóa khóa học"
          desc="Bạn có chắc chắn muốn xóa khóa học không ?"
        >
            <Button className="button-delete" children="Xóa khóa học"></Button>
        </ModelOverlay>

    </div>
    
  );
}
