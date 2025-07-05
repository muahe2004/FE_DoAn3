import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    host: '0.0.0.0', // 👈 Cho phép truy cập từ mọi host/IP
    port: 5174,       // Bạn có thể thay đổi cổng tùy theo nhu cầu
    cors: true,       // (tuỳ chọn) cho phép CORS
    allowedHosts: ['*'], // ✅ Cho phép tất cả các domain (kể cả Ngrok)
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
