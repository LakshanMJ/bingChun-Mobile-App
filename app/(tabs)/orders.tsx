import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
// ✅ CORRECT
import { Image, Text, View } from 'react-native';


// ── Types ────────────────────────────────────────────────────

type OrderStatus = "preparing" | "onway" | "delivered" | "placed";
type TabKey = "active" | "past" | "favourites";

interface OrderItem {
  name: string;
  variant: string;
  qty: number;
  price: number; // unit price in LKR
  imageUrl: any;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
}

// ── Data ─────────────────────────────────────────────────────

const ACTIVE_ORDERS: Order[] = [
  {
    id: "BC-2041",
    date: "Today, 2:35 PM",
    status: "onway",
    items: [
      {
        name: "Blueberry Bobo Tea",
        variant: "700ml · Less sugar",
        qty: 1,
        price: 450,
        // Use a real HTTPS URL here
        imageUrl: require("../../assets/product_images/Blueberry-Bobo-Tea-500u.webp")
      },
      {
        name: "Blueberry Sundae",
        variant: "Regular · Extra toppings",
        qty: 2,
        price: 450,
        imageUrl: require("../../assets/product_images/Blueberry-Sundae-360.webp")
      },
    ],
  },
];

const PAST_ORDERS: Order[] = [
  {
    id: "BC-2038",
    date: "Yesterday, 5:10 PM",
    status: "delivered",
    items: [
      { name: "Chocolate Oreo Milkshake", variant: "Large", qty: 1, price: 450, imageUrl: require("../../assets/product_images/Chocolate-Oreo-Milkshake.webp") },
      { name: "Brown Sugar Boba Milk Tea", variant: "500ml · Normal sugar", qty: 1, price: 450, imageUrl: require("../../assets/product_images/Brown-Black-Sugar-Boba-Milk-Tea-500u.webp") },
      { name: "Blueberry Sundae", variant: "Regular", qty: 1, price: 450, imageUrl: require("../../assets/product_images/Blueberry-Sundae-360.webp") },
    ],
  },
  {
    id: "BC-2031",
    date: "Apr 15, 12:44 PM",
    status: "delivered",
    items: [
      { name: "Grape Bobo Tea", variant: "700ml · Less sugar", qty: 2, price: 350, imageUrl: require("../../assets/product_images/Grape-Bobo-Tea-700ml.webp") },
    ],
  },
  {
    id: "BC-2024",
    date: "Apr 12, 3:20 PM",
    status: "delivered",
    items: [
      { name: "Mango Pomelo Sago", variant: "Regular", qty: 2, price: 550, imageUrl: require("../../assets/product_images/Mango-Pomelo-Sago.webp") },
      { name: "Lemon Black Tea", variant: "700ml", qty: 1, price: 650, imageUrl: require("../../assets/product_images/Lemon-Black-Tea-700ml.webp") },
      { name: "Original Milk Tea", variant: "500ml · Normal sugar", qty: 1, price: 650, imageUrl: require("../../assets/product_images/Bobo-Milk-Tea-500u.webp") },
    ],
  },
  {
    id: "BC-2017",
    date: "Apr 8, 6:55 PM",
    status: "delivered",
    items: [
      { name: "Blueberry Milkshake", variant: "Large", qty: 1, price: 480, imageUrl: require("../../assets/product_images/Blueberry-Milkshake-500u.webp") },
      { name: "Chocolate Ice Cream", variant: "Double scoop", qty: 1, price: 450, imageUrl: require("../../assets/product_images/Chocolate-Ice-Cream.webp") },
    ],
  },
];

