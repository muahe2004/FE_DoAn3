

import { useEffect, useState } from "react";
import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import AdminCourse from "~/components/Admin/Course";

import "../styles/Admin/admin.css";

import { Link } from "react-router-dom";


export default function AdminAnanlysis() {
  return (
    <div>
        <Header title="Thống kê"></Header>
        <AdminNav></AdminNav>
      
    </div>
    
  );
}
