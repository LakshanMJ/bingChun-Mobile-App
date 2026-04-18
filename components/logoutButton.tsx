import { useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // 1. Clear auth (example)
    // await AsyncStorage.removeItem("token");
    // await logoutFromApi();

    // 2. Redirect to login
    router.replace("/login");
  };

  return (
    <TouchableOpacity onPress={handleLogout}>
      <Text>Logout</Text>
    </TouchableOpacity>
  );
}