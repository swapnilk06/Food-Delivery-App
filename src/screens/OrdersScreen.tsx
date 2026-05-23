import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const OrdersScreen: React.FC = ({ navigation }: any) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <Text style={[styles.text, { color: theme.text }]}>My Orders</Text>
      </View>

      <ScrollView contentContainerStyle={styles.center}>
        <Ionicons name="receipt-outline" size={60} color={theme.subtext} />
        <Text style={[styles.emptyText, { color: theme.text }]}>No orders yet</Text>
        <Text style={{ color: theme.subtext, marginTop: 5 }}>Your delicious history will appear here.</Text>
        
        <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]} onPress={() => navigation.navigate('HomeTab')}>
          <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Browse Cafe Menu</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  text: { fontSize: 24, fontWeight: 'bold' },
  emptyText: { fontSize: 18, fontWeight: '600', marginTop: 15 },
  btn: { paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25, marginTop: 20 }
});

export default OrdersScreen;