import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./app-slice";
import contactsSlice from "./contacts-slice";


const AppStore = configureStore({
	reducer:{
		appinfo:appSlice.reducer,
		contacts:contactsSlice.reducer
	}
});

export default AppStore; 