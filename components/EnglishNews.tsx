import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import axios from 'axios';
import HTMLParser from 'react-native-html-parser';
import { toggleDarkMode } from '../store/actions/action';
import { useDispatch, useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import Share from 'react-native-share';
import Tts from 'react-native-tts';

interface Article {
  title: string;
  summary: string;
  link: string;
}

const StockMarketNews = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [speakingArticle, setSpeakingArticle] = useState<number | null>(null); // Track which article is being spoken
  const [loading, setLoading] = useState(true);
  const isDarkMode = useSelector((state) => state.isDarkMode);
  const dispatch = useDispatch();

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  useEffect(() => {
    fetchNewsData();
    const interval = setInterval(() => {
      fetchNewsData();
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const fetchNewsData = async () => {
    try {
      setLoading(true);
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
        const link = titleElement
          .getElementsByTagName('a')[0]
          .getAttribute('href');

        const summaryElement = articleElement.getElementsByClassName('desc')[0];
        const summary = summaryElement
          ? summaryElement.textContent.trim()
          : 'No summary available';

        parsedArticles.push({ title, summary, link });
      }

      setArticles(parsedArticles);
    } catch (error) {
      console.error('Error fetching news data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error('Error opening URL:', err)
      );
    }
  };

  const handleShare = async (title: string, link: string) => {
    try {
      const shareOptions = {
        title: 'Share News',
        message: `${title} - ${link}`,
        failOnCancel: false,
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSpeak = (text: string, index: number) => {
    if (speakingArticle === index) {
      Tts.stop(); // Stop speaking if the same article is clicked
      setSpeakingArticle(null); // Reset the speaking state
    } else {
      if (speakingArticle !== null) {
        Tts.stop(); // Stop any currently speaking article
      }
      Tts.speak(text); // Start speaking the clicked article
      setSpeakingArticle(index); // Update the speaking state for the current article
    }
  };

  const renderArticle = (article: Article, index: number) => (
    <View key={index} style={[styles.card, isDarkMode && styles.darkCard]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>
        {article.title}
      </Text>
      <Text style={[styles.summary, isDarkMode && styles.darkSummary]}>
        {article.summary}
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => handlePress(article.link)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Read More</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleShare(article.title, article.link)}
          style={[styles.button, { backgroundColor: '#27ae60' }]}
        >
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSpeak(article.summary, index)}
          style={[styles.button, { backgroundColor: 'gray' }]}
        >
          <Text style={styles.buttonText}>
            {speakingArticle === index ? 'Stop' : 'Speak'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <FastImage
            source={
              isDarkMode
                ? require('./loader.gif')
                : require('./light-loading.gif')
            }
            style={styles.loader}
          />
          <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
            Loading news...
          </Text>
        </View>
      ) : (
        <ScrollView>{articles.map(renderArticle)}</ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    borderRadius: 500,
    width: 400,
    height: 400,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
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
  darkCard: {
    backgroundColor: '#1e1e1e',
  },
  title: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  darkText: {
    color: '#e0e0e0',
  },
  summary: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  darkSummary: {
    color: '#a0a0a0',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default StockMarketNews;
