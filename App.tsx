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
      <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8' }]}> 
        {/* Custom Header with Transparent Background */}
        <View style={[styles.header, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)' }]}> 
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 'Hindi News' && styles.activeTabButton]}
              onPress={() => handleTabChange('Hindi News')}
            >
              <Text style={[styles.tabText, selectedTab === 'Hindi News' && styles.activeTabText, { color: isDarkMode ? 'white' : 'black' }]}>Hindi News</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 'English News' && styles.activeTabButton]}
              onPress={() => handleTabChange('English News')}
            >
              <Text style={[styles.tabText, selectedTab === 'English News' && styles.activeTabText, { color: isDarkMode ? 'white' : 'black' }]}>English News</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => dispatch(toggleDarkMode())}>
            <Icon
              name={isDarkMode ? 'sun-o' : 'moon-o'}
              size={24}
              color={isDarkMode ? 'white' : 'black'}
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  tabContainer: {
    flexDirection: 'row',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: '#3498db',
  },
  tabText: {
    fontSize: 16,
    color: 'gray',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
