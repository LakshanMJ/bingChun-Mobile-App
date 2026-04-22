import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "@/components/utils/auth";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("isLoggedIn");

            await logout();

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