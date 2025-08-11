import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { usePantry } from '../contexts/PantryContext';

export default function PantryScreen({ navigation }) {
  const { items, isLoading, addItem, updateItem, removeItem } = usePantry();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');

  const onAdd = async () => {
    if (!name.trim()) return;
    await addItem({ name: name.trim(), quantity: Number(quantity) || 1 });
    setName('');
    setQuantity('1');
  };

  const ingredientList = useMemo(() => items.map((i) => i.name).join(','), [items]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput placeholder="Item name" value={name} onChangeText={setName} style={[styles.input, { marginRight: 8 }]} />
        <TextInput placeholder="Qty" value={quantity} onChangeText={setQuantity} style={[styles.input, { width: 80, marginRight: 8 }]} keyboardType="numeric" />
        <Button title="Add" onPress={onAdd} />
      </View>
      <View style={styles.actions}>
        <View style={{ marginRight: 12 }}>
          <Button title="Scan Barcode" onPress={() => navigation.navigate('Scan')} />
        </View>
        <View style={{ marginRight: 12 }}>
          <Button title="Find Recipes" onPress={() => navigation.navigate('Recipes', { ingredients: ingredientList })} />
        </View>
        <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
      </View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>Qty: {item.quantity}{item.barcode ? ` • ${item.barcode}` : ''}</Text>
              </View>
              <View style={styles.itemButtons}>
                <TouchableOpacity style={{ marginRight: 12 }} onPress={() => updateItem(item.id, { quantity: (item.quantity || 1) + 1 })}><Text style={styles.btn}>+1</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => removeItem(item.id)}><Text style={[styles.btn, { color: 'red' }]}>Delete</Text></TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6 },
  actions: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 8 },
  name: { fontSize: 16, fontWeight: '600' },
  meta: { color: '#666', marginTop: 4 },
  itemButtons: { flexDirection: 'row', alignItems: 'center' },
  btn: { fontWeight: '700', color: '#007AFF', paddingHorizontal: 8 },
});