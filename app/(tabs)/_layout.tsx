// import { Tabs } from 'expo-router';
// import React from 'react';

// import { HapticTab } from '@/components/haptic-tab';
// import { IconSymbol } from '@/components/ui/icon-symbol';
// import { Colors } from '@/constants/theme';
// import { useColorScheme } from '@/hooks/use-color-scheme';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold, useFonts } from '@expo-google-fonts/poppins';
// import * as SplashScreen from 'expo-splash-screen';
// import { useEffect } from 'react';

// // Prevent splash screen from hiding automatically
// SplashScreen.preventAutoHideAsync();

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   const [loaded, error] = useFonts({
//     'Poppins-ExtraBold': Poppins_800ExtraBold,
//     'Poppins-Bold': Poppins_700Bold,
//     'Poppins-Regular': Poppins_400Regular,
//     'Poppins-SemiBold': Poppins_600SemiBold,
//   });

//   useEffect(() => {
//     if (loaded || error) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded, error]);

//   if (!loaded && !error) {
//     return null;
//   }

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//         tabBarButton: HapticTab,
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: 'Explore',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }


import { BlurView } from 'expo-blur';
import { SplashScreen, Tabs } from 'expo-router';
import { House, ShoppingBag, User } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
// import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold, useFonts } from '@expo-google-fonts/poppins';

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
        tabBarActiveTintColor: "#ffffff",   // your brand blue
        tabBarInactiveTintColor: "#4B5563", // soft slate gray
        tabBarStyle: styles.tabBar,
        // This makes the tab bar "glassy" on iOS
        tabBarBackground: () => (
          <>
            <BlurView
              intensity={60}
              tint="light" // lighter base works better for color blending
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: '#3b82f6', // your blue with opacity
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
      {/* <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => <ReceiptText name="notifications-outline" size={size} color={color} />,
        }}
      /> */}
      <Tabs.Screen
        name="profile"
        options={{
          // title: 'Profile',
          // tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
          tabBarIcon: ({ color, size }) => <User name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>

    
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute', // Makes it float
    borderTopWidth: 0,
    elevation: 0,
    height: Platform.OS === 'ios' ? 88 : 60,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#3B82F6', // Solid color for Android

  },
});
