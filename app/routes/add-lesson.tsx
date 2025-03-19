

import { useEffect, useState } from "react";
import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import AdminCourse from "~/components/Admin/Course";

import "../styles/Admin/admin.css";

import { Link } from "react-router-dom";


export default function AddLesson() {
  return (
    <div>
        <Header title="Thêm chương học"></Header>
        <AdminNav></AdminNav>
      
    </div>
    
  );
}
