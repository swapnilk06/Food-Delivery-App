import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

// Screens
import OnBoardingScreen from "../screens/OnBoardingScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import ResturantScreen from "../screens/ResturantScreen";
import CartScreen from "../screens/CartScreen";
import AddressScreen from "../screens/AddressScreen";
import OrdersScreen from "../screens/OrdersScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingScreen from "../screens/SettingScreen";

// Context & Types
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import type {
  AuthStackParamList,
  HomeStackParamList,
  TabParamList,
  DrawerParamList,
} from "../types/types";

const Auth = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

function AuthStackNavigator() {
  return (
    <Auth.Navigator screenOptions={{ headerShown: false }}>
      <Auth.Screen name="Onboarding" component={OnBoardingScreen} />
      <Auth.Screen name="Login" component={LoginScreen} />
      <Auth.Screen name="Register" component={RegisterScreen} />
    </Auth.Navigator>
  );
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Search" component={SearchScreen} />
      <HomeStack.Screen name="Resturant" component={ResturantScreen} />
      <HomeStack.Screen name="Cart" component={CartScreen} />
      <HomeStack.Screen name="Address" component={AddressScreen} />
    </HomeStack.Navigator>
  );
}

function BottomTabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subtext,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.divider,
          elevation: 8,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 5,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          if (route.name === "HomeTab") iconName = focused ? "home" : "home-outline";
          else if (route.name === "Search") iconName = focused ? "search" : "search-outline";
          else if (route.name === "Orders") iconName = focused ? "receipt" : "receipt-outline";
          else if (route.name === "Profile") iconName = focused ? "person" : "person-outline";
          return <Ionicons name={iconName} size={focused ? size + 2 : size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ tabBarLabel: "Home" }} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function CustomDrawerContent(props: any) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return "SK";
    const parts = name.split(" ");
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: theme.background, flex: 1, justifyContent: "space-between" }}>
      <View style={{ flex: 1 }}>
        <View style={[styles.drawerHeader, { borderBottomColor: theme.divider }]}>
          <View style={[styles.avatar, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.avatarText, { color: theme.primary }]}>{user ? getInitials(user.fullName) : "SK"}</Text>
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={[styles.profileName, { color: theme.text }]} numberOfLines={1}>{user ? user.fullName : "Swapnil Kathale"}</Text>
            <Text style={[styles.profileEmail, { color: theme.subtext }]} numberOfLines={1}>{user ? user.email : "swapnil@cafe.com"}</Text>
          </View>
        </View>
        <View style={styles.itemListContainer}>
          <DrawerItemList {...props} />
        </View>
      </View>

      <View style={[styles.drawerFooter, { borderTopColor: theme.divider }]}>
        <View style={styles.themeToggleRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name={isDark ? "sunny" : "moon"} size={20} color={theme.text} />
            <Text style={[styles.footerActionText, { color: theme.text, marginLeft: 12 }]}>{isDark ? "Light Mode" : "Dark Mode"}</Text>
          </View>
          <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: "#DCDCDC", true: theme.primary }} thumbColor="#FFFFFF" />
        </View>

        <TouchableOpacity onPress={async () => { props.navigation.closeDrawer(); await logout(); }} style={styles.logoutBtn} activeOpacity={0.7}>
          <Ionicons name="log-out" size={20} color={theme.primary} />
          <Text style={[styles.footerActionText, { color: theme.primary, marginLeft: 12 }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  const { theme } = useTheme();
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false, drawerActiveTintColor: theme.primary, drawerInactiveTintColor: theme.text, drawerActiveBackgroundColor: theme.primaryLight, drawerStyle: { backgroundColor: theme.background, width: 280 }, drawerLabelStyle: { fontSize: 14, fontWeight: "700" } }}>
      <Drawer.Screen name="MainTabs" component={BottomTabNavigator} options={{ drawerLabel: "Home Dashboard", drawerIcon: ({ color, size }) => <Ionicons name="cafe" size={size} color={color} /> }} />
      <Drawer.Screen name="MyOrders" component={OrdersScreen} options={{ drawerLabel: "My Orders", drawerIcon: ({ color, size }) => <Ionicons name="receipt" size={size} color={color} /> }} />
      <Drawer.Screen name="Settings" component={SettingScreen} options={{ drawerLabel: "App Settings", drawerIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} /> }} />
    </Drawer.Navigator>
  );
}

export default function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
        <Text style={{ marginTop: 20, color: theme.primary, fontWeight: "800", fontSize: 16 }}>Brewing something special... ☕</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <DrawerNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: { padding: 20, paddingTop: 40, flexDirection: "row", alignItems: "center", borderBottomWidth: 1 },
  avatar: { width: 52, height: 52, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 20, fontWeight: "800" },
  profileTextContainer: { marginLeft: 14, flex: 1 },
  profileName: { fontSize: 16, fontWeight: "800" },
  profileEmail: { fontSize: 12, marginTop: 2 },
  itemListContainer: { paddingTop: 12 },
  drawerFooter: { padding: 16, borderTopWidth: 1, paddingBottom: 30 },
  themeToggleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingHorizontal: 4 },
  logoutBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 4 },
  footerActionText: { fontSize: 14, fontWeight: "700" },
});