const FAVOURITES = [
  { name: "Blueberry Bobo Tea", variant: "700ml · Less sugar", price: "LKR 450", imageUrl: require("../../assets/product_images/Blueberry-Bobo-Tea-500u.webp"), orders: 6 },
  { name: "Blueberry Sundae", variant: "Regular · Extra toppings", price: "LKR 450", imageUrl: require("../../assets/product_images/Blueberry-Sundae-360.webp"), orders: 4 },
  { name: "Chocolate Oreo Milkshake", variant: "Large", price: "LKR 450", imageUrl: require("../../assets/product_images/Chocolate-Oreo-Milkshake.webp"), orders: 3 },
  { name: "Mango Pomelo Sago", variant: "Regular", price: "LKR 550", imageUrl: require("../../assets/product_images/Mango-Pomelo-Sago.webp"), orders: 2 },
];

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "placed", label: "Placed" },
  { key: "preparing", label: "Preparing" },
  { key: "onway", label: "On way" },
  { key: "delivered", label: "Delivered" },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  placed: 0, preparing: 1, onway: 2, delivered: 3,
};

const fmt = (n: number) => `LKR ${n.toLocaleString()}`;
const orderTotal = (items: OrderItem[]) =>
  items.reduce((sum, it) => sum + it.price * it.qty, 0);

// ── Sonar Ping Dot ────────────────────────────────────────────
// Two rings expand outward and fade — the solid dot never animates.

const SonarDot = () => {
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );
    pulse(ring1, 0).start();
    pulse(ring2, 700).start();
  }, []);

  const ringStyle = (anim: Animated.Value) => ({
    position: "absolute" as const,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#22C55E",
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.75, 0] }),
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.8] }) }],
  });

  return (
    <View style={{ width: 22, height: 22, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={ringStyle(ring1)} />
      <Animated.View style={ringStyle(ring2)} />
      <View style={sonarStyles.dot} />
    </View>
  );
};

const sonarStyles = StyleSheet.create({
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22C55E",
    shadowColor: "#22C55E",
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});

// ── Progress Tracker ──────────────────────────────────────────

const ProgressTracker = ({ status }: { status: OrderStatus }) => {
  const currentIdx = STATUS_INDEX[status];
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: currentIdx / (STEPS.length - 1),
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, []);

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={trackerStyles.wrapper}>
      <View style={trackerStyles.titleRow}>
        <Text style={trackerStyles.label}>Delivery progress</Text>
        {/* <View style={trackerStyles.livePill}>
          <View style={trackerStyles.liveDot} />
          <Text style={trackerStyles.liveText}>Live</Text>
        </View> */}
      </View>

      <View style={trackerStyles.row}>
        <View style={trackerStyles.trackBg} />
        <Animated.View style={[trackerStyles.trackFill, { width: fillWidth }]} />

        {STEPS.map((step, i) => {
          const done = i <= currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <View key={step.key} style={trackerStyles.stepCol}>
              {isCurrent ? (
                <SonarDot />
              ) : (
                <View style={[trackerStyles.dot, done ? trackerStyles.dotDone : trackerStyles.dotPending]} />
              )}
              <Text
                style={[
                  trackerStyles.stepLabel,
                  isCurrent
                    ? trackerStyles.stepLabelCurrent
                    : done
                      ? trackerStyles.stepLabelDone
                      : trackerStyles.stepLabelPending,
                ]}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const trackerStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "Poppins-SemiBold",
  },


  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },
  liveText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#15803D",
    fontFamily: "Poppins-SemiBold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    position: "relative",
  },
  trackBg: {
    position: "absolute",
    left: 11,
    right: 11,
    height: 3,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    top: 9,
  },
  trackFill: {
    position: "absolute",
    left: 11,
    height: 3,
    backgroundColor: "#22C55E",
    borderRadius: 2,
    top: 9,
    zIndex: 1,
  },
  stepCol: { alignItems: "center", gap: 6, zIndex: 2 },
  dot: { width: 22, height: 22, borderRadius: 11 },
  dotDone: { backgroundColor: "#22C55E" },
  dotPending: { backgroundColor: "#E2E8F0" },
  stepLabel: { fontSize: 10, fontWeight: "600", fontFamily: "Poppins-Regular" },
  stepLabelCurrent: { color: "#15803D", fontWeight: "700", fontFamily: "Poppins-SemiBold" },
  stepLabelDone: { color: "#22C55E", fontWeight: "700", fontFamily: "Poppins-SemiBold" },
  stepLabelPending: { color: "#94A3B8" },
});

