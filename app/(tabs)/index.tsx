import LogoutButton from "@/components/logoutButton";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AnimatedReanimated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import MenuDrawer from "../../components/MenuDrawer";

const { width, height } = Dimensions.get("window");

const categories = ["All", "Bubble Tea", "Milk Tea", "Fruit Tea", "Milkshakes"];


const gradientConfigs = [
  {
    // Slide 1 — Deep diagonal (primary look)
    colors: [
      { color: "#0a3ea8", stop: "0%" },
      { color: "#0c45b2", stop: "30%" },
      { color: "#104bb9", stop: "65%" },
      { color: "#1B5DD5", stop: "100%" },
    ],
    angle: 135, // top-left → bottom-right
  },
  {
    // Slide 2 — Rich darker blend
    colors: [
      { color: "#0a3ea8", stop: "0%" },
      { color: "#0a3ea8", stop: "25%" }, // keeps top dark
      { color: "#104bb9", stop: "60%" },
      { color: "#1B5DD5", stop: "100%" },
    ],
    angle: 145, // slightly shifted diagonal
  },
  {
    // Slide 3 — Slight brightness but controlled
    colors: [
      { color: "#0a3ea8", stop: "0%" },
      { color: "#104bb9", stop: "40%" },
      { color: "#1B5DD5", stop: "75%" },
      { color: "#2f6fe0", stop: "100%" }, // toned-down light blue
    ],
    angle: 125, // different corner direction
  },
];

const slides = [
  {
    title: "Soft Serve",
    subtitle: "Starting from Rs. 200",
    description:
      "Indulge in our signature soft-serve ice cream — vanilla, matcha, and seasonal flavors made fresh daily.",
    primaryLabel: "View Flavors",
    secondaryLabel: "Our Story",
  },
  {
    title: "Find Us",
    subtitle: "Island Wide",
    description:
      "Visit our stores across Colombo, Kandy, and more. Bing Chun is always near you with the freshest drinks and treats.",
    primaryLabel: "Our Locations",
    secondaryLabel: "Our Story",
  },
  {
    title: "Bubble Tea",
    subtitle: "Sweet & Refreshing",
    description:
      "Experience the authentic taste of Bing Chun — premium bubble tea, creamy soft-serve, and refreshing fruit teas crafted with love.",
    primaryLabel: "Order Now",
    secondaryLabel: "Explore Menu",
  },
];

// Slide Component with fade animation
interface SlideProps {
  slide: typeof slides[0];
}

// Animated Gradient Background Component - smooth transitions
interface AnimatedGradientProps {
  currentIndex: number;
  height: number;
}

