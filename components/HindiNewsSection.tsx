import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Linking,
  RefreshControl,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import Share from 'react-native-share';
import Tts from 'react-native-tts';
import {useSelector} from 'react-redux';
import HTMLParser from 'react-native-html-parser';
import FastImage from 'react-native-fast-image';

interface Article {
  title: string;
  image_src: string | null;
  url: string;
}

interface Props {
  onScroll: (event: any) => void;
}

const {height} = Dimensions.get('window');

const HindiNewsSection: React.FC<Props> = ({onScroll}) => {
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
      setLoading(true);
      const response = await axios.get('https://www.bhaskar.com/business/');
      const htmlString = response.data;

      const DOMParser = HTMLParser.DOMParser;
      const doc = new DOMParser().parseFromString(htmlString, 'text/html');

      const articles: Article[] = [];
      const liElements = doc.getElementsByTagName('li');

      for (let i = 0; i < liElements.length; i++) {
        const liElement = liElements[i];

        // Check if the <li> element has the required classes
        const classAttribute = liElement.getAttribute('class');
        if (classAttribute && classAttribute.includes('c7ff6507 db9a2680')) {
          const linkElement = liElement.getElementsByTagName('a')[0];
          if (linkElement) {
            const url = linkElement.getAttribute('href');
            const titleElement = linkElement.getElementsByTagName('h3')[0];
            const title = titleElement ? titleElement.textContent.trim() : 'No Title';

            let imageSrc = null;
            const imgElement = linkElement.getElementsByTagName('img')[0];
            if (imgElement) {
              imageSrc =
                imgElement.getAttribute('src') ||
                imgElement.getAttribute('data-src');
            }

            if (url) {
              articles.push({title, image_src: imageSrc, url});
            }
          }
        }
      }

      setNewsData(articles);
    } catch (error) {
      console.error('Error fetching Hindi news data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePullToRefresh = () => {
    setRefreshing(true); // Set refreshing state to true before fetching data
    fetchNewsData();
  };

  const handlePress = (url: string) => {
    console.log('URL:', url); // Debugging
    if (url) {
      const absoluteUrl = url.startsWith('http')
        ? url
        : `https://www.bhaskar.com${url}`;
      Linking.openURL(absoluteUrl).catch(err =>
        console.error('Error opening URL: ', err),
      );
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

  const renderNewsItem = ({item}: {item: Article}) => {
    const showPlaceholderImage = !item.image_src;
    return (
      <View
        style={[styles.cardContainer, isDarkMode && styles.darkCardContainer]}>
        <View style={isDarkMode ? styles.darkCard : styles.card}>
          <Text style={isDarkMode ? styles.darkTitle : styles.title}>
            {item.title}
          </Text>
          {showPlaceholderImage ? (
            <Image
              source={require('./No_Image_Available.png')}
              style={styles.bannerImage}
            />
          ) : (
            <Image source={{uri: item.image_src}} style={styles.bannerImage} />
          )}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => {
                console.log('Read More Pressed:', item.url); // Debugging
                handlePress(item.url);
              }}
              style={styles.button}>
              <Text
                style={isDarkMode ? styles.darkButtonText : styles.buttonText}>
                Read More
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleShare(item.title)}
              style={[styles.button, {backgroundColor: '#27ae60'}]}>
              <Text
                style={isDarkMode ? styles.darkButtonText : styles.buttonText}>
                Share
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSpeak(item.title)}
              style={[styles.button, {backgroundColor: 'gray'}]}>
              <Text
                style={isDarkMode ? styles.darkButtonText : styles.buttonText}>
                {isSpeaking ? 'Stop' : 'Speak'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={isDarkMode ? styles.darkContainer : styles.container}>
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
          <Text
            style={isDarkMode ? styles.darkLoadingText : styles.loadingText}>
            Loading news...
          </Text>
        </View>
      ) : (
        <FlatList
          data={newsData}
          renderItem={renderNewsItem}
          keyExtractor={(item, index) => index.toString()}
          pagingEnabled // Enable paging
          showsVerticalScrollIndicator={false} // Hide scroll indicator
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handlePullToRefresh}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e4e2',
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#3b3c36',
  },
  cardContainer: {
    height: height - 100, // Adjust height to fit the screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkCardContainer: {
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
    width: '90%',
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
    width: '90%',
    shadowColor: '#4C4646',
    shadowOffset: {width: 0, height: 2},
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