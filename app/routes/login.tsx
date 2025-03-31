
import { useEffect, useState } from "react";
import {  Link, useParams, useNavigate } from "react-router-dom";
import Button from "~/components/Button";

import "../styles/login.css";


export default function Login() {
    const navigate = useNavigate(); 



    const isEmailValid = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };
      
      const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const input = event.target;
        const formErr = input.parentElement?.querySelector(".login-text") as HTMLElement | null;
      
        if (formErr) {
          if (input.type === "email") {
            formErr.style.opacity = isEmailValid(input.value.trim()) ? "0" : "1";
          } else {
            formErr.style.opacity = input.value.trim() ? "0" : "1";
          }
        }
    };

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;

        const email = form.querySelector<HTMLInputElement>('input[name="email"]');
        const password = form.querySelector<HTMLInputElement>('input[name="password"]');

        const showError = (input: HTMLInputElement | null, message: string) => {
            if (input) {
              const formText = input.parentElement?.querySelector<HTMLElement>(".login-text");
              if (formText) {
                formText.innerText = message;
                formText.style.opacity = "1";
              }
              input.focus();
            }
        };

        if (!email?.value.trim()) {
            showError(email, "Email không hợp lệ!");
            return;
        }

        if (!password?.value.trim()) {
            showError(password, "Mật khẩu không được để trống!");
            return;
        }

        const body = {
            email: email.value.trim(),
            matKhau: password.value.trim()
        }

        // console.log(body);

        try {
            const res = await fetch("http://localhost:1000/login", {
                method: "POST",
                credentials: "include", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
              })
              if (res.ok) {
                await getUserInfo(body.email);
                await getRole();
                // navigate("/");
              } else {
                console.error("Lỗi khi đăng nhập:", await res.text());
            }
        } catch (err) {
            console.log("Lỗi: ", err);
        }
    }

    const getUserInfo = async (email: string) => {
        try {
            const response = await fetch(`http://localhost:1000/users/${encodeURIComponent(email)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
    
            if (!response.ok) throw new Error("Lỗi khi lấy thông tin!");
    
            const data = await response.json();
            localStorage.setItem("userInfo", JSON.stringify(data));
        } catch (err) {
            console.error("Lỗi:", err);
        }
    };
    
    const getRole = async () => {
        try {
            const res = await fetch("http://localhost:1000/role", { 
                method: "GET",
                credentials: "include",
            });
    
            if (!res.ok) throw new Error("Lỗi khi lấy vai trò!");
    
            const data = await res.json();

            if (data.role !== "Admin") {
                navigate("/");
            } else {
                navigate("/admin");
            }
            
        } catch (err) {
            console.error("Lỗi:", err);
        }
    };
    
      

  return (
    <div className="login-wrapper">
    
        <div className="login-inner">
            <h1 className="login-title">Đăng nhập</h1>

            <form onSubmit={handleLogin} action="" className="login-form">
                {/* Tài khoản */}
                <div className="login-group">
                    <label htmlFor="email" className="login-label">Email</label>
                    <input name="email" type="email" className="login-input" onBlur={handleBlur}/>
                    <span className="login-text">Email không hợp lệ</span>
                </div>
                {/* Mật khẩu */}
                <div className="login-group">
                    <label htmlFor="password" className="login-label">Mật khẩu</label>
                    <input name="password" type="password" className="login-input" onBlur={handleBlur}/>
                    <span className="login-text">Mật khẩu không được để trống</span>
                </div>

                <Button className="login-btn" type="submit" to="">Đăng nhập</Button>
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
