import 'react-native-gesture-handler';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import NewsWidget from './components/NewsSection';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ContactUs from './screens/ContactUs';
import AboutUs from './screens/AboutUs';
import {Provider, useSelector} from 'react-redux';
import store from './store/store';
import BlogsScreen from './components/BlogsScreen';
import CustomHeader from './components/customHeader';

const Tab = createBottomTabNavigator();

const App = () => {
  const isDarkMode = useSelector((state: any) => state.isDarkMode);
  
  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <Tab.Navigator
            screenOptions={({ navigation, route }) => ({
              header: () => (
                <CustomHeader navigation={navigation} route={route} />
              ),
              tabBarStyle: {
                backgroundColor: isDarkMode ? '#333' : '#fff',
              },
              tabBarLabelStyle: {
                color: isDarkMode ? '#fff' : '#333',
              },
            })}
          >
            <Tab.Screen name="Feed" component={NewsWidget} />
            <Tab.Screen name="Contact Us" component={ContactUs} />
            <Tab.Screen name="About Us" component={AboutUs} />
            <Tab.Screen name="Blogs" component={BlogsScreen} />
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
