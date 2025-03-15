import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import FoodItem from '../../components/FoodItem';
import AddItemModal from '../../components/AddItemModal';

type FoodItem = {
  id: string;
  name: string;
  halfPrice: number;
  fullPrice: number;
  imageUrl: string;
};

type BillItem = {
  id: string;
  name: string;
  price: number;
  type: 'half' | 'full';
};

type BillHistory = {
  id: string;
  date: string;
  items: BillItem[];
  total: number;
};

export default function HomeScreen() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const savedItems = await AsyncStorage.getItem('foodItems');
      if (savedItems) setItems(JSON.parse(savedItems));
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const saveItems = async (newItems: FoodItem[]) => {
    try {
      await AsyncStorage.setItem('foodItems', JSON.stringify(newItems));
    } catch (error) {
      console.error('Error saving items:', error);
    }
  };

  const saveBillToHistory = async () => {
    if (billItems.length === 0) {
      Alert.alert("Nothing to save", "Your bill is empty");
      return;
    }
    
    try {
      // Get existing history
      const historyString = await AsyncStorage.getItem('billHistory');
      const history: BillHistory[] = historyString ? JSON.parse(historyString) : [];
      
      // Create new bill record
      const newBill: BillHistory = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        items: [...billItems],
        total: getTotalBill()
      };
      
      // Add to history and save
      const updatedHistory = [newBill, ...history];
      await AsyncStorage.setItem('billHistory', JSON.stringify(updatedHistory));
      
      Alert.alert("Success", "Bill saved to history");
      clearBill();
    } catch (error) {
      console.error('Error saving bill history:', error);
      Alert.alert("Error", "Failed to save bill history");
    }
  };

  const addItem = (name: string, halfPrice: number, fullPrice: number, imageUrl: string) => {
    const newItem = {
      id: Date.now().toString(),
      name,
      halfPrice,
      fullPrice,
      imageUrl,
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    saveItems(newItems);
  };

  const deleteItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    saveItems(newItems);
    setBillItems(billItems.filter(billItem => 
      !items.find(item => item.id === id && item.name === billItem.name)
    ));
  };

  const addToBill = (item: FoodItem, type: 'half' | 'full') => {
    const billItem = {
      id: Date.now().toString(),
      name: item.name,
      price: type === 'half' ? item.halfPrice : item.fullPrice,
      type,
    };
    setBillItems([...billItems, billItem]);
  };

  const getTotalBill = () => {
    return billItems.reduce((sum, item) => sum + item.price, 0);
  };
  
  const clearBill = () => {
    setBillItems([]);
  };

  const goToHistory = () => {
    navigation.navigate('History' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hotel Bill Calculator</Text>
        <View style={styles.headerActions}>
          <Text style={styles.totalAmount}>Total: ₹{getTotalBill()}</Text>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.historyButton} onPress={goToHistory}>
          <MaterialIcons name="history" size={20} color="white" />
          <Text style={styles.buttonText}>History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.saveButton} onPress={saveBillToHistory}>
          <MaterialIcons name="save" size={20} color="white" />
          <Text style={styles.buttonText}>Save Bill</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.clearButton} onPress={clearBill}>
          <MaterialIcons name="refresh" size={20} color="white" />
          <Text style={styles.buttonText}>Start Over</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {billItems.length > 0 && (
          <View style={styles.currentBillContainer}>
            <Text style={styles.currentBillTitle}>Current Bill</Text>
            {billItems.map((item, index) => (
              <View key={item.id} style={styles.billItemRow}>
                <Text style={styles.billItemIndex}>{index + 1}.</Text>
                <Text style={styles.billItemName}>{item.name}</Text>
                <Text style={styles.billItemType}>({item.type})</Text>
                <Text style={styles.billItemPrice}>₹{item.price}</Text>
              </View>
            ))}
          </View>
        )}
        
        <Text style={styles.sectionTitle}>Menu Items</Text>
        {items.map(item => (
          <FoodItem
            key={item.id}
            item={item}
            onSelectHalf={() => addToBill(item, 'half')}
            onSelectFull={() => addToBill(item, 'full')}
            onDelete={() => deleteItem(item.id)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
      >
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>

      <AddItemModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={addItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  historyButton: {
    backgroundColor: '#5856D6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#34C759',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  currentBillContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  currentBillTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#007AFF',
  },
  billItemRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  billItemIndex: {
    width: 25,
    fontWeight: '500',
  },
  billItemName: {
    flex: 1,
    fontWeight: '400',
  },
  billItemType: {
    marginRight: 8,
    fontStyle: 'italic',
    color: '#666',
  },
  billItemPrice: {
    fontWeight: '500',
    minWidth: 60,
    textAlign: 'right',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});