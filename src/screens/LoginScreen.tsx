import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const { width } = Dimensions.get("window");

interface LoginScreenProps {
  navigation: {
    navigate: (screenName: string, params?: any) => void;
  };
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { login } = useAuth();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    // Basic validation
    if (emailOrUsername.trim() === "" || password.trim() === "") {
      setErrorMessage("Please enter both username/email and password.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const result = await login(emailOrUsername.trim(), password);

    setLoading(false);
    if (!result.success) {
      setErrorMessage(result.error || "Authentication failed.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      
      {/* Visual Blob background decorations */}
      <View style={[styles.bgBlob, { backgroundColor: theme.primaryLight }]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Typography */}
          <View style={styles.headerContainer}>
            <View style={[styles.logoIcon, { backgroundColor: theme.primary }]}>
              <Ionicons name="cafe" size={32} color="#FFFFFF" />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: theme.subtext }]}>
              Log in to access your custom Cafe hub & live tracking!
            </Text>
          </View>

          {/* Login Card Form */}
          <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {errorMessage && (
              <View style={[styles.errorContainer, { backgroundColor: theme.primary + "15", borderColor: theme.primary }]}>
                <Ionicons name="alert-circle" size={20} color={theme.primary} />
                <Text style={[styles.errorText, { color: theme.text }]}>{errorMessage}</Text>
              </View>
            )}

            {/* Email/Username Input */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: theme.subtext }]}>USERNAME OR EMAIL</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <Ionicons name="person-outline" size={18} color={theme.subtext} style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter email or username"
                  placeholderTextColor={isDark ? "#808080" : "#A0A0A0"}
                  style={[styles.textInput, { color: theme.text }]}
                  value={emailOrUsername}
                  onChangeText={(text) => {
                    setEmailOrUsername(text);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: theme.subtext }]}>PASSWORD</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <Ionicons name="lock-closed-outline" size={18} color={theme.subtext} style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor={isDark ? "#808080" : "#A0A0A0"}
                  secureTextEntry={secureTextEntry}
                  style={[styles.textInput, { color: theme.text }]}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={theme.subtext}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleLogin}
              style={[styles.loginBtn, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.loginBtnText}>Log In</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Navigation */}
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: theme.subtext }]}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={[styles.registerLink, { color: theme.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgBlob: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    opacity: 0.6,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  logoIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 1.2,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 6,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1.2,
    paddingHorizontal: 12,
    height: 52,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    height: "100%",
  },
  eyeBtn: {
    padding: 4,
  },
  loginBtn: {
    borderRadius: 18,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "500",
  },
  registerLink: {
    fontSize: 14,
    fontWeight: "700",
  },
});

export default LoginScreen;