import React, {useEffect, useState, useRef, useMemo} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {s, vs} from 'react-native-size-matters';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import EncryptedStorage from 'react-native-encrypted-storage';
import BottomSheet from '@gorhom/bottom-sheet';

import moment from 'moment';

import {
  getMarkerArray,
  getRegionForCoordinates,
} from '../../utils/functions/Misc';
import {GroupPlace, MarkerObject, Place} from '../../utils/interfaces/types';
import {getPlaces} from '../../utils/api/placeAPI';
import {
  deleteGroupEvent,
  forkGroupEvent,
} from '../../utils/api/groups/eventAPI';

import PlacesDisplay from '../components/PlacesDisplay';
import Blur from '../components/Blur';
import OptionMenu from '../components/OptionMenu';
import Icon from '../components/Icon';
import Text from '../components/Text';

import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';

interface Props {
  navigation: any;
  route: any;
}

const GroupEvent: React.FC<Props> = ({navigation, route}) => {
  const [groupEventId] = useState<number>(route?.params?.eventData?.id);
  const [eventTitle] = useState<string>(route?.params?.eventData?.name);
  const [suggester] = useState<{name: string; self: boolean}>(
    route?.params?.eventData?.suggester,
  );
  const [date] = useState<string>(
    moment(route?.params?.eventData?.date, 'YYYY-MM-DD').format('M/D/YYYY'),
  );
  const [bookmarks, setBookmarks] = useState<number[]>(
    route?.params?.bookmarks,
  );
  const [userId, setUserId] = useState<number>(-1);

  const [groupPlaces, setGroupPlaces] = useState<GroupPlace[]>();

  const [placeIdx, setPlaceIdx] = useState<number>(0);
  const [markers, setMarkers] = useState<MarkerObject[]>([]);

  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(
    () => [vs(380) - (insets.top + s(50)), vs(680) - (insets.top + s(50))],
    [insets.top],
  );

  useEffect(() => {
    const initializeUserId = async () => {
      const idString: string | null = await EncryptedStorage.getItem('user_id');
      if (!idString) {
        return;
      }

      const id: number = parseInt(idString, 10);
      if (Number.isNaN(id)) {
        return;
      }

      setUserId(id);
    };

    const initializeData = async () => {
      const _places = await getPlaces();

      if (_places) {
        const bookmarksIds: number[] = _places.map(
          (bookmark: Place) => bookmark.id,
        );
        setBookmarks(bookmarksIds);
      } else {
        Alert.alert('Error', 'Unable to load places. Please try again.');
      }

      setGroupPlaces(route?.params?.eventData?.destinations);
      // const markerArray: MarkerObject[] = getMarkerArray(
      //   route?.params?.eventData?.places,
      // );
      // setMarkers(markerArray);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      initializeData();
      initializeUserId();
    });
    return unsubscribe;
  }, [navigation, groupEventId, route?.params?.eventData?.destinations]);

  // const reloadPlaces = async () => {
  //   const _places = await getGroupEvent(groupEventId);
  //   if (_places) {
  //     setFullEventData(_places);
  //   } else {
  //     Alert.alert('Error', 'Unable to reload places. Please try again.');
  //   }
  // };

  const handleFork = async () => {
    const response = await forkGroupEvent(groupEventId);

    if (response) {
      navigation.navigate('Library');
    } else {
      Alert.alert('Error', 'Unable to copy event. Please try again.');
    }
  };

  const handleRemoveEvent = async (group_event_id: number) => {
    const response = await deleteGroupEvent(group_event_id);

    if (response) {
      navigation.navigate('Groups');
    } else {
      Alert.alert('Error', 'Unable to remove event. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        userInterfaceStyle={'light'}
        region={getRegionForCoordinates(markers)}>
        {markers?.length > 0
          ? markers?.map((marker: MarkerObject, index: number) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.name}
              />
            ))
          : null}
      </MapView>

      <Blur height={s(50)} />

      <SafeAreaView>
        <View style={headerStyles.container}>
          <Icon
            icon={icons.back}
            onPress={() => navigation.navigate('Groups')}
          />

          <View style={headerStyles.texts}>
            <Text size="m" weight="b">
              {eventTitle}
            </Text>
            <Text size="xs" weight="l" color={colors.accent}>
              {date + ' • ' + suggester?.name}
            </Text>
          </View>
          <OptionMenu
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
                name: strings.groups.fork,
                onPress: handleFork,
                color: colors.accent,
              },
              {
                name: strings.library.edit,
                onPress: () => {
                  // TODO: edit group event if owner
                  Alert.alert('Edit', 'Edit is not implemented yet');
                },
                disabled: !suggester?.self,
                color: colors.black,
              },
              {
                name: strings.main.remove,
                onPress: () => handleRemoveEvent(groupEventId),
                disabled: !suggester?.self,
                color: colors.red,
              },
            ]}
          />
        </View>
      </SafeAreaView>

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={placesDisplayStyles.container}
        animateOnMount={Platform.OS === 'ios'}
        enableContentPanningGesture={false}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {groupPlaces?.map((groupPlace: GroupPlace, idx: number) => (
            <View key={idx}>
              <View style={destHeaderStyles.header}>
                <View style={destHeaderStyles.title}>
                  <Text>{groupPlace.name}</Text>
                </View>
                <OptionMenu
                  options={[
                    {
                      name: 'Summary',
                      onPress: () => {
                        Alert.alert(
                          'Summary',
                          'Summary is not implemented yet',
                        );
                      },
                      color: colors.black,
                    },
                    {
                      name: 'Add Options',
                      onPress: () => {},
                      color: colors.accent,
                    },
                  ]}
                />
              </View>
              <PlacesDisplay
                navigation={navigation}
                places={groupPlace.places}
                width={s(290)}
                bookmarks={bookmarks}
                setBookmarked={(bookmarked: boolean, id: number) => {
                  if (bookmarked) {
                    setBookmarks([...bookmarks, id]);
                  } else {
                    setBookmarks(
                      bookmarks.filter((bookmark: number) => bookmark !== id),
                    );
                  }
                }}
                index={placeIdx}
                setIndex={setPlaceIdx}
              />
              {idx !== groupPlaces.length - 1 ? (
                <View style={styles.separater} />
              ) : null}
            </View>
          ))}
        </ScrollView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  map: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  dim: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollView: {
    paddingVertical: s(15),
  },
  separater: {
    height: 0.5,
    marginHorizontal: s(20),
    marginVertical: s(15),
    backgroundColor: colors.grey,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(350),
    height: s(50),
    paddingHorizontal: s(20),
  },
  texts: {
    flex: 1,
    marginHorizontal: s(10),
  },
});

const destHeaderStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: s(30),
    marginBottom: s(5),
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: s(10),
    flex: 1,
  },
});

const placesDisplayStyles = StyleSheet.create({
  container: {
    borderTopLeftRadius: s(10),
    borderTopRightRadius: s(10),
    backgroundColor: colors.white,
  },
  handle: {
    paddingTop: 0,
  },
  handleIndicator: {
    height: 0,
  },
  scrollView: {
    marginVertical: s(10),
    overflow: 'visible', // display shadow
  },
  contentContainer: {
    paddingHorizontal: s(30), // (350 - 290) / 2
  },
  card: {
    width: s(290), // height: 290 * 5/8 = 181.25
  },
});

export default GroupEvent;
