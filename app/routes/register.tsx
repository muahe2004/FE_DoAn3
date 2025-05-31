import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "~/components/Button";

import "../styles/register.css";
import "../styles/Responsive/register.css";

export default function Register() {
  const navigate = useNavigate();

  // State để lưu mật khẩu và thông báo lỗi
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Hàm kiểm tra email hợp lệ
  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Hàm kiểm tra mật khẩu nhập lại có khớp không
  const isPasswordMatch = (confirmPass: string): boolean => {
    return confirmPass.trim() === password;
  };

  // Xử lý khi blur (rời khỏi input)
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const input = event.target;
    const formErr = input.parentElement?.querySelector(".register-text") as HTMLElement | null;

    if (formErr) {
      if (input.type === "email") {
        formErr.style.opacity = isEmailValid(input.value.trim()) ? "0" : "1";
      } else if (input.name === "re-password") {
        const isMatch = isPasswordMatch(input.value);
        formErr.style.opacity = isMatch ? "0" : "1";
      } else {
        formErr.style.opacity = input.value.trim() ? "0" : "1";
      }
    }
  };

  // Đăng ký
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const name = form.querySelector<HTMLInputElement>('input[name="name"]');
    const email = form.querySelector<HTMLInputElement>('input[name="email"]');
    const password = form.querySelector<HTMLInputElement>('input[name="password"]');
    const confirmPasswordInput = form.querySelector<HTMLInputElement>('input[name="re-password"]');
    const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');

    const showError = (input: HTMLInputElement | null, message: string) => {
      if (input) {
        const formText = input.parentElement?.querySelector<HTMLElement>(".register-text");
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

    if (!name?.value.trim()) {
      showError(name, "Tên người dùng không hợp lệ!");
      return;
    }

    if (!password?.value.trim()) {
      showError(password, "Mật khẩu không được để trống!");
      return;
    }

    if (!confirmPasswordInput?.value.trim() || password.value.trim() !== confirmPasswordInput.value.trim()) {
      showError(confirmPasswordInput, "Mật khẩu nhập lại không khớp!");
      return;
    }

    const body = {
      tenNguoiDung: name.value.trim(),
      email: email.value.trim(),
      matKhau: password.value.trim()
    };

    // Vô hiệu hóa nút đăng ký để tránh gửi nhiều lần
    if (submitButton) submitButton.disabled = true;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        Login(email.value.trim(), password.value.trim());
      } else if (res.status === 409) {
        showError(email, "Email này đã được sử dụng!");
      } else {
        const errorMessage = await res.text();
        console.error("Lỗi khi đăng ký:", errorMessage);
        alert("Đăng ký thất bại, vui lòng thử lại!");
      }
    
    } catch (err) {
      console.log("Lỗi: ", err);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  };

  const Login = async (email: string, password: string) => {

    const body = {
      email: email,
      matKhau: password
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        credentials: "include", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await getUserInfo(body.email);
        await getRole();
      } else {
        console.error("Lỗi khi đăng nhập:", await res.text());
      }
    } catch (err) {
        console.error("Lỗi:", err);
    }
  };

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
    <div className="register-wrapper">
      <div className="register-inner">
        <h1 className="register-title">Đăng ký</h1>

        <form onSubmit={handleRegister} action="" className="register-form">
          <div className="register-form__container">
            {/* Email */}
            <div className="register-group">
              <label htmlFor="email" className="register-label">Email</label>
              <input name="email" type="email" className="register-input" onBlur={handleBlur} />
              <span className="register-text">Email không hợp lệ</span>
            </div>

            {/* Tên người dùng */}
            <div className="register-group">
              <label htmlFor="name" className="register-label">Tên người dùng</label>
              <input name="name" type="text" className="register-input" onBlur={handleBlur} />
              <span className="register-text">Tên người dùng không được để trống!</span>
            </div>

            {/* Mật khẩu */}
            <div className="register-group">
              <label htmlFor="password" className="register-label">Mật khẩu</label>
              <input 
                name="password" 
                type="password" 
                className="register-input" 
                onBlur={handleBlur} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <span className="register-text">Mật khẩu không được để trống</span>
            </div>

            {/* Nhập lại mật khẩu */}
            <div className="register-group">
              <label htmlFor="re-password" className="register-label">Nhập lại mật khẩu</label>
              <input 
                name="re-password" 
                type="password" 
                className="register-input" 
                onBlur={handleBlur} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
              <span className="register-text">Mật khẩu nhập lại không khớp!</span>
            </div>
          </div>

          <Button className="register-btn" type="submit" to="">Đăng ký</Button>

          <Link to="/login" className="register-btnSignUp">Đăng nhập</Link>
        </form>
      </div>
    </div>
  );
}
