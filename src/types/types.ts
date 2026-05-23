import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type {
  CompositeNavigationProp,
  RouteProp,
} from "@react-navigation/native";

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  items: MenuItem[];
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export type CartItem = MenuItem & { quantity: number; restaurantId: string; restaurantName: string };

// Auth Stack
export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

// Home Stack (nested inside Home Tab)
export type HomeStackParamList = {
  Home: undefined;
  Search: undefined;
  Resturant: { resturantId: string; resturantName?: string };
  Cart: undefined;
  Address: undefined; // Added Address screen
};

// Bottom Tab Navigator
export type TabParamList = {
  HomeTab: undefined;
  Search: undefined;
  Orders: { tip?: number }; // Added optional tip param
  Profile: undefined;
};

// Drawer Navigator
export type DrawerParamList = {
  MainTabs: undefined;
  MyOrders: undefined;
  Settings: undefined;
  Help: undefined;
  Logout: undefined;
};

// Composed navigation props for screens deep inside nested navigators
export type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, "Home">,
  CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList>,
    DrawerNavigationProp<DrawerParamList>
  >
>;

export type RestaurantDetailScreenRouteProp = RouteProp<
  HomeStackParamList,
  "Resturant"
>;

export type RestaurantDetailNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "Resturant"
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends DrawerParamList {}
  }
}