import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
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
import BottomSheet from '@gorhom/bottom-sheet';

import moment from 'moment';

import {
  getMarkerArray,
  getRegionForCoordinates,
} from '../../utils/functions/Misc';
import {
  Category,
  GroupPlace,
  MarkerObject,
  Place,
  User,
} from '../../utils/interfaces/types';
import {getPlaces} from '../../utils/api/placeAPI';
import {deleteGroupEvent, getGroupEvent} from '../../utils/api/groups/eventAPI';
import {postEvent} from '../../utils/api/eventAPI';

import AddFromCategory from './AddFromCategory';
import AddByCategory from '../editEventScreens/AddByCategory';
import AddFromLibrary from '../editEventScreens/AddFromLibrary';
import AddCustomDest from '../editEventScreens/AddCustomDest';

import PlacesDisplay from '../components/PlacesDisplay';
import Blur from '../components/Blur';
import OptionMenu from '../components/OptionMenu';
import Icon from '../components/Icon';
import Text from '../components/Text';

import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {postAlternative} from '../../utils/api/groups/otherAPI';
import {floats} from '../../constants/numbers';
import SelectSubcategory from '../editEventScreens/SelectSubcategory';
import EncryptedStorage from 'react-native-encrypted-storage';

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
  const [bookmarks, setBookmarks] = useState<Place[]>(route?.params?.bookmarks);

  const [groupPlaces, setGroupPlaces] = useState<GroupPlace[]>();

  const [markers, setMarkers] = useState<MarkerObject[]>([]);

  const [userId, setUserId] = useState<number>();

  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(
    () => [vs(380) - (insets.top + s(50)), vs(680) - (insets.top + s(50))],
    [insets.top],
  );

  const [addOptionsStatus, setAddOptionsStatus] = useState<number>(0);
  const addOptionsBottomSheetRef = useRef<BottomSheet>(null);
  const addOptionsSnapPoints = useMemo(
    () => [vs(680) - s(50) - insets.top],
    [insets.top],
  );
  const [groupPlace, setGroupPlace] = useState<GroupPlace>();
  const [categoryToSearch, setCategoryToSearch] = useState<Category>();
  const selectSubcategoryRef = useRef<any>(null); // due to forwardRef

  const [selectionIndices, setSelectionIndices] = useState<number[]>([]);

  const handleAddOptionsChange = useCallback((_: number, toIndex: number) => {
    if (toIndex === -1) {
      setAddOptionsStatus(0);
    }
  }, []);

  const onAltSelect = async (place: Place) => {
    addOptionsBottomSheetRef.current?.collapse();
    setAddOptionsStatus(0);

    if (groupPlace) {
      const response: boolean = await postAlternative(place.id, groupPlace.id);
      if (response) {
        reloadPlaces();
      } else {
        Alert.alert(
          'Error',
          'Unable to add alternative location. Please try again.',
        );
      }
    } else {
      Alert.alert(
        'Error',
        'Unable to add alternative location. Please try again.',
      );
    }
  };

  const onClose = () => {
    addOptionsBottomSheetRef.current?.collapse();
    setAddOptionsStatus(0);
  };

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
      const _places: Place[] | null = await getPlaces();

      if (_places) {
        setBookmarks(_places);
      } else {
        Alert.alert('Error', 'Unable to load places. Please try again.');
      }

      const _groupPlaces: GroupPlace[] | null = await getGroupEvent(
        groupEventId,
      );
      if (_groupPlaces) {
        setSelectionIndices(Array(_groupPlaces.length).fill(0));
        setGroupPlaces(_groupPlaces);
      } else {
        Alert.alert('Error', 'Unable to reload places. Please try again.');
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      initializeData();
      initializeUserId();
    });
    return unsubscribe;
  }, [navigation, groupEventId, route?.params?.eventData?.destinations]);

  useEffect(() => {
    let places: Place[] = [];
    groupPlaces?.forEach((_groupPlace: GroupPlace, index: number) => {
      places.push(_groupPlace.places[selectionIndices[index]]);
    });

    setMarkers(getMarkerArray(places));
  }, [groupPlaces, selectionIndices]);

  const reloadPlaces = async () => {
    const _groupPlaces: GroupPlace[] | null = await getGroupEvent(groupEventId);

    if (_groupPlaces) {
      setSelectionIndices(Array(_groupPlaces.length).fill(0));
      setGroupPlaces(_groupPlaces);
    } else {
      Alert.alert('Error', 'Unable to reload places. Please try again.');
    }
  };

  const handleFork = async () => {
    const placeIds: number[] = [];
    groupPlaces?.forEach((_groupPlace: GroupPlace, index: number) => {
      placeIds.push(_groupPlace.places[selectionIndices[index]].id);
    });

    if (placeIds.length > 0) {
      const response: boolean = await postEvent(
        eventTitle,
        placeIds,
        moment(date, 'M/D/YYYY').format('YYYY-MM-DD'),
      );

      if (response) {
        navigation.navigate('TabStack', {screen: 'Library'});
      } else {
        Alert.alert('Error', 'Unable to copy event. Please Try Again');
      }
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

  const findMyVote = (places: Place[]) => {
    for (let i = 0; i < places.length; i++) {
      const J: number | undefined = places[i]?.votes?.length;
      if (J) {
        for (let j = 0; j < J; j++) {
          const votes: User[] | undefined = places[i]?.votes;
          if (votes && votes[j].id === userId) {
            return i;
          }
        }
      }
    }
    return -1;
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
          {groupPlaces?.map((_groupPlace: GroupPlace, idx: number) => (
            <View key={idx}>
              <View style={destHeaderStyles.header}>
                <View style={destHeaderStyles.title}>
                  <Text>{_groupPlace.name}</Text>
                </View>
                <OptionMenu
                  icon={icons.plus}
                  iconColor={colors.accent}
                  options={[
                    {
                      name: `${strings.library.browse} ${_groupPlace.places[0].category.name}s`,
                      onPress: () => {
                        setAddOptionsStatus(1);
                        setGroupPlace(_groupPlace);
                        setCategoryToSearch(_groupPlace.places[0].category);
                        addOptionsBottomSheetRef.current?.expand();
                      },
                      color: colors.accent,
                    },
                    {
                      name: strings.library.browseCategory,
                      onPress: () => {
                        setAddOptionsStatus(2);
                        addOptionsBottomSheetRef.current?.expand();
                        setGroupPlace(_groupPlace);
                      },
                      color: colors.black,
                    },
                    {
                      name: strings.library.browseLibrary,
                      onPress: () => {
                        setAddOptionsStatus(3);
                        addOptionsBottomSheetRef.current?.expand();
                        setGroupPlace(_groupPlace);
                      },
                      color: colors.black,
                    },
                    {
                      name: strings.library.browseCustom,
                      onPress: () => {
                        setAddOptionsStatus(4);
                        addOptionsBottomSheetRef.current?.expand();
                        setGroupPlace(_groupPlace);
                      },
                      color: colors.black,
                    },
                  ]}
                />
              </View>
              <PlacesDisplay
                navigation={navigation}
                places={_groupPlace.places}
                width={s(290)}
                bookmarks={bookmarks.map((bookmark: Place) => bookmark.id)}
                setBookmarked={(bookmarked: boolean, place: Place) => {
                  if (bookmarked) {
                    setBookmarks([...bookmarks, place]);
                  } else {
                    setBookmarks(
                      bookmarks.filter((bookmark: Place) => bookmark !== place),
                    );
                  }
                }}
                index={selectionIndices[idx]}
                setIndex={(index: number) => {
                  const newSelectionIndices = [...selectionIndices];
                  newSelectionIndices[idx] = index;
                  setSelectionIndices(newSelectionIndices);
                }}
                displayCategory={false}
                isGroupPlace={true}
                myVote={findMyVote(_groupPlace.places)}
              />
              {idx !== groupPlaces.length - 1 ? (
                <View style={styles.separater} />
              ) : null}
            </View>
          ))}
        </ScrollView>
      </BottomSheet>

      {addOptionsStatus !== 0 ? (
        <View
          style={styles.dim}
          onTouchStart={() => {
            addOptionsBottomSheetRef.current?.close();
          }}
        />
      ) : null}

      <BottomSheet
        index={-1}
        ref={addOptionsBottomSheetRef}
        enablePanDownToClose={true}
        snapPoints={addOptionsSnapPoints}
        onAnimate={handleAddOptionsChange}>
        {addOptionsStatus === 1 && categoryToSearch && groupPlace ? (
          <AddFromCategory
            onClose={onClose}
            onSelect={onAltSelect}
            radius={floats.defaultRadius}
            latitude={groupPlace.places[0].latitude}
            longitude={groupPlace.places[0].longitude}
            bookmarks={bookmarks.map((bookmark: Place) => bookmark.id)}
            setBookmarked={(bookmarked: boolean, place: Place) => {
              if (bookmarked) {
                setBookmarks([...bookmarks, place]);
              } else {
                setBookmarks(
                  bookmarks.filter((bookmark: Place) => bookmark !== place),
                );
              }
            }}
            category={categoryToSearch}
            onSubcategoryOpen={selectSubcategoryRef.current?.onSubcategoryOpen}
            onSubcategorySelect={
              selectSubcategoryRef.current?.onSubcategorySelect
            }
          />
        ) : null}
        {addOptionsStatus === 2 ? (
          <AddByCategory
            onClose={() => {
              onClose();
              setCategoryToSearch(undefined);
            }}
            onSelect={(category: Category) => {
              setCategoryToSearch(category);
              setAddOptionsStatus(1);
            }}
          />
        ) : null}
        {addOptionsStatus === 3 ? (
          <AddFromLibrary onClose={onClose} onSelect={onAltSelect} />
        ) : null}
        {addOptionsStatus === 4 ? (
          <AddCustomDest onClose={onClose} onSelect={onAltSelect} />
        ) : null}
      </BottomSheet>

      <SelectSubcategory ref={selectSubcategoryRef} />
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
