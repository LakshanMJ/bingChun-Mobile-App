import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, Image, Pressable, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.82;

interface MenuDrawerProps {
    visible: boolean;
    onClose: () => void;
}

export default function MenuDrawer({ visible, onClose }: MenuDrawerProps) {

    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(animation, {
                toValue: 1,
                duration: 300,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animation, {
                toValue: 0,
                duration: 300,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        }
    }, [visible, animation]);

    const overlayOpacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const drawerTranslateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [DRAWER_WIDTH, 0],
    });

    if (!visible) return null;

    return (
        <View style={styles.drawerOverlayContainer} pointerEvents="box-none">
            <Animated.View style={[styles.drawerBackdrop, { opacity: overlayOpacity }]}>
                <BlurView intensity={30} tint="dark" style={styles.drawerBackdrop} />
            </Animated.View>
            <Pressable style={styles.drawerTouchableArea} onPress={onClose} />
            <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: drawerTranslateX }] }]}>
                <View style={styles.drawerTopRow}>
                    <View style={styles.drawerLogoShell}>
                        <Image
                            source={require('../assets/mascot1.png')}
                            style={styles.drawerLogo}
                            resizeMode="contain"
                        />
                    </View>
                    <Pressable style={styles.drawerCloseButton} onPress={onClose}>
                        <Ionicons name="close" size={26} color="#3B82F6" />
                    </Pressable>
                </View>
                <View style={styles.divider} />
                <View style={styles.drawerMenuList}>
                    {['Home', 'Profile', 'Orders', 'Stores', 'Contact', 'Help and Support', 'About'].map((item) => (
                        <Pressable key={item} style={styles.drawerMenuItem} onPress={onClose}>
                            <Text style={styles.drawerMenuText}>{item}</Text>
                        </Pressable>
                    ))}
                </View>

                <View style={styles.drawerFooter}>
                    <Pressable style={styles.drawerActionButton} onPress={onClose}>
                        <Text style={styles.drawerActionText}>Order Now</Text>
                    </Pressable>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerOverlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 30,
    },
    drawerBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    drawerTouchableArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: width - DRAWER_WIDTH,
    },
    drawerContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        width: DRAWER_WIDTH,
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        paddingHorizontal: 24,
        paddingVertical: 28,
        shadowColor: '#0F172A',
        shadowOpacity: 0.16,
        shadowRadius: 24,
        shadowOffset: { width: -8, height: 14 },
        elevation: 20,
    },
    drawerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 28,
        marginBottom: 16,
    },
    drawerLogoShell: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: 'rgba(227, 22, 22, 0)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    drawerLogo: {
        marginTop: 16,
        width: 100,
        height: 100,
    },
    drawerCloseButton: {
        width: 42,
        height: 42,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    drawerMenuList: {
        marginTop: 12,
        paddingBottom: 24,
    },
    drawerMenuItem: {
        paddingVertical: 18,
    },
    drawerMenuText: {
        fontSize: 14,
        fontFamily: "Poppins-Bold",
        fontWeight: '700',
        color: '#374151',
        letterSpacing: 0.2,
    },
    drawerFooter: {
        marginTop: 'auto',
    },
    drawerActionButton: {
        width: '100%',
        borderRadius: 20,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#307EF2',
        shadowColor: '#307EF2',
        shadowOpacity: 0.28,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 12,
    },
    drawerActionText: {
        color: '#FFFFFF',
        fontFamily: "Poppins-Bold",
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.35,
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: 'rgba(125, 119, 119, 0.15)',
        marginVertical: 0,
        alignSelf: 'center',
    },
});