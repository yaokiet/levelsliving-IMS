"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "@/lib/api/authApi";
import { RootState } from "@/app/_store/redux-store";
import { setUser, clearUser, setInitialized } from "@/app/_store/authSlice";

export function AuthInitializer() {
  const dispatch = useDispatch();
  const { initialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!initialized) {
        console.log("AuthInitializer running")
      getCurrentUser()
        .then(user => dispatch(setUser(user)))
        .catch(() => dispatch(clearUser()))
        .finally(() => dispatch(setInitialized()));
    }
  }, [initialized, dispatch]);

  return null;
}
