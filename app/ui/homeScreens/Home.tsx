import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';
import Separator from '../components/SeparatorR';
import PoiCard from '../components/PoiCard';

import BookmarkContext from '../../context/BookmarkContext';

import {Coordinate, Poi} from '../../utils/types';
import {fetchUserLocation, handleBookmark} from '../../utils/Misc';

// TODO: INCOMPLETE
const Home = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const [location, setLocation] = useState<Coordinate>();

  const bookmarkContext = useContext(BookmarkContext);
  if (!bookmarkContext) {
    throw new Error('BookmarkContext is not set!');
  }
  const {bookmarks, setBookmarks} = bookmarkContext;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLocation(await fetchUserLocation());
    });

    return unsubscribe;
  }, [navigation]);

  const GetGreetings = () => {
    const myDate = new Date();
    const hours = myDate.getHours();

    if (hours < 12) {
      return strings.greeting.morning;
    } else if (hours >= 12 && hours <= 17) {
      return strings.greeting.afternoon;
    } else if (hours >= 17 && hours <= 24) {
      return strings.greeting.evening;
    }
  };

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Text size="l">{GetGreetings()}</Text>
          <Icon
            icon={icons.friends}
            button={true}
            padding={-2}
            onPress={() => navigation.navigate('Friends')}
          />
        </View>
      </SafeAreaView>
      <FlatList
        data={temp_data}
        renderItem={({item}) => (
          <View style={styles.container}>
            <View style={styles.header}>
              <Text>{item.name}</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Explore', {
                    name: item.name,
                    pois: item.pois,
                    location: location,
                  })
                }>
                <Text size="s" color={colors[theme].accent}>
                  {strings.main.seeAll}
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollView}>
              {item.pois.map((poi: Poi) => (
                <TouchableOpacity
                  key={poi.id}
                  style={styles.cardContainer}
                  onPress={() => {
                    navigation.navigate('Poi', {
                      poi: poi,
                      bookmarked: false,
                      mode: 'none',
                    });
                  }}>
                  <PoiCard
                    poi={poi}
                    bookmarked={false}
                    handleBookmark={(p: Poi) => {
                      handleBookmark(p, bookmarks, setBookmarks);
                    }}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        ItemSeparatorComponent={Separator}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      paddingVertical: s(10),
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingHorizontal: s(20),
      paddingTop: s(5),
      paddingBottom: s(5),
    },
    scrollView: {
      paddingLeft: s(20),
      paddingVertical: s(5),
    },
    cardContainer: {
      marginRight: s(15),
      overflow: 'visible',
    },
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: s(50),
      height: s(50),
      borderRadius: s(25),
      backgroundColor: colors[theme].primary,
    },
    icon: {
      width: '60%',
      height: '60%',
    },
  });

const temp_data = [
  {
    id: 1,
    name: 'Popular in Seattle',
    pois: [
      {
        id: 1,
        supplier: 'google',
        name: 'Cafe on the Ave',
        photo: 'https://picsum.photos/200',
        place_id: 'ChIJXeaxcAwVkFQRMyvOL6psoX0',
        latitude: 47.618834,
        longitude: -122.3250644,
        vicinity: '123 Main St',
        price: 3,
        rating: 4.5,
        rating_count: 10000,
        category_name: 'Category 1',
      },
      {
        id: 2,
        supplier: 'google',
        name: 'Poke mon go',
        photo: 'https://picsum.photos/200',
        place_id: 'ChIJXeaxcAwVkFQRMyvOL6psoX0',
        latitude: 47.618834,
        longitude: -122.3250644,
        vicinity: '123 Main St',
        price: 1,
        rating: 3.5,
        rating_count: 13845,
        category_name: 'Category 1',
      },
      {
        id: 3,
        supplier: 'google',
        name: 'Poi 3',
        photo: 'https://picsum.photos/200',
        place_id: 'ChIJXeaxcAwVkFQRMyvOL6psoX0',
        latitude: 47.618834,
        longitude: -122.3250644,
        vicinity: '123 Main St',
        price: 4,
        rating: 4.5,
        rating_count: 10000,
        category_name: 'Category 1',
      },
    ],
  },
  {
    id: 2,
    name: 'Not Popular in Seattle',
    pois: [
      {
        id: 1,
        supplier: 'google',
        name: 'Local Point',
        photo: 'https://picsum.photos/200',
        place_id: 'ChIJXeaxcAwVkFQRMyvOL6psoX0',
        latitude: 47.618834,
        longitude: -122.3250644,
        vicinity: '123 Main St',
        price: 2,
        rating: 4.3,
        rating_count: 10000,
        category_name: 'Ass',
      },
      {
        id: 2,
        supplier: 'google',
        name: 'Center Table',
        photo: 'https://picsum.photos/200',
        place_id: 'ChIJXeaxcAwVkFQRMyvOL6psoX0',
        latitude: 47.618834,
        longitude: -122.3250644,
        vicinity: '123 Main St',
        price: 4,
        rating: 4.5,
        rating_count: 32400,
        category_name: 'Category 1',
      },
      {
        id: 3,
        supplier: 'google',
        name: 'Poi 3',
        photo: 'https://picsum.photos/200',
        place_id: 'ChIJXeaxcAwVkFQRMyvOL6psoX0',
        latitude: 47.618834,
        longitude: -122.3250644,
        vicinity: '123 Main St',
        price: 5,
        rating: 4.5,
        rating_count: 100,
        category_name: 'Category 1',
      },
    ],
  },
  {
    id: 3,
    name: 'Kinda Popular in Seattle',
    pois: [
      {
        id: 1,
        supplier: 'google',
        name: 'Local Point',
        photo: 'https://picsum.photos/200',
        place_id: 'ChIJXeaxcAwVkFQRMyvOL6psoX0',
        latitude: 47.618834,
        longitude: -122.3250644,
        vicinity: '123 Main St',
        price: 2,
        rating: 4.3,
        rating_count: 10000,
        category_name: 'Ass',
      },
      {
        id: 2,
        supplier: 'google',
        name: 'Center Table',
        photo: 'https://picsum.photos/200',
        place_id: 'ChIJXeaxcAwVkFQRMyvOL6psoX0',
        latitude: 47.618834,
        longitude: -122.3250644,
        vicinity: '123 Main St',
        price: 4,
        rating: 4.5,
        rating_count: 32400,
        category_name: 'Category 1',
      },
      {
        id: 3,
        supplier: 'google',
        name: 'Poi 3',
        photo: 'https://picsum.photos/200',
        place_id: 'ChIJXeaxcAwVkFQRMyvOL6psoX0',
        latitude: 47.618834,
        longitude: -122.3250644,
        vicinity: '123 Main St',
        price: 5,
        rating: 4.5,
        rating_count: 100,
        category_name: 'Category 1',
      },
    ],
  },
];

export default Home;
