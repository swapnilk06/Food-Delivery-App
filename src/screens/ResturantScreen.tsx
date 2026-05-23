import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
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
import resturants from '../data/resturants';
import { Restaurant } from '../types/types';

const { width } = Dimensions.get('window');

interface ResturantScreenProps {
  navigation?: {
    navigate: (screenName: string, params?: any) => void;
    goBack: () => void;
  };
  route?: {
    params?: {
      resturantId?: string;
      resturantName?: string;
    };
  };
}

const ResturantScreen: React.FC<ResturantScreenProps> = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const { cartItems, addToCart, removeFromCart, cartSubtotal, cartCount } = useCart();
  
  const [menuSearchQuery, setMenuSearchQuery] = useState('');

  // 1. Dynamic restaurant loading with safe fallback
  const activeRestaurant: Restaurant = useMemo(() => {
    const passedId = route?.params?.resturantId;
    const passedName = route?.params?.resturantName;
    
    if (passedId) {
      const match = resturants.find((r) => r.id === passedId);
      if (match) return match;
    }
    if (passedName) {
      const match = resturants.find((r) => r.name.toLowerCase() === passedName.toLowerCase());
      if (match) return match;
    }
    
    // Default fallback to first restaurant so screen never crashes
    return resturants[0];
  }, [route]);

  // Menu Search filter
  const filteredMenuItems = useMemo(() => {
    if (menuSearchQuery.trim() === '') return activeRestaurant.items;
    
    const query = menuSearchQuery.toLowerCase();
    return activeRestaurant.items.filter(
      (item: any) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }, [activeRestaurant, menuSearchQuery]);

  // Get item quantity in cart
  const getItemQty = (itemId: string) => {
    const found = cartItems.find((item) => item.id === itemId);
    return found ? found.quantity : 0;
  };

  const getBannerColor = (emoji: string) => {
    if (isDark) {
      switch (emoji) {
        case "☕": return "#2C1B1B";
        case "🍵": return "#142C14";
        case "🍰": return "#2C1422";
        case "🥐": return "#2C2114";
        case "🍪": return "#2C2B14";
        default: return "#1E1E1E";
      }
    } else {
      switch (emoji) {
        case "☕": return "#FFF0F0";
        case "🍵": return "#F6FFF5";
        case "🍰": return "#FFF0F5";
        case "🥐": return "#FFF5EB";
        case "🍪": return "#FFFBF0";
        default: return "#F8F9FA";
      }
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
        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
          {activeRestaurant.name}
        </Text>
        <TouchableOpacity 
          style={[styles.backCircle, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => navigation?.navigate('Cart')}
        >
          <Ionicons name="cart" size={20} color={theme.text} />
          {cartCount > 0 && (
            <View style={[styles.badgeIndicator, { backgroundColor: theme.primary }]}>
              <Text style={styles.badgeIndicatorText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Restaurant Billboard Card */}
        <View style={[styles.restaurantBillboard, { backgroundColor: theme.surface }]}>
          <View style={[styles.billboardImageBadge, { backgroundColor: getBannerColor(activeRestaurant.image) }]}>
            <Text style={styles.billboardEmoji}>{activeRestaurant.image}</Text>
          </View>
          
          <View style={styles.billboardTextContainer}>
            <Text style={[styles.billboardName, { color: theme.text }]}>{activeRestaurant.name}</Text>
            <Text style={[styles.billboardCuisine, { color: theme.subtext }]}>{activeRestaurant.cuisine}</Text>
            
            <View style={styles.billboardStatsRow}>
              <View style={[styles.billboardRatingContainer, { backgroundColor: activeRestaurant.rating >= 4.5 ? theme.success : theme.warning }]}>
                <Ionicons name="star" size={12} color="#FFFFFF" />
                <Text style={styles.billboardRatingText}>{activeRestaurant.rating}</Text>
              </View>
              <Text style={[styles.bullet, { color: theme.divider }]}>•</Text>
              <Text style={[styles.billboardMetaText, { color: theme.subtext }]}>{activeRestaurant.deliveryTime}</Text>
              <Text style={[styles.bullet, { color: theme.divider }]}>•</Text>
              <Text style={[styles.billboardMetaText, { color: theme.subtext }]}>${activeRestaurant.deliveryFee} delivery</Text>
            </View>
          </View>
        </View>

        {/* Menu Search */}
        <View style={[styles.menuSearchContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
          <Ionicons name="search" size={16} color={theme.subtext} />
          <TextInput
            placeholder={`Search in ${activeRestaurant.name}'s menu...`}
            placeholderTextColor={theme.dark ? '#808080' : '#A0A0A0'}
            style={[styles.menuSearchInput, { color: theme.text }]}
            value={menuSearchQuery}
            onChangeText={setMenuSearchQuery}
          />
          {menuSearchQuery !== '' && (
            <TouchableOpacity onPress={() => setMenuSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={theme.subtext} />
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.menuDivider, { backgroundColor: theme.surface }]} />
        
        <Text style={[styles.menuSectionHeader, { color: theme.text }]}>Explore Menu</Text>

        {/* Menu Item Cards */}
        {filteredMenuItems.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsEmoji}>☕</Text>
            <Text style={[styles.noResultsTitle, { color: theme.text }]}>No items match your search</Text>
          </View>
        ) : (
          filteredMenuItems.map((item: any) => {
            const qty = getItemQty(item.id);
            return (
              <View key={item.id} style={[styles.menuItemCard, { borderBottomColor: theme.divider }]}>
                <View style={styles.itemInfo}>
                  {/* Veg Indicator */}
                  <View style={[styles.vegIndicator, { borderColor: theme.success }]}>
                    <View style={[styles.vegDot, { backgroundColor: theme.success }]} />
                  </View>
                  
                  <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
                  <Text style={[styles.itemPrice, { color: theme.text }]}>${item.price.toFixed(2)}</Text>
                  <Text style={[styles.itemDescription, { color: theme.subtext }]} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>

                {/* Interactive Add Button */}
                <View style={styles.itemRightColumn}>
                  <View style={[styles.menuItemImageBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={styles.menuItemImagePlaceholder}>🍽️</Text>
                  </View>
                  
                  {qty > 0 ? (
                    <View style={[styles.quantityContainer, { backgroundColor: theme.primary, shadowColor: theme.primary }]}>
                      <TouchableOpacity
                        onPress={() => removeFromCart(item.id)}
                        style={styles.qtyBtn}
                      >
                        <Text style={styles.qtyBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{qty}</Text>
                      <TouchableOpacity
                        onPress={() => addToCart(item, activeRestaurant.id, activeRestaurant.name)}
                        style={styles.qtyBtn}
                      >
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => addToCart(item, activeRestaurant.id, activeRestaurant.name)}
                      style={[styles.addButton, { borderColor: theme.primary }]}
                    >
                      <Text style={[styles.addButtonText, { color: theme.primary }]}>ADD</Text>
                      <Text style={[styles.addButtonPlus, { color: theme.primary }]}>+</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Floating Checkout Toast */}
      {cartCount > 0 && (
        <View style={[styles.checkoutBanner, { backgroundColor: theme.primary, shadowColor: theme.primary }]}>
          <View style={styles.checkoutTextContainer}>
            <Text style={styles.checkoutCount}>
              {cartCount} item{cartCount > 1 ? 's' : ''} added
            </Text>
            <Text style={styles.checkoutTotal}>
              Subtotal: ${cartSubtotal.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={() => navigation?.navigate('Cart')}
          >
            <Text style={[styles.viewCartText, { color: theme.primary }]}>View Cart</Text>
            <Ionicons name="arrow-forward" size={16} color={theme.primary} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
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
    position: 'relative',
  },
  badgeIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIndicatorText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    flex: 0.75,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  restaurantBillboard: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  billboardImageBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  billboardEmoji: {
    fontSize: 32,
  },
  billboardTextContainer: {
    marginLeft: 14,
    flex: 1,
  },
  billboardName: {
    fontSize: 20,
    fontWeight: '800',
  },
  billboardCuisine: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  billboardStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  billboardRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  billboardRatingText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 2,
  },
  bullet: {
    fontSize: 10,
    marginHorizontal: 6,
  },
  billboardMetaText: {
    fontSize: 11,
    fontWeight: '600',
  },
  menuSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  menuSearchInput: {
    flex: 1,
    fontSize: 13,
    marginLeft: 6,
  },
  menuDivider: {
    height: 6,
    marginTop: 16,
  },
  menuSectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  menuItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1.5,
  },
  itemInfo: {
    flex: 0.65,
  },
  vegIndicator: {
    width: 14,
    height: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3,
  },
  itemDescription: {
    fontSize: 11,
    marginTop: 6,
    lineHeight: 15,
  },
  itemRightColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.3,
    position: 'relative',
  },
  menuItemImageBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemImagePlaceholder: {
    fontSize: 28,
  },
  addButton: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 11,
    fontWeight: '800',
  },
  addButtonPlus: {
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 2,
  },
  quantityContainer: {
    position: 'absolute',
    bottom: -10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: 72,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  qtyBtn: {
    paddingHorizontal: 4,
  },
  qtyBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  checkoutBanner: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  checkoutTextContainer: {
    flex: 0.65,
  },
  checkoutCount: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  checkoutTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  viewCartButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCartText: {
    fontSize: 12,
    fontWeight: '800',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noResultsEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  noResultsTitle: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default ResturantScreen;