import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store/store';
import HindiNewsSection from './components/HindiNewsSection';
import StockMarketNews from './components/EnglishNews';
import AboutUs from './screens/AboutUs';
import ContactUs from './screens/ContactUs';
import { toggleDarkMode } from './store/actions/action';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const App = () => {
  const [selectedTab, setSelectedTab] = useState('Hindi News');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: any) => state.isDarkMode);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setIsSidebarOpen(false); // Close sidebar after selecting a tab
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'Hindi News':
        return <HindiNewsSection onScroll={() => {}} />;
      case 'English News':
        return <StockMarketNews onScroll={() => {}} />;
      case 'About Us':
        return <AboutUs />;
      case 'Contact Us':
        return <ContactUs />;
      default:
        return null;
    }
  };

  return (
    <Provider store={store}>
      <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8' }]}>
        {/* Sidebar */}
        <View style={[styles.sidebar, { width: isSidebarOpen ? width * 0.6 : 0 }]}>
          
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => handleTabChange('About Us')}
          >
            <Text style={[styles.sidebarText, { color: isDarkMode ? 'white' : 'black' }]}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => handleTabChange('Contact Us')}
          >
            <Text style={[styles.sidebarText, { color: isDarkMode ? 'white' : 'black' }]}>Contact Us</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Custom Header with Transparent Background */}
          <View style={[styles.header, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)' }]}>
            <TouchableOpacity onPress={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Icon
                name="bars"
                size={24}
                color={isDarkMode ? 'white' : 'black'}
              />
            </TouchableOpacity>
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
          {renderContent()}
        </View>
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarItem: {
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  sidebarText: {
    fontSize: 18,
  },
  mainContent: {
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