import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("isLoggedIn");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {/* Full-screen blue gradient — same as home hero */}
      <LinearGradient
        colors={["#1E4ED8", "#2563EB", "#3B82F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative blobs — same subtle feel as hero section */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobTopLeft} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ── HEADER ── */}
        <Animated.View
          entering={FadeInUp.duration(500)}
          style={styles.headerSection}
        >
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../assets/mascot1.png')}
              style={styles.avatar}
              resizeMode="contain"
            />
            <View style={styles.onlineDot} />
          </View>

          <Text style={styles.userName}>Lakshan Jay</Text>
          <Text style={styles.userSub}>Member since 2023</Text>

          {/* Stats pill — mimics hero BlurView badge */}
          <View style={styles.statsPill}>
            <StatItem label="Cool Points" value="1200" accent={false} />
            <View style={styles.statDivider} />
            <StatItem label="Membership" value="Gold" accent />
            <View style={styles.statDivider} />
            <StatItem label="Flavors Tried" value="14/30" accent={false} />
          </View>
        </Animated.View>

        {/* ── WHITE SHEET — same rise as products section ── */}
        <View style={styles.sheet}>

          {/* ACCOUNT */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Text style={styles.groupLabel}>Account</Text>
            <View style={styles.menuCard}>
              <MenuRow
                iconName="person-outline"
                iconBg="#EFF6FF"
                iconColor="#3B82F6"
                label="Edit Profile"
                showChevron
              />
              <MenuRow
                iconName="shield-checkmark-outline"
                iconBg="#EFF6FF"
                iconColor="#3B82F6"
                label="Security"
                showChevron
              />
              <MenuRow
                iconName="notifications-outline"
                iconBg="#EFF6FF"
                iconColor="#3B82F6"
                label="Notifications"
                isLast
                right={
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                    thumbColor="#fff"
                  />
                }
              />
            </View>
          </Animated.View>

          {/* PREFERENCES */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Text style={styles.groupLabel}>Preferences</Text>
            <View style={styles.menuCard}>
              <MenuRow
                iconName="wallet-outline"
                iconBg="#F0F9FF"
                iconColor="#3B82F6"
                label="Payment"
                showChevron
              />
              <MenuRow
                iconName="chatbubble-ellipses-outline" // Gives a "we are here to talk" vibe
                iconBg="#F0F9FF"   // Very light blue/sky tint
                iconColor="#3B82F6" // Calm, trustworthy blue
                label="Help & Support"
                showChevron
              />
              <MenuRow
                iconName="moon-outline"
                iconBg="#F0F9FF"
                iconColor="#3B82F6"
                label="Dark Mode"
                isLast
                right={
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                    thumbColor="#fff"
                  />
                }
              />
            </View>
          </Animated.View>

          {/* SIGN OUT */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <Pressable
              style={({ pressed }) => [
                styles.logoutBtn,
                pressed && { opacity: 0.7 },
              ]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Sign Out</Text>
            </Pressable>
          </Animated.View>

        </View>
      </ScrollView>
    </View>
  );
}

// ── Sub-components ──────────────────────────────────────────

const StatItem = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: boolean;
}) => (
  <View style={styles.statBox}>
    <Text style={[styles.statValue, accent && { color: "#FCD34D" }]}>
      {value}
    </Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const MenuRow = ({
  iconName,
  iconBg,
  iconColor,
  label,
  showChevron,
  isLast,
  right,
}: {
  iconName: any;
  iconBg: string;
  iconColor: string;
  label: string;
  showChevron?: boolean;
  isLast?: boolean;
  right?: React.ReactNode;
}) => (
  <Pressable
    style={({ pressed }) => [
      styles.menuRow,
      !isLast && styles.menuRowBorder,
      pressed && { backgroundColor: "#F8FAFC" },
    ]}
  >
    <View style={styles.menuRowLeft}>
      <View style={[styles.menuIconBox, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={18} color={iconColor} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    {right ?? (showChevron && (
      <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
    ))}
  </Pressable>
);

const Badge = ({ value }: { value: string }) => (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>{value}</Text>
  </View>
);

// ── Styles ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E4ED8",
  },

  // Decorative blobs
  blobTopRight: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  blobTopLeft: {
    position: "absolute",
    top: 80,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(255,255,255,0.03)",
  },

  // Header
  headerSection: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.9)",
  },
  onlineDot: {
    position: "absolute",
    bottom: 3,
    right: 3,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#22C55E",
    borderWidth: 2.5,
    borderColor: "#2563EB",
  },
  userName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    fontFamily: "Poppins-ExtraBold",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  userSub: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginBottom: 24,
  },

  // Stats pill — matches BlurView badge in home
  statsPill: {
    flexDirection: "row",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.08)",
    width: width - 48,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
  },
  statDivider: {
    width: 0.5,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    fontFamily: "Poppins-ExtraBold",
  },
  statLabel: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },

  // White sheet — same rise as products section
  sheet: {
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
    minHeight: 500,
  },

  groupLabel: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "Poppins-SemiBold",
    color: "#94A3B8",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 10,
    marginLeft: 4,
    marginTop: 8,
  },

  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    // Shadow
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  menuRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#F1F5F9",
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    color: "#111827",
  },

  badge: {
    backgroundColor: "#3B82F6",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(239,68,68,0.06)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.15)",
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 30,
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Poppins-SemiBold",
  },
});