const AnimatedGradientBackground: React.FC<AnimatedGradientProps> = ({ currentIndex, height }) => {
  const [visibleIndex, setVisibleIndex] = useState(currentIndex);
  const [nextIndex, setNextIndex] = useState(currentIndex);
  const opacity = useSharedValue(1);


  // check and remove below !!!!
  const getGradientDirection = (angle: number) => {
    const rad = (angle * Math.PI) / 180;

    return {
      start: {
        x: 0.5 - Math.cos(rad) / 2,
        y: 0.5 - Math.sin(rad) / 2,
      },
      end: {
        x: 0.5 + Math.cos(rad) / 2,
        y: 0.5 + Math.sin(rad) / 2,
      },
    };
  };

  useEffect(() => {
    // Start fade out of current gradient
    opacity.value = withTiming(0, {
      duration: 400,
      easing: Easing.inOut(Easing.cubic),
    });

    // Mid-transition: swap the gradient
    const timer = setTimeout(() => {
      setVisibleIndex(currentIndex);
      setNextIndex(currentIndex);
      // Fade in new gradient
      opacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.inOut(Easing.cubic),
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const visibleGradient = gradientConfigs[visibleIndex % gradientConfigs.length];
  const nextGradient = gradientConfigs[nextIndex % gradientConfigs.length];

  const visibleDir = getGradientDirection(visibleGradient.angle);
  const nextDir = getGradientDirection(nextGradient.angle);

  return (
    // <View style={[styles.gradientBackgroundContainer, { height }]}>
    //   {/* Background layer - next gradient (hidden initially) */}
    //   <LinearGradient
    //     colors={nextGradient.colors.map((c) => c.color)}
    //     angle={nextGradient.angle}
    //     style={styles.gradientLayer}
    //   />

    //   {/* Animated overlay - visible gradient with fade transition */}
    //   <AnimatedReanimated.View style={[styles.gradientLayerAbsolute, animatedStyle]}>
    //     <LinearGradient
    //       colors={visibleGradient.colors.map((c) => c.color)}
    //       angle={visibleGradient.angle}
    //       style={styles.gradientLayer}
    //     />
    //   </AnimatedReanimated.View>

    //   <View style={styles.gradientOverlay} />
    // </View>

    <View style={[styles.gradientBackgroundContainer, { height }]}>

      {/* Next Gradient (base) */}
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.05)", // very subtle light
          "transparent",
          "rgba(10,62,168,0.15)",   // blue depth instead of white
        ]}
        start={nextDir.start}
        end={nextDir.end}
        style={styles.gradientLayer}
      />

      {/* Animated Current Gradient */}
      <AnimatedReanimated.View
        style={[styles.gradientLayerAbsolute, animatedStyle]}
      >
        <LinearGradient
          colors={[
            "rgba(255,255,255,0.05)", // very subtle light
            "transparent",
            "rgba(10,62,168,0.15)",   // blue depth instead of white
          ]}
          start={visibleDir.start}
          end={visibleDir.end}
          style={styles.gradientLayer}
        />
      </AnimatedReanimated.View>

      {/* Subtle depth overlay (FIXED) */}
      <View style={styles.gradientOverlay} />
    </View>
  );
};

const SlideComponent: React.FC<SlideProps> = ({ slide }) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <AnimatedReanimated.View style={[styles.slideContainer, animatedStyle]}>
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.subtitle}>{slide.subtitle}</Text>
      <Text style={styles.description}>{slide.description}</Text>

      <View style={styles.buttonRow}>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>
            {slide.primaryLabel}
            <Text style={{ color: "#307EF2" }}> {" >"}</Text>
          </Text>
        </Pressable>

        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>
            {slide.secondaryLabel}
          </Text>
        </Pressable>
      </View>
    </AnimatedReanimated.View>
  );
};

