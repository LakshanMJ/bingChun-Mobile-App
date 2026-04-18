import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const mascot = require('../../assets/mascot-sitting.avif');

export default function SignUpScreen() {
  const fadeOpacity = useSharedValue(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [focused, setFocused] = useState('');

  useEffect(() => {
    fadeOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
    transform: [{ translateY: withTiming(fadeOpacity.value === 1 ? 0 : 20, { duration: 800 }) }]
  }));

  const handleSignUp = async () => {
    setLoading(true);
    // Add your signup logic here (Firebase, Supabase, etc.)
    setTimeout(() => {
      setLoading(false);
      router.replace('/login');
    }, 1500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a1a3c' }}>
      <LinearGradient colors={["#0a1a3c", "#1746a0", "#3b82f6"]} style={StyleSheet.absoluteFill} />
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <Animated.View style={[fadeStyle, { paddingHorizontal: 20 }]}>
            
            <View style={styles.header}>
              <Image source={mascot} style={styles.miniMascot} resizeMode="contain" />
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join the community today</Text>
            </View>

            <BlurView intensity={40} tint="light" style={styles.card}>
              <View style={styles.inputGroup}>
                {/* Name Input */}
                <View style={[styles.inputWrap, focused === 'name' && styles.inputFocused]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#e0e6f7"
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused('')}
                    onChangeText={(t) => setForm({...form, name: t})}
                  />
                </View>

                {/* Email Input */}
                <View style={[styles.inputWrap, focused === 'email' && styles.inputFocused]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#e0e6f7"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    onChangeText={(t) => setForm({...form, email: t})}
                  />
                </View>

                {/* Password Input */}
                <View style={[styles.inputWrap, focused === 'password' && styles.inputFocused]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#e0e6f7"
                    secureTextEntry
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    onChangeText={(t) => setForm({...form, password: t})}
                  />
                </View>

                <Pressable 
                  style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
                  onPress={handleSignUp}
                  disabled={loading}
                >
                  <Text style={styles.btnText}>{loading ? 'Creating...' : 'Sign Up'}</Text>
                </Pressable>
              </View>
            </BlurView>

            <Pressable onPress={() => router.push('/login')} style={{ marginTop: 25, alignItems: 'center' }}>
              <Text style={styles.footerText}>
                Already have an account? <Text style={styles.linkText}>Login</Text>
              </Text>
            </Pressable>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 20 },
  miniMascot: { width: 70, height: 70, marginBottom: 10 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#e0e6f7', fontSize: 16, marginTop: 4 },
  card: { borderRadius: 28, overflow: 'hidden', padding: 25 },
  inputGroup: { width: '100%' },
  inputWrap: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    marginBottom: 15,
  },
  inputFocused: { borderColor: '#3b82f6' },
  input: { color: '#fff', padding: 16, fontSize: 16 },
  btn: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  btnPressed: { opacity: 0.8 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  footerText: { color: '#e0e6f7', fontSize: 14 },
  linkText: { color: '#fff', fontWeight: '800' }
});