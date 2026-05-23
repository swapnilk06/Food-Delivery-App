import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

interface ProfileScreenProps {
  navigation?: {
    navigate: (screenName: string, params?: any) => void;
    goBack: () => void;
  };
  route?: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { orders } = useCart();
  const { user } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return 'SK';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const getMemberSince = (dateString: string) => {
    if (!dateString) return 'May 2026';
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch {
      return 'May 2026';
    }
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Profile</Text>
        <TouchableOpacity
          onPress={() => navigation?.navigate('Setting')}
          style={[styles.backCircle, { backgroundColor: theme.surface, borderColor: theme.border }]}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-sharp" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.avatarBig, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.avatarBigText, { color: theme.primary }]}>
              {getInitials(user?.fullName || '')}
            </Text>
          </View>
          
          <Text style={[styles.userName, { color: theme.text }]}>{user?.fullName || 'Swapnil Kathale'}</Text>
          <Text style={[styles.userEmail, { color: theme.subtext }]}>{user?.email || 'swapnil@cafe.com'}</Text>
          
          <View style={[styles.divider, { backgroundColor: theme.divider }]} />
          
          <View style={styles.detailsRow}>
            <View style={styles.detailCol}>
              <Text style={[styles.detailLabel, { color: theme.subtext }]}>USERNAME</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>@{user?.username || 'swapnil'}</Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={[styles.detailLabel, { color: theme.subtext }]}>MEMBER SINCE</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{getMemberSince(user?.createdAt || '')}</Text>
            </View>
          </View>
        </View>

        {/* Dynamic Completed Order History Feed */}
        <View style={styles.historyHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Order History</Text>
          <Text style={[styles.sectionCount, { color: theme.subtext }]}>{orders.length} orders</Text>
        </View>

        {orders.length === 0 ? (
          <View style={styles.noHistory}>
            <Text style={styles.noHistoryEmoji}>🍲</Text>
            <Text style={[styles.noHistoryTitle, { color: theme.text }]}>No orders placed yet</Text>
            <Text style={[styles.noHistorySubtitle, { color: theme.subtext }]}>
              Your orders will show up here once you checkout!
            </Text>
          </View>
        ) : (
          orders.map((order) => (
            <View
              key={order.id}
              style={[styles.orderCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              {/* Order Card Header */}
              <View style={styles.orderCardHeader}>
                <View>
                  <Text style={[styles.orderRestName, { color: theme.text }]}>{order.restaurantName}</Text>
                  <Text style={[styles.orderRestDate, { color: theme.subtext }]}>{order.date}</Text>
                </View>
                
                <View style={[styles.orderStatusBadge, { backgroundColor: theme.success + '15', borderColor: theme.success }]}>
                  <Ionicons name="checkmark-circle" size={12} color={theme.success} />
                  <Text style={[styles.orderStatusText, { color: theme.success }]}>Delivered</Text>
                </View>
              </View>

              <View style={[styles.cardDivider, { backgroundColor: theme.divider }]} />

              {/* Order Card Items Summary list */}
              <View style={styles.orderItemsContainer}>
                {order.items.map((item) => (
                  <Text key={item.id} style={[styles.orderItemSummary, { color: theme.subtext }]}>
                    {item.quantity}x  {item.name}
                  </Text>
                ))}
              </View>

              <View style={[styles.cardDivider, { backgroundColor: theme.divider }]} />

              {/* Order Card Footer */}
              <View style={styles.orderCardFooter}>
                <Text style={[styles.orderTotalLabel, { color: theme.subtext }]}>
                  Paid: <Text style={[styles.orderTotalValue, { color: theme.text }]}>${order.total.toFixed(2)}</Text>
                </Text>

                <TouchableOpacity
                  style={[styles.reorderBtn, { borderColor: theme.primary }]}
                  activeOpacity={0.7}
                  onPress={() => {
                    alert(`Reordering items from ${order.restaurantName}!`);
                  }}
                >
                  <Text style={[styles.reorderText, { color: theme.primary }]}>Reorder</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    borderWidth: 1.2,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.01,
    shadowRadius: 6,
    elevation: 1,
  },
  avatarBig: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarBigText: {
    fontSize: 28,
    fontWeight: '800',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
  },
  userEmail: {
    fontSize: 13,
    marginTop: 4,
  },
  divider: {
    width: '100%',
    height: 1,
    marginVertical: 18,
  },
  detailsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  detailCol: {
    flex: 0.48,
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    marginTop: 28,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  noHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  noHistoryEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  noHistoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  noHistorySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },
  orderCard: {
    borderRadius: 18,
    borderWidth: 1.2,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.01,
    shadowRadius: 5,
    elevation: 1,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderRestName: {
    fontSize: 15,
    fontWeight: '800',
  },
  orderRestDate: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  orderStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  orderStatusText: {
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
  },
  cardDivider: {
    height: 1,
    marginVertical: 12,
  },
  orderItemsContainer: {
    paddingVertical: 2,
  },
  orderItemSummary: {
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 2,
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotalLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderTotalValue: {
    fontWeight: '800',
    fontSize: 14,
  },
  reorderBtn: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  reorderText: {
    fontSize: 11,
    fontWeight: '800',
  },
});

export default ProfileScreen;