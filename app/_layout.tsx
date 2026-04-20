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