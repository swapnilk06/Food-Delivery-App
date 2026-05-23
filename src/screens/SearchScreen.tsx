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
import resturants from '../data/resturants';

const { width } = Dimensions.get('window');

interface SearchScreenProps {
  navigation?: {
    navigate: (screenName: string, params?: any) => void;
    goBack: () => void;
  };
  route?: any;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // CAFE SEARCH TAGS
  const recentSearches = ['Espresso', 'Chocolate Cake', 'Green Tea', 'Croissant', 'Cookies'];

  const matchedRestaurants = useMemo(() => {
    if (searchQuery.trim() === '') return [];
    
    const query = searchQuery.toLowerCase();
    return resturants.filter((rest) => {
      const matchesName = rest.name.toLowerCase().includes(query);
      const matchesCuisine = rest.cuisine.toLowerCase().includes(query);
      const matchesItems = rest.items.some((item: any) =>
        item.name.toLowerCase().includes(query)
      );
      return matchesName || matchesCuisine || matchesItems;
    });
  }, [searchQuery]);

  // NEW EMOJI COLOR MAP
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
      
      <View style={[styles.header, { borderBottomColor: theme.divider }]}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <View style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
          <TextInput
            placeholder="Search coffee, tea, cakes..."
            placeholderTextColor={theme.dark ? '#808080' : '#A0A0A0'}
            style={[styles.searchInput, { color: theme.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true} 
            clearButtonMode="while-editing"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color={theme.subtext} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {searchQuery.trim() === '' ? (
          <View style={styles.recentContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Cravings</Text>
            <View style={styles.tagsContainer}>
              {recentSearches.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => setSearchQuery(tag)}
                  style={[styles.tag, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <Ionicons name="search" size={12} color={theme.subtext} style={{ marginRight: 6 }} />
                  <Text style={[styles.tagText, { color: theme.text }]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Popular Categories</Text>
            <View style={styles.cuisinesGrid}>
              {['☕ Coffee', '🍵 Tea', '🍰 Cakes', '🥐 Pastries'].map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setSearchQuery(item.split(' ')[1])}
                  style={[styles.cuisineBox, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <Text style={[styles.cuisineBoxText, { color: theme.text }]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.resultsContainer}>
            <Text style={[styles.resultsCount, { color: theme.subtext }]}>
              {matchedRestaurants.length} matches for "{searchQuery}"
            </Text>

            {matchedRestaurants.length === 0 ? (
              <View style={styles.noResults}>
                <Text style={styles.noResultsEmoji}>☕</Text>
                <Text style={[styles.noResultsTitle, { color: theme.text }]}>We couldn't find a match</Text>
                <Text style={[styles.noResultsSubtitle, { color: theme.subtext }]}>
                  Try checking spelling or search for items like Coffee, Green Tea, or Cake!
                </Text>
              </View>
            ) : (
              matchedRestaurants.map((restaurant) => {
                const ratingColor = restaurant.rating >= 4.5 ? theme.success : theme.warning;
                return (
                  <TouchableOpacity
                    key={restaurant.id}
                    style={[styles.resultCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                    activeOpacity={0.9}
                    onPress={() => {
                      navigation?.navigate('Resturant', { resturantId: restaurant.id, resturantName: restaurant.name });
                    }}
                  >
                    <View style={[styles.cardImage, { backgroundColor: getBannerColor(restaurant.image) }]}>
                      <Text style={styles.cardEmoji}>{restaurant.image}</Text>
                    </View>
                    
                    <View style={styles.cardDetails}>
                      <View style={styles.cardNameRow}>
                        <Text style={[styles.cardName, { color: theme.text }]} numberOfLines={1}>
                          {restaurant.name}
                        </Text>
                        <View style={[styles.ratingBadge, { backgroundColor: ratingColor }]}>
                          <Text style={styles.ratingVal}>{restaurant.rating}</Text>
                          <Ionicons name="star" size={9} color="#FFFFFF" style={{ marginLeft: 2 }} />
                        </View>
                      </View>
                      
                      <Text style={[styles.cardCuisine, { color: theme.subtext }]} numberOfLines={1}>
                        {restaurant.cuisine}
                      </Text>
                      <Text style={[styles.cardDelivery, { color: theme.text }]}>
                        ⚡ {restaurant.deliveryTime} • ${restaurant.deliveryFee === 0 ? 'Free' : restaurant.deliveryFee.toFixed(2)} delivery
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ... styles remain unchanged from original SearchScreen ...
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1 },
  backButton: { padding: 8, marginRight: 4 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 10 : 4 },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '500' },
  clearBtn: { padding: 4 },
  scrollContent: { paddingBottom: 40 },
  recentContainer: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '800', letterSpacing: 0.5, marginBottom: 12 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  tag: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1.5, marginHorizontal: 4, marginBottom: 8 },
  tagText: { fontSize: 12, fontWeight: '600' },
  cuisinesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cuisineBox: { width: width * 0.44, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1.5, marginBottom: 10, alignItems: 'center' },
  cuisineBoxText: { fontSize: 13, fontWeight: '700' },
  resultsContainer: { padding: 16 },
  resultsCount: { fontSize: 12, fontWeight: '600', marginBottom: 14 },
  resultCard: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, padding: 10, marginBottom: 12, alignItems: 'center', shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 6, elevation: 2 },
  cardImage: { width: 64, height: 64, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardEmoji: { fontSize: 32 },
  cardDetails: { marginLeft: 12, flex: 1, justifyContent: 'center' },
  cardNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardName: { fontSize: 14, fontWeight: '800', flex: 0.82 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  ratingVal: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  cardCuisine: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  cardDelivery: { fontSize: 11, fontWeight: '600', marginTop: 4 },
  noResults: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50, paddingHorizontal: 20 },
  noResultsEmoji: { fontSize: 48, marginBottom: 12 },
  noResultsTitle: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  noResultsSubtitle: { fontSize: 13, textAlign: 'center', marginTop: 6 }
});

export default SearchScreen;