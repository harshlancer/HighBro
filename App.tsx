import 'react-native-gesture-handler';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import NewsWidget from './components/NewsSection';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import ContactUs from './screens/ContactUs';
import AboutUs from './screens/AboutUs';
import {Provider, useSelector} from 'react-redux';
import store from './store/store';
import BlogsScreen from './components/BlogsScreen';
import CustomHeader from './components/customHeader';

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <Drawer.Navigator
            screenOptions={({navigation, route}) => ({
              header: () => (
                <CustomHeader navigation={navigation} route={route} />
              ),
              drawerStyle: {
                backgroundColor: useSelector((state: any) => state.isDarkMode)
                  ? '#333'
                  : '#fff',
              },
              drawerLabelStyle: {
                color: useSelector((state: any) => state.isDarkMode)
                  ? '#fff'
                  : '#333',
              },
            })}>
            <Drawer.Screen name="Feed" component={NewsWidget} />
            <Drawer.Screen name="Contact Us" component={ContactUs} />
            <Drawer.Screen name="About Us" component={AboutUs} />
            <Drawer.Screen name="Blogs" component={BlogsScreen} />
          </Drawer.Navigator>
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
