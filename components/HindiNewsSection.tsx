import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Linking, RefreshControl } from 'react-native';
import axios from 'axios';
import Share from 'react-native-share';
import Tts from 'react-native-tts';
import { useDispatch, useSelector } from 'react-redux';
import HTMLParser from 'react-native-html-parser';
import { toggleDarkMode } from '../store/actions/action';
import FastImage from 'react-native-fast-image';

interface Article {
  title: string;
  image_src: string | null;
}

interface Props {
  onScroll: (event: any) => void;
}

const HindiNewsSection: React.FC<Props> = ({ onScroll }) => {
  const [newsData, setNewsData] = useState<Article[]>([]);
  const [isSpeaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State for refresh control
  const isDarkMode = useSelector((state: any) => state.isDarkMode);

  useEffect(() => {
    fetchNewsData();
  }, []);

  const fetchNewsData = async () => {
    try {
      setLoading(true); // Set loading to true before fetching data
      const response = await axios.get('https://www.bhaskar.com/business/');
      const htmlString = response.data;

      const DOMParser = HTMLParser.DOMParser;
      const doc = new DOMParser().parseFromString(htmlString, 'text/html');

      const articles: Article[] = [];
      const h3Elements = doc.getElementsByTagName('h3');
      const uniqueTitles = new Set(); // To track unique titles

      for (let i = 0; i < h3Elements.length; i++) {
        const titleElement = h3Elements[i];
        const title = titleElement.textContent.trim();

        // Check if the title is already added
        if (uniqueTitles.has(title)) {
          continue; // Skip duplicate title
        }

        uniqueTitles.add(title); // Add title to the set

        let imageSrc = null;
        const imgElements = titleElement.parentNode.getElementsByTagName('img');
        const sourceElements = titleElement.parentNode.getElementsByTagName('source');

        if (imgElements.length > 0) {
          imageSrc =
            imgElements[0].getAttribute('src') ||
            imgElements[0].getAttribute('data-src');
        } else if (sourceElements.length > 0) {
          imageSrc = sourceElements[0].getAttribute('srcset');
          if (imageSrc && imageSrc.includes(',')) {
            imageSrc = imageSrc.split(',')[0].split(' ')[0]; // Extract first URL from srcset
          }
        }

        articles.push({ title, image_src: imageSrc });
      }

      setNewsData(articles);
    } catch (error) {
      console.error('Error fetching Hindi news data:', error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
      setRefreshing(false); // Stop the refreshing state
    }
  };

  const handlePullToRefresh = () => {
    setRefreshing(true); // Set refreshing state to true before fetching data
    fetchNewsData();
  };

  const handlePress = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) => console.error('Error opening URL: ', err));
    }
  };

  const handleShare = async (title: string) => {
    try {
      const shareOptions = {
        title: 'Share News',
        message: `${title} - https://play.google.com/store/apps/details?id=com.highbro`,
        failOnCancel: false,
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSpeak = (text: string) => {
    if (!isSpeaking) {
      Tts.speak(text);
      setSpeaking(true);
    } else {
      Tts.stop();
      setSpeaking(false);
    }
  };

  const renderNewsItem = (item: Article) => {
    const showPlaceholderImage = !item.image_src;
    return (
      <View style={isDarkMode ? styles.darkCard : styles.card}>
        <Text style={isDarkMode ? styles.darkTitle : styles.title}>{item.title}</Text>
        {showPlaceholderImage ? (
          <Image source={require('./No_Image_Available.png')} style={styles.bannerImage} />
        ) : (
          <Image source={{ uri: item.image_src }} style={styles.bannerImage} />
        )}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => handlePress(item.title)} style={styles.button}>
            <Text style={isDarkMode ? styles.darkButtonText : styles.buttonText}>Read More</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleShare(item.title)}
            style={[styles.button, { backgroundColor: '#27ae60' }]}>
            <Text style={isDarkMode ? styles.darkButtonText : styles.buttonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSpeak(item.title)}
            style={[styles.button, { backgroundColor: 'gray' }]}>
            <Text style={isDarkMode ? styles.darkButtonText : styles.buttonText}>
              {isSpeaking ? 'Stop' : 'Speak'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={isDarkMode ? styles.darkContainer : styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <FastImage
            source={isDarkMode ? require('./loader.gif') : require('./light-loading.gif')}
            style={styles.loader}
          />
          <Text style={isDarkMode ? styles.darkLoadingText : styles.loadingText}>Loading news...</Text>
        </View>
      ) : (
        <ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={isDarkMode ? styles.darkContainer : styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handlePullToRefresh} />
          }>
          {newsData.map((item, index) => renderNewsItem(item))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '2%',
    backgroundColor: '#e5e4e2',
  },
  darkContainer: {
    flex: 1,
    padding: '2%',
    backgroundColor: '#3b3c36',
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
  darkLoadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#e0e0e0',
  },
  card: {
    backgroundColor: '#F8F8FF',
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
    backgroundColor: 'black',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#4C4646',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    color: 'black',
    fontFamily: 'oswald',
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  darkTitle: {
    color: 'white',
    fontFamily: 'oswald',
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bannerImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: '1%',
    paddingHorizontal: '3%',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  darkButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default HindiNewsSection;
