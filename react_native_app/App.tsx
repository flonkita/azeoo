import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import ProfileContainerScreen from './src/screens/ProfileContainerScreen';

// On peut ajouter des icônes plus tard, restons simples pour le test
const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // On cache le header par défaut
          tabBarStyle: { paddingBottom: 5, height: 60 },
          tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
        }}
      >
        <Tab.Screen
          name="Config"
          component={HomeScreen}
          options={{ tabBarLabel: 'Configuration (ID)' }}
        />
        <Tab.Screen
          name="Profil"
          component={ProfileContainerScreen}
          options={{ tabBarLabel: 'Voir le Profil (SDK)' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
