import { useEffect, useState } from "react";
import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { isLoggedIn } from "@/components/utils/auth";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const logged = await isLoggedIn();

      if (logged) {
        router.replace("/(tabs)" as any);
      } else {
        router.replace("/login" as any); // go to login
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return null;
}