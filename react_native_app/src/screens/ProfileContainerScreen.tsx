import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, NativeModules, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// 👇 On récupère le module Java qu'on a créé
const { FlutterModule } = NativeModules;

export default function ProfileContainerScreen() {
  const [currentId, setCurrentId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadId = async () => {
        const id = await AsyncStorage.getItem('target_user_id');
        setCurrentId(id);
      };
      loadId();
    }, [])
  );

  // 👇 La fonction qui appelle le natif
  const openFlutterProfile = () => {
    if (!currentId) {
      Alert.alert('Erreur', 'Aucun ID utilisateur défini.');
      return;
    }

    try {
      console.log(`Tentative d'ouverture de Flutter pour ID: ${currentId}`);
      // C'est ICI que React Native parle à Java !
      FlutterModule.openProfile(currentId);
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Impossible de lancer le module Flutter.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Intégration Flutter</Text>

      <View style={styles.card}>
        <Text style={styles.label}>ID actuel :</Text>
        <Text style={styles.value}>{currentId ? currentId : '?'}</Text>
      </View>

      <Text style={styles.info}>
        Le module natif est prêt. Cliquez pour tester :
      </Text>

      {/* 👇 Le Bouton Magique */}
      <TouchableOpacity
        style={[styles.button, !currentId && styles.buttonDisabled]}
        onPress={openFlutterProfile}
        disabled={!currentId}
      >
        <Text style={styles.buttonText}>Ouvrir Profil Flutter 🚀</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eef2f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 12, elevation: 3, alignItems: 'center', marginBottom: 30, width: '80%' },
  label: { fontSize: 14, color: '#888', marginBottom: 5 },
  value: { fontSize: 32, fontWeight: 'bold', color: '#007AFF' },
  info: { textAlign: 'center', color: '#666', paddingHorizontal: 40, marginBottom: 20 },
  button: { backgroundColor: '#007AFF', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, elevation: 5 },
  buttonDisabled: { backgroundColor: '#ccc', elevation: 0 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
