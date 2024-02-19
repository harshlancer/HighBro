import axios from 'axios';
import { Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Share, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import Tts from "react-native-tts";
import { Dimensions } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  isDarkMode:boolean
}
interface Props {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}


const NewsWidget: React.FC<Props> = ({ isDarkMode,setIsDarkMode }: Props) => {
  const [newsData, setNewsData] = useState<Article[]>([]);
  const [isSpeaking,setSpeaking]=useState(false)
  const key = '995e4a922f2a496f9bbf2ffe227a4e33';
  const api_url = 'https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=995e4a922f2a496f9bbf2ffe227a4e33';

  
  const CACHE_KEY = 'newsData';
  const MAX_CACHE_SIZE = 50; // Adjust this as needed

  useEffect(() => {
    fetchData(); // Fetch data initially when component mounts
    const intervalId = setInterval(fetchData, 36000000); // Fetch data every 1 minute (adjust as needed)
    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=995e4a922f2a496f9bbf2ffe227a4e33');
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
      if (cachedNews.length > MAX_CACHE_SIZE) {
        cachedNews = cachedNews.slice(-MAX_CACHE_SIZE); // Keep only the latest MAX_CACHE_SIZE items
      }

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cachedNews));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePress = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) => console.error('Error opening URL: ', err));
    }
  };

  const renderNewsItem = ({ item }: { item: Article }) => {
    const showPlaceholderImage = !item.urlToImage || item.urlToImage === 'null';
    const widgetData=item.title
    const text=item.title
    const handleShare = async () => {
      try {
        await Share.share({
          title: item.title,
          message: item.title+" "+item.description ,
          url: item.url,
        });
      } catch (error) {
        console.log(error);
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
        setSpeaking(false)
      }
    };
    const handleDark=()=>{
      setIsDarkMode(!isDarkMode)
    }

    return (
      <View style={isDarkMode ? styles.darkCard : styles.card}>
        <Text style={isDarkMode ? styles.darkHeading : styles.heading}>{item.title}</Text>
        <Text style={isDarkMode ? styles.darkSummaryText : styles.summaryText}>{item.description}</Text>
        {showPlaceholderImage ? (
          <Image
            source={require('./No_Image_Available.png')}
            style={styles.bannerImage}
          />
        ) : (
          <Image source={{ uri: item.urlToImage }} style={styles.bannerImage} />
        )}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => handlePress(item.url)} style={styles.button}>
            <Text style={isDarkMode ? styles.darkButtonText : styles.buttonText}>Read More</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={[styles.button, { backgroundColor: '#27ae60' }]}>
            <Text style={isDarkMode ? styles.darkButtonText : styles.buttonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSpeak} style={[styles.button, { backgroundColor: 'gray' }]}>
            <Text style={isDarkMode ? styles.darkButtonText : styles.buttonText}>{isSpeaking ? "Stop" : "Speak"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDark} style={[styles.button, { backgroundColor: '#A7D397' }]}>
            <Text style={isDarkMode ? styles.darkButtonText : styles.buttonText}>{isDarkMode ? "Light" : "Dark"  }</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={isDarkMode ? styles.darkContainer : styles.container }>
      <Swiper loop={false} showsPagination={false} horizontal={false} showsVerticalScrollIndicator>
        {newsData.map((item, index) => (
          <View key={index}>{renderNewsItem({ item })}
          </View>
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
  // Define other styles here...
}

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
  heading: {
    color: 'black',
    fontFamily: 'oswald',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  darkHeading: {
    color: 'white',
    fontFamily: 'oswald',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 18,
    color: '#555',
    lineHeight: 25,
    marginBottom: 8,
  },
  darkSummaryText: {
    fontSize: 18,
    color: 'white',
    lineHeight: 25,
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

