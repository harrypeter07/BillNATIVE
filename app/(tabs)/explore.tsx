import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import MyNewComponent1 from '../../components/MyNewComponent1'; // Adjust the import path
// import MyNewComponent2 from '../../components/MyNewComponent2'; // Adjust the import path
// import MyNewComponent3 from '../../components/MyNewComponent3'; // Adjust the import path

export default function TabTwoScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Explore Screen</Text>
      </View>
      {/* <MyNewComponent1 />
      <MyNewComponent2 />
      <MyNewComponent3 /> */}
      {/* Add your other components here */}
    </ScrollView>
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
});