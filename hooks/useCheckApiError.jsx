import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";

export const useCheckApiError = () => {
  console.log("66666666666666666666666666666666666666");
  const router = useRouter();
  const backToLogin = useSelector((state) => state.mainConfig.backToLogin);
  useEffect(() => {
    console.log("5555555555555555555555", backToLogin);
    if (backToLogin == true) router.push("/LoginScreen");
  }, [backToLogin]);
};
