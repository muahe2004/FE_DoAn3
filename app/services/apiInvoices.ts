import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiInvoices = createApi({
    reducerPath: "invoicesApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL}/api` }),
    tagTypes: ["Invoices"],
    endpoints: (builder) => ({
        // Lấy danh sách hóa đơn theo mã người nạp
        getInvoicesByUserId: builder.query({
        query: (maNguoiNap) => `invoices/by-user/${maNguoiNap}`,
        providesTags: ["Invoices"],
        }),
    }),
});

export const { useGetInvoicesByUserIdQuery } = apiInvoices;
