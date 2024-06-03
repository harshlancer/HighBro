import axios from 'axios';
import {Linking, RefreshControl} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {captureRef} from 'react-native-view-shot';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Share from 'react-native-share';

import Swiper from 'react-native-swiper';
import Tts from 'react-native-tts';
import {Dimensions} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {toggleDarkMode} from '../store/actions/action';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  isDarkMode: boolean;
}
interface Props {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewsWidget = () => {
  const [newsData, setNewsData] = useState<Article[]>([]);
  const [isSpeaking, setSpeaking] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const key = '995e4a922f2a496f9bbf2ffe227a4e33';
  const api_url =
    'https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=995e4a922f2a496f9bbf2ffe227a4e33';

  const CACHE_KEY = 'newsData';
  const MAX_CACHE_SIZE = 50; // Adjust this as needed

  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: any) => state.isDarkMode);

  const viewRef = useRef(null);

  useEffect(() => {
    fetchData(); // Fetch data initially when component mounts
    const intervalId = setInterval(fetchData, 36000000); // Fetch data every 10 hours (adjust as needed)
    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(api_url);
      const freshNews = response.data.articles.map((article: Article) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
      }));
      setNewsData(freshNews);
      // Cache the fresh data
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      let cachedNews: Article[] = cachedData ? JSON.parse(cachedData) : [];
      cachedNews = [...cachedNews, ...freshNews]; // Append fresh news to existing cached news
      const newArticles = freshNews.filter(
        (newArticle: any) =>
          !cachedNews.find(cached => cached.url === newArticle.url),
      );
      const updatedNews = [...cachedNews, ...newArticles];
      if (updatedNews.length > MAX_CACHE_SIZE) {
        updatedNews.splice(0, updatedNews.length - MAX_CACHE_SIZE);
      }

      setNewsData(updatedNews);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedNews));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handlePress = (url: string) => {
    if (url) {
      Linking.openURL(url).catch(err =>
        console.error('Error opening URL: ', err),
      );
    }
  };

  const renderNewsItem = ({item}: {item: Article}) => {
    const showPlaceholderImage = !item.urlToImage || item.urlToImage === 'null';
    const widgetData = item.title;
    const text = item.title;

    const handleShare = async () => {
      try {
        const uri = await captureRef(viewRef, {
          format: 'png',
          quality: 0.8,
        });
        const shareOptions = {
          title: 'Share News',
          message:
            'Get High News with High Bro and share it with your friends! https://play.google.com/store/apps/details?id=com.highbro',
          url: uri,
          failOnCancel: false,
        };
        await Share.open(shareOptions);
      } catch (error) {
        console.error('Error sharing screenshot:', error);
      }
    };

    const handleSpeak = () => {
      if (!isSpeaking) {
        // Start speaking
        Tts.speak(text);
        setSpeaking(true);
      } else {
        // Stop speaking
        Tts.stop();
        setSpeaking(false);
      }
    };

    const handleDark = () => {
      dispatch(toggleDarkMode());
    };

    return (
      <View style={isDarkMode ? styles.darkCard : styles.card}>
        <Text
          style={isDarkMode ? styles.darkHeading : styles.heading}
          allowFontScaling={false}>
          {item.title}
        </Text>
        <View style={styles.line}></View>
        <Text
          style={isDarkMode ? styles.darkSummaryText : styles.summaryText}
          allowFontScaling={false}>
          {item.description}
        </Text>
        {showPlaceholderImage ? (
          <Image
            source={require('./No_Image_Available.png')}
            style={styles.bannerImage}
          />
        ) : (
          <Image source={{uri: item.urlToImage}} style={styles.bannerImage} />
        )}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() => handlePress(item.url)}
            style={styles.button}>
            <Text
              style={isDarkMode ? styles.darkButtonText : styles.buttonText}
              allowFontScaling={false}>
              Read More
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShare}
            style={[styles.button, {backgroundColor: '#27ae60'}]}>
            <Text
              style={isDarkMode ? styles.darkButtonText : styles.buttonText}
              allowFontScaling={false}>
              Share
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSpeak}
            style={[styles.button, {backgroundColor: 'gray'}]}>
            <Text
              style={isDarkMode ? styles.darkButtonText : styles.buttonText}
              allowFontScaling={false}>
              {isSpeaking ? 'Stop' : 'Speak'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View
      ref={viewRef}
      style={isDarkMode ? styles.darkContainer : styles.container}>
      <Swiper
        loop={false}
        showsPagination={false}
        horizontal={false}
        showsVerticalScrollIndicator
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        {newsData.map((item, index) => (
          <View key={index}>{renderNewsItem({item})}</View>
        ))}
      </Swiper>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface Styles {
  container: {
    flex: number;
    padding: string;
    backgroundColor: string;
  };
  darkContainer: {
    flex: number;
    padding: string;
    backgroundColor: string;
  };
  buttonsContainer: {
    flexDirection: 'row';
    justifyContent: 'space-around';
    marginTop: number;
  };
  button: {
    backgroundColor: string;
    paddingVertical: string;
    paddingHorizontal: string;
    borderRadius: number;
  };
  buttonText: {
    color: string;
    fontWeight: 'bold';
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '2%',
    backgroundColor: '#e5e4e2',
  },
  line: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 8,
    marginTop: 8,
  },

  darkContainer: {
    flex: 1,
    padding: '2%',
    backgroundColor: '#3b3c36',
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

  shareButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#F8F8FF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heading: {
    color: 'black',
    fontFamily: 'oswald',
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  darkHeading: {
    color: 'white',
    fontFamily: 'oswald',
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 19,
    color: '#555',
    marginBottom: 8,
  },
  darkSummaryText: {
    fontSize: 16,
    lineHeight: 19,
    color: 'white',
    marginBottom: 8,
  },
  bannerImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  speakButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  speakButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NewsWidget;
