import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

type FoodItemProps = {
  item: {
    id: string;
    name: string;
    fullPrice: number;
    halfPrice: number;
    imageUrl: string;
  };
  onSelectHalf: () => void;
  onSelectFull: () => void;
  onDelete: () => void;
};

export default function FoodItem({ item, onSelectHalf, onSelectFull, onDelete }: FoodItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.itemHeader}>
        <Image 
          source={{ uri: item.imageUrl }}
          style={styles.image}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <TouchableOpacity style={styles.priceButton} onPress={onSelectHalf}>
          <Text style={styles.priceLabel}>Half</Text>
          <Text style={styles.price}>₹{item.halfPrice}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.priceButton} onPress={onSelectFull}>
          <Text style={styles.priceLabel}>Full</Text>
          <Text style={styles.price}>₹{item.fullPrice}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    fontSize: 24,
    color: '#FF3B30',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  priceButton: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});