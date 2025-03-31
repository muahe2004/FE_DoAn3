
import { useEffect, useState } from "react";
import {  Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "~/components/Navbar";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Button from "~/components/Button";




export default function CourseDetails() {


    useEffect(() => {
        fetch(`http://localhost:1000/login`, {
            method: "POST",  
            credentials: "include", 
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({ email: "lyvanminh@gmail.com", matKhau: "muahe2004" }) 
        })
        .then(res => res.json())
        .then(data => {
            // getRole();  
        })
        .catch(err => console.error("Lỗi:", err));
    }, []);

    // const getRole = () => {
    //     fetch('http://localhost:1000/role', {
    //         method: 'GET',
    //         credentials: 'include' 
    //     })
    //     .then(response => response.json())
    //     .then(data => console.log(data))
    //     .catch(error => console.error('Lỗi:', error));
    // };

    
    

  return (
    <div className="">
        <Navbar></Navbar>
        <Header title="Đăng nhập"></Header>
    
        

        <Footer></Footer>
    </div>
    
  );
}
