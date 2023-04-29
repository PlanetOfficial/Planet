import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {s} from 'react-native-size-matters';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import Text from '../components/elements/Text';
import IconButton from '../components/elements/IconButton';
import PlaceCard from '../components/PlaceCard';
import EventCard from '../components/EventCard';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';

import EncryptedStorage from 'react-native-encrypted-storage';
import {getEvents} from '../../utils/api/libraryCalls/getEvents';
import {getBookmarks} from '../../utils/api/shared/getBookmarks';
import {filterToUniqueIds} from '../../utils/functions/Misc';

const Library = ({navigation}: {navigation: any}) => {
  const [selectedIndex, setIndex] = useState(0);
  const [places, setPlaces] = useState([]);
  const [events, setEvents] = useState([]);

  const removePlace = (placeId: number) => {
    setPlaces(places.filter((item: any) => item?.id !== placeId));
  };

  useEffect(() => {
    const initializeData = async () => {
      const authToken = await EncryptedStorage.getItem('auth_token');

      const eventsRaw = await getEvents(authToken);
      setEvents(filterToUniqueIds(eventsRaw));

      const bookmarks = await getBookmarks(authToken);
      setPlaces(bookmarks);
    };

    initializeData();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Text size='xl' weight='b'>{strings.title.library}</Text>
          <IconButton size='l' icon={icons.search} onPress={() => {
            navigation.navigate('SearchLibrary');
          }}/>
        </View>
      </SafeAreaView>

      <SegmentedControlTab
        testIDs={['saved', 'events']}
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

      {selectedIndex === 0
        ? Places(navigation, places, removePlace)
        : Events(navigation, events, places)}
    </View>
  );
};

const Places = (
  navigation: any,
  places: Array<any>,
  removePlace: (placeId: number) => void,
) => (
  <FlatList
    testID="bookmarksList"
    data={places}
    style={styles.flatlist}
    key={'Places'}
    initialNumToRender={4}
    keyExtractor={item => item?.id}
    ItemSeparatorComponent={Spacer}
    contentContainerStyle={styles.contentContainer}
    renderItem={({item}) => {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Place', {
              destination: item,
              category: item?.category?.name,
            });
          }}>
          <PlaceCard
            id={item?.id}
            name={item?.name}
            info={item?.category?.name}
            marked={true}
            image={
              item?.image_url
                ? {
                    uri: item?.image_url,
                  }
                : icons.defaultIcon
            }
            onUnBookmark={removePlace}
          />
        </TouchableOpacity>
      );
    }}
  />
);

const Events = (navigation: any, events: Array<any>, places: Array<any>) => (
  <FlatList
    testID="eventHistoryList"
    data={events}
    style={styles.flatlist}
    initialNumToRender={4}
    key={'Events'}
    keyExtractor={item => item?.id}
    ItemSeparatorComponent={Spacer}
    contentContainerStyle={styles.contentContainer}
    renderItem={({item}) => {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Event', {
              eventData: item,
              bookmarks: places?.map(place => place?.id),
            });
          }}>
          <EventCard
            name={item?.name}
            info={item?.date}
            image={
              item?.places &&
              item?.places?.length !== 0 &&
              item?.places[0]?.image_url
                ? {uri: item?.places[0]?.image_url}
                : icons.defaultIcon
            }
          />
        </TouchableOpacity>
      );
    }}
  />
);

const Spacer = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(350),
    height: s(50),
    paddingHorizontal: s(20),
    paddingVertical: s(10),
  },
  flatlist: {
    width: s(350),
    paddingHorizontal: s(20),
  },
  contentContainer: {
    paddingVertical: s(10),
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginVertical: s(10),
  },
});

const sctStyles = StyleSheet.create({
  container: {
    paddingHorizontal: s(20),
    height: s(30),
  },
  tab: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    backgroundColor: colors.white,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: colors.accent,
    backgroundColor: colors.white,
  },
  firstTab: {
    borderRightWidth: 0,
  },
  text: {
    marginBottom: 2,
    fontSize: s(14),
    fontWeight: '700',
    color: colors.black,
  },
  activeText: {
    marginBottom: 0,
    color: colors.accent,
  },
});

export default Library;