export default function HomeScreen() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");



  const SCREEN_HEIGHT = height;
  const tabBarHeight = useBottomTabBarHeight();

  const progressAnim = useSharedValue(0);

  // useEffect(() => {
  //   progressAnim.setValue(0);

  //   Animated.timing(progressAnim, {
  //     toValue: 1,
  //     duration: 5000,
  //     useNativeDriver: false,
  //   }).start(({ finished }) => {
  //     if (finished) {
  //       setActiveSlide((prev) => (prev + 1) % slides.length);
  //     }
  //   });
  // }, [activeSlide]);

  useEffect(() => {
    progressAnim.value = 0;
    progressAnim.value = withTiming(1, {
      duration: 5000,
      easing: Easing.linear
    }, (finished) => {
      if (finished) {
        // Use runOnJS to update state from the animation thread
        runOnJS(setActiveSlide)((activeSlide + 1) % slides.length);
      }
    });
  }, [activeSlide]);

  const progressFillStyle = useAnimatedStyle(() => ({
    width: progressAnim.value * 32,
  }));

  const slide = slides[activeSlide];

  const products = [
    {
      title: "Blueberry Bobo Tea",
      description: "Refreshing blueberry tea bursting with juicy boba pearls",
      price: "LKR 450.00",
      category: "BUBBLE TEA",
      popular: true,
      image: require("../../assets/product_images/Blueberry-Bobo-Tea-500u.avif")
    },
    {
      title: "Blueberry Milkshake",
      description: "Thick and creamy shake blended with fresh blueberries",
      price: "LKR 480.00",
      category: "MILKSHAKE",
      popular: true,
      // image: require("../../assets/product_images/Blueberry-Milkshake-500u.avif")
      image: require("../../assets/product_images/bbms.png")
    },
    {
      title: "Blueberry Sundae",
      description: "Soft-serve sundae drizzled with rich blueberry compote",
      price: "LKR 450.00",
      category: "SUNDAE",
      popular: true,
      image: require("../../assets/product_images/Blueberry-Sundae-360.avif")
    },
    {
      title: "Brown Black Sugar Boba Milk Tea",
      description: "Rich brown sugar syrup swirled with fresh boba pearls",
      price: "LKR 450.00",
      category: "BUBBLE TEA",
      image: require("../../assets/product_images/Brown-Black-Sugar-Boba-Milk-Tea-500u.avif")
    },
    {
      title: "Original Milk Tea",
      description: "Our beloved signature milk tea, smooth and perfectly balanced",
      price: "LKR 650.00",
      category: "MILK TEA",
      image: require("../../assets/product_images/Bobo-Milk-Tea-500u.avif")
    },

    {
      title: "Chocolate Ice Cream",
      description: "Rich, velvety chocolate soft-serve ice cream",
      price: "LKR 450.00",
      category: "ICE CREAM",
      image: require("../../assets/product_images/Chocolate-Ice-Cream.avif")
    },
    {
      title: "Chocolate Oreo Milkshake",
      description: "Decadent chocolate shake loaded with crushed Oreo cookies",
      price: "LKR 450.00",
      category: "MILKSHAKE",
      image: require("../../assets/product_images/Chocolate-Oreo-Milkshake.avif")
    },
    {
      title: "Grape Bobo Tea",
      description: "Sweet purple grape tea with chewy tapioca boba pearls",
      price: "LKR 350.00",
      category: "BUBBLE TEA",
      image: require("../../assets/product_images/Grape-Bobo-Tea-700ml.avif")
    },
    {
      title: "Lemon Black Tea",
      description: "Bold black tea brightened with a splash of fresh lemon",
      price: "LKR 650.00",
      category: "FRUIT TEA",
      image: require("../../assets/product_images/Lemon-Black-Tea-700ml.avif")
    },
    {
      title: "Mango Pomelo Sago",
      description: "Classic Hong Kong dessert — fresh mango, pomelo and sago pearls",
      price: "LKR 550.00",
      category: "SUNDAE",
      image: require("../../assets/product_images/Mango-Pomelo-Sago.avif")
    }
  ]

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  // Levitate mascot animation with rotation
  const mascotTranslateY = useSharedValue(0);
  const mascotRotate = useSharedValue(0);
  useEffect(() => {
    mascotTranslateY.value = withRepeat(
      withTiming(-18, { duration: 1800 }), // slower
      -1,
      true
    );
    mascotRotate.value = withRepeat(
      withTiming(-6, { duration: 900 }), // up: anticlockwise
      -1,
      true
    );
  }, []);
  // const mascotAnimStyle = useAnimatedStyle(() => {
  //   // Interpolate rotation based on translateY
  //   // -18 (top) => -6deg, 0 (bottom) => 6deg
  //   const rotate = mascotTranslateY.value < 0
  //     ? -6 * (mascotTranslateY.value / -18) // up: -6deg
  //     : 6 * (mascotTranslateY.value / 18);  // down: 6deg
  //   return {
  //     transform: [
  //       { translateY: mascotTranslateY.value },
  //       { rotate: `${rotate}deg` },
  //     ],
  //   };
  // });

  // Change this style block
  const mascotAnimStyle = useAnimatedStyle(() => {
    // Use a derived value approach for the rotation to keep it clean
    const rotationValue = mascotTranslateY.value < 0
      ? -6 * (mascotTranslateY.value / -18)
      : 6 * (mascotTranslateY.value / 18);

    return {
      transform: [
        { translateY: mascotTranslateY.value },
        // Ensure the string is treated as a fresh value
        { rotate: `${rotationValue}deg` as any },
      ],
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      // pagingEnabled
      >
        {/*SECTION 1 - HERO */}
        <LinearGradient
          colors={["#1E4ED8", "#3B82F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.heroSection,
            {
              // height: SCREEN_HEIGHT - tabBarHeight,
              height: SCREEN_HEIGHT * 0.5
            },
          ]}
          >
          {/* Animated Gradient Overlay */}
          <AnimatedGradientBackground
            currentIndex={activeSlide}
            height={SCREEN_HEIGHT - tabBarHeight}
          />
          {/* HEADER */}
          <View style={styles.header}>
            {/* Wrap images in a row container */}
            <View style={styles.logoContainer}>

              <Image
                source={require("../../assets/bing.png")}
                style={styles.textLogo}
                resizeMode="contain" // Ensures text doesn't stretch weirdly
              />
              <Image
                source={require("../../assets/mascot1.png")}
                style={styles.mascotLogo}
              />
              <Image
                source={require("../../assets/chun.png")}
                style={styles.textLogo}
                resizeMode="contain" // Ensures text doesn't stretch weirdly
              />
              {/* <LogoutButton /> */}
            </View>

            <Pressable onPress={() => setDrawerVisible(true)}>
              <Ionicons name="menu" size={30} color="#fff" />
            </Pressable>
          </View>

          {/* CONTENT */}
          <View style={styles.content}>
            {/* <View style={{ marginTop: -120 }}>
              <AnimatedReanimated.View style={mascotAnimStyle}>
                <Image
                  source={require("../../assets/mascot-sitting.avif")}
                  style={styles.mascotImage}
                />
              </AnimatedReanimated.View>
            </View> */}

            {/* <BlurView intensity={32} tint="light" style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>Since 2012 — Now in Sri Lanka</Text>
            </BlurView> */}

            {/* Animated Slide Component */}
            <SlideComponent key={activeSlide} slide={slides[activeSlide]} />
          </View>

          {/* BOTTOM */}
          <View style={styles.bottomRow}>
            <View style={{ flexDirection: "row", gap: 6 }}>
              {slides.map((_, i) =>
                i === activeSlide ? (
                  <View key={i} style={styles.progressBar}>
                    {/* Use AnimatedReanimated here, NOT the standard Animated */}
                    <AnimatedReanimated.View
                      style={[
                        styles.progressFill,
                        progressFillStyle, // Use the style we created in Step 3
                      ]}
                    />
                  </View>
                ) : (
                  <View key={i} style={styles.progressDot} />
                )
              )}
            </View>
          </View>
        </LinearGradient>

        {/*SECTION 2 - PRODUCTS */}
        <View style={styles.productsSection}>
          {/* <Text style={styles.superTitle}>OUR MENU</Text> */}
          <Text style={styles.sectionTitle}>Explore Our Products</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionDescription}>
            From signature bubble teas to creamy soft-serve ice cream, discover
            our range of refreshing beverages and treats.
          </Text>

          {/* PRODUCT CATEGORY CHIPS */}

          <View style={styles.categoryWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent} // Adds padding to ends
            >
              {categories.map((cat) => {
                const active = cat === selectedCategory;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Left Fade */}
            <LinearGradient
              colors={['rgba(248, 250, 252, 1)', 'rgba(248, 250, 252, 0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.leftFade}
              pointerEvents="none"
            />

            {/* Right Fade */}
            <LinearGradient
              colors={['rgba(248, 250, 252, 0)', 'rgba(248, 250, 252, 1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.rightFade}
              pointerEvents="none"
            />
          </View>

          {/* PRODUCTS GRID */}
          <View style={styles.grid}>
            {filteredProducts.map((p, i) => (
              <Pressable
                key={i}
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.cardPressed,
                ]}
              >
                <View style={styles.cardTop}>
                  {p.popular && (
                    <View style={styles.badgeTopLeft}>
                      <Text style={styles.badgeTopLeftText}>{'Popular'}</Text>
                    </View>
                  )}
                  <BlurView intensity={30} tint="light" style={styles.badgeTopRight}>
                    <Text style={styles.badgeTopRightText}>{p.category}</Text>
                  </BlurView>
                  <Image
                    source={p.image}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.cardBottom}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {p.title}
                  </Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    {p.description}
                  </Text>
                  <Pressable style={styles.priceButton}>
                    <Text style={styles.priceButtonText}>{p.price}</Text>
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.fixedIconContainer}>
        <Ionicons name="moon-outline" size={22} color="#fff" />
      </View>

      <MenuDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  slideContainer: {
    width: "100%",
    alignItems: "center",
  },
  gradientBackgroundContainer: {
    ...StyleSheet.absoluteFillObject, // Ensures full coverage of the screen
    flex: 1, // Stretches to fill the parent container
    overflow: "hidden",
  },
  gradientLayer: {
    ...StyleSheet.absoluteFillObject, // Ensures full coverage of the screen
  },
  gradientLayerAbsolute: {
    ...StyleSheet.absoluteFillObject, // Ensures full coverage of the screen
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    opacity: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Aligns mascot and text vertically
  },
  mascotLogo: {
    width: 30, // Slightly smaller looks more "premium"
    height: 40,
    marginRight: 4,
  },
  textLogo: {
    width: 40, // Fixed width usually works better than % for small logos
    height: 30,
  },
  card: {
    marginLeft: -7,
    marginRight: -7,
    width: "50%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 16,
    // overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  cardTop: {
    backgroundColor: "#F3F7FD",
    // backgroundColor: "#0f6fff19",
    borderTopEndRadius: 18,
    borderTopStartRadius: 18,
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 14,
    alignItems: "center",
    position: "relative",
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  cardBottom: {
    borderBottomEndRadius: 18,
    borderBottomStartRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  cardPressed: {
    // shadowColor: "#0F172A",
    // shadowOpacity: 10.15, // Increased slightly for visibility
    // shadowRadius: 10,    // Blur radius
    shadowOffset: { width: 0, height: 0 }, // 0,0 puts it on all sides
    backgroundColor: "#FFFFFF",
    transform: [{ translateY: -6 }],
    // shadowOpacity: 0.16,
    // shadowRadius: 24,
    elevation: 140,
  },

  badgeTopLeft: {
    position: "absolute",
    top: 12,
    left: 8,
    backgroundColor: "#3B82F6",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 999,

    // bring to front
    zIndex: 10,
    elevation: 10, // important for Android

    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  badgeTopLeftText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  badgeTopRight: {
    position: "absolute",
    top: 10,
    right: 6,
    // backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 1,
    overflow: "hidden",
    borderColor: "rgba(59,130,246,0.2)",

    // bring to front
    zIndex: 10,
    elevation: 10, // important for Android
  },

  badgeTopRightText: {
    color: "#3B82F6",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // productImage: {
  //   width: 112,
  //   height: 140,
  //   marginTop: 8,
  //   marginBottom: 8,
  // },
  productImage: {
    width: 112,
    height: 140,
    marginTop: 8,
    marginBottom: 8,

    // iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 }, // 👈 push shadow UP
    shadowOpacity: 0.2,
    shadowRadius: 6,

    // Android
    elevation: 6,
  },

  logoImage: {
    width: 30,
    height: 30,
    marginBottom: 8,
  },

  logoLabel: {
    color: "#374151",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  cardTitle: {
    fontFamily: "Poppins-ExtraBold",
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },

  cardDesc: {
    fontFamily: "Poppins-Regular",
    fontSize: 9,
    color: "rgb(148, 163, 184)",
    lineHeight: 16,
    marginBottom: 18,
  },

  priceButton: {
    width: "100%",
    backgroundColor: "#EFF6FF",
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  priceButtonText: {
    color: "#3B82F6",
    fontWeight: "800",
    fontSize: 14,
  },

  heroSection: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    position: "relative",
    overflow: "hidden",
  },
  
  heroContent: {
    position: "relative",
    zIndex: 1,
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
  },
  
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  content: {
    alignItems: "center",
  },

  mascotImage: {
    width: 150,
    height: 150,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,

    // Android shadow
    elevation: 8,
  },

  // badge: {
  //   borderRadius: 999,
  //   padding: 8,
  //   // marginVertical: 10,
  //   marginTop: 50,
  // },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 18,
    overflow: "hidden",
    marginTop: 50,
    marginBottom: 10,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginRight: 10,
  },
  badgeText: {
    color: "#D1FAE5",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  title: {
    fontFamily: "Poppins-ExtraBold",
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
  },

  subtitle: {
    fontFamily: "Poppins-SemiBold",
    color: "#FCD34D",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 28,
    textAlign: "center",
    marginTop: -2,
  },

  description: {
    // color: "#E0F2FE",
    color: "rgba(255,255,255,0.82)",
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 22,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },

  primaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 999,
    width: 180,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",

    // 👇 SHADOW (iOS)
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    // 👇 ANDROID
    elevation: 6,
  },

  primaryButtonText: {
    color: "#307EF2",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    fontWeight: "700",
  },

  secondaryButton: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "rgba(255,255,255,0.02)",
    paddingVertical: 12,
    borderRadius: 999,
    width: 140, // 👈 SAME WIDTH as primary
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: "#fff",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
  },

  progressBar: {
    width: 32,
    height: 6,
    backgroundColor: "#93C5FD",
    borderRadius: 3,
    overflow: "hidden",
  },

  progressFill: {
    height: 6,
    backgroundColor: "#fff",
  },

  progressDot: {
    width: 6,
    height: 6,
    backgroundColor: "#93C5FD",
    borderRadius: 3,
  },

  fixedIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(15, 23, 42, 0.66)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  productsSection: {
    backgroundColor: "#F8FAFC",
    padding: 20,
    justifyContent: "center",
  },

  superTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    fontWeight: "700",
    color: "#3b82f6", // Vibrant blue
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: "center",
  },

  sectionTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
    textAlign: "center",
  },

  sectionDescription: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#6b7280", // Muted gray
    textAlign: "center",
    lineHeight: 18,
    maxWidth: '90%', // Prevents text from hitting the screen edges
    alignSelf: "center",
    marginBottom: 2,
  },

  divider: {
    width: 60,
    height: 4,
    backgroundColor: "#3b82f6",
    borderRadius: 2,
    marginBottom: 20,
    alignSelf: "center",
  },

  categoryWrapper: {
    position: 'relative',
    backgroundColor: '#F9FAFB', // Match the screen background
  },
  scrollContent: {
    paddingHorizontal: 20, // Give space for the fade effect
    paddingVertical: 10,
  },
  chip: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB', // Subtle light gray border
  },
  chipActive: {
    backgroundColor: '#3B82F6',
    borderWidth: 0, // Remove border for active
    // Shadow for iOS
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 6,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563', // Premium slate gray
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  // Fade Effects
  leftFade: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 30,
    zIndex: 2,
  },
  rightFade: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 30,
    zIndex: 2,
  },

  // chip: {
  //   padding: 10,
  //   borderRadius: 999,
  //   borderWidth: 1,
  //   marginRight: 10,
  // },

  // chipActive: {
  //   backgroundColor: "#3B82F6",
  // },

  // chipText: {
  //   color: "#374151",
  // },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
  },

  badgesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  badgeLeft: {
    backgroundColor: "#3B82F6",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  badgeLeftText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  badgeRight: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },

  badgeRightText: {
    color: "#3B82F6",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});