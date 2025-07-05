import { type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"), 
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
    route("user", "routes/user.tsx"),
    route("admin", "routes/admin.tsx"),
    route("admin-analytics", "routes/adm-analytics.tsx"),

    route("admin-analysis", "routes/admin-analysis.tsx"),

    route("learning/:maKhoaHoc", "routes/learning.tsx"),
    route("about", "routes/about.tsx"),
    route("my-courses", "routes/mycourses.tsx"),
    route("all-courses", "routes/all-courses.tsx"),
    route("contact", "routes/contact.tsx"),
    route("purview", "routes/purview.tsx"),
    route("payment", "routes/payment.tsx"),
    route("payment-done", "routes/payment-done.tsx"),
    route("roadmap", "routes/roadmap.tsx"),
    route("courses/course-details/:maKhoaHoc", "routes/course-details.tsx"),
    route("add-course", "routes/add-course.tsx"),
    route("admin-course-details/:maKhoaHoc", "routes/adm-course-details.tsx"),
    route("add-lesson", "routes/add-lesson.tsx"),
    route("admin-lesson-details/:maChuongHoc", "routes/adm-lesson-details.tsx"),
    route("add-lecture", "routes/add-lecture.tsx"),
    route("add-question", "routes/add-question.tsx"),
    route("admin-question-details/:maCauHoi", "routes/adm-ques-details.tsx"),
    route("adm-management-question", "routes/adm-management-question.tsx"),
    route("admin-lecture-details/:maBaiHoc", "routes/adm-lecture-details.tsx"),
    route("admin-user", "routes/adm-user.tsx"),

    route("invoices", "routes/invoices.tsx"),
    route("blog", "routes/blog.tsx"),
    route("read-blog/:maBaiViet", "routes/read-blog.tsx"),
] satisfies RouteConfig;
// adm-management-question.tsx