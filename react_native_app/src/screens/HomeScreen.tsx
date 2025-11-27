import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [userId, setUserId] = useState('');

  const saveUserId = async () => {
    if (!userId.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un ID valide');
      return;
    }

    try {
      // On sauvegarde l'ID avec la clé 'target_user_id'
      await AsyncStorage.setItem('target_user_id', userId);
      Keyboard.dismiss();
      Alert.alert('Succès', `ID ${userId} sauvegardé ! Allez voir l'onglet Profil.`);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de sauvegarder l\'ID');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuration du SDK</Text>
      <Text style={styles.label}>Entrez l'ID utilisateur (ex: 1 ou 3)</Text>
      <TextInput
        style={styles.input}
        placeholder="User ID"
        keyboardType="numeric"
        value={userId}
        onChangeText={setUserId}
      />

      <TouchableOpacity style={styles.button} onPress={saveUserId}>
        <Text style={styles.buttonText}>Sauvegarder l'ID</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
  label: { fontSize: 16, marginBottom: 10, color: '#666' },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
