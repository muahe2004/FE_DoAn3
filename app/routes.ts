import { type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"), 
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
    route("admin", "routes/admin.tsx"),
    route("about", "routes/about.tsx"),
    route("contact", "routes/contact.tsx"),
    route("purview", "routes/purview.tsx"),
    route("roadmap", "routes/roadmap.tsx"),
    route("courses/course-details/:maKhoaHoc", "routes/course-details.tsx"),
    route("add-course", "routes/add-course.tsx"),
    route("admin-course-details/:maKhoaHoc", "routes/adm-course-details.tsx"),
    route("add-lesson", "routes/add-lesson.tsx"),
    route("admin-lesson-details/:maChuongHoc", "routes/adm-lesson-details.tsx"),
    route("add-lecture", "routes/add-lecture.tsx"),
    route("admin-lecture-details/:maBaiHoc", "routes/adm-lecture-details.tsx"),
    // route("admin-analysis", "routes/admin-analysis.tsx"),
    // route("admin-analysis", "routes/admin-analysis.tsx"),



] satisfies RouteConfig;
