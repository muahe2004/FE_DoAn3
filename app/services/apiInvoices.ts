// Import các hàm từ RTK Query
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Tạo slice API mới cho hóa đơn (invoices)
export const apiInvoices = createApi({
  // Tên reducer sẽ lưu trong Redux store
  reducerPath: "invoicesApi",

  // Cấu hình base URL cho tất cả các API gọi từ slice này
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL}/api` }),

  // Định nghĩa các loại tag để dùng cho caching và invalidation
  tagTypes: ["Invoices"],

  // Khai báo các endpoint (API)
  endpoints: (builder) => ({
    // Endpoint: lấy danh sách hóa đơn theo mã người nạp
    getInvoicesByUserId: builder.query({
      // Hàm tạo URL và các tham số truy vấn
      query: ({ maNguoiNap, page = 1, pageSize = 5, count }) => {
        // Tạo đối tượng URL từ base + endpoint
        const url = new URL(
          `invoices/by-user/${maNguoiNap}`,
          import.meta.env.VITE_API_URL + '/api'
        );

        // Thêm các tham số vào URL
        url.searchParams.append("page", page.toString());
        url.searchParams.append("pageSize", pageSize.toString());
        if (count) url.searchParams.append("count", "true");

        // Trả về cấu hình request
        return {
          url: url.pathname + url.search, // Ex: /invoices/by-user/1?page=1&pageSize=5
          method: "GET",
        };
      },

      // Đánh dấu dữ liệu được trả về có liên quan tới tag "Invoices"
      providesTags: ["Invoices"],
    }),
  }),
});

// Export custom hook để gọi API trong React component
export const { useGetInvoicesByUserIdQuery } = apiInvoices;
