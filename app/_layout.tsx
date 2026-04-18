// import { isLoggedIn } from "@/components/utils/auth";
// import { Slot, useRootNavigationState, useRouter, useSegments } from "expo-router";
// import { useEffect, useState } from "react";

// export default function RootLayout() {
//   const navState = useRootNavigationState();
//   const router = useRouter();

//   useEffect(() => {
//     // Wait for navigation to be ready
//     if (!navState?.key) return;

//     const checkAuth = async () => {
//       const loggedIn = await isLoggedIn();
//       if (loggedIn) {
//         // Use a slight delay or process.nextTick to ensure layout is ready
//         router.replace("/(tabs)");
//       } else {
//         router.replace("/login");
//       }
//     };
//     checkAuth();
//   }, [navState?.key]); // Only re-run when navigation key is ready

//   return <Slot />;
// }


import { Stack } from "expo-router";

export default function RootLayout() {
  // If this works without crashing, the issue is definitely 
  // the useEffect/logic we had in the layout earlier.
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}