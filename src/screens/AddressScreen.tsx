import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  Platform, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const AddressScreen: React.FC = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [houseNo, setHouseNo] = useState('');
  const [building, setBuilding] = useState('');
  const [landmark, setLandmark] = useState('');

  const handleSave = () => {
    if (houseNo.trim() === '' || building.trim() === '') {
      Alert.alert('Incomplete Form', 'Please enter your address details.');
      return;
    }
    Alert.alert('Address Saved', 'Your delivery address is ready!', [
      { text: 'OK', onPress: () => navigation?.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.divider }]}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Add Delivery Address</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.label, { color: theme.subtext }]}>HOUSE / FLAT NO.</Text>
        <TextInput 
          placeholder="e.g. Flat 402" 
          placeholderTextColor={theme.subtext}
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]} 
          value={houseNo} 
          onChangeText={setHouseNo} 
        />

        <Text style={[styles.label, { color: theme.subtext }]}>BUILDING / APARTMENT</Text>
        <TextInput 
          placeholder="e.g. Swapnil Heights" 
          placeholderTextColor={theme.subtext}
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]} 
          value={building} 
          onChangeText={setBuilding} 
        />

        <Text style={[styles.label, { color: theme.subtext }]}>LANDMARK (OPTIONAL)</Text>
        <TextInput 
          placeholder="e.g. Near Coffee Shop" 
          placeholderTextColor={theme.subtext}
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]} 
          value={landmark} 
          onChangeText={setLandmark} 
        />

        <TouchableOpacity 
          style={[styles.saveBtn, { backgroundColor: theme.primary }]} 
          onPress={handleSave}
        >
          <Text style={styles.btnText}>Save Address</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 20 },
  content: { padding: 20 },
  label: { fontSize: 10, fontWeight: '800', marginBottom: 8, marginLeft: 4 },
  input: { borderWidth: 1, padding: 15, borderRadius: 12, marginBottom: 20, fontSize: 14 },
  saveBtn: { padding: 16, borderRadius: 30, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default AddressScreen;