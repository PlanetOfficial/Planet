import React, {useEffect, useState, useRef, useMemo} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {s} from 'react-native-size-matters';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import EncryptedStorage from 'react-native-encrypted-storage';
import BottomSheet from '@gorhom/bottom-sheet';

import moment from 'moment';

import {
  getMarkerArray,
  getPlaceCardString,
  getRegionForCoordinates,
} from '../../utils/functions/Misc';
import {MarkerObject, Place} from '../../utils/interfaces/types';
import {getPlaces} from '../../utils/api/placeAPI';
import { getGroupEvent, deleteGroupEvent, forkGroupEvent } from '../../utils/api/groups/eventAPI';

import PlaceCard from '../components/PlaceCard';
import Blur from '../components/Blur';
import ScrollIndicator from '../components/ScrollIndicator';
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

const FGEvent: React.FC<Props> = ({navigation, route}) => {
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

  const [fullEventData, setFullEventData] = useState<Place[]>();

  const [placeIdx, setPlaceIdx] = useState<number>(0);
  const [markers, setMarkers] = useState<MarkerObject[]>([]);

  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [s(290) + insets.bottom], [insets.bottom]);

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

      setFullEventData(route?.params?.eventData?.places);
      const markerArray: MarkerObject[] = getMarkerArray(
        route?.params?.eventData?.places,
      );
      setMarkers(markerArray);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      initializeData();
      initializeUserId();
    });
    return unsubscribe;
  }, [navigation, groupEventId, route?.params?.eventData?.places]);

  const reloadPlaces = async () => {
    const _places = await getGroupEvent(groupEventId);
    if (_places) {
      setFullEventData(_places);
    } else {
      Alert.alert('Error', 'Unable to reload places. Please try again.');
    }
  };

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
      navigation.navigate('Friends');
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
            onPress={() => navigation.navigate('Friends')}
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
                name: strings.friends.fork,
                onPress: handleFork,
                color: colors.accent,
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
        index={0}
        snapPoints={snapPoints}
        handleStyle={placesDisplayStyles.handle}
        handleIndicatorStyle={placesDisplayStyles.handleIndicator}
        backgroundStyle={placesDisplayStyles.container}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}>
        <SafeAreaView>
          <ScrollView
            style={placesDisplayStyles.scrollView}
            contentContainerStyle={placesDisplayStyles.contentContainer}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            scrollEventThrottle={16}
            snapToInterval={s(310)} // 290 + 20
            snapToAlignment={'start'}
            decelerationRate={'fast'}
            onScroll={event =>
              setPlaceIdx(
                Math.round(event.nativeEvent.contentOffset.x / s(310)),
              )
            }>
            {fullEventData?.map((dest: Place, idx: number) =>
              dest.likes && dest.dislikes && dest.group_place_id ? (
                <View
                  style={[
                    placesDisplayStyles.card,
                    idx !== fullEventData?.length - 1
                      ? {
                          marginRight: s(20),
                        }
                      : null,
                  ]}
                  key={idx}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Place', {
                        destination: dest,
                        category: dest.category.name,
                        bookmarked: bookmarks.includes(dest.id),
                      });
                    }}>
                    <PlaceCard
                      id={dest.id}
                      name={dest.name}
                      info={getPlaceCardString(dest)}
                      bookmarked={bookmarks.includes(dest.id)}
                      setBookmarked={(bookmarked: boolean, id: number) => {
                        if (bookmarked) {
                          setBookmarks([...bookmarks, id]);
                        } else {
                          setBookmarks(
                            bookmarks.filter(
                              (bookmark: number) => bookmark !== id,
                            ),
                          );
                        }
                      }}
                      image={
                        dest.photo
                          ? {
                              uri: dest.photo,
                            }
                          : icons.defaultIcon
                      }
                    />
                  </TouchableOpacity>
                </View>
              ) : null,
            )}
          </ScrollView>
          {fullEventData ? (
            <ScrollIndicator num={fullEventData.length} idx={placeIdx} />
          ) : null}
        </SafeAreaView>
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
  reactionNames: {
    color: colors.black,
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

export default FGEvent;
