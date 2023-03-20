import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import Place from '../../components/Place';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {icons, miscIcons} from '../../constants/images';

import EncryptedStorage from 'react-native-encrypted-storage';
import {getEvents} from '../../utils/api/libraryCalls/getEvents';
import {getPlaces} from '../../utils/api/libraryCalls/getPlaces';
import misc from '../../constants/misc';
import {filterToUniqueIds} from '../../utils/functions/Misc';

const Library = ({navigation}: {navigation: any}) => {
  const [selectedIndex, setIndex] = useState(0);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const initializeData = async () => {
      const authToken = await EncryptedStorage.getItem('auth_token');

      const eventsRaw = await getEvents(authToken);
      setEvents(filterToUniqueIds(eventsRaw));

      const bookmarks = await getPlaces(authToken);
      setSavedPlaces(bookmarks);
    };

    initializeData();
  }, []);

  return (
    <View style={styles.container}>
      {Header(navigation)}
      {SegmentedControl(selectedIndex, setIndex)}
      {selectedIndex === 0 ? Places(savedPlaces) : Events(events)}
    </View>
  );
};

const Header = (navigation: any) => (
  <View style={headerStyles.container}>
    <Text style={headerStyles.title}>{strings.title.library}</Text>
    <TouchableOpacity
      style={headerStyles.button}
      onPress={() => navigation.navigate('SearchLibrary')}>
      <Image style={headerStyles.icon} source={miscIcons.search} />
    </TouchableOpacity>
  </View>
);

const SegmentedControl = (
  selectedIndex: number,
  setIndex: React.Dispatch<React.SetStateAction<number>>,
) => (
  <SegmentedControlTab
    tabsContainerStyle={sctStyles.container}
    tabStyle={sctStyles.tab}
    activeTabStyle={sctStyles.activeTab}
    tabTextStyle={sctStyles.text}
    firstTabStyle={sctStyles.firstTab}
    activeTabTextStyle={sctStyles.activeText}
    borderRadius={0}
    values={[strings.library.saved, strings.library.events]}
    selectedIndex={selectedIndex}
    onTabPress={index => setIndex(index)}
  />
);

const Places = (savedPlaces: Array<any>) => (
  <SafeAreaView style={styles.cardsContainer}>
    <FlatList
      data={savedPlaces}
      renderItem={({item}) => {
        if (item?.images === undefined || item?.images?.length === 0) {
          return Place(item?.name, item?.category?.name, icons.defaultImage);
        } else {
          return Place(item?.name, item?.category?.name, {
            uri:
              item?.images[0]?.prefix +
              misc.imageSize +
              item?.images[0]?.suffix,
          });
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
    <Text style={cardStyles.info}>{date}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  cardsContainer: {
    flex: 1,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(50),
    width: s(300),
  },
  title: {
    fontSize: s(28),
    fontWeight: 'bold',
    color: colors.black,
  },
  button: {
    position: 'absolute',
    right: 0,
    width: s(20),
    height: s(20),
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
});

const sctStyles = StyleSheet.create({
  container: {
    marginTop: vs(20),
    width: s(300),
    height: s(30),
  },
  tab: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  activeTab: {
    backgroundColor: colors.white,
    borderBottomWidth: 3,
    borderBottomColor: colors.accent,
  },
  firstTab: {
    borderRightWidth: 0,
  },
  text: {
    marginBottom: 2,
    fontSize: s(14),
    fontWeight: 'bold',
    color: colors.black,
  },
  activeText: {
    color: colors.accent,
  },
});

const cardStyles = StyleSheet.create({
  container: {
    marginTop: s(10),
    height: s(210),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  name: {
    marginHorizontal: s(5),
    fontSize: s(18),
    fontWeight: '700',
    color: colors.black,
  },
  info: {
    marginHorizontal: s(5),
    fontSize: s(12),
    fontWeight: '500',
    color: colors.accent,
  },
  image: {
    marginTop: s(3),
    width: s(300),
    height: s(160),
    borderRadius: s(10),
  },
  imageOverlap: {
    position: 'absolute',
    bottom: s(4),
    left: s(5),
    width: s(290),
    height: s(160),
    borderRadius: s(10),
    zIndex: -1,
  },
});

export default Library;
