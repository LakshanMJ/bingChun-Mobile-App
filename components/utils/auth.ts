import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "isLoggedIn";

export const login = async () => {
  await AsyncStorage.setItem(KEY, "true");
};

export const logout = async () => {
  await AsyncStorage.removeItem(KEY);
};

export const isLoggedIn = async () => {
  const value = await AsyncStorage.getItem(KEY);
  return value === "true";
};