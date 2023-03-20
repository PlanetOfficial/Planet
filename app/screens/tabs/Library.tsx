import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import Place from '../../components/Place';

import strings from '../../constants/strings';
import {colors} from '../../constants/colors';
import {icons, miscIcons, vectors} from '../../constants/images';

import EncryptedStorage from 'react-native-encrypted-storage';
import { getEvents } from '../../utils/api/libraryCalls/getEvents';
import { getPlaces } from '../../utils/api/libraryCalls/getPlaces';
import misc from '../../constants/misc';
import { filterToUniqueIds } from '../../utils/functions/Misc';

const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;

const Library = ({navigation}: {navigation: any}) => {
  const [selectedIndex, setIndex] = useState(0);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const initializeData = async() => {
      const authToken = await EncryptedStorage.getItem('auth_token');

      const events = await getEvents(authToken);
      setEvents(filterToUniqueIds(events));

      const bookmarks = await getPlaces(authToken);
      setSavedPlaces(bookmarks);
    }

    initializeData();
  }, [])

  return (
    <View style={styles.container}>
      <Image style={styles.background} source={vectors.shape1} />
      <Text style={styles.title}>{strings.title.library}</Text>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigation.navigate()}>
        <Image style={styles.search} source={miscIcons.search} />
      </TouchableOpacity>
      {SegmentedControl(selectedIndex, setIndex)}
      {selectedIndex === 0 ? Places(savedPlaces) : Events(events)}
    </View>
  );
};

const SegmentedControl = (
  selectedIndex: number,
  setIndex: React.Dispatch<React.SetStateAction<number>>,
) => (
  <View style={styles.sctContainer}>
    <SegmentedControlTab
      tabsContainerStyle={sctStyles.container}
      tabStyle={sctStyles.tab}
      activeTabStyle={sctStyles.activeTab}
      tabTextStyle={sctStyles.text}
      activeTabTextStyle={sctStyles.activeText}
      borderRadius={25}
      values={[strings.library.saved, strings.library.events]}
      selectedIndex={selectedIndex}
      onTabPress={index => setIndex(index)}
    />
  </View>
);

const Places = (savedPlaces: Array<any>) => (
  <SafeAreaView style={styles.cardsContainer}>
    <FlatList
      data={savedPlaces}
      renderItem={({item}) => {
        if (item?.images === undefined || item?.images?.length === 0) {
          return Place(item?.name, item?.category?.name, icons.defaultImage);
        } else {
          return Place(item?.name, item?.category?.name, {uri: item?.images[0]?.prefix + misc.imageSize + item?.images[0]?.suffix});
        }
      }}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
    />
  </SafeAreaView>
);

const Events = (events: Array<any>) => (
  <SafeAreaView style={styles.cardsContainer}>
    <FlatList
      data={events}
      renderItem={({item}) => Event(item.name, item.date)}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
    />
  </SafeAreaView>
);

const Event = (name: string, date: string) => (
  <View style={cardStyles.container}>
    <Text style={cardStyles.name}>{name}</Text>
    <Text style={cardStyles.category}>{date}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: W,
    height: H,
    backgroundColor: colors.white,
  },
  background: {
    width: W,
    height: 240,
    tintColor: colors.fill,
  },
  title: {
    position: 'absolute',
    top: 60,
    left: 30,
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.black,
  },
  searchButton: {
    position: 'absolute',
    top: 69,
    right: 30,
    width: 24,
    height: 24,
  },
  search: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
  sctContainer: {
    position: 'absolute',
    top: 120,
  },
  cardsContainer: {
    position: 'absolute',
    top: 240,
    width: W - 60,
    height: H - 240,
  },
});

const sctStyles = StyleSheet.create({
  container: {
    width: W - 60,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.grey,
  },
  tab: {
    margin: 5,
    borderRadius: 20,
    borderColor: colors.grey,
    backgroundColor: colors.grey,
  },
  activeTab: {
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  activeText: {
    color: colors.accent,
  },
});

const cardStyles = StyleSheet.create({
  container: {
    width: W - 60,
    height: 200,
    marginBottom: 25,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
  },
  category: {
    marginVertical: 2,
    fontSize: 12,
    color: colors.accent,
  },
  image: {
    width: W - 60,
    height: 164,
    borderRadius: 10,
  },
  imageOverlap: {
    bottom: 159,
    left: 5,
    width: W - 70,
    height: 164,
    borderRadius: 10,
    zIndex: -1,
  },
});

export default Library;
