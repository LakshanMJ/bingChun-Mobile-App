// import AsyncStorage from "@react-native-async-storage/async-storage/lib/typescript/AsyncStorage";
// import { useRouter } from "expo-router";
// import { TouchableOpacity, Text } from "react-native";

// export default function LogoutButton() {
//   const router = useRouter();

//   const handleLogout = async () => {
//     // 1. Clear auth (example)
//     await AsyncStorage.removeItem("token");
//     await logoutFromApi();

//     // 2. Redirect to login
//     router.replace("/login");
//   };

//   return (
//     <TouchableOpacity onPress={handleLogout}>
//       <Text>Logout</Text>
//     </TouchableOpacity>
//   );
// }


import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
// ✅ Correct import for the actual functionality
import AsyncStorage from "@react-native-async-storage/async-storage"; 
// ✅ Import your utility function
import { logout } from "@/components/utils/auth"; 

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Clear the local storage
      // Use the key you use in your isLoggedIn check (likely 'user' or 'isLoggedIn')
      await AsyncStorage.removeItem("isLoggedIn"); 
      
      // 2. Call your auth utility if you have one
      await logout(); 

      // 3. Redirect
      // Using replace ensures the user can't click 'back' to go to the home screen
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.button}>
      <Text style={styles.text}>Logout</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  }
});