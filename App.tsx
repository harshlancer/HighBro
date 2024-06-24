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
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const App = () => {
  const isDarkMode = useSelector((state: any) => state.isDarkMode);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <Tab.Navigator
            screenOptions={({navigation, route}) => ({
              header: () => (
                <CustomHeader navigation={navigation} route={route} />
              ),
              tabBarStyle: {
                backgroundColor: isDarkMode ? '#333' : '#fff',
              },
              tabBarLabelStyle: {
                color: isDarkMode ? '#fff' : '#333',
              },
              tabBarIcon: ({color, size}) => {
                let iconName;

                if (route.name === 'Feed') {
                  iconName = 'feed';
                } else if (route.name === 'Contact Us') {
                  iconName = 'contact-support';
                } else if (route.name === 'About Us') {
                  iconName = 'user';
                } else if (route.name === 'Blogs') {
                  iconName = 'eye';
                }

                return <Icon name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: isDarkMode ? '#fff' : '#333',
              inactiveTintColor: isDarkMode ? '#555' : '#aaa',
            }}>
            <Tab.Screen name="Feed" component={NewsWidget} />
            <Tab.Screen name="Blogs" component={BlogsScreen} />
            <Tab.Screen name="About Us" component={AboutUs} />
            <Tab.Screen name="Contact Us" component={ContactUs} />
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
