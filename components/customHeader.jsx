import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {toggleDarkMode, refreshNews} from '../store/actions/action';
import Icon from 'react-native-vector-icons/FontAwesome5';

const CustomHeader = ({navigation, route}) => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.isDarkMode);

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const handleRefresh = () => {
    dispatch(refreshNews());
  };

  return (
    <View style={[styles.header, {backgroundColor: isDarkMode ? '#333' : '#fff'}]}>
      <TouchableOpacity onPress={handleRefresh}>
        <Text style={[styles.headerText, {color: isDarkMode ? '#fff' : '#333'}]}>
          {route.name}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleToggleDarkMode} style={styles.toggleButton}>
        <Icon
          name={isDarkMode ? "sun" : "moon"}
          size={23}
          color={isDarkMode ? '#fff' : '#333'}
        />
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
    fontSize: 22,
  },
 
  toggleButtonText: {
    fontSize: 20,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  refreshButtonText: {
    fontSize: 14,
  },
});

export default CustomHeader;
