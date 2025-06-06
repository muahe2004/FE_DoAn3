
import { useEffect, useState } from "react";
import {  Link, useParams, useNavigate } from "react-router-dom";
import Button from "~/components/Button";

import "../styles/login.css";
import "../styles/Responsive/login.css";

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
            if (input.name === "email") {
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

        const showError = (input: HTMLInputElement | null, message: string, focus: boolean = false): void => {
            if (input) {
                const formText = input.parentElement?.querySelector<HTMLElement>(".login-text");
                if (formText) {
                    formText.innerText = message;
                    formText.style.opacity = "1";
                }
                if (focus) {
                    input.focus();
                }
            }
        };

        if (!email?.value.trim()) {
            showError(email, "Email không được để trống!", true);
            return;
        }

        if (!isEmailValid(email.value.trim())) {
            showError(email, "Email không hợp lệ!", true);
            return;
        }

        if (!password?.value.trim()) {
            showError(password, "Mật khẩu không được để trống!", true);
            return;
        }

        const body = {
            email: email.value.trim(),
            matKhau: password.value.trim()
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: "POST",
                credentials: "include", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
            if (res.ok) {
                await getUserInfo(body.email);
                await getRole();
            } else {
                showError(email, "Sai email hoặc mật khẩu!");
                showError(password, "Sai email hoặc mật khẩu!");
                return;
            }
        } catch (err) {
            console.log("Lỗi: ", err);
        }
    }

    const getUserInfo = async (email: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${encodeURIComponent(email)}`, {
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
            const res = await fetch(`${import.meta.env.VITE_API_URL}/role`, { 
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
                    {/* Email */}
                    <div className="login-group">
                        <label htmlFor="email" className="login-label">Email</label>
                        <input name="email" type="text" className="login-input" onBlur={handleBlur}/>
                        <span className="login-text">Email không hợp lệ</span>
                    </div>
                    {/* Mật khẩu */}
                    <div className="login-group">
                        <label htmlFor="password" className="login-label">Mật khẩu</label>
                        <input name="password" type="password" className="login-input" onBlur={handleBlur}/>
                        <span className="login-text">Mật khẩu không được để trống</span>
                    </div>

                    <Button className="login-btn" type="submit" to="">Đăng nhập</Button>
                    <Button
                        className="login-btn login-google"
                        onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
                        >
                        <img className="login-icon" src="./icons/Google.svg" alt="" />
                        Đăng nhập bằng Google
                    </Button>

                    <Link to="/register" className="login-btnSignUp">Đăng ký</Link>
                </form>
            </div>
        </div>
    );
}
