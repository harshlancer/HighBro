// CustomHeader.js
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {toggleDarkMode} from '../store/actions/action';

const CustomHeader = ({navigation, route}) => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.isDarkMode);

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <View style={[styles.header, {backgroundColor: isDarkMode ? '#333' : '#fff'}]}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Text style={[styles.headerText, {color: isDarkMode ? '#fff' : '#333'}]}>
          {route.name}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleToggleDarkMode} style={styles.toggleButton}>
        <Text style={[styles.toggleButtonText, {color: isDarkMode ? '#fff' : '#333'}]}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleButton: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  toggleButtonText: {
    fontSize: 14,
  },
});

export default CustomHeader;
