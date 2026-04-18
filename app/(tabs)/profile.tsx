import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("isLoggedIn");
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0a1a3c', '#11224d']} style={StyleSheet.absoluteFill} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }} 
            style={styles.avatar} 
          />
          <Text style={styles.userName}>Dev User</Text>
          <Text style={styles.userTag}>Full-Stack Developer | Fitness</Text>
          
          <View style={styles.statsRow}>
            <StatItem label="Projects" value="12" />
            <StatItem label="Streak" value="15d" />
            <StatItem label="Level" value="Pro" />
          </View>
        </View>

        {/* Settings Groups */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <BlurView intensity={20} tint="light" style={styles.menuCard}>
            <MenuItem icon="person-outline" label="Edit Profile" />
            <MenuItem icon="shield-checkmark-outline" label="Security" />
            <View style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="moon-outline" size={22} color="#fff" />
                <Text style={styles.menuLabel}>Dark Mode</Text>
              </View>
              <Switch 
                value={isDarkMode} 
                onValueChange={setIsDarkMode}
                trackColor={{ false: '#3e3e3e', true: '#3b82f6' }}
              />
            </View>
          </BlurView>
        </Animated.View>

        {/* Logout Section */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ff4d4d" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// Sub-components for cleaner code
const StatItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const MenuItem = ({ icon, label }: { icon: any; label: string }) => (
  <Pressable style={styles.menuItem}>
    <View style={styles.menuLeft}>
      <Ionicons name={icon} size={22} color="#fff" />
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
  </Pressable>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1a3c' },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#3b82f6' },
  userName: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 15 },
  userTag: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  statsRow: { flexDirection: 'row', marginTop: 25, width: '100%', justifyContent: 'space-evenly' },
  statBox: { alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 20, fontWeight: '700' },
  statLabel: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  section: { paddingHorizontal: 20, marginTop: 30 },
  sectionTitle: { color: '#94a3b8', fontSize: 13, fontWeight: '600', textTransform: 'uppercase', marginBottom: 12, marginLeft: 5 },
  menuCard: { borderRadius: 20, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.1)' },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuLabel: { color: '#fff', fontSize: 16, marginLeft: 12, fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,77,77,0.1)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,77,77,0.2)' },
  logoutText: { color: '#ff4d4d', fontSize: 16, fontWeight: '700', marginLeft: 8 },
});