import { type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"), 
    route("admin", "routes/admin.tsx"),
    route("about", "routes/about.tsx"),
    route("admin-course-details/:maKhoaHoc", "routes/adm-course-details.tsx"),
    route("add-course", "routes/add-course.tsx"),
    route("add-lesson", "routes/add-lesson.tsx"),
    route("add-lecture", "routes/add-lecture.tsx"),
    // route("admin-analysis", "routes/admin-analysis.tsx"),
    // route("admin-analysis", "routes/admin-analysis.tsx"),
    // route("admin-analysis", "routes/admin-analysis.tsx"),



] satisfies RouteConfig;
