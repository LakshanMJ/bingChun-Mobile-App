import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Animated, Easing, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Easing as ReanimatedEasing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { login } from '@/components/utils/auth';

const mascot = require('../../assets/mascot-sitting.avif');

export default function LoginScreen() {
  // Fade-in animation
  const fadeAnim = useState(new Animated.Value(0))[0];
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, []);

  // Mascot floating animation
  const mascotY = useSharedValue(0);
  useEffect(() => {
    mascotY.value = withRepeat(
      withTiming(-18, { duration: 1600, easing: ReanimatedEasing.inOut(ReanimatedEasing.ease) }),
      -1,
      true
    );
  }, []);
  const mascotAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: mascotY.value }],
  }));

  // Mascot shadow animation
  const mascotShadowAnimStyle = useAnimatedStyle(() => {
    const t = mascotY.value / -18; // 0 (bottom) to 1 (top)
    const scale = 1.25 - 0.4 * t; // 1.25 (bottom), 0.85 (top)
    const opacity = 0.22 - 0.10 * t; // 0.22 (bottom), 0.12 (top)
    return {
      transform: [{ scaleX: scale }, { scaleY: scale * 0.5 }],
      opacity,
    };
  });

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState('');
  const [loading, setLoading] = useState(false);

  // Button press animation
  const [loginScale] = useState(new Animated.Value(1));
  const animateLoginPress = (to: any) => {
    Animated.spring(loginScale, {
      toValue: to,
      useNativeDriver: true,
      speed: 18,
      bounciness: 6,
    }).start();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a1a3c' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Background gradient */}
        <LinearGradient
          colors={["#0a1a3c", "#1746a0", "#3b82f6"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Radial glow overlay */}
        <View pointerEvents="none" style={styles.radialGlow} />
        <Animated.View style={{ flex: 1, opacity: fadeAnim, justifyContent: 'center' }}>
          {/* Mascot + shadow */}
          <View style={styles.mascotContainer}>
            <Animated.View style={[styles.mascotShadow, mascotShadowAnimStyle]} />
            <Animated.View style={[styles.mascot, mascotAnimStyle]}>
              <Image source={mascot} style={{ width: 92, height: 92 }} resizeMode="contain" />
            </Animated.View>
          </View>
          {/* Glassy card */}
          <View style={styles.cardWrap}>
            <BlurView intensity={40} tint="light" style={styles.cardBlur}>
              <View style={styles.cardContent}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>
                <View style={{ height: 18 }} />
                {/* Email */}
                <View style={[styles.inputWrap, focused === 'email' && styles.inputFocused]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#e0e6f7"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                  />
                </View>
                {/* Password */}
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
                <View style={styles.forgotRow}>
                  <Pressable>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </Pressable>
                </View>
                {/* Login Button */}
                <Animated.View style={{ transform: [{ scale: loginScale }] }}>
                  <Pressable
                    style={({ pressed }) => [styles.loginBtn, pressed && styles.loginBtnPressed]}
                    onPressIn={() => animateLoginPress(0.96)}
                    onPressOut={() => animateLoginPress(1)}
                    onPress={async () => {
                      setLoading(true);

                      setTimeout(async () => {
                        await login(); // ✅ save login state
                        setLoading(false);
                        router.replace('/(tabs)' as any);
                      }, 1200);
                    }}
                    disabled={loading}
                  >
                    <Text style={styles.loginBtnText}>{loading ? 'Loading...' : 'Login'}</Text>
                  </Pressable>
                </Animated.View>
                {/* Create Account */}
                <Pressable style={styles.createBtn}>
                  <Text style={styles.createBtnText}>Create Account</Text>
                </Pressable>
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
    // Simulate a subtle blue radial glow
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
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  subtitle: {
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
  loginBtnPressed: {
    backgroundColor: '#1746a0',
    shadowOpacity: 0.28,
    transform: [{ scale: 0.96 }],
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
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
