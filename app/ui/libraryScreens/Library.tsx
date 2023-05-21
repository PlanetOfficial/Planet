import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import moment from 'moment';

import {s} from 'react-native-size-matters';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import Text from '../components/Text';
import Icon from '../components/Icon';
import PlaceCard from '../components/PlaceCard';
import EventCard from '../components/EventCard';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';

import {getPlaces} from '../../utils/api/placeAPI';
import {getEvents, deleteEvent} from '../../utils/api/eventAPI';
import {Place, Event} from '../../utils/interfaces/types';
import {getPlaceCardString, isPlace2} from '../../utils/functions/Misc';

interface Props {
  navigation: any;
}

const Library: React.FC<Props> = ({navigation}) => {
  const [selectedIndex, setIndex] = useState<number>(0);

  const [places, setPlaces] = useState<Place[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const initializeData = async () => {
    const _places: Place[] | null = await getPlaces();
    if (_places) {
      setPlaces(_places);
    } else {
      Alert.alert('Error', 'Unable to load places. Please try again.');
    }

    const _events: Event[] | null = await getEvents();
    if (_events) {
      setEvents(_events);
    } else {
      Alert.alert('Error', 'Unable to load events. Please try again.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      initializeData();
    });
    return unsubscribe;
  }, [navigation]);

  const handleRemoveEvent = async (event_id: number) => {
    const response: boolean = await deleteEvent(event_id);

    if (response) {
      setEvents(events.filter((event: Event) => event.id !== event_id));
    } else {
      Alert.alert('Error', 'Unable to remove event. Please try again.');
    }
  };

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
              // TODO: implement library search
              Alert.alert('Search', 'Search is not implemented yet');
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
          return isPlace2(item) ? (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                navigation.navigate('Place', {
                  destination: item,
                  category: item.category.name,
                  bookmarked: places.includes(item),
                });
              }}>
              <PlaceCard
                id={item.id}
                name={item.name}
                info={getPlaceCardString(item)}
                bookmarked={places.includes(item)}
                setBookmarked={(bookmarked: boolean, id: number) => {
                  if (!bookmarked) {
                    setPlaces(places.filter((place: Place) => place.id !== id));
                  }
                }}
                image={{uri: item.photo}}
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
                  item.places[0].photo
                    ? {uri: item.places[0].photo}
                    : icons.defaultIcon
                }
                options={[
                  {
                    name: strings.main.share,
                    onPress: () => {
                      // TODO: share event
                      Alert.alert('Share', 'Share is not implemented yet');
                    },
                    color: colors.black,
                  },
                  {
                    name: strings.main.remove,
                    onPress: () => handleRemoveEvent(item.id),
                    color: colors.red,
                  },
                ]}
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
