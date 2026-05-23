import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

interface CartScreenProps {
  navigation?: {
    navigate: (screenName: string, params?: any) => void;
    goBack: () => void;
  };
  route?: any;
}

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { cartItems, addToCart, removeFromCart, cartSubtotal, cartCount } = useCart();
  
  // Custom tip state
  const [tip, setTip] = useState<number>(2.00);

  const tipsList = [1.00, 2.00, 3.00, 5.00];

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
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Cart</Text>
        <View style={styles.headerSpacer} />
      </View>

      {cartItems.length === 0 ? (
        // Empty Cart State
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>☕</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Your cart is empty</Text>
          <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>
            Add some coffee or cake to satisfy your cravings!
          </Text>
          <TouchableOpacity
            style={[styles.browseBtn, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
            onPress={() => navigation?.navigate('Home')}
          >
            <Text style={styles.browseBtnText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Active Cart Items List
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Restaurant Title Block */}
            <View style={[styles.restaurantHeader, { backgroundColor: theme.surface }]}>
              <View style={[styles.restaurantLogo, { backgroundColor: theme.primaryLight }]}>
                <Text style={{ fontSize: 20 }}>🏢</Text>
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.restaurantName, { color: theme.text }]}>
                  {cartItems[0].restaurantName}
                </Text>
                <Text style={[styles.restaurantSub, { color: theme.subtext }]}>
                  Ordering from local outlet
                </Text>
              </View>
            </View>

            {/* Cart Items Card */}
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {cartItems.map((item, index) => (
                <View key={item.id}>
                  <View style={styles.itemRow}>
                    <View style={styles.itemMeta}>
                      <View style={[styles.vegIndicator, { borderColor: theme.success }]}>
                        <View style={[styles.vegDot, { backgroundColor: theme.success }]} />
                      </View>
                      <View style={{ marginLeft: 8, flex: 0.9 }}>
                        <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={[styles.itemPrice, { color: theme.text }]}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    {/* Quantity Edit Counter */}
                    <View style={[styles.quantityContainer, { backgroundColor: theme.primary }]}>
                      <TouchableOpacity
                        onPress={() => removeFromCart(item.id)}
                        style={styles.qtyBtn}
                      >
                        <Text style={styles.qtyText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyCount}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => addToCart(item, item.restaurantId, item.restaurantName)}
                        style={styles.qtyBtn}
                      >
                        <Text style={styles.qtyText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {index < cartItems.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: theme.divider }]} />
                  )}
                </View>
              ))}
            </View>

            {/* Promo Code Card */}
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="pricetag" size={18} color={theme.primary} />
                <Text style={[styles.promoText, { color: theme.text }]}>WELCOME50 applied!</Text>
              </View>
              <Text style={[styles.promoSavings, { color: theme.success }]}>Saved $3.00</Text>
            </View>

            {/* Zomato-style Delivery Tip selection */}
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.cardHeaderTitle, { color: theme.text }]}>Support Your Delivery Partner</Text>
              <Text style={[styles.cardHeaderSub, { color: theme.subtext }]}>
                100% of your tip goes to the rider to appreciate their efforts.
              </Text>
              <View style={styles.tipsRow}>
                {tipsList.map((value) => {
                  const isActive = tip === value;
                  return (
                    <TouchableOpacity
                      key={value}
                      onPress={() => setTip(isActive ? 0 : value)}
                      style={[
                        styles.tipButton,
                        { backgroundColor: theme.surface, borderColor: theme.border },
                        isActive && [styles.tipButtonActive, { borderColor: theme.primary, backgroundColor: theme.primaryLight }],
                      ]}
                    >
                      <Text style={[styles.tipButtonText, { color: theme.subtext }, isActive && { color: theme.primary, fontWeight: '700' }]}>
                        ${value.toFixed(0)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Cancellation Policy Note */}
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, padding: 12 }]}>
              <View style={{ flexDirection: 'row' }}>
                <Ionicons name="information-circle" size={16} color={theme.subtext} />
                <Text style={[styles.policyText, { color: theme.subtext }]}>
                  Avoid Cancelling: Once order is placed, restaurant begins food prep immediately. Late cancellation incurs 100% fee.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Checkout Footer Bar */}
          <View style={[styles.footer, { borderTopColor: theme.divider, backgroundColor: theme.card }]}>
            <View style={styles.footerInfo}>
              <Text style={[styles.footerTotalLabel, { color: theme.subtext }]}>GRAND TOTAL</Text>
              <Text style={[styles.footerTotalPrice, { color: theme.text }]}>
                ${(cartSubtotal + tip).toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation?.navigate('Orders', { tip: tip })}
              style={[styles.checkoutBtn, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
              activeOpacity={0.9}
            >
              <Text style={styles.checkoutBtnText}>Next Steps</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </>
      )}
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
    paddingBottom: 110,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyEmoji: {
    fontSize: 72,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  browseBtn: {
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 28,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  browseBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  restaurantLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '800',
  },
  restaurantSub: {
    fontSize: 12,
    marginTop: 2,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1.2,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.01,
    shadowRadius: 5,
    elevation: 1,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.65,
  },
  vegIndicator: {
    width: 14,
    height: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  quantityContainer: {
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 8,
    width: 72,
  },
  qtyBtn: {
    paddingHorizontal: 4,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  qtyCount: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  promoText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
  },
  promoSavings: {
    fontSize: 12,
    fontWeight: '700',
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  cardHeaderSub: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  tipsRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  tipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginRight: 8,
  },
  tipButtonActive: {
    borderWidth: 1.5,
  },
  tipButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  policyText: {
    fontSize: 10,
    marginLeft: 6,
    flex: 1,
    lineHeight: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerInfo: {
    justifyContent: 'center',
  },
  footerTotalLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  footerTotalPrice: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  checkoutBtn: {
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default CartScreen;