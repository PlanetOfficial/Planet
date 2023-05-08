import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';

import {s} from 'react-native-size-matters';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import EncryptedStorage from 'react-native-encrypted-storage';

import Text from '../components/Text';
import Icon from '../components/Icon';
import PlaceCard from '../components/PlaceCard';
import EventCard from '../components/EventCard';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';

import {getEvents} from '../../utils/api/libraryCalls/getEvents';
import {getBookmarks} from '../../utils/api/shared/getBookmarks';
import {Place, Event} from '../../utils/interfaces/types';

interface Props {
  navigation: any;
}

const Library: React.FC<Props> = ({navigation}) => {
  const [selectedIndex, setIndex] = useState<number>(0);
  const [places, setPlaces] = useState<Place[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const removePlace = (placeId: number) => {
    setPlaces(places.filter((place: Place) => place.id !== placeId));
  };

  const isPlace = (item: Place | Event): item is Place => {
    return item.hasOwnProperty('latitude');
  };

  useEffect(() => {
    const initializeData = async () => {
      const authToken = await EncryptedStorage.getItem('auth_token');

      const eventsRaw = await getEvents(authToken);
      setEvents(eventsRaw);

      const bookmarks = await getBookmarks(authToken);
      setPlaces(bookmarks);
    };

    initializeData();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Text size="xl" weight="b">
            {strings.title.library}
          </Text>
          <Icon
            size="m"
            icon={icons.search}
            onPress={() => {
              navigation.navigate('SearchLibrary');
            }}
          />
        </View>
      </SafeAreaView>

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
        onTabPress={(index: number) => setIndex(index)}
      />

      <FlatList
        key={selectedIndex}
        data={selectedIndex === 0 ? places : events}
        contentContainerStyle={styles.contentContainer}
        initialNumToRender={5}
        keyExtractor={(_: Place | Event, idx: number) => idx.toString()}
        ItemSeparatorComponent={Spacer}
        renderItem={({item}: {item: Place | Event}) => {
          return isPlace(item) ? (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                navigation.navigate('Place', {
                  destination: item,
                  category: item.category_name,
                });
              }}>
              <PlaceCard
                id={item.id}
                name={item.name}
                info={item.category_name}
                marked={places.includes(item)}
                image={
                  item.image_url
                    ? {
                        uri: item.image_url,
                      }
                    : icons.defaultIcon
                }
                onUnBookmark={removePlace}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                navigation.navigate('Event', {
                  eventData: item,
                  bookmarks: places.map((place: Place) => place.id),
                });
              }}>
              <EventCard
                name={item.name}
                info={moment(item.date, 'YYYY-MM-DD').format('M/D/YYYY')}
                image={
                  item.places &&
                  item.places.length !== 0 &&
                  item.places[0].place.image_url
                    ? {uri: item.places[0].place.image_url}
                    : icons.defaultIcon
                }
                option={true}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

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
  },
  contentContainer: {
    paddingVertical: s(10),
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginVertical: s(10),
  },
  card: {
    alignSelf: 'center',
    width: s(310),
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
