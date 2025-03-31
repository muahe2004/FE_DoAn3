
import { useEffect, useState } from "react";
import {  Link, useParams, useNavigate } from "react-router-dom";
import Button from "~/components/Button";

import "../styles/login.css";


export default function CourseDetails() {


    useEffect(() => {
        fetch(`http://localhost:1000/login`, {
            method: "POST",  
            credentials: "include", 
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({ email: "lyvanminh@gmail.com", matKhau: "muahe2004" }) 
        })
        .then(res => res.json())
        .catch(err => console.error("Lỗi:", err));
    }, []);

    const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const input = event.target;
        const formErr = input.parentElement?.querySelector(".lecture-form__text") as HTMLElement | null;
    
        if (formErr) {
          formErr.style.display = input.value.trim() ?  "none" : "block";
        }
      }

  return (
    <div className="login-wrapper">
    
        <div className="login-inner">
            <h1 className="login-title">Đăng nhập</h1>

            <form action="" className="login-form">
                {/* Tài khoản */}
                <div className="login-group">
                    <label htmlFor="name" className="login-label">Email</label>
                    <input name="name" type="text" className="login-input" onBlur={handleBlur}/>
                    <span className="login-text">Email không được để trống</span>
                </div>
                {/* Mật khẩu */}
                <div className="login-group">
                    <label htmlFor="name" className="login-label">Mật khẩu</label>
                    <input name="name" type="text" className="login-input" onBlur={handleBlur}/>
                    <span className="login-text">Mật khẩu không được để trống</span>
                </div>

                <Button className="login-btn" type="button" to="">Học ngay bây giờ</Button>
                <Button className="login-btn login-google" to="">
                    <img className="login-icon" src="./icons/Google.svg" alt="" />
                    Đăng nhập bằng Google
                </Button>

                <Link to="" className="login-btnSignUp">Đăng ký</Link>
            </form>
        </div>
    </div>
    
  );
}
