// Import hàm configureStore từ Redux Toolkit 
// — cách hiện đại và đơn giản để tạo Redux store.
import { configureStore } from "@reduxjs/toolkit"

// Import API slice
import { apiInvoices } from "~/services/apiInvoices"
import { apiBills } from "~/services/apiBills";

const store = configureStore({
  reducer: {
    [apiInvoices.reducerPath]: apiInvoices.reducer,
    [apiBills.reducerPath]: apiBills.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiInvoices.middleware)
      .concat(apiBills.middleware),
});


export default store;
