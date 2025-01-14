import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import store from './store/store';
import HindiNewsSection from './components/HindiNewsSection';
import StockMarketNews from './components/EnglishNews';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName;

                if (route.name === 'Hindi News') {
                  iconName = 'globe';
                } else if (route.name === 'English News') {
                  iconName = 'rss';
                }

                return <Icon name={iconName} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen name="English News" component={StockMarketNews} />
            <Tab.Screen name="Hindi News" component={HindiNewsSection} />
          </Tab.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
