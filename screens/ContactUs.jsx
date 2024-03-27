import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet,TouchableOpacity } from 'react-native';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSendEmail = () => {
    // Implement email sending logic here
    // ...
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={text => setName(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Message"
        value={message}
        onChangeText={text => setMessage(text)}
        multiline
        numberOfLines={4}
        style={styles.messageInput}
      />
       <TouchableOpacity style={styles.button} onPress={handleSendEmail}>
        <Text style={styles.buttonText}>Send Email</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17171E', // Dark background
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFF', // White text
    marginBottom: 20,
    fontFamily: 'sans-serif', // Adjust font if desired
  },
  input: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#2A2A2A', // Darker input field
    color: '#FFF', // White text
    borderRadius: 5, // Rounded corners
  },
  messageInput: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#2A2A2A', // Darker input field
    color: '#FFF', // White text
    borderRadius: 5, // Rounded corners
    height: 100, // Adjust message field height as needed
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ContactUs;
