import { login } from '@/components/utils/auth';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {

    const mascot = require('../../assets/mascot-sitting.avif');
    const fadeOpacity = useSharedValue(0);

    useEffect(() => {
        fadeOpacity.value = withTiming(1, { duration: 700 });
    }, []);

    const fadeStyle = useAnimatedStyle(() => ({
        opacity: fadeOpacity.value,
    }));

    const mascotY = useSharedValue(0);
    useEffect(() => {
        mascotY.value = withRepeat(
            withTiming(-18, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const mascotAnimStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: mascotY.value }],
    }));

    const mascotShadowAnimStyle = useAnimatedStyle(() => {
        const t = mascotY.value / -18;
        const scale = 1.25 - 0.4 * t;
        return {
            transform: [{ scaleX: scale }, { scaleY: scale * 0.5 }],
            opacity: 0.22 - 0.10 * t,
        };
    });

    const loginScale = useSharedValue(1);
    const btnAnimStyle = useAnimatedStyle(() => ({
        transform: [{ scale: loginScale.value }],
    }));

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [focused, setFocused] = useState('');
    const [loading, setLoading] = useState(false);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0a1a3c' }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <LinearGradient
                    colors={["#0a1a3c", "#1746a0", "#3b82f6"]}
                    style={StyleSheet.absoluteFill}
                />

                <Animated.View style={[{ flex: 1, justifyContent: 'center' }, fadeStyle]}>

                    <View style={styles.mascotContainer}>
                        <Animated.View style={[styles.mascotShadow, mascotShadowAnimStyle]} />
                        <Animated.View style={[styles.mascot, mascotAnimStyle]}>
                            <Image source={mascot} style={{ width: 92, height: 92 }} resizeMode="contain" />
                        </Animated.View>
                    </View>

                    <View style={styles.cardWrap}>
                        <BlurView intensity={40} tint="light" style={styles.cardBlur}>
                            <View style={styles.cardContent}>
                                <Text style={styles.title}>Welcome Back</Text>
                                <Text style={styles.subtitle}>Sign in to continue</Text>

                                <View style={[styles.inputWrap, focused === 'email' && styles.inputFocused]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email"
                                        placeholderTextColor="#e0e6f7"
                                        value={email}
                                        onChangeText={setEmail}
                                        onFocus={() => setFocused('email')}
                                        onBlur={() => setFocused('')}
                                    />
                                </View>

                                <View style={[styles.inputWrap, focused === 'password' && styles.inputFocused]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Password"
                                        placeholderTextColor="#e0e6f7"
                                        secureTextEntry
                                        value={password}
                                        onChangeText={setPassword}
                                        onFocus={() => setFocused('password')}
                                        onBlur={() => setFocused('')}
                                    />
                                </View>

                                <Animated.View style={btnAnimStyle}>
                                    <Pressable
                                        style={styles.loginBtn}
                                        onPressIn={() => { loginScale.value = withSpring(0.96); }}
                                        onPressOut={() => { loginScale.value = withSpring(1); }}
                                        onPress={async () => {
                                            setLoading(true);
                                            await login();
                                            setLoading(false);
                                            router.replace('/(tabs)');
                                        }}
                                        disabled={loading}
                                    >
                                        <Text style={styles.loginBtnText}>{loading ? 'Loading...' : 'Login'}</Text>
                                    </Pressable>
                                    <Pressable
                                        style={styles.signUpBtn}
                                        onPressIn={() => { loginScale.value = withSpring(0.96); }}
                                        onPressOut={() => { loginScale.value = withSpring(1); }}
                                        onPress={async () => {
                                            // setLoading(true);
                                            await login();
                                            // setLoading(false);
                                            router.replace('/signup');
                                        }}
                                        disabled={loading}
                                    >
                                        <Text style={styles.signUpText}>{loading ? 'Loading...' : 'Create Account'}</Text>
                                    </Pressable>
                                </Animated.View>
                            </View>
                        </BlurView>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    radialGlow: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        zIndex: 0,
        borderRadius: 9999,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.18,
        shadowRadius: 80,
        elevation: 40,
    },
    mascotContainer: {
        alignItems: 'center',
        marginBottom: -36,
        marginTop: 24,
        zIndex: 2,
    },
    mascot: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    mascotShadow: {
        position: 'absolute',
        top: 82,
        left: '50%',
        marginLeft: -36,
        width: 72,
        height: 24,
        backgroundColor: '#0a1a3c',
        borderRadius: 40,
        opacity: 0.22,
        zIndex: 1,
    },
    cardWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 18,
        marginTop: 0,
    },
    cardBlur: {
        borderRadius: 28,
        overflow: 'hidden',
        padding: 0,
        width: 340,
        maxWidth: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 8 },
        elevation: 12,
    },
    cardContent: {
        paddingHorizontal: 28,
        paddingVertical: 32,
        alignItems: 'center',
    },
    title: {
        fontFamily: "Poppins-ExtraBold",
        color: '#fff',
        fontSize: 26,
        fontWeight: '800',
        letterSpacing: 0.2,
        marginBottom: 2,
    },
    subtitle: {
        fontFamily: "Poppins-Regular",
        color: '#e0e6f7',
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 2,
    },
    inputWrap: {
        width: '100%',
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginTop: 16,
        borderWidth: 1.5,
        borderColor: 'rgba(59,130,246,0.08)',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
    },
    input: {
        fontFamily: "Poppins-Regular",
        color: '#fff',
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontWeight: '500',
        letterSpacing: 0.1,
    },
    inputFocused: {
        borderColor: '#3b82f6',
        shadowColor: '#3b82f6',
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 6,
    },
    forgotRow: {
        width: '100%',
        alignItems: 'flex-end',
        marginTop: 8,
        marginBottom: 8,
    },
    forgotText: {
        color: '#8ec3ff',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.1,
    },
    loginBtn: {
        marginTop: 18,
        backgroundColor: '#2563eb',
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
        shadowColor: '#3b82f6',
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
        width: 220,
    },
    signUpBtn: {
        marginTop: 12,
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#93c5fd',
        width: 220,
    },
    loginBtnPressed: {
        backgroundColor: '#1746a0',
        shadowOpacity: 0.28,
        transform: [{ scale: 0.96 }],
    },
    loginBtnText: {
        fontFamily: "Poppins-SemiBold",
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    signUpText: {
        color: '#dbeafe',
        fontSize: 17,
        fontWeight: '700',
    },
    createBtn: {
        marginTop: 18,
        alignItems: 'center',
    },
    createBtnText: {
        color: '#8ec3ff',
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.1,
    },
});
