import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import EncryptedStorage from 'react-native-encrypted-storage';
import {icons} from '../../constants/images';
import misc from '../../constants/misc';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {s} from 'react-native-size-matters';
import MapView, {Marker} from 'react-native-maps';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';

import PlaceCard from '../components/PlaceCard';

import {requestLocations} from '../../utils/api/CreateCalls/requestLocations';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(true);

  const [locations, setLocations]: [any, any] = useState({});
  const [indices, setIndices]: [number[], any] = useState([]);
  const [bookmarks, setBookmarks]: [any, any] = useState([]);
  const [eventTitle, setEventTitle] = useState(
    strings.createTabStack.untitledEvent,
  );
  const [markers, setMarkers]: [Array<MarkerObject>, any] = useState([]);
  const [date, setDate] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const loadDestinations = async (categoryIds: Array<number>) => {
      const response = await requestLocations(
        categoryIds,
        radius,
        latitude,
        longitude,
        5,
      );

      let ind: number[] = [];
      let places: any[] = [];
      categories?.forEach((item: any) => {
        if (response[item?.id] && response[item?.id]?.length > 0) {
          ind.push(0);
          places.push(response[item?.id][0]);
        } else {
          ind.push(-1);
        }
      });

      setMarkers(getMarkerArray(places));
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
    setModalVisible(false);

    // send destinations to backend
    const placeIds: number[] = [];
    for (let i = 0; i < indices.length; i++) {
      if (indices[i] !== -1) {
        placeIds.push(locations[categories[i]?.id][indices[i]]?.id);
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

      if (responseStatus) {
        navigation.navigate('TabStack', {screen: 'Library'});
        // TODO: show successful save
      } else {
        // TODO: error, make sure connected to internet and logged in, if error persists, log out and log back in
      }
    }
  };

  return (
    <View testID="selectDestinationsScreenView" style={styles.container}>
      <MapView
        style={[
          styles.map,
          {height: mapExpanded ? s(420) : insets.top + s(60)},
        ]}
        region={getRegionForCoordinates(markers)}>
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
        <Pressable
          onPress={() => setMapExpanded(!mapExpanded)}
          style={styles.bottom}>
          {/* TODO: add arrow */}
        </Pressable>
      </MapView>
      <BlurView
        style={[styles.top, {height: insets.top + s(35)}]}
        blurAmount={3}
        blurType="xlight"
      />
      <SafeAreaView>
        <View style={headerStyles.container}>
          <TouchableOpacity
            testID="selectDestinationsScreenBack"
            style={headerStyles.back}
            onPress={() => navigation.navigate('SelectCategories')}>
            <Image style={headerStyles.icon} source={icons.back} />
          </TouchableOpacity>
          <Text style={headerStyles.title}>
            {strings.createTabStack.selectDestinations}
          </Text>
          <TouchableOpacity
            testID="confirmDestinations"
            style={headerStyles.confirm}
            onPress={() => setModalVisible(true)}>
            <Image style={headerStyles.icon} source={icons.confirm} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View
        style={[
          destStyles.container,
          {
            marginTop:
              (mapExpanded ? s(420) : insets.top + s(60)) -
              s(42) -
              insets.top +
              1,
          },
        ]}>
        <ScrollView
          testID="selectDestinationsMainScroll"
          showsVerticalScrollIndicator={false}>
          {categories
            ? categories?.map((category: any, idx: number) => (
                <View key={category?.id}>
                  <View style={destStyles.header}>
                    <Image
                      style={destStyles.icon}
                      source={icons.tempCategory}
                    />
                    <Text style={destStyles.name}>{category?.name}</Text>
                  </View>
                  <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    style={styles.scrollView}
                    testID={`category.${category?.id}.scrollView`}
                    horizontal={true}
                    onScroll={event => {
                      const i: number = Math.round(
                        event.nativeEvent.contentOffset.x / s(325),
                      );

                      let _indices = [...indices];
                      if (_indices[idx] !== i) {
                        _indices[idx] = i;
                        setIndices(_indices);
                        let places: any[] = [];
                        for (let j = 0; j < _indices.length; j++) {
                          if (_indices[j] !== -1) {
                            places.push(
                              locations[categories[j]?.id][_indices[j]],
                            );
                          }
                        }
                        setMarkers(getMarkerArray(places));
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
                            <PlaceCard
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
                      {locations[category?.id].map((e: any, i: number) => (
                        <View
                          key={i}
                          style={[
                            indStyles.circle,
                            {
                              backgroundColor:
                                i === indices[idx]
                                  ? colors.accent
                                  : colors.darkgrey,
                            },
                          ]}
                        />
                      ))}
                    </View>
                  ) : null}
                  <View style={styles.separator} />
                </View>
              ))
            : null}
        </ScrollView>
      </View>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <Pressable
          style={modalStyles.dim}
          onPress={() => {
            setModalVisible(false);
          }}
        />
        <View style={modalStyles.container}>
          <Text style={modalStyles.title}>
            {strings.createTabStack.saveEvent}
          </Text>
          <View style={modalStyles.option}>
            <Text style={modalStyles.boldText}>
              {strings.createTabStack.name}:
            </Text>
            <TextInput
              testID="eventTitleText"
              style={modalStyles.text}
              onChangeText={setEventTitle}>
              {eventTitle}
            </TextInput>
          </View>
          <View style={modalStyles.option}>
            <Text style={modalStyles.boldText}>
              {strings.createTabStack.date}:
            </Text>
            <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
              <Text style={modalStyles.text}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={datePickerOpen}
              date={date}
              onConfirm={newDate => {
                setDatePickerOpen(false);
                setDate(newDate);
              }}
              onCancel={() => {
                setDatePickerOpen(false);
              }}
            />
          </View>
          <View style={modalStyles.footer}>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={modalStyles.cancelContainer}>
              <Text style={modalStyles.cancel}>
                {strings.createTabStack.cancel}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={modalStyles.confirmContainer}>
              <Text style={modalStyles.confirm}>
                {strings.createTabStack.confirm}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  top: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: s(15),
    backgroundColor: colors.darkgrey,
    opacity: 0.7,
  },
  contentContainer: {
    paddingLeft: s(20),
    paddingRight: s(5),
  },
  scrollView: {
    overflow: 'visible',
  },
  card: {
    width: s(310),
    marginRight: s(15),
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
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
    position: 'absolute',
    width: s(350),
    marginHorizontal: s(20),
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: s(350),
    height: s(30),
    marginBottom: s(5),
    paddingHorizontal: s(20),
  },
  title: {
    fontSize: s(16),
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
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: s(20),
    paddingHorizontal: s(7),
    marginTop: s(10),
    marginBottom: s(7),
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
    marginLeft: s(7),
    fontSize: s(17),
    fontWeight: '700',
    color: colors.black,
  },
});

const modalStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: s(45),
    top: '35%',
    width: s(260),
    height: '30%',
    borderRadius: s(10),
    borderWidth: 2,
    borderColor: colors.white,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
    backgroundColor: colors.white,
  },
  dim: {
    width: '100%',
    height: '200%',
    position: 'absolute',
    backgroundColor: colors.black,
    opacity: 0.5,
  },
  title: {
    marginTop: s(10),
    fontSize: s(20),
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
  },
  option: {
    marginTop: s(20),
    flexDirection: 'row',
    marginHorizontal: s(30),
  },
  boldText: {
    fontSize: s(16),
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
  },
  text: {
    marginLeft: s(20),
    fontSize: s(16),
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
  },
  footer: {
    justifyContent: 'center',
    position: 'absolute',
    width: s(260) - 4,
    bottom: 0,
  },
  cancelContainer: {
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: s(130) - 3,
    height: s(40),
    backgroundColor: colors.darkgrey,
    borderBottomLeftRadius: s(10) - 2,
  },
  cancel: {
    fontSize: s(16),
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
  },
  confirmContainer: {
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: s(130) - 3,
    height: s(40),
    backgroundColor: colors.accent,
    borderBottomRightRadius: s(10) - 2,
  },
  confirm: {
    fontSize: s(16),
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
});

const indStyles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    margin: s(7),
    padding: s(7),
    borderRadius: s(11.5),
    backgroundColor: colors.grey,
  },
  circle: {
    marginHorizontal: s(3.5),
    width: s(7),
    height: s(7),
    borderRadius: s(3.5),
  },
});

export default SelectDestinations;
