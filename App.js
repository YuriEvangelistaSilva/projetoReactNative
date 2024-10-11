import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider } from 'react-native-paper';

import Products from './components/Products';
import Home from './components/Home';
import Notificacoes from './components/Notificacao';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="Produto" component={Products} />
          <Drawer.Screen name="Notificação" component={Notificacoes} />
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
