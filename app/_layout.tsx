import { isLoggedIn } from "@/components/utils/auth";
import { Slot, useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const router = useRouter();
  const navState = useRootNavigationState();

  useEffect(() => {
    if (!navState?.key) return;

    const checkAuth = async () => {
      const loggedIn = await isLoggedIn();

      router.replace(loggedIn ? "/" : "/login");
    };

    checkAuth();
  }, [navState]);

  return <Slot />;
}