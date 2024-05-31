import React from 'react';
import { WebView } from 'react-native-webview';

const BlogsScreen = () => {
    const url = 'https://wolftrader.online/'; // Your blog URL

    return (
        <WebView
            source={{ uri: url }}
            style={{ flex: 1 }} // Optional: Set styles for the WebView
        />
    );
};

export default BlogsScreen;
