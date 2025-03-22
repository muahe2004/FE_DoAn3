

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
      
        

    </div>
    
  );
}
