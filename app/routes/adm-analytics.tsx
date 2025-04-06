import { data, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { TooltipProps } from 'recharts';

import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import "../styles/Admin/adm-analytics.css";

const fakeValue = [
  {
    maKhoaHoc: "KH010",
    tenKhoaHoc: "Khóa học free 4",
    soLuongHocVien: 3,
  },
  {
    maKhoaHoc: "KH001",
    tenKhoaHoc: "Lập trình Python cơ bản",
    soLuongHocVien: 2,
  },
  {
    maKhoaHoc: "KH002",
    tenKhoaHoc: "Lập trình Javascrips cơ bản",
    soLuongHocVien: 2,
  },
  {
    maKhoaHoc: "KH003",
    tenKhoaHoc: "Test cơ bản",
    soLuongHocVien: 2,
  },
  {
    maKhoaHoc: "KH005",
    tenKhoaHoc: "Lập trình C++ cơ bản",
    soLuongHocVien: 2,
  },
  {
    maKhoaHoc: "KH007",
    tenKhoaHoc: "Khóa học free 1",
    soLuongHocVien: 2,
  },
  {
    maKhoaHoc: "KH008",
    tenKhoaHoc: "Khóa học free 2",
    soLuongHocVien: 1,
  },
  {
    maKhoaHoc: "KH009",
    tenKhoaHoc: "Khóa học free 3",
    soLuongHocVien: 1,
  },
  {
    maKhoaHoc: "KH010",
    tenKhoaHoc: "Khóa học free 4",
    soLuongHocVien: 1,
  },
  {
    maKhoaHoc: "KH011",
    tenKhoaHoc: "Khóa học free 5",
    soLuongHocVien: 2,
  },
  {
    maKhoaHoc: "KH010",
    tenKhoaHoc: "Khóa học free 4",
    soLuongHocVien: 1,
  },
  {
    maKhoaHoc: "KH011",
    tenKhoaHoc: "Khóa học free 5",
    soLuongHocVien: 4,
  },
  
];

const fakeDoanhThu = [
  { thang: '1', doanhThu: 8500000 },
  { thang: '2', doanhThu: 12300000 },
  { thang: '3', doanhThu: 9750000 },
  { thang: '4', doanhThu: 15000000 },
  { thang: '5', doanhThu: 11200000 },
  { thang: '6', doanhThu: 13800000 },
  { thang: '7', doanhThu: 7900000 },
  { thang: '8', doanhThu: 16400000 },
  { thang: '9', doanhThu: 14200000 },
  { thang: '10', doanhThu: 18000000 },
  { thang: '11', doanhThu: 19500000 },
  { thang: '12', doanhThu: 20000000 },
];

const fakeMost = [
  { tenKhoaHoc: "Khóa 1", soHocVien: 120},
  { tenKhoaHoc: "Khóa 2", soHocVien: 100},
  { tenKhoaHoc: "Khóa 3", soHocVien: 70},
  { tenKhoaHoc: "Khóa 4", soHocVien: 60},
  { tenKhoaHoc: "Khóa 5", soHocVien: 30},
]

const colors = ['#005fa3', '#4da674', '#f1ac20', '#e95354', '#21a2ff'];



// Tooltip custom 
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #21a2ff",
          padding: "10px",
          borderRadius: "5px",
          color: "#333",
          fontWeight: "bold",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}
      >
        <p>Tháng {label}</p>
        <p>Doanh thu: {payload[0].value?.toLocaleString()}₫</p>
      </div>
    );
  }

  return null;
};


export default function Analytics() {
  // doanh thu 12 tháng
  const [benefit, setBenefit] = useState([])
  useEffect(() => {
    fetch(`http://localhost:1000/courses/benefit/12`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setBenefit(data)
      })
  }, []);

  // 5 khóa nhiều học viên nhất
  const [most, setMost] = useState([]);
  useEffect(() => {
    fetch('http://localhost:1000/courses/most')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMost(data);
      })
  }, [])

  // số học viên
  const [students, setStudent] = useState(0);
  useEffect(() => {
    fetch('http://localhost:1000/courses/sum-student')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setStudent(data);
      })
  }, [])

  // số khóa vip
  const [vipCourses, setVipCourses] = useState(0);
  useEffect(() => {
    fetch('http://localhost:1000/api/courses/count-vip')
      .then((res) => res.json())
      .then((data) => {console.log(data); setVipCourses(data);});
  })

  // số khóa free
  const [freeCourses, setFreeCourses] = useState(0);
  useEffect(() => {
    fetch('http://localhost:1000/api/courses/count-free')
      .then((res) => res.json())
      .then((data) => {console.log(data); setFreeCourses(data);});
  })

  // tổng doanh thu
  const [sumBenefit, setSumBenefit] = useState(0);
  useEffect(() => {
    fetch('http://localhost:1000/courses/sum-benefit')
      .then((res) => res.json())
      .then((data) => {console.log(data); setSumBenefit(data);})
  })

  const formattedMoney = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(sumBenefit);
  

  // Random màu
  const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  };
      
  return (
    <div className="analytics-wrapper">
      <Header title="Thống kê" />
      <AdminNav />

      <div className="analytics-inner">
        <div className="analytics-containers">
            <div className="analytics-containers__item">
              <span className="analytics-containers__title">Khóa học free</span>
              <span className="analytics-containers__value">{freeCourses}</span>
            </div>

            <div className="analytics-containers__item analytics-containers__item--second"> 
              <span className="analytics-containers__title">Khóa học vip</span>
              <span className="analytics-containers__value">{vipCourses}</span>
            </div>

            <div className="analytics-containers__item analytics-containers__item--third">
              <span className="analytics-containers__title">Học viên</span>
              <span className="analytics-containers__value">{students}</span>
            </div>

            <div className="analytics-containers__item analytics-containers__item--fourth">
              <span className="analytics-containers__title analytics-containers__title--fourth">Doanh thu</span>
              <span className="analytics-containers__value analytics-containers__value--fourth">{formattedMoney}</span>
            </div>
        </div>

        <div className="analytics-content">
          {/* Cột */}
          <div className="analytics-chart__column">
            <ResponsiveContainer width="100%">
              <BarChart data={benefit}  margin={{ top: 20, right: 0, left: 50, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="thang" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="doanhThu" 
                  fill="#a4d8fd" 
                  barSize={30} 
                  stroke="#21a2ff"          
                  strokeWidth={2}        
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tròn */}
          <div className="analytics-chart__wheel">
            <h2 className="analytics-chart__title">Top 5 khóa học hot nhất</h2>
            <ResponsiveContainer width="100%">
              <PieChart>
                <Pie
                  data={most}
                  dataKey="soHocVien"
                  nameKey="tenKhoaHoc"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label
                >
                  {most.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
