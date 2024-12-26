import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const loadState = () => {
  const serializedState = sessionStorage.getItem("reduxState");
  return serializedState ? JSON.parse(serializedState) : undefined;
};

const saveState = (state: RootState) => {
  const serializedState = JSON.stringify(state);
  sessionStorage.setItem("reduxState", serializedState);
};

export type RootState = ReturnType<typeof store.getState>;

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
