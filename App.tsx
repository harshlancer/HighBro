import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store/store';
import HindiNewsSection from './components/HindiNewsSection';
import StockMarketNews from './components/EnglishNews';
import { toggleDarkMode } from './store/actions/action';
import Icon from 'react-native-vector-icons/FontAwesome';

const App = () => {
  const [selectedTab, setSelectedTab] = useState('Hindi News');
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: any) => state.isDarkMode);

  const handleTabChange = (tab: string) => setSelectedTab(tab);

  return (
    <Provider store={store}>
      <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? 'black' : 'white' }]}>
        {/* Custom Header with Transparent Background */}
        <View style={[styles.header, { backgroundColor: 'rgba(255, 255, 255, 0.5)' }]}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => handleTabChange('Hindi News')}
          >
            <Text style={[styles.tabText, selectedTab === 'Hindi News' && styles.activeTab, { color: isDarkMode ? 'white' : 'black' }]}>
              Hindi News
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => handleTabChange('English News')}
          >
            <Text style={[styles.tabText, selectedTab === 'English News' && styles.activeTab, { color: isDarkMode ? 'white' : 'black' }]}>
              English News
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch(toggleDarkMode())}>
            <Icon
              name={isDarkMode ? "sun-o" : "moon-o"}
              size={24}
              color={isDarkMode ? "white" : "black"}
            />
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        {selectedTab === 'Hindi News' ? (
          <HindiNewsSection onScroll={() => {}} />
        ) : (
          <StockMarketNews onScroll={() => {}} />
        )}
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Transparent background
  },
  tabButton: {
    padding: 10,
  },
  tabText: {
    fontSize: 16,
    color: 'gray',
  },
  activeTab: {
    fontWeight: 'bold',
  },
});

export default App;
