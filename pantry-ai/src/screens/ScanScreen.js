import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { fetchProductByBarcode } from '../services/api';
import { usePantry } from '../contexts/PantryContext';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { addItem } = usePantry();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    try {
      const product = await fetchProductByBarcode(data);
      if (product) {
        await addItem({ name: product.name, barcode: data, quantity: 1 });
        Alert.alert('Added', `${product.name} added to pantry`);
      } else {
        Alert.alert('Not found', 'No product info found. Adding generic item.');
        await addItem({ name: `Item ${data}`, barcode: data, quantity: 1 });
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch product info');
    } finally {
      setTimeout(() => setScanned(false), 1200);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
});