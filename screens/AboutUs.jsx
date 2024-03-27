import React from 'react';
import ContactUs from './ContactUs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const AboutUs = () => {

  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>About Us</Text>
      <View style={styles.textContainer}>
        <Text style={styles.sectionHeading}>Mission Statement:</Text>
        <Text style={styles.text}>
          At HIGH BRO, our mission is to save time for investors by curating news from various platforms and presenting it in a concise manner, all in one place.
        </Text>
        <Text style={styles.sectionHeading}>History:</Text>
        <Text style={styles.text}>
          HIGH BRO is an upcoming platform that aims to revolutionize how investors stay updated with the latest financial news. Founded by a passionate individual, it is driven by the vision of simplifying the process of accessing and understanding financial information.
        </Text>
        <Text style={styles.sectionHeading}>Meet the Founder:</Text>
        <Text style={styles.text}>
          [Harsh Ranjan Dwivedi]
        </Text>
        <Text style={styles.sectionHeading}>Values:</Text>
        <Text style={styles.text}>
          - Financial Literacy: We are committed to spreading financial literacy in India, empowering individuals to make informed investment decisions.
          {"\n"}
          - Accessibility: We believe that everyone should have access to reliable financial information, regardless of their background or experience.
        </Text>
        <Text style={styles.sectionHeading}>Our Product:</Text>
        <Text style={styles.text}>
          HIGH BRO Blog - A dedicated platform where investors can find insightful articles, analyses, and opinions on stocks, market trends, and financial news. Stay informed and empowered to make smarter investment choices.
        </Text>
        <Text style={styles.sectionHeading}>Contact Us:</Text>
        <Text style={styles.text}>
          Have questions or suggestions? Feel free to 
            <Text style={{ color: '#4CAF50', textDecorationLine: 'underline' }} > Contact Us  </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17171E', // Dark background
    padding: 20,
  },
  heading: {
    fontSize: 24,
    color: '#FFF', // White text
    marginBottom: 20,
    fontFamily: 'sans-serif', // Adjust font if desired
  },
  textContainer: {
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#FFF', // White text
    textAlign: 'left',
    lineHeight: 20,
  },
  sectionHeading: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFF', // White text
  },
});

export default AboutUs;
