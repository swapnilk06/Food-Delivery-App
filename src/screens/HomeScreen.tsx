import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import resturants from "../data/resturants";

const { width } = Dimensions.get("window");

interface HomeScreenProps {
  navigation?: {
    navigate: (screenName: string, params?: any) => void;
  };
  route?: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState(false);
  const [fastDeliveryFilter, setFastDeliveryFilter] = useState(false);

  // CAFE SPECIFIC CATEGORIES
  const categories = [
    { id: "1", name: "Coffee", emoji: "☕" },
    { id: "2", name: "Tea", emoji: "🍵" },
    { id: "3", name: "Cakes", emoji: "🍰" },
    { id: "4", name: "Pastry", emoji: "🥐" },
    { id: "5", name: "Snacks", emoji: "🍪" },
  ];

  const filteredRestaurants = useMemo(() => {
    return resturants.filter((rest) => {
      if (activeCategory) {
        const matchesCategory = rest.cuisine
          .toLowerCase()
          .includes(activeCategory.toLowerCase());
        if (!matchesCategory) return false;
      }

      if (ratingFilter && rest.rating < 4.5) {
        return false;
      }

      if (fastDeliveryFilter) {
        const mins = parseInt(rest.deliveryTime.split("-")[0]) || 30;
        if (mins > 25) return false;
      }

      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = rest.name.toLowerCase().includes(query);
        const matchesCuisine = rest.cuisine.toLowerCase().includes(query);
        const matchesItems = rest.items.some((item: any) =>
          item.name.toLowerCase().includes(query),
        );
        return matchesName || matchesCuisine || matchesItems;
      }

      return true;
    });
  }, [searchQuery, activeCategory, ratingFilter, fastDeliveryFilter]);

  // COLOR MAP FOR NEW EMOJIS
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={theme.dark ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <View style={[styles.header, { borderBottomColor: theme.divider }]}>
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={() => navigation?.navigate("Address")}
          activeOpacity={0.7}
        >
          <Ionicons name="location" size={22} color={theme.primary} />
          <View style={styles.locationTextContainer}>
            <View style={styles.locationRow}>
              <Text style={[styles.locationLabel, { color: theme.text }]}>
                Home
              </Text>
              <Ionicons
                name="chevron-down"
                size={14}
                color={theme.text}
                style={styles.chevron}
              />
            </View>
            <Text
              style={[styles.locationSubText, { color: theme.subtext }]}
              numberOfLines={1}
            >
              DLF Phase 3, Gurugram, Haryana
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.actionCircle,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isDark ? "sunny" : "moon"}
              size={18}
              color={isDark ? theme.warning : theme.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.profileCircle,
              {
                backgroundColor: theme.primaryLight,
                borderColor: theme.primary,
              },
            ]}
            onPress={() => navigation?.navigate("Profile")}
          >
            <Text style={[styles.profileInitials, { color: theme.primary }]}>
              SK
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.introSection}>
          <Text style={[styles.introTitle, { color: theme.subtext }]}>
            Fresh brews,
          </Text>
          <Text style={[styles.introSubtitle, { color: theme.text }]}>
            and sweet treats 🍰
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.searchBarContainer,
            { backgroundColor: theme.inputBg, borderColor: theme.border },
          ]}
          activeOpacity={0.9}
          onPress={() => navigation?.navigate("Search")}
        >
          <Ionicons
            name="search"
            size={20}
            color={theme.subtext}
            style={styles.searchIcon}
          />
          <Text
            style={[
              styles.searchInputPlaceholder,
              { color: theme.dark ? "#808080" : "#A0A0A0" },
            ]}
          >
            Search coffee, tea, cakes...
          </Text>
          <View style={styles.verticalDivider} />
          <View style={styles.filterMenuButton}>
            <Feather name="sliders" size={18} color={theme.primary} />
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            What are you craving?
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          <TouchableOpacity
            style={[
              styles.categoryCard,
              { backgroundColor: theme.surface },
              activeCategory === null && [
                styles.categoryCardActive,
                {
                  borderColor: theme.primary,
                  backgroundColor: theme.primaryLight,
                },
              ],
            ]}
            onPress={() => setActiveCategory(null)}
          >
            <Text style={styles.categoryEmojiText}>🍽️</Text>
            <Text
              style={[
                styles.categoryLabel,
                { color: theme.subtext },
                activeCategory === null && [
                  styles.categoryLabelActive,
                  { color: theme.primary },
                ],
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  { backgroundColor: theme.surface },
                  isActive && [
                    styles.categoryCardActive,
                    {
                      borderColor: theme.primary,
                      backgroundColor: theme.primaryLight,
                    },
                  ],
                ]}
                onPress={() => setActiveCategory(isActive ? null : cat.name)}
              >
                <Text style={styles.categoryEmojiText}>{cat.emoji}</Text>
                <Text
                  style={[
                    styles.categoryLabel,
                    { color: theme.subtext },
                    isActive && [
                      styles.categoryLabelActive,
                      { color: theme.primary },
                    ],
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.filtersRow}>
          <TouchableOpacity
            style={[
              styles.filterPill,
              { borderColor: theme.border, backgroundColor: theme.card },
              ratingFilter && [
                styles.filterPillActive,
                { backgroundColor: theme.primary, borderColor: theme.primary },
              ],
            ]}
            onPress={() => setRatingFilter(!ratingFilter)}
          >
            <Ionicons
              name="star"
              size={12}
              color={ratingFilter ? "#FFFFFF" : theme.warning}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.filterPillText,
                { color: theme.subtext },
                ratingFilter && styles.filterPillTextActive,
              ]}
            >
              Ratings 4.5+
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              { borderColor: theme.border, backgroundColor: theme.card },
              fastDeliveryFilter && [
                styles.filterPillActive,
                { backgroundColor: theme.primary, borderColor: theme.primary },
              ],
            ]}
            onPress={() => setFastDeliveryFilter(!fastDeliveryFilter)}
          >
            <Ionicons
              name="time"
              size={12}
              color={fastDeliveryFilter ? "#FFFFFF" : theme.subtext}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.filterPillText,
                { color: theme.subtext },
                fastDeliveryFilter && styles.filterPillTextActive,
              ]}
            >
              Fast Delivery
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.promoBanner,
            {
              backgroundColor: theme.primaryLight,
              borderColor: theme.primary + "30",
            },
          ]}
        >
          <View style={styles.promoInfo}>
            <View
              style={[styles.promoBadge, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.promoBadgeText}>OFFER</Text>
            </View>
            <Text style={[styles.promoTitle, { color: theme.text }]}>
              Free Slice of Cake!
            </Text>
            <Text style={[styles.promoSubtitle, { color: theme.primary }]}>
              With any Coffee. Code: SWAPNIL50
            </Text>
          </View>
          <Text style={styles.promoEmoji}>🍰</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Premium Cafes & Bakeries
          </Text>
          <Text style={[styles.sectionCount, { color: theme.subtext }]}>
            {filteredRestaurants.length} found
          </Text>
        </View>

        {filteredRestaurants.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsEmoji}>🔍</Text>
            <Text style={[styles.noResultsTitle, { color: theme.text }]}>
              No cafes found
            </Text>
            <Text style={[styles.noResultsSubtitle, { color: theme.subtext }]}>
              Try adjusting your filters or searching for something else!
            </Text>
          </View>
        ) : (
          filteredRestaurants.map((restaurant) => {
            const ratingColor =
              restaurant.rating >= 4.5 ? theme.success : theme.warning;
            return (
              <TouchableOpacity
                key={restaurant.id}
                style={[
                  styles.restaurantCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
                activeOpacity={0.9}
                onPress={() => {
                  navigation?.navigate("Resturant", {
                    resturantId: restaurant.id,
                    resturantName: restaurant.name,
                  });
                }}
              >
                <View
                  style={[
                    styles.cardImageContainer,
                    { backgroundColor: getBannerColor(restaurant.image) },
                  ]}
                >
                  <Text style={styles.restaurantEmoji}>{restaurant.image}</Text>
                  <View
                    style={[
                      styles.promoLabelContainer,
                      { backgroundColor: theme.primary },
                    ]}
                  >
                    <Text style={styles.promoLabelText}>FREE DELIVERY</Text>
                  </View>
                  <View style={styles.timeLabelContainer}>
                    <Text style={styles.timeLabelText}>
                      {restaurant.deliveryTime}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardDetails}>
                  <View style={styles.cardNameRow}>
                    <Text
                      style={[styles.restaurantName, { color: theme.text }]}
                      numberOfLines={1}
                    >
                      {restaurant.name}
                    </Text>
                    <View
                      style={[
                        styles.ratingPill,
                        { backgroundColor: ratingColor },
                      ]}
                    >
                      <Text style={styles.ratingValue}>
                        {restaurant.rating}
                      </Text>
                      <Ionicons
                        name="star"
                        size={10}
                        color="#FFFFFF"
                        style={{ marginLeft: 2 }}
                      />
                    </View>
                  </View>

                  <View style={styles.cardInfoRow}>
                    <Text
                      style={[styles.cuisineText, { color: theme.subtext }]}
                      numberOfLines={1}
                    >
                      {restaurant.cuisine}
                    </Text>
                    <Text style={[styles.costText, { color: theme.text }]}>
                      $
                      {restaurant.deliveryFee === 0
                        ? "Free"
                        : restaurant.deliveryFee.toFixed(2)}{" "}
                      delivery
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.cardDivider,
                      { backgroundColor: theme.divider },
                    ]}
                  />
                  <View style={styles.cardSafetyRow}>
                    <Ionicons
                      name="shield-checkmark"
                      size={14}
                      color={theme.subtext}
                    />
                    <Text style={[styles.safetyText, { color: theme.subtext }]}>
                      Baked fresh every morning
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ... styles remain unchanged from your original HomeScreen ...
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  locationContainer: { flexDirection: "row", alignItems: "center", flex: 0.75 },
  locationTextContainer: { marginLeft: 8, flex: 1 },
  locationRow: { flexDirection: "row", alignItems: "center" },
  locationLabel: { fontSize: 16, fontWeight: "800" },
  chevron: { marginLeft: 4 },
  locationSubText: { fontSize: 12, marginTop: 2 },
  headerRightActions: { flexDirection: "row", alignItems: "center" },
  actionCircle: { width: 38, height: 38, borderRadius: 19, justifyContent: "center", alignItems: "center", borderWidth: 1.5, marginRight: 8 },
  profileCircle: { width: 38, height: 38, borderRadius: 19, justifyContent: "center", alignItems: "center", borderWidth: 1.5 },
  profileInitials: { fontSize: 14, fontWeight: "700" },
  scrollContent: { paddingBottom: 40 },
  introSection: { paddingHorizontal: 16, marginTop: 16, marginBottom: 4 },
  introTitle: { fontSize: 22, fontWeight: "300" },
  introSubtitle: { fontSize: 26, fontWeight: "800", marginTop: 2 },
  searchBarContainer: { flexDirection: "row", alignItems: "center", marginHorizontal: 16, marginTop: 12, marginBottom: 16, paddingHorizontal: 12, paddingVertical: Platform.OS === "ios" ? 12 : 8, borderRadius: 16, borderWidth: 1 },
  searchIcon: { marginRight: 8 },
  searchInputPlaceholder: { flex: 1, fontSize: 14, fontWeight: "500" },
  verticalDivider: { width: 1, height: 20, backgroundColor: "#DCDCDC", marginHorizontal: 10 },
  filterMenuButton: { padding: 4 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", paddingHorizontal: 16, marginTop: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  sectionCount: { fontSize: 12, fontWeight: "500" },
  categoriesContainer: { paddingLeft: 16, paddingRight: 8, marginBottom: 16 },
  categoryCard: { alignItems: "center", justifyContent: "center", width: width * 0.18, height: width * 0.22, borderRadius: 20, marginRight: 10, borderWidth: 1.5, borderColor: "transparent", shadowColor: "#000000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 2 },
  categoryCardActive: { borderWidth: 1.5 },
  categoryEmojiText: { fontSize: 26, marginBottom: 6 },
  categoryLabel: { fontSize: 11, fontWeight: "600" },
  categoryLabelActive: { fontWeight: "700" },
  filtersRow: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 16 },
  filterPill: { flexDirection: "row", alignItems: "center", borderWidth: 1, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, marginRight: 8 },
  filterPillActive: { borderWidth: 1 },
  filterPillText: { fontSize: 12, fontWeight: "600" },
  filterPillTextActive: { color: "#FFFFFF", fontWeight: "700" },
  promoBanner: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 16, borderRadius: 18, padding: 16, marginBottom: 24, borderWidth: 1 },
  promoInfo: { flex: 0.8 },
  promoBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: "flex-start", marginBottom: 6 },
  promoBadgeText: { fontSize: 9, fontWeight: "800", color: "#FFFFFF", letterSpacing: 0.5 },
  promoTitle: { fontSize: 18, fontWeight: "800" },
  promoSubtitle: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  promoEmoji: { fontSize: 36 },
  noResultsContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 40, paddingHorizontal: 20 },
  noResultsEmoji: { fontSize: 48, marginBottom: 12 },
  noResultsTitle: { fontSize: 16, fontWeight: "700", textAlign: "center" },
  noResultsSubtitle: { fontSize: 13, textAlign: "center", marginTop: 6 },
  restaurantCard: { borderRadius: 20, marginHorizontal: 16, marginBottom: 18, shadowColor: "#000000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, overflow: "hidden" },
  cardImageContainer: { height: 150, justifyContent: "center", alignItems: "center", position: "relative" },
  restaurantEmoji: { fontSize: 60 },
  promoLabelContainer: { position: "absolute", bottom: 12, left: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  promoLabelText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  timeLabelContainer: { position: "absolute", bottom: 12, right: 12, backgroundColor: "rgba(28, 28, 28, 0.75)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  timeLabelText: { color: "#FFFFFF", fontSize: 10, fontWeight: "700" },
  cardDetails: { padding: 14 },
  cardNameRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  restaurantName: { fontSize: 16, fontWeight: "800", flex: 0.8 },
  ratingPill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  ratingValue: { fontSize: 11, fontWeight: "800", color: "#FFFFFF" },
  cardInfoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6 },
  cuisineText: { fontSize: 13, fontWeight: "500", flex: 0.6 },
  costText: { fontSize: 12, fontWeight: "600" },
  cardDivider: { height: 1, marginVertical: 10 },
  cardSafetyRow: { flexDirection: "row", alignItems: "center" },
  safetyText: { fontSize: 11, marginLeft: 6, fontWeight: "500" }
});

export default HomeScreen;