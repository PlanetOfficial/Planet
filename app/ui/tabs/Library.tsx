import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {s} from 'react-native-size-matters';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import Header from '../components/MainHeader';
import Place from '../components/Place';
import Event from '../components/Event';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {miscIcons} from '../../constants/images';

import EncryptedStorage from 'react-native-encrypted-storage';
import {getEvents} from '../../utils/api/libraryCalls/getEvents';
import {getPlaces} from '../../utils/api/libraryCalls/getPlaces';
import misc from '../../constants/misc';
import {filterToUniqueIds, getImagesFromURLs} from '../../utils/functions/Misc';

const Library = ({navigation}: {navigation: any}) => {
  const [selectedIndex, setIndex] = useState(0);
  const [places, setPlaces] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const initializeData = async () => {
      const authToken = await EncryptedStorage.getItem('auth_token');

      const eventsRaw = await getEvents(authToken);
      setEvents(filterToUniqueIds(eventsRaw));

      const bookmarks = await getPlaces(authToken);
      setPlaces(bookmarks);
    };

    initializeData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {Header(strings.title.library, miscIcons.search, () =>
        navigation.navigate('SearchLibrary'),
      )}
      {SegmentedControl(selectedIndex, setIndex)}
      {selectedIndex === 0 ? Places(places) : Events(events)}
    </SafeAreaView>
  );
};

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

const Places = (places: Array<any>) => (
  <FlatList
    data={places}
    style={styles.flatlist}
    initialNumToRender={4}
    keyExtractor={item => item?.id}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
    renderItem={({item}) => {
      return (
        <Place
          id={item?.id}
          name={item?.name}
          info={item?.category?.name}
          marked={true}
          image={
            item?.images && item?.images?.length !== 0
              ? {
                  uri:
                    item?.images[0]?.prefix +
                    misc.imageSize +
                    item?.images[0]?.suffix,
                }
              : (null as any)
          }
        />
      );
    }}
  />
);

const Events = (events: Array<any>) => (
  <FlatList
    data={events}
    style={styles.flatlist}
    initialNumToRender={4}
    keyExtractor={item => item?.id}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
    renderItem={({item}) => {
      const images = getImagesFromURLs(item?.places); // check with lavy
      return (
        <Event
          name={item.name}
          info={item.date}
          image={images ? {uri: images[0]} : (null as any)}
        />
      );
    }}
  />
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  flatlist: {
    width: s(350),
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginVertical: s(10),
    marginHorizontal: s(20),
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
