// Import hàm configureStore từ Redux Toolkit 
// — cách hiện đại và đơn giản để tạo Redux store.
import { configureStore } from "@reduxjs/toolkit"

// Import API slice
import { apiInvoices } from "~/services/apiInvoices"

const store = configureStore({
  reducer: {
    [apiInvoices.reducerPath]: apiInvoices.reducer,
  },
  // middleware mặc định để có thể chạy
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiInvoices.middleware), 
})

export default store;
