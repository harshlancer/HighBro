import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';
import HTMLParser from 'react-native-html-parser';

interface Article {
  title: string;
  summary: string;
  link: string;
}

const StockMarketNews = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchNewsData();
  }, []);

   const fetchNewsData = async () => {
    try {
      const response = await axios.get('https://pulse.zerodha.com/');
      const htmlString = response.data;

      const DOMParser = HTMLParser.DOMParser;
      const doc = new DOMParser().parseFromString(htmlString, 'text/html');

      const articleElements = doc.getElementsByClassName('box item');
      const parsedArticles: Article[] = [];

      for (let i = 0; i < articleElements.length; i++) {
        const articleElement = articleElements[i];

        const titleElement = articleElement.getElementsByClassName('title')[0];
        const title = titleElement.textContent.trim();
        const link = titleElement.getElementsByTagName('a')[0].getAttribute('href');

        const summaryElement = articleElement.getElementsByClassName('desc')[0];
        const summary = summaryElement ? summaryElement.textContent.trim() : 'No summary available';

        parsedArticles.push({ title, summary, link });
      }

      setArticles(parsedArticles);
    } catch (error) {
      console.error('Error fetching news data:', error);
    }
  };



  const handlePress = (url: string) => {
    if (url) {
      Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
    }
  };

  const renderArticle = (article: Article, index: number) => (
    <View key={index} style={styles.card}>
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.summary}>{article.summary}</Text>
      <TouchableOpacity onPress={() => handlePress(article.link)} style={styles.button}>
        <Text style={styles.buttonText}>Read More</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {articles.map(renderArticle)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    color:"black",
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default StockMarketNews;
