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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const { width } = Dimensions.get("window");

interface RegisterScreenProps {
  navigation: {
    navigate: (screenName: string, params?: any) => void;
    goBack: () => void;
  };
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    // Form Validations
    if (
      fullName.trim() === "" ||
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (username.length < 3) {
      setErrorMessage("Username must be at least 3 characters.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const result = await register(
      username.trim().toLowerCase(),
      email.trim().toLowerCase(),
      password,
      fullName.trim()
    );

    setLoading(false);
    if (result.success) {
      Alert.alert(
        "🎉 Registration Successful",
        "Your account has been created on FreeAPI! You can now log in using your credentials.",
        [{ text: "Log In Now", onPress: () => navigation.navigate("Login") }]
      );
    } else {
      setErrorMessage(result.error || "Registration failed.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />

      {/* Decorative background blob */}
      <View style={[styles.bgBlob, { backgroundColor: theme.primaryLight }]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Back to Login circle */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backCircle, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <Ionicons name="arrow-back" size={20} color={theme.text} />
          </TouchableOpacity>

          {/* Typography Header */}
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: theme.subtext }]}>
              Join us for premium tea, coffee & freshly baked cakes!
            </Text>
          </View>

          {/* Registration Card Form */}
          <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {errorMessage && (
              <View style={[styles.errorContainer, { backgroundColor: theme.primary + "15", borderColor: theme.primary }]}>
                <Ionicons name="alert-circle" size={20} color={theme.primary} />
                <Text style={[styles.errorText, { color: theme.text }]}>{errorMessage}</Text>
              </View>
            )}

            {/* Full Name */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: theme.subtext }]}>FULL NAME</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <Ionicons name="person-outline" size={16} color={theme.subtext} style={styles.inputIcon} />
                <TextInput
                  placeholder="e.g. Swapnil Kathale"
                  placeholderTextColor={isDark ? "#808080" : "#A0A0A0"}
                  style={[styles.textInput, { color: theme.text }]}
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Username */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: theme.subtext }]}>USERNAME</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <Ionicons name="at-outline" size={16} color={theme.subtext} style={styles.inputIcon} />
                <TextInput
                  placeholder="e.g. swapnil"
                  placeholderTextColor={isDark ? "#808080" : "#A0A0A0"}
                  style={[styles.textInput, { color: theme.text }]}
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: theme.subtext }]}>EMAIL ADDRESS</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <Ionicons name="mail-outline" size={16} color={theme.subtext} style={styles.inputIcon} />
                <TextInput
                  placeholder="e.g. swapnil@cafe.com"
                  placeholderTextColor={isDark ? "#808080" : "#A0A0A0"}
                  style={[styles.textInput, { color: theme.text }]}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: theme.subtext }]}>PASSWORD</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <Ionicons name="lock-closed-outline" size={16} color={theme.subtext} style={styles.inputIcon} />
                <TextInput
                  placeholder="Minimum 6 characters"
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
                    size={16}
                    color={theme.subtext}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleRegister}
              style={[styles.registerBtn, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.registerBtnText}>Create Account</Text>
                  <Ionicons name="sparkles" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Navigation */}
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: theme.subtext }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.loginLink, { color: theme.primary }]}>Log In</Text>
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
    bottom: -120,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    opacity: 0.5,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingBottom: 40,
    paddingTop: Platform.OS === "ios" ? 0 : 20,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
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
    marginBottom: 20,
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
    marginBottom: 14,
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
    height: 50,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    height: "100%",
  },
  eyeBtn: {
    padding: 4,
  },
  registerBtn: {
    borderRadius: 18,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  registerBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
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
  loginLink: {
    fontSize: 14,
    fontWeight: "700",
  },
});

export default RegisterScreen;