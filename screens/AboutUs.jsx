import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';

const AboutUs = () => {
  const [showWebView, setShowWebView] = useState(false);

  const handlePrivacyPolicyPress = () => {
    setShowWebView(true); // Show WebView when Privacy Policy is clicked
  };

  const handleCloseWebView = () => {
    setShowWebView(false); // Hide WebView and go back to About Us page
  };

  if (showWebView) {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.closeButton} onPress={handleCloseWebView}>
          <Text style={styles.closeText}>✕ Close</Text>
        </TouchableOpacity>
        <WebView 
          source={{ uri: 'https://privacy-policy-git-main-harshlancers-projects.vercel.app/' }}
          startInLoadingState
        />
      </View>
    );
  }

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
        <Text style={styles.text}>[Harsh Ranjan Dwivedi]</Text>
        <Text style={styles.sectionHeading}>Values:</Text>
        <Text style={styles.text}>
          - Financial Literacy: We are committed to spreading financial literacy in India, empowering individuals to make informed investment decisions.
          {"\n"}- Accessibility: We believe that everyone should have access to reliable financial information, regardless of their background or experience.
        </Text>
        <Text style={styles.sectionHeading}>Our Product:</Text>
        <Text style={styles.text}>
          HIGH BRO Blog - A dedicated platform where investors can find insightful articles, analyses, and opinions on stocks, market trends, and financial news. Stay informed and empowered to make smarter investment choices.
        </Text>
        <Text style={styles.sectionHeading}>Contact Us:</Text>
        <Text style={styles.text}>
          Have questions or suggestions? Feel free to 
          <Text style={{ color: '#4CAF50', textDecorationLine: 'underline' }}> Contact Us  </Text>
        </Text>
      </View>

      {/* Privacy Policy Card */}
      <View style={styles.card}>
        <Icon name="lock" size={24} color="#FF69B4" style={styles.icon} />
        <Text style={styles.sectionHeading}>Privacy Policy</Text>
        <Text style={styles.text}>
          We value your privacy. Read our{' '}
          <Text style={styles.link} onPress={handlePrivacyPolicyPress}>
            Privacy Policy
          </Text>{' '}
          to understand how we handle your data.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#17171E', padding: 20 },
  heading: { fontSize: 24, color: '#FFF', marginBottom: 20 },
  textContainer: { marginBottom: 20 },
  text: { fontSize: 16, color: '#FFF', textAlign: 'left', lineHeight: 20 },
  sectionHeading: { fontWeight: 'bold', marginBottom: 10, color: '#FFF' },
  card: { backgroundColor: '#222', padding: 15, borderRadius: 10, marginTop: 15 },
  link: { color: '#FF69B4', textDecorationLine: 'underline' },
  closeButton: { position: 'absolute', top: 10, right: 10, zIndex: 10, padding: 10 },
  closeText: { color: '#FF69B4', fontSize: 18, fontWeight: 'bold' },
});

export default AboutUs;
