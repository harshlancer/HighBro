import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {View, SafeAreaView, StyleSheet, LogBox} from 'react-native';
import NewsWidget from './components/NewsSection';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import ContactUs from './screens/ContactUs';
import AboutUs from './screens/AboutUs';
import {Provider, useSelector, useDispatch} from 'react-redux'; // Import Redux dependencies
import store from './store/store'; // Import Redux store
import {toggleDarkMode} from './store/actions/action'; // Import toggleDarkMode action

interface LanguageButtonText {
  color: string;
  fontSize: number;
  allowFontScaling: boolean;
}

const App = () => {
  const Drawer = createDrawerNavigator();

  useEffect(() => {
    // Ignore specific warnings related to new NativeEventEmitter
    LogBox.ignoreLogs([
      '`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.',
    ]);
  }, []);

  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: any) => state.isDarkMode);

  function MyDrawer() {
    return (
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: isDarkMode ? '#333' : '#fff', // Set background color based on dark mode
          },
          drawerLabelStyle: {
            color: isDarkMode ? '#fff' : '#333', // Set text color based on dark mode
          },
          headerStyle: {
            backgroundColor: isDarkMode ? '#333' : '#fff', // Set header background color based on dark mode
          },
          headerTintColor: isDarkMode ? '#fff' : '#333', // Set header text color based on dark mode
        }}>
        <Drawer.Screen name="Feed" component={NewsWidget} />
        <Drawer.Screen name="Contact Us" component={ContactUs} />
        <Drawer.Screen name="About Us" component={AboutUs} />
      </Drawer.Navigator>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaView
          style={[
            styles.container,
            {backgroundColor: isDarkMode ? '#333' : '#fff'},
          ]}>
          <MyDrawer />
        </SafeAreaView>
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedLanguageButton: {
    backgroundColor: '#333',
  },
  languageButtonText: {
    color: '#333',
    fontSize: 16,
    allowFontScaling: false,
  } as LanguageButtonText,
  selectedLanguageButtonText: {
    color: '#fff',
  },
  toggleButton: {
    padding: 16,
  },
  toggleButtonText: {
    color: '#000',
  },
});

export default App;
