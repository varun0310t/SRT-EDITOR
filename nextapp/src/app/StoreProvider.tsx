"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../lib/store";
import { login } from "../lib/storeActions/userSlice";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();

    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        storeRef.current.dispatch(
          login({
            id: JSON.parse(user).id,
            name: JSON.parse(user).name,
            Email: JSON.parse(user).Email,
            Username: JSON.parse(user).Username,
          })
        );
      }
    }

  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
