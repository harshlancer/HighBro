import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, LogBox } from 'react-native';
import NewsWidget from './components/NewsSection';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DarkModeProvider } from './components/DarkModeProvider';
import ContactUs from './screens/ContactUs';
import AboutUs from './screens/AboutUs';

interface LanguageButtonText {
  color: string;
  fontSize: number;
  allowFontScaling: boolean;
}

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const Drawer = createDrawerNavigator();

  useEffect(() => {
    // Ignore specific warnings related to new NativeEventEmitter
    LogBox.ignoreLogs([
      "`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method."
    ]);
  }, []);
  function MyDrawer() {
    return (
      
      <Drawer.Navigator >
          <Drawer.Screen name="Feed" component={NewsWidget}  />
          <Drawer.Screen name="Contact Us" component={ContactUs}  />
          <Drawer.Screen name="About Us" component={AboutUs}  />
          
      </Drawer.Navigator>
    );
  }

  return (
    <DarkModeProvider>

    <NavigationContainer>
      
      <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}> 
        <MyDrawer />
      </SafeAreaView> 
     </NavigationContainer>
    </DarkModeProvider>
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
