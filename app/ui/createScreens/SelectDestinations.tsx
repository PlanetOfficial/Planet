import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {icons} from '../../constants/images';
import misc from '../../constants/misc';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {s} from 'react-native-size-matters';
import MapView, {Marker} from 'react-native-maps';

import Place from '../components/PlaceCard';

import {requestLocations} from '../../utils/api/CreateCalls/requestLocations';

import {Category} from '../../utils/interfaces/category';
import {getBookmarks} from '../../utils/api/shared/getBookmarks';
import {getRegionForCoordinates} from '../../utils/functions/Misc';
import {getMarkerArray} from '../../utils/functions/Misc';
import {MarkerObject} from '../../utils/interfaces/MarkerObject';
import {sendEvent} from '../../utils/api/CreateCalls/sendEvent';

const SelectDestinations = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [latitude] = useState(route?.params?.latitude);
  const [longitude] = useState(route?.params?.longitude);
  const [radius] = useState(route?.params?.radius);
  const [categories] = useState(route?.params?.selectedCategories);

  // gets all locations from selectedCategories
  const [locations, setLocations]: [any, any] = useState({});
  const [selectedDestinations, setSelectedDestinations]: [any, any] = useState(
    new Map(),
  );
  const [bookmarks, setBookmarks]: [any, any] = useState([]);
  const [eventTitle, setEventTitle] = useState(
    strings.createTabStack.untitledEvent,
  );
  const [markers, setMarkers]: [Array<MarkerObject>, any] = useState([]);
  //TODO: set date in select categories screen, only display open places
  const [date] = useState(new Date());

  const [indices, setIndices] = useState(new Map());

  useEffect(() => {
    const loadDestinations = async (categoryIds: Array<number>) => {
      const response = await requestLocations(
        categoryIds,
        radius,
        latitude,
        longitude,
        5,
      );

      let cat = new Map();
      let ind = new Map();
      categories.forEach((item: any) => {
        cat.set(
          item?.id,
          response[item?.id] && response[item?.id].length > 0
            ? response[item?.id][0]
            : null,
        );
        ind.set(
          item?.id,
          response[item?.id] && response[item?.id].length > 0 ? 0 : -1,
        );
      });
      setSelectedDestinations(cat);
      setMarkers(getMarkerArray(cat));
      setIndices(ind);

      await setLocations(response);
    };

    const loadBookmarks = async () => {
      const authToken = await EncryptedStorage.getItem('auth_token');
      const response = await getBookmarks(authToken);

      let bookmarksLoaded: any = [];
      response?.forEach((bookmark: any) => {
        bookmarksLoaded?.push(bookmark?.id);
      });

      setBookmarks(bookmarksLoaded);
    };

    const filteredCategories = categories?.map((item: any) => item?.id);
    loadDestinations(filteredCategories);

    loadBookmarks();
  }, [latitude, longitude, radius, categories]);

  const handleSave = async () => {
    // send destinations to backend
    const placeIds: number[] = [];
    for (let [, value] of selectedDestinations) {
      if (value) {
        placeIds.push(value?.id);
      }
    }

    if (placeIds.length > 0) {
      const authToken = await EncryptedStorage.getItem('auth_token');

      const responseStatus = await sendEvent(
        eventTitle,
        placeIds,
        authToken,
        date.toLocaleDateString(),
      );

      if (responseStatus === 200) {
        navigation.navigate('TabStack', {screen: 'Library'});
        // TODO: show successful save
      } else {
        // TODO: error, make sure connected to internet and logged in, if error persists, log out and log back in
      }
    }
  };

  return (
    <SafeAreaView
      testID="selectDestinationsScreenView"
      style={styles.container}>
      <View style={headerStyles.container}>
        <TouchableOpacity
          testID="selectDestinationsScreenBack"
          style={headerStyles.back}
          onPress={() => navigation.navigate('SelectCategories')}>
          <Image style={headerStyles.icon} source={icons.back} />
        </TouchableOpacity>
        <TextInput
          testID="eventTitleText"
          style={headerStyles.title}
          onChangeText={setEventTitle}>
          {eventTitle}
        </TextInput>
        <TouchableOpacity
          testID="confirmDestinations"
          style={headerStyles.confirm}
          onPress={handleSave}>
          <Image style={headerStyles.icon} source={icons.confirm} />
        </TouchableOpacity>
      </View>
      <MapView style={styles.map} region={getRegionForCoordinates(markers)}>
        {markers?.length > 0
          ? markers?.map((marker: MarkerObject, index: number) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker?.latitude,
                  longitude: marker?.longitude,
                }}
                title={marker?.name}
              />
            ))
          : null}
      </MapView>
      <View style={destStyles.container}>
        <ScrollView
          testID="selectDestinationsMainScroll"
          showsVerticalScrollIndicator={false}>
          {categories
            ? categories?.map((category: Category) => (
                <View key={category?.id}>
                  <View style={destStyles.header}>
                    <Image style={destStyles.icon} source={icons.settings} />
                    <Text style={destStyles.name}>{category?.name}</Text>
                  </View>
                  <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    testID={`category.${category?.id}.scrollView`}
                    horizontal={true}
                    onScroll={event => {
                      const idx: number = Math.round(
                        event.nativeEvent.contentOffset.x / s(325),
                      );
                      let cat = new Map(selectedDestinations);
                      cat.set(category?.id, locations[category?.id][idx]);
                      setSelectedDestinations(cat);
                      setMarkers(getMarkerArray(cat));

                      let ind = new Map(indices);
                      if (ind.get(category?.id) !== idx) {
                        ind.set(category?.id, idx);
                        setIndices(ind);
                      }
                    }}
                    scrollEventThrottle={16}
                    showsHorizontalScrollIndicator={false}
                    decelerationRate={'fast'}
                    snapToInterval={s(325)}
                    snapToAlignment={'start'}
                    pagingEnabled>
                    {locations &&
                    locations[category?.id] &&
                    locations[category?.id].length > 0 ? (
                      locations[category?.id]?.map((dest: any) => (
                        <View
                          style={styles.card}
                          testID={`destination.${category?.id}.${dest?.id}`}
                          key={dest?.id}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('Place', {
                                destination: dest,
                                category: category?.name,
                              })
                            }>
                            <Place
                              id={dest?.id}
                              name={dest?.name}
                              info={`${strings.createTabStack.rating}: ${dest?.rating}/10  ${strings.createTabStack.price}: ${dest?.price}/5`}
                              marked={bookmarks?.includes(dest?.id)}
                              image={
                                dest?.images && dest?.images?.length !== 0
                                  ? {
                                      uri:
                                        dest?.images[0]?.prefix +
                                        misc.imageSize +
                                        dest?.images[0]?.suffix,
                                    }
                                  : icons.defaultIcon
                              }
                            />
                          </TouchableOpacity>
                        </View>
                      ))
                    ) : (
                      <View style={styles.placeHolder}>
                        <Text style={styles.placeHolderText}>
                          {strings.createTabStack.noDestinations}
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                  {locations &&
                  locations[category?.id] &&
                  locations[category?.id].length > 0 ? (
                    <View style={indStyles.container}>
                      {[...Array(locations[category?.id].length)].map(
                        (e, i) => (
                          <View
                            key={i}
                            style={[
                              indStyles.circle,
                              {
                                backgroundColor:
                                  i === indices.get(category?.id)
                                    ? colors.accent
                                    : colors.darkgrey,
                              },
                            ]}
                          />
                        ),
                      )}
                    </View>
                  ) : null}
                  <View style={styles.separator} />
                </View>
              ))
            : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const indStyles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    margin: s(10),
    padding: s(8),
    borderRadius: s(11.5),
    backgroundColor: colors.grey,
  },
  circle: {
    marginHorizontal: s(4),
    width: s(7),
    height: s(7),
    borderRadius: s(3.5),
  },
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  contentContainer: {
    paddingLeft: s(20),
    paddingRight: s(5),
  },
  card: {
    width: s(310),
    marginRight: s(15),
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginVertical: s(10),
    marginHorizontal: s(20),
  },
  placeHolder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(310),
    marginVertical: s(20),
  },
  placeHolderText: {
    fontSize: s(18),
    fontWeight: '600',
    color: colors.black,
  },
  map: {
    width: s(310),
    height: s(200),
    borderRadius: s(15),
    marginHorizontal: s(20),
    marginTop: s(10),
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: s(20),
    paddingVertical: s(10),
  },
  title: {
    fontSize: s(18),
    fontWeight: '600',
    color: colors.black,
  },
  back: {
    marginRight: s(20 / 3),
    width: s(40 / 3),
    height: s(20),
  },
  confirm: {
    width: s(20),
    height: s(20),
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
});

const destStyles = StyleSheet.create({
  container: {
    marginTop: s(10),
    width: '100%',
    height: '69%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: s(20),
    paddingHorizontal: s(5),
    marginBottom: s(10),
  },
  icon: {
    width: s(30),
    height: s(30),
    borderRadius: s(15),
    borderWidth: 2,
    tintColor: colors.black,
    borderColor: colors.accent,
    backgroundColor: colors.white,
  },
  name: {
    marginLeft: s(10),
    fontSize: s(20),
    fontWeight: '600',
    color: colors.black,
  },
});

export default SelectDestinations;
