import React, { useState, useEffect } from 'react';
import {View, SafeAreaView, StyleSheet, TouchableOpacity, Text, LogBox } from 'react-native';
import NewsWidget from './components/NewsSection';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  

  useEffect(() => {
    // Ignore specific warnings related to new NativeEventEmitter
    LogBox.ignoreLogs([
      "`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method."
    ]);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      
      <NewsWidget isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}  />
      {/* Your other components or code here */}
    </SafeAreaView>
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
  },
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
