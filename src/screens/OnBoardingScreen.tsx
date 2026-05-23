import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

interface OnBoardingScreenProps {
  navigation?: {
    navigate: (screenName: string, params?: any) => void;
  };
  route?: any;
}

const OnBoardingScreen: React.FC<OnBoardingScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const active = Math.round(offset / slideSize);
    setActiveSlide(active);
  };

  const handleNextPress = () => {
    if (activeSlide < 2) {
      scrollViewRef.current?.scrollTo({
        x: (activeSlide + 1) * width,
        animated: true,
      });
      setActiveSlide(activeSlide + 1);
    } else {
      navigation?.navigate('Login');
    }
  };

  const renderCircleIllustration = (index: number) => {
    switch (index) {
      case 0:
        return (
          <View style={styles.illustrationWrapper}>
            <View style={[styles.dishPlate, { backgroundColor: theme.dark ? '#2C2C2C' : '#FFFFFF', borderColor: theme.border }]}>
              <View style={styles.dishInner} />
              <Text style={styles.plateItemEmoji1}>☕</Text>
              <Text style={styles.plateItemEmoji2}>🍵</Text>
              <Text style={styles.plateItemEmoji3}>🥐</Text>
              <Text style={styles.plateItemEmoji4}>🍰</Text>
            </View>
            <View style={[styles.tagBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.tagBadgeText}>PREMIUM BREWS</Text>
            </View>
          </View>
        );
      case 1:
        return (
          <View style={styles.illustrationWrapper}>
            <View style={[styles.chefCircle, { backgroundColor: theme.dark ? '#1A1A1A' : '#FAFAFA' }]}>
              <Text style={styles.chefHat}>🧑‍🍳</Text>
              <Text style={styles.ingredientTomato}>🍫</Text>
              <Text style={styles.ingredientBasil}>🍓</Text>
              <Text style={styles.ingredientCheese}>🍯</Text>
              <Text style={styles.cookingPot}>🧁</Text>
            </View>
            <View style={[styles.tagBadge, { backgroundColor: theme.success }]}>
              <Text style={styles.tagBadgeText}>BAKED FRESH</Text>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.illustrationWrapper}>
            <View style={[styles.mapCircle, { borderColor: theme.border }]}>
              <View style={[styles.gpsPathLine, { borderColor: theme.primary }]} />
              <Text style={styles.scooterIcon}>🛵</Text>
              <Text style={styles.pinIcon}>📍</Text>
              <Text style={styles.homeIcon}>🏠</Text>
              <Text style={styles.treeIcon}>🌳</Text>
            </View>
            <View style={[styles.tagBadge, { backgroundColor: theme.warning }]}>
              <Text style={styles.tagBadgeText}>HOT & FAST</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const slides = [
    {
      title: 'Freshly Brewed\nCoffee & ' + 'Tea',
      subtitle: 'Experience authentic, rich blends sourced from premium estates right at your doorstep.',
    },
    {
      title: 'Delicious Cakes\nBaked ' + 'Daily',
      subtitle: 'Indulge in sweet treats, pastries, and custom cakes baked freshly every morning.',
    },
    {
      title: 'Track Your Treats\nIn Real-' + 'Time',
      subtitle: 'Watch your hot coffee and cake travel directly to you with accurate live map tracking.',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      
      <View style={[styles.bgBlobLeft, { backgroundColor: theme.dark ? 'rgba(226, 55, 68, 0.03)' : 'rgba(226, 55, 68, 0.05)' }]} />
      <View style={[styles.bgBlobRight, { backgroundColor: theme.dark ? 'rgba(226, 55, 68, 0.02)' : 'rgba(226, 55, 68, 0.04)' }]} />

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.pager}
      >
        {slides.map((slide, index) => (
          <View key={index} style={[styles.slideContainer, { width }]}>
            
            <View style={styles.heroSection}>
              <View style={styles.circleContainer}>
                <View style={[styles.mainCircle, { borderColor: theme.border, backgroundColor: theme.card }]} />
                {renderCircleIllustration(index)}
              </View>
            </View>

            <View style={styles.textSection}>
              <View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="sparkles" size={14} color={theme.primary} />
                <Text style={[styles.badgeText, { color: theme.primary }]}>
                  {index === 0 ? 'Swapnil\'s Favorites' : index === 1 ? 'Handcrafted Desserts' : 'Fast Delivery'}
                </Text>
              </View>

              <Text style={[styles.title, { color: theme.text }]}>
                {index === 0 ? (
                  <>
                    Freshly Brewed{'\n'}
                    Coffee & <Text style={{ color: theme.primary }}>Tea</Text>
                  </>
                ) : index === 1 ? (
                  <>
                    Delicious Cakes{'\n'}
                    Baked <Text style={{ color: theme.success }}>Daily</Text>
                  </>
                ) : (
                  <>
                    Track Your Treats{'\n'}
                    In Real-<Text style={{ color: theme.warning }}>Time</Text>
                  </>
                )}
              </Text>

              <Text style={[styles.subtitle, { color: theme.subtext }]}>
                {slide.subtitle}
              </Text>
            </View>

          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomControls}>
        <View style={styles.dotContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: theme.dark ? '#3C3C3C' : '#E0E0E0' },
                activeSlide === index && [styles.activeDot, { backgroundColor: theme.primary }],
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleNextPress}
            style={[styles.getStartedButton, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
          >
            <Text style={styles.buttonText}>
              {activeSlide === 2 ? 'Get Started' : 'Next'}
            </Text>
            <View style={styles.arrowCircle}>
              <Ionicons name="arrow-forward" size={18} color={theme.primary} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// ... styles remain unchanged from original OnBoardingScreen ...
const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
  bgBlobLeft: { position: 'absolute', top: -50, left: -50, width: 250, height: 250, borderRadius: 125 },
  bgBlobRight: { position: 'absolute', bottom: -80, right: -80, width: 300, height: 300, borderRadius: 150 },
  pager: { flex: 1 },
  slideContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  heroSection: { flex: 1.1, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  circleContainer: { width: width * 0.72, height: width * 0.72, justifyContent: 'center', alignItems: 'center' },
  mainCircle: { width: width * 0.62, height: width * 0.62, borderRadius: (width * 0.62) / 2, borderWidth: 2, borderStyle: 'dashed', position: 'absolute' },
  illustrationWrapper: { width: width * 0.58, height: width * 0.58, borderRadius: (width * 0.58) / 2, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  tagBadge: { position: 'absolute', bottom: 5, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  tagBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  dishPlate: { width: width * 0.44, height: width * 0.44, borderRadius: (width * 0.44) / 2, borderWidth: 6, justifyContent: 'center', alignItems: 'center', shadowColor: '#000000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 15, elevation: 6 },
  dishInner: { width: '78%', height: '78%', borderRadius: 100, backgroundColor: '#FAFAFA', borderWidth: 1.5, borderColor: '#EFEFEF', borderStyle: 'dashed' },
  plateItemEmoji1: { position: 'absolute', fontSize: 48, top: '30%', left: '30%' },
  plateItemEmoji2: { position: 'absolute', fontSize: 26, top: 15, left: 20 },
  plateItemEmoji3: { position: 'absolute', fontSize: 28, bottom: 15, right: 20 },
  plateItemEmoji4: { position: 'absolute', fontSize: 26, top: '40%', right: 15 },
  chefCircle: { width: width * 0.46, height: width * 0.46, borderRadius: (width * 0.46) / 2, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)' },
  chefHat: { fontSize: 64 },
  ingredientTomato: { position: 'absolute', fontSize: 26, top: 25, left: 25 },
  ingredientBasil: { position: 'absolute', fontSize: 24, top: 30, right: 25 },
  ingredientCheese: { position: 'absolute', fontSize: 26, bottom: 45, left: 25 },
  cookingPot: { position: 'absolute', fontSize: 28, bottom: 30, right: 35 },
  mapCircle: { width: width * 0.46, height: width * 0.46, borderRadius: (width * 0.46) / 2, borderWidth: 1.5, borderStyle: 'dashed', backgroundColor: 'transparent', position: 'relative' },
  gpsPathLine: { position: 'absolute', width: '80%', height: '60%', top: '20%', left: '10%', borderRadius: 40, borderWidth: 3, borderStyle: 'dashed', opacity: 0.15 },
  scooterIcon: { position: 'absolute', fontSize: 42, bottom: 35, left: 45 },
  pinIcon: { position: 'absolute', fontSize: 28, top: 25, left: '42%' },
  homeIcon: { position: 'absolute', fontSize: 32, bottom: 60, right: 30 },
  treeIcon: { position: 'absolute', fontSize: 22, top: 65, left: 20 },
  textSection: { flex: 0.9, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginBottom: 16 },
  badgeText: { fontSize: 12, fontWeight: '700', marginLeft: 6 },
  title: { fontSize: 32, fontWeight: '800', textAlign: 'center', lineHeight: 40, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginTop: 14 },
  bottomControls: { paddingHorizontal: 24, paddingBottom: 20, justifyContent: 'center' },
  dotContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
  dot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 4 },
  activeDot: { width: 18 },
  buttonSection: { justifyContent: 'center' },
  getStartedButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingLeft: 28, paddingRight: 16, borderRadius: 30, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 6 },
  buttonText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2 },
  arrowCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }
});

export default OnBoardingScreen;