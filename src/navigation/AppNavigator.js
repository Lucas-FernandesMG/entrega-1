import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SensorList from '../screens/SensorList';
import SensorDetail from '../screens/SensorDetail';
import ConfigScreen from '../screens/ConfigScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SensorList" component={SensorList} options={{ title: 'Sensores' }} />
        <Stack.Screen name="SensorDetail" component={SensorDetail} options={{ title: 'Detalhe do Sensor' }} />
        <Stack.Screen name="Config" component={ConfigScreen} options={{ title: 'Configurações' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}