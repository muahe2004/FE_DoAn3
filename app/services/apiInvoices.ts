import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiInvoices = createApi({
  reducerPath: "invoicesApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL}/api` }),
  tagTypes: ["Invoices"],
  endpoints: (builder) => ({
    getInvoicesByUserId: builder.query({
      query: ({ maNguoiNap, page = 1, pageSize = 5, count }) => {
        const url = new URL(`invoices/by-user/${maNguoiNap}`, import.meta.env.VITE_API_URL + '/api');
        url.searchParams.append("page", page.toString());
        url.searchParams.append("pageSize", pageSize.toString());
        if (count) url.searchParams.append("count", "true");

        return {
          url: url.pathname + url.search,
          method: "GET",
        };
      },
      providesTags: ["Invoices"],
    }),
  }),
});

export const { useGetInvoicesByUserIdQuery } = apiInvoices;
