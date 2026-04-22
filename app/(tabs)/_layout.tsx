import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold, useFonts } from '@expo-google-fonts/poppins';
import { BlurView } from 'expo-blur';
import { SplashScreen, Tabs } from 'expo-router';
import { House, ShoppingBag, User } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
    const [loaded, error] = useFonts({
        'Poppins-ExtraBold': Poppins_800ExtraBold,
        'Poppins-Bold': Poppins_700Bold,
        'Poppins-Regular': Poppins_400Regular,
        'Poppins-SemiBold': Poppins_600SemiBold,
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#ffffff",
                tabBarInactiveTintColor: "#4B5563",
                tabBarStyle: styles.tabBar,
                tabBarBackground: () => (
                    <>
                        <BlurView
                            intensity={60}
                            tint="light"
                            style={StyleSheet.absoluteFill}
                        />
                        <View
                            style={[
                                StyleSheet.absoluteFill,
                                {
                                    backgroundColor: '#3b82f6',
                                },
                            ]}
                        />
                    </>
                )
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <House name="home-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    title: 'Orders',
                    tabBarIcon: ({ color, size }) => <ShoppingBag name="list-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color, size }) => <User name="person-outline" size={size} color={color} />,
                }}
            />
        </Tabs>


    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        borderTopWidth: 0,
        elevation: 0,
        height: Platform.OS === 'ios' ? 88 : 60,
        backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#3B82F6',

    },
});
