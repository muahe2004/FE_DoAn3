
import { useEffect, useState } from "react";
import {  Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "~/components/Navbar";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Button from "~/components/Button";




export default function CourseDetails() {


    useEffect(() => {
        fetch(`http://localhost:1000/login`, {
            method: "POST",  // Vì API đăng nhập thường là POST
            credentials: "include", // Bắt buộc để gửi cookies lên server
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "phanNgocLinh@gmail.com", matKhau: "123456" }) 
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("Phản hồi từ server:", data);
        })
        .catch((err) => console.error("Lỗi:", err));
    }, []);
    



    

  return (
    <div className="">
        <Navbar></Navbar>
        <Header title="Đăng nhập"></Header>
    
        

        <Footer title=""></Footer>
    </div>
    
  );
}
