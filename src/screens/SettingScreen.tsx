import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface SettingScreenProps {
  navigation?: {
    navigate: (screenName: string, params?: any) => void;
    goBack: () => void;
  };
  route?: any;
}

const SettingScreen: React.FC<SettingScreenProps> = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  // Mock settings switches
  const [notifications, setNotifications] = useState(true);
  const [promoEmails, setPromoEmails] = useState(false);
  const [fastCheckout, setFastCheckout] = useState(true);

  const getInitials = (name: string) => {
    if (!name) return 'SK';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Delete Account',
      'Are you absolutely sure you want to delete your account? This will erase all order histories, addresses, and saved details. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Permanently', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted.', [
              { text: 'OK', onPress: async () => {
                await logout();
              }}
            ]);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.divider }]}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={[styles.backCircle, { backgroundColor: theme.surface, borderColor: theme.border }]}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card Dynamic */}
        <View style={[styles.profileBrief, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.avatar, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.avatarText, { color: theme.primary }]}>
              {getInitials(user?.fullName || '')}
            </Text>
          </View>
          <View style={{ marginLeft: 14 }}>
            <Text style={[styles.profileName, { color: theme.text }]}>{user?.fullName || 'Swapnil Kathale'}</Text>
            <Text style={[styles.profileEmail, { color: theme.subtext }]}>{user?.email || 'swapnil@cafe.com'}</Text>
          </View>
        </View>

        {/* Section 1: Themes & Styling */}
        <Text style={[styles.sectionHeader, { color: theme.subtext }]}>APP STYLING</Text>
        
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingMeta}>
              <View style={[styles.iconCircle, { backgroundColor: theme.surface }]}>
                <Ionicons name="moon" size={18} color={isDark ? theme.warning : theme.text} />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
                <Text style={[styles.settingSub, { color: theme.subtext }]}>Toggle between light and dark visual themes</Text>
              </View>
            </View>
            
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#DCDCDC', true: theme.primary }}
              thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            />
          </View>
        </View>

        {/* Section 2: Preferences */}
        <Text style={[styles.sectionHeader, { color: theme.subtext }]}>NOTIFICATIONS & CONTROLS</Text>
        
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {/* Notifications */}
          <View style={styles.settingRow}>
            <View style={styles.settingMeta}>
              <View style={[styles.iconCircle, { backgroundColor: theme.surface }]}>
                <Ionicons name="notifications" size={18} color={theme.primary} />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Push Notifications</Text>
                <Text style={[styles.settingSub, { color: theme.subtext }]}>Receive live tracking and delivery status</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#DCDCDC', true: theme.primary }}
              thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          {/* Promo Emails */}
          <View style={styles.settingRow}>
            <View style={styles.settingMeta}>
              <View style={[styles.iconCircle, { backgroundColor: theme.surface }]}>
                <Ionicons name="mail" size={18} color={theme.success} />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Promotional Deals</Text>
                <Text style={[styles.settingSub, { color: theme.subtext }]}>Receive alerts for discount codes & offers</Text>
              </View>
            </View>
            <Switch
              value={promoEmails}
              onValueChange={setPromoEmails}
              trackColor={{ false: '#DCDCDC', true: theme.primary }}
              thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          {/* Fast Checkout */}
          <View style={styles.settingRow}>
            <View style={styles.settingMeta}>
              <View style={[styles.iconCircle, { backgroundColor: theme.surface }]}>
                <Ionicons name="flash" size={18} color={theme.warning} />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Quick Checkout</Text>
                <Text style={[styles.settingSub, { color: theme.subtext }]}>Skip review screens for cash orders</Text>
              </View>
            </View>
            <Switch
              value={fastCheckout}
              onValueChange={setFastCheckout}
              trackColor={{ false: '#DCDCDC', true: theme.primary }}
              thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            />
          </View>
        </View>

        {/* Section 3: Danger Zone */}
        <Text style={[styles.sectionHeader, { color: '#E23744' }]}>ACCOUNT ACTIONS</Text>
        
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {/* Sign Out */}
          <TouchableOpacity
            style={styles.dangerRow}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.settingMeta}>
              <View style={[styles.iconCircle, { backgroundColor: theme.surface }]}>
                <Ionicons name="log-out" size={18} color={theme.text} />
              </View>
              <View style={{ marginLeft: 12, flex: 0.9 }}>
                <Text style={[styles.settingLabel, { color: theme.text, fontWeight: '700' }]}>Sign Out</Text>
                <Text style={[styles.settingSub, { color: theme.subtext }]}>Log out of your current session safely</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.subtext} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          {/* Delete Account */}
          <TouchableOpacity
            style={styles.dangerRow}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <View style={styles.settingMeta}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(226, 55, 68, 0.08)' }]}>
                <Ionicons name="trash" size={18} color="#E23744" />
              </View>
              <View style={{ marginLeft: 12, flex: 0.9 }}>
                <Text style={[styles.settingLabel, { color: '#E23744', fontWeight: '800' }]}>Delete Account</Text>
                <Text style={[styles.settingSub, { color: theme.subtext }]}>Erase your profile and order data permanently</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.subtext} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.appVersion, { color: theme.subtext }]}>SwapnilCafe App v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  headerSpacer: {
    width: 38,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileBrief: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    borderWidth: 1.2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
  },
  profileEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginLeft: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1.2,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.01,
    shadowRadius: 5,
    elevation: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  settingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.85,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingSub: {
    fontSize: 10,
    marginTop: 2,
    lineHeight: 14,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  dangerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appVersion: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 32,
    marginBottom: 10,
  },
});

export default SettingScreen;