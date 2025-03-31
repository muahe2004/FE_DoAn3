
import { useEffect, useState } from "react";
import {  Link, useParams, useNavigate } from "react-router-dom";
import Button from "~/components/Button";

import "../styles/register.css";


export default function Register() {
    const navigate = useNavigate(); 



    const isEmailValid = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };
      
      const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const input = event.target;
        const formErr = input.parentElement?.querySelector(".register-text") as HTMLElement | null;
      
        if (formErr) {
          if (input.type === "email") {
            formErr.style.opacity = isEmailValid(input.value.trim()) ? "0" : "1";
          } else {
            formErr.style.opacity = input.value.trim() ? "0" : "1";
          }
        }
    };
    

  return (
    <div className="register-wrapper">
    
        <div className="register-inner">
            <h1 className="register-title">Đăng ký</h1>

            <form action="" className="register-form">
                <div className="register-form__container">
                    {/* Tài khoản */}
                    <div className="register-group">
                        <label htmlFor="email" className="register-label">Email</label>
                        <input name="email" type="email" className="register-input" onBlur={handleBlur}/>
                        <span className="register-text">Email không hợp lệ</span>
                    </div>

                    {/* Tên */}
                    <div className="register-group">
                        <label htmlFor="name" className="register-label">Tên người dùng</label>
                        <input name="name" type="text" className="register-input" onBlur={handleBlur}/>
                        <span className="register-text">Tên người dùng không được để trống!</span>
                    </div>

                    {/* Mật khẩu */}
                    <div className="register-group">
                        <label htmlFor="password" className="register-label">Mật khẩu</label>
                        <input name="password" type="password" className="register-input" onBlur={handleBlur}/>
                        <span className="register-text">Mật khẩu không được để trống</span>
                    </div>

                    {/* nhập lại mật khẩu */}
                    <div className="register-group">
                        <label htmlFor="re-password" className="register-label">Nhập lại mật khẩu</label>
                        <input name="re-password" type="password" className="register-input" onBlur={handleBlur}/>
                        <span className="register-text">Mật khẩu không được để trống</span>
                    </div>
                </div>
                

                <Button className="register-btn" type="submit" to="">Đăng ký</Button>

                <Link to="" className="register-btnSignUp">Đăng nhập</Link>
            </form>
        </div>
    </div>
    
  );
}
