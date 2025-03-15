import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

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

export default function HistoryScreen() {
  const [history, setHistory] = useState<BillHistory[]>([]);
  const [expandedBillId, setExpandedBillId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyString = await AsyncStorage.getItem('billHistory');
      if (historyString) {
        setHistory(JSON.parse(historyString));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const clearHistory = async () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to delete all bill history?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('billHistory');
              setHistory([]);
              Alert.alert("Success", "History cleared successfully");
            } catch (error) {
              console.error('Error clearing history:', error);
              Alert.alert("Error", "Failed to clear history");
            }
          }
        }
      ]
    );
  };

  const toggleExpandBill = (id: string) => {
    setExpandedBillId(expandedBillId === id ? null : id);
  };

  const deleteSingleBill = async (id: string) => {
    Alert.alert(
      "Delete Bill",
      "Are you sure you want to delete this bill?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedHistory = history.filter(bill => bill.id !== id);
              await AsyncStorage.setItem('billHistory', JSON.stringify(updatedHistory));
              setHistory(updatedHistory);
            } catch (error) {
              console.error('Error deleting bill:', error);
              Alert.alert("Error", "Failed to delete bill");
            }
          }
        }
      ]
    );
  };

  const renderBillItem = ({ item }: { item: BillHistory }) => {
    const isExpanded = expandedBillId === item.id;
    
    return (
      <View style={styles.billCard}>
        <TouchableOpacity 
          style={styles.billHeader} 
          onPress={() => toggleExpandBill(item.id)}
        >
          <View style={styles.billHeaderLeft}>
            <Text style={styles.billDate}>{item.date}</Text>
            <Text style={styles.billItemCount}>
              {item.items.length} item{item.items.length !== 1 ? 's' : ''}
            </Text>
          </View>
          
          <View style={styles.billHeaderRight}>
            <Text style={styles.billTotal}>₹{item.total}</Text>
            <MaterialIcons 
              name={isExpanded ? "expand-less" : "expand-more"} 
              size={24} 
              color="#007AFF" 
            />
          </View>
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.billDetails}>
            {item.items.map((billItem, index) => (
              <View key={`${item.id}-${billItem.id}`} style={styles.billItemRow}>
                <Text style={styles.billItemIndex}>{index + 1}.</Text>
                <Text style={styles.billItemName}>{billItem.name}</Text>
                <Text style={styles.billItemType}>({billItem.type})</Text>
                <Text style={styles.billItemPrice}>₹{billItem.price}</Text>
              </View>
            ))}
            
            <TouchableOpacity
              style={styles.deleteBillButton}
              onPress={() => deleteSingleBill(item.id)}
            >
              <MaterialIcons name="delete" size={18} color="white" />
              <Text style={styles.deleteBillButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bill History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <MaterialIcons name="delete-sweep" size={24} color="#FF3B30" />
          </TouchableOpacity>
        )}
      </View>

      {history.length > 0 ? (
        <FlatList
          data={history}
          renderItem={renderBillItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialIcons name="history" size={64} color="#C7C7CC" />
          <Text style={styles.emptyStateText}>No bill history yet</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  billCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  billHeaderLeft: {
    flex: 1,
  },
  billHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  billDate: {
    fontSize: 16,
    fontWeight: '500',
  },
  billItemCount: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  billTotal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginRight: 8,
  },
  billDetails: {
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  billItemRow: {
    flexDirection: 'row',
    paddingVertical: 6,
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
  deleteBillButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  deleteBillButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#8E8E93',
    marginTop: 12,
  },
});