☕ Premium Tea, Coffee & Cake App
A premium Tea, Coffee, and Cake delivery application designed for an artisan cafe experience. Developed by Swapnil Kathale.

This application implements a robust multi-navigator architecture, full-lifecycle session authentication, dynamic cafe-themed styling, and state-managed cart operations. It is built using the latest Expo SDK 55 and TypeScript.

✨ Key Features
🌐 Multi-Navigator Architecture
Auth Stack: Seamless flow between Onboarding, Login, and Registration.

Drawer Navigation: Sidebar access with dynamic user profiles, theme toggles, and account management.

Tab Navigation: Core navigation (Home, Search, Orders, Profile) with consistent iconography.

Stack Navigation: Integrated flow for Restaurants, Menus, Address management, and Cart/Checkout.

🔐 Session-Based Auth System
Live Integration: Seamlessly communicates with FreeAPI endpoints (/users/register, /users/login).

JWT Persistence: Secure session handling using @react-native-async-storage/async-storage.

Profile Sync: Automatic background validation (/users/current-user) on app launch.

🎨 Artisan Cafe Design System
Curated Palette: Warm espresso browns, creamy off-whites, and soft textures designed specifically for a premium cafe brand.

Dynamic Theming: Context-aware stylesheets that toggle between "Light" and "Dark" modes instantly via the Settings drawer.

⚡ Core Context Providers
AuthProvider: Manages global authentication, user profile state, and session tokens.

ThemeProvider: Controls the application's visual identity (colors, borders, and typography).

CartProvider: Handles complex state including subtotal arithmetic, tax calculations (18% GST), and order history.

🛠️ Tech Stack
Framework: React Native / Expo (SDK 55)

Language: TypeScript

Navigation: React Navigation v7

State Management: React Context API

Icons: @expo/vector-icons (Ionicons)

📂 Project Structure
```
food-delivery-app/
├── App.tsx                    # Roots Providers & entrypoint
├── babel.config.js            # Reanimated plugin configuration
├── package.json               # Lockfiles & dependencies
├── README.md                  # Project Documentation
└── src/
    ├── context/               # Global State Managers
    │   ├── AuthContext.tsx    # Session, JWT, and API actions
    │   ├── CartContext.tsx    # In-memory Cart and Order History
    │   └── ThemeContext.tsx   # Cafe-themed visual tokens (Light/Dark)
    ├── data/                  
    │   └── resturants.ts      # Cafe categories, coffees, teas & cakes
    ├── navigations/           
    │   └── RootNavigation.tsx # Stack, Drawer, and Tab routing
    ├── screens/               # Premium UI Screens
    │   ├── AddressScreen.tsx
    │   ├── CartScreen.tsx
    │   ├── HomeScreen.tsx
    │   ├── LoginScreen.tsx
    │   ├── OnBoardingScreen.tsx
    │   ├── OrdersScreen.tsx
    │   ├── ProfileScreen.tsx
    │   ├── RegisterScreen.tsx
    │   ├── ResturantScreen.tsx
    │   ├── SearchScreen.tsx
    │   └── SettingScreen.tsx
    └── types/
        └── types.ts           # Shared typings and route params
```

🚀 Getting Started
1. Installation
Clone the repository and install the required dependencies:

```bash
npm install
```

2. Verify Compatibility
Ensure your local environment dependencies are healthy:

```bash
npx expo-doctor
```

3. Boot the Application
Clear the packager cache to ensure all navigation and context changes are registered correctly:


```bash
npx expo start --c
```

- Press i to boot on the iOS Simulator.
- Press a to boot on the Android Emulator.
- Scan the QR code to run on a physical device using the Expo Go application.

🛡️ Authentication Architecture
All network requests are directed towards the FreeAPI base URL: [https://api.freeapi.app/api/v1](https://api.freeapi.app/api/v1)

Session Flow:

Login: Credentials are sent; on success, a JWT accessToken is returned.

Persistence: The token is stored in AsyncStorage.

Validation: On startup, the AuthProvider attempts to fetch /users/current-user. If the token is invalid, the app forces a logout and redirects to the Auth Stack.

Cleanup: logout() clears local storage and resets the authentication state, triggering a UI redirect.

Developed by Swapnil Kathale