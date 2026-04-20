import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const mascot = require('../../assets/mascot-sitting.avif');

// Import flavor images
const flavorImages = {
  blueberryBobo: require('../../assets/product_images/Blueberry-Bobo-Tea-500u.avif'),
  blueberryMilkshake: require('../../assets/product_images/Blueberry-Milkshake-500u.avif'),
  boboMilkTea: require('../../assets/product_images/Bobo-Milk-Tea-500u.avif'),
  chocolateIceCream: require('../../assets/product_images/Chocolate-Ice-Cream.avif'),
  grapeBobTea: require('../../assets/product_images/Grape-Bobo-Tea-700ml.avif'),
  BlueberrySundae: require('../../assets/product_images/Blueberry-Sundae-360.avif'),
  
};

const FLAVOR_OPTIONS = [
  { id: 'blueberryBobo', name: 'Blueberry Bobo Tea', image: flavorImages.blueberryBobo },
  { id: 'blueberryMilkshake', name: 'Blueberry Milkshake', image: flavorImages.blueberryMilkshake },
  { id: 'boboMilkTea', name: 'Bobo Milk Tea', image: flavorImages.boboMilkTea },
  { id: 'chocolateIceCream', name: 'Chocolate Ice Cream', image: flavorImages.chocolateIceCream },
  { id: 'grapeBobTea', name: 'Grape Bobo Tea', image: flavorImages.grapeBobTea },
  { id: 'BlueberrySundae', name: 'Blueberry Sundae', image: flavorImages.BlueberrySundae },
];

export default function SignUpScreen() {
  const fadeOpacity = useSharedValue(0);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [form, setForm] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    password: '',
    dateOfBirth: new Date(2000, 0, 1),
    dateOfBirthString: '',
    selectedFlavors: []
  });
  const [focused, setFocused] = useState('');

  useEffect(() => {
    fadeOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
    transform: [{ translateY: withTiming(fadeOpacity.value === 1 ? 0 : 20, { duration: 800 }) }]
  }));

  const toggleFlavor = (flavorId: string) => {
    setForm(prev => {
      const selected = prev.selectedFlavors.includes(flavorId)
        ? prev.selectedFlavors.filter(id => id !== flavorId)
        : prev.selectedFlavors.length < 3
          ? [...prev.selectedFlavors, flavorId]
          : prev.selectedFlavors;
      return { ...prev, selectedFlavors: selected };
    });
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (date: Date) => {
    setForm({
      ...form,
      dateOfBirth: date,
      dateOfBirthString: formatDate(date)
    });
  };

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
              <Text style={styles.subtitle}>Join the sweet escape !</Text>
            </View>

            <BlurView intensity={40} tint="light" style={styles.card}>
              <View style={styles.inputGroup}>
                {/* Full Name Input */}
                <View style={[styles.inputWrap, focused === 'name' && styles.inputFocused]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#e0e6f7"
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused('')}
                    onChangeText={(t) => setForm({ ...form, name: t })}
                  />
                </View>

                {/* Mobile Number Input */}
                <View style={[styles.inputWrap, focused === 'mobile' && styles.inputFocused]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    placeholderTextColor="#e0e6f7"
                    keyboardType="phone-pad"
                    onFocus={() => setFocused('mobile')}
                    onBlur={() => setFocused('')}
                    onChangeText={(t) => setForm({ ...form, mobileNumber: t })}
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
                    onChangeText={(t) => setForm({ ...form, email: t })}
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
                    onChangeText={(t) => setForm({ ...form, password: t })}
                  />
                </View>

                {/* Date of Birth Input */}
                <Pressable
                  style={[styles.inputWrap, styles.datePickerTrigger]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={[styles.dateInput, { paddingVertical: 16 }]}>
                    {form.dateOfBirthString || 'Select Date of Birth'}
                  </Text>
                </Pressable>

                <DateTimePickerModal
                  isVisible={showDatePicker}
                  mode="date"
                  onConfirm={(date) => {
                    handleDateChange(date);
                    setShowDatePicker(false);
                  }}
                  onCancel={() => setShowDatePicker(false)}
                  maximumDate={new Date()}
                  date={form.dateOfBirth}
                  isDarkModeEnabled={true}
                  textColor="#fff"
                />

                {/* Favorite Flavors Section */}
                <View style={styles.flavorSection}>
                  <Text style={styles.flavorTitle}>Select 3 Favorite Flavors</Text>
                  <Text style={styles.flavorSubtitle}>
                    ({form.selectedFlavors.length}/3 selected)
                  </Text>
                  <View style={styles.flavorGrid}>
                    {FLAVOR_OPTIONS.map((flavor) => (
                      <Pressable
                        key={flavor.id}
                        style={[
                          styles.flavorCard,
                          form.selectedFlavors.includes(flavor.id) && styles.flavorCardSelected
                        ]}
                        onPress={() => toggleFlavor(flavor.id)}
                      >
                        <Image
                          source={flavor.image}
                          style={styles.flavorImage}
                          resizeMode="contain"
                        />
                        <Text style={styles.flavorName}>{flavor.name}</Text>
                        {form.selectedFlavors.includes(flavor.id) && (
                          <View style={styles.checkmark}>
                            <Text style={styles.checkmarkText}>✓</Text>
                          </View>
                        )}
                      </Pressable>
                    ))}
                  </View>
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
  title: { color: '#fff', fontSize: 28, fontWeight: '800',fontFamily: "Poppins-ExtraBold" },
  subtitle: { color: '#e0e6f7', fontSize: 16, marginTop: 4, fontFamily: "Poppins-Regular"},
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
  input: { color: '#fff', padding: 16, fontSize: 16, fontFamily: "Poppins-Regular"},
  dateInput: { color: '#e0e6f7', paddingHorizontal: 16, fontSize: 16, fontFamily: "Poppins-Regular" },
  datePickerTrigger: {
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  flavorSection: {
    marginVertical: 20,
    marginBottom: 20,
  },
  flavorTitle: {
    fontFamily: "Poppins-SemiBold",
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  flavorSubtitle: {
    fontFamily: "Poppins-Regular",
    color: '#e0e6f7',
    fontSize: 13,
    marginBottom: 15,
  },
  flavorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  flavorCard: {
    width: '48%',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  flavorCardSelected: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  flavorImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  flavorName: {
    fontFamily: "Poppins-Regular",
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  btn: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  btnPressed: { opacity: 0.8 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '700', fontFamily: "Poppins-SemiBold" },
  footerText: { color: '#e0e6f7', fontSize: 14, fontFamily: "Poppins-Regular" },
  linkText: { color: '#fff', fontWeight: '800', fontFamily: "Poppins-SemiBold" },
});