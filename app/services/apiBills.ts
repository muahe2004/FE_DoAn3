// services/apiBills.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { bills } from "~/types/bills";

export const apiBills = createApi({
  reducerPath: "billsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL}/api` }),
  tagTypes: ["Bills"],
  endpoints: (builder) => ({
    createBills: builder.mutation<void, bills>({
      query: (body) => ({
        url: "bills",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bills"],
    }),
  }),
});

export const { useCreateBillsMutation } = apiBills;
