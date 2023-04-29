import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {s} from 'react-native-size-matters';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import Text from '../components/Text';
import IconButton from '../components/IconButton';
import Places from '../components/Places';
import Events from '../components/Events';

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
          <Text size="xl" weight="b">
            {strings.title.library}
          </Text>
          <IconButton
            size="l"
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
        onTabPress={index => setIndex(index)}
      />

      {selectedIndex === 0 ? (
        <Places
          data={places}
          onPress={(item: any) => {
            navigation.navigate('Place', {
              destination: item,
              category: item?.category?.name,
            });
          }}
          onUnBookmark={removePlace}
        />
      ) : (
        <Events
          data={events}
          onPress={(item: any) => {
            navigation.navigate('Event', {
              eventData: item,
              bookmarks: places?.map((place: any) => place?.id),
            });
          }}
        />
      )}
    </View>
  );
};

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