// ── Active Order Card ─────────────────────────────────────────
// SHADOW FIX: cardShadow (outer) holds shadow props.
// cardClip (inner) holds overflow:hidden + borderRadius to clip the gradient.
// iOS drops shadows when overflow:hidden is on the same view — this splits them.

const ActiveOrderCard = ({ order }: { order: Order }) => {
  const total = orderTotal(order.items);
  return (
    <View style={styles.cardShadow}>
      <View style={styles.cardClip}>
        <LinearGradient
          colors={["#1E4ED8", "#3B82F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cardHeader}
        >
          <View>
            <Text style={styles.cardHeaderSub}>Order #{order.id}</Text>
            <Text style={styles.cardHeaderDate}>{order.date}</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>On the way</Text>
          </View>
        </LinearGradient>

        <View style={styles.cardBody}>
          {order.items.map((item, i) => (
            <View
              key={i}
              style={[
                styles.itemRow,
                i < order.items.length - 1 && styles.itemRowBorder,
              ]}
            >
              {/* Image / Emoji Container */}
              <View style={styles.itemEmoji}>
                {item.imageUrl ? (
                  <Image
                    source={item.imageUrl}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={{ fontSize: 24 }}>{'item.emoji'}</Text>
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemVariant}>{item.variant}</Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.itemQty}>×{item.qty}</Text>
                <Text style={styles.itemPrice}>{fmt(item.price * item.qty)}</Text>
              </View>
            </View>
          ))}

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{fmt(total)}</Text>
          </View>

          <ProgressTracker status={order.status} />

          <View style={styles.ctaRow}>
            <Pressable style={styles.ctaPrimary}>
              <Text style={styles.ctaPrimaryText}>Track Order</Text>
            </Pressable>
            <Pressable style={styles.ctaSecondary}>
              <Text style={styles.ctaSecondaryText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

// ── Past Order Card ───────────────────────────────────────────

const PastOrderCard = ({ order }: { order: Order }) => {
  const preview = order.items.slice(0, 2);
  const extra = order.items.length - 2;
  const total = orderTotal(order.items);

  return (
    <View style={styles.cardShadow}>
      <View style={[styles.cardClip, { backgroundColor: "#fff" }]}>
        <View style={styles.cardBody}>
          <View style={styles.pastHeader}>
            <View>
              <Text style={styles.cardHeaderSubDark}>Order #{order.id}</Text>
              <Text style={styles.pastDate}>{order.date}</Text>
            </View>
            <View style={styles.deliveredPill}>
              <Text style={styles.deliveredPillText}>Delivered</Text>
            </View>
          </View>

          <View style={styles.pastItemsRow}>
            {preview.map((item, i) => (
              <Image
                key={`${item.name}-${i}`}
                source={item.imageUrl}
                style={styles.productImage}
                resizeMode="contain"
              />
            ))}
            {extra > 0 && (
              <View style={styles.pastExtra}>
                <Text style={styles.pastExtraText}>+{extra}</Text>
              </View>
            )}
            <Text style={styles.pastTotal}>{fmt(total)}</Text>
          </View>

          <Pressable style={styles.reorderBtn}>
            <Ionicons name="refresh-outline" size={15} color="#3B82F6" />
            <Text style={styles.reorderText}>Reorder</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

// ── Favourite Card ────────────────────────────────────────────

const FavouriteCard = ({ item }: { item: typeof FAVOURITES[0] }) => (
  <View style={styles.favShadow}>
    <View style={styles.favCard}>
      <View style={styles.favEmoji}>
        <Image
          source={item.imageUrl}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.favName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.favVariant}>{item.variant}</Text>
        <View style={styles.favMeta}>
          <Text style={styles.favPrice}>{item.price}</Text>
          <View style={styles.favOrdersBadge}>
            <Ionicons name="repeat-outline" size={11} color="#3B82F6" />
            <Text style={styles.favOrdersText}>Ordered {item.orders}x</Text>
          </View>
        </View>
      </View>
      <Pressable style={styles.favAddBtn}>
        <Ionicons name="add" size={20} color="#fff" />
      </Pressable>
    </View>
  </View>
);

// ── Main Screen ───────────────────────────────────────────────

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>("active");

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#1E4ED8", "#2563EB", "#3B82F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.blobTR} />
          <View style={styles.blobBL} />
          <Text style={styles.heroGreeting}>Good afternoon,</Text>
          <Text style={styles.heroTitle}>Your Orders</Text>
          <Text style={styles.heroSub}>
            Track, reorder, and manage your Bing Chun favourites.
          </Text>
        </LinearGradient>

        <View style={styles.tabBar}>
          {(["active", "past", "favourites"] as TabKey[]).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab ? styles.tabActive : styles.tabInactive]}
            >
              <Text style={[styles.tabText, activeTab === tab ? styles.tabTextActive : styles.tabTextInactive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.content}>
          {activeTab === "active" &&
            ACTIVE_ORDERS.map((o) => <ActiveOrderCard key={o.id} order={o} />)}

          {activeTab === "past" &&
            PAST_ORDERS.map((o) => <PastOrderCard key={o.id} order={o} />)}

          {activeTab === "favourites" && (
            <>
              <Text style={styles.favHeading}>Your go-to picks</Text>
              {FAVOURITES.map((f, i) => <FavouriteCard key={i} item={f} />)}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  productImage: {
    width: 60,  // Or use a percentage like '100%' if the parent container has a size
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ccc', // Add a temporary bg color to see if the box even exists
  },
  hero: {
    paddingTop: 60,
    paddingBottom: 64,
    paddingHorizontal: 20,
    position: "relative",
    overflow: "hidden",
  },
  blobTR: {
    position: "absolute", top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  blobBL: {
    position: "absolute", bottom: -30, left: -50,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  heroGreeting: { color: "rgba(255,255,255,0.65)", fontSize: 13, fontFamily: "Poppins-Regular", marginBottom: 4 },
  heroTitle: { color: "#fff", fontSize: 22, fontWeight: "800", fontFamily: "Poppins-ExtraBold", letterSpacing: -0.3, marginBottom: 6 },
  heroSub: { color: "rgba(255,255,255,0.55)", fontSize: 13, fontFamily: "Poppins-Regular" },

  tabBar: {
    marginHorizontal: 20,
    marginTop: -24,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    flexDirection: "row",
    gap: 4,
    shadowColor: "#1E40AF",
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 14, alignItems: "center" },
  tabActive: { backgroundColor: "#3B82F6" },
  tabInactive: { backgroundColor: "#F1F5F9" },
  tabText: { fontSize: 13, fontFamily: "Poppins-SemiBold" },
  tabTextActive: { color: "#fff", fontWeight: "700" },
  tabTextInactive: { color: "#64748B", fontWeight: "600" },

  content: { padding: 20, gap: 14, marginBottom: 80 },

  // ── Shadow fix ──
  // Outer view: shadow only, no overflow clip
  // Inner view: overflow:hidden + borderRadius to clip gradient corners
  cardShadow: {
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#1E40AF",
    shadowOpacity: 0.18,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
    marginBottom: 14,
  },
  cardClip: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  cardHeaderSub: { color: "rgba(255,255,255,0.7)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, fontFamily: "Poppins-Regular" },
  cardHeaderSubDark: { color: "#94A3B8", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, fontFamily: "Poppins-Regular" },
  cardHeaderDate: { color: "#fff", fontWeight: "700", fontSize: 14, marginTop: 2, fontFamily: "Poppins-SemiBold" },
  statusPill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  statusPillText: { color: "#fff", fontSize: 11, fontWeight: "700", fontFamily: "Poppins-SemiBold" },
  cardBody: { padding: 18 },

  itemRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingBottom: 14, marginBottom: 14 },
  itemRowBorder: { borderBottomWidth: 0.5, borderBottomColor: "#F1F5F9" },
  itemEmoji: { width: 52, height: 52, borderRadius: 14, backgroundColor: "#F3F7FD", alignItems: "center", justifyContent: "center" },
  itemName: { fontWeight: "700", fontSize: 14, color: "#111827", fontFamily: "Poppins-SemiBold", marginBottom: 2 },
  itemVariant: { color: "#94A3B8", fontSize: 12, fontFamily: "Poppins-Regular" },
  itemQty: { fontWeight: "800", color: "#3B82F6", fontSize: 13, fontFamily: "Poppins-ExtraBold", textAlign: "right" },
  itemPrice: { color: "#64748B", fontSize: 12, fontFamily: "Poppins-Regular", textAlign: "right", marginTop: 2 },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 14,
    marginBottom: 14,
  },
  totalLabel: { fontSize: 14, fontWeight: "700", color: "#111827", fontFamily: "Poppins-SemiBold" },
  totalAmount: { fontSize: 16, fontWeight: "800", color: "#3B82F6", fontFamily: "Poppins-ExtraBold" },

  ctaRow: { flexDirection: "row", gap: 10 },
  ctaPrimary: { flex: 1, backgroundColor: "#EFF6FF", borderRadius: 14, paddingVertical: 12, alignItems: "center" },
  ctaPrimaryText: { color: "#3B82F6", fontSize: 13, fontWeight: "700", fontFamily: "Poppins-SemiBold" },
  ctaSecondary: { flex: 1, backgroundColor: "#F8FAFC", borderRadius: 14, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0" },
  ctaSecondaryText: { color: "#64748B", fontSize: 13, fontWeight: "600", fontFamily: "Poppins-Regular" },

  pastHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  pastDate: { color: "#111827", fontWeight: "700", fontSize: 14, marginTop: 2, fontFamily: "Poppins-SemiBold" },
  deliveredPill: { backgroundColor: "#F0FDF4", borderRadius: 999, paddingVertical: 5, paddingHorizontal: 12 },
  deliveredPillText: { color: "#15803D", fontSize: 11, fontWeight: "700", fontFamily: "Poppins-SemiBold" },
  pastItemsRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  pastEmoji: { width: 48, height: 48, borderRadius: 14, backgroundColor: "#F3F7FD", alignItems: "center", justifyContent: "center" },
  pastExtra: { width: 48, height: 48, borderRadius: 14, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center" },
  pastExtraText: { color: "#3B82F6", fontSize: 13, fontWeight: "700" },
  pastTotal: { marginLeft: "auto", color: "#3B82F6", fontSize: 14, fontWeight: "800", fontFamily: "Poppins-ExtraBold" },
  reorderBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#EFF6FF", borderRadius: 14, paddingVertical: 12 },
  reorderText: { color: "#3B82F6", fontSize: 13, fontWeight: "700", fontFamily: "Poppins-SemiBold" },

  favHeading: { fontSize: 11, fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4, fontFamily: "Poppins-SemiBold" },
  favShadow: {
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#1E40AF",
    shadowOpacity: 0.18,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
    marginBottom: 12,
  },
  favCard: { borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "#fff" },
  favEmoji: { width: 60, height: 60, borderRadius: 16, backgroundColor: "#F3F7FD", alignItems: "center", justifyContent: "center" },
  favName: { fontSize: 14, fontWeight: "700", color: "#111827", fontFamily: "Poppins-SemiBold", marginBottom: 2 },
  favVariant: { fontSize: 12, color: "#94A3B8", fontFamily: "Poppins-Regular", marginBottom: 8 },
  favMeta: { flexDirection: "row", alignItems: "center", gap: 10 },
  favPrice: { fontSize: 13, fontWeight: "800", color: "#3B82F6", fontFamily: "Poppins-ExtraBold" },
  favOrdersBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#EFF6FF", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  favOrdersText: { fontSize: 11, color: "#3B82F6", fontWeight: "600", fontFamily: "Poppins-Regular" },
  favAddBtn: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: "#3B82F6",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#3B82F6", shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
});