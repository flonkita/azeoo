import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileContainerScreen() {
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Ce hook se lance à chaque fois que l'onglet devient visible
  useFocusEffect(
    useCallback(() => {
      const loadId = async () => {
        const id = await AsyncStorage.getItem('target_user_id');
        setCurrentId(id);
      };
      loadId();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Intégration Flutter</Text>
      <View style={styles.card}>
        <Text style={styles.label}>ID actuel en mémoire :</Text>
        <Text style={styles.value}>{currentId ? currentId : 'Aucun ID défini'}</Text>
      </View>

      <Text style={styles.info}>
        Bientôt ici : Le module Flutter s'affichera pour l'utilisateur {currentId}.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eef2f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    alignItems: 'center',
    marginBottom: 30,
    width: '80%',
  },
  label: { fontSize: 14, color: '#888', marginBottom: 5 },
  value: { fontSize: 32, fontWeight: 'bold', color: '#007AFF' },
  info: { textAlign: 'center', color: '#666', paddingHorizontal: 40 },
});
