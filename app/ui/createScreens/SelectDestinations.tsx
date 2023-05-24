import 'react-native-gesture-handler';
import React, {useRef, useEffect, useState, useMemo, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';

import DatePicker from 'react-native-date-picker';
import {Marker} from 'react-native-maps';
import MapView from 'react-native-maps';
import {s, vs} from 'react-native-size-matters';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';

import Blur from '../components/Blur';
import CustomText from '../components/Text';
import Icon from '../components/Icon';
import EditEvent from '../editEventScreens/EditEvent';
import AddEvent from '../editEventScreens/AddEvent';
import Confirmation from '../editEventScreens/Confirmation';

import {getPlaces} from '../../utils/api/placeAPI';
import {postEvent} from '../../utils/api/eventAPI';

import {
  getMarkerArray,
  getRegionForCoordinates,
  isPlace,
} from '../../utils/functions/Misc';
import {MarkerObject} from '../../utils/interfaces/types';

import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import strings from '../../constants/strings';

import {Place, Category} from '../../utils/interfaces/types';

interface Props {
  navigation: any;
  route: any;
}

const SelectDestinations: React.FC<Props> = ({navigation, route}) => {
  const [latitude] = useState<number>(route?.params?.latitude);
  const [longitude] = useState<number>(route?.params?.longitude);
  const [radius] = useState<number>(route?.params?.radius);
  const [categories] = useState<Category[]>(route?.params?.selectedCategories);

  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [eventTitle, setEventTitle] = useState<string>(
    strings.createTabStack.untitledEvent,
  );
  const [date, setDate] = useState<string>(
    moment(new Date()).format('M/D/YYYY'),
  );
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [saveConfirmationOpen, setSaveConfirmationOpen] =
    useState<boolean>(false);

  const [destinations, setDestinations] = useState<(Place | Category)[]>([]);
  const [selectionIndices, setSelectionIndices] = useState<number[]>([]);

  const [markers, setMarkers] = useState<MarkerObject[]>([]);

  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState<boolean>(true);

  const [bottomPad, setBottomPad] = useState<number>(0);
  const addRef = useRef<any>(null); // due to forwardRef
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(
    () => [vs(380) - (insets.top + s(50)), vs(680) - (insets.top + s(50))],
    [insets.top],
  );
  const handleSheetChange = useCallback((_: number, toIndex: number) => {
    if (toIndex === 1) {
      setBottomPad(0);
    } else {
      setBottomPad(vs(300));
    }
  }, []);

  useEffect(() => {
    const loadDestinations = async () => {
      let _destinations: (Place | Category)[] = [];
      let _selectionIndices: number[] = [];

      if (route.params?.theDestination) {
        _destinations.push(route.params.theDestination);
        _selectionIndices.push(0);
      }

      categories.forEach((category: Category) => {
        _destinations.push({
          id: category.id,
          name: category.name,
          icon: category.icon,
          subcategories: category.subcategories,
          options: [],
        });
        _selectionIndices.push(0);
      });
      setDestinations(_destinations);
      setSelectionIndices(_selectionIndices);
      setLoading(false);
    };

    loadDestinations();
    loadBookmarks();
  }, [latitude, longitude, radius, categories, route.params?.theDestination]);

  const loadBookmarks = async () => {
    const response: Place[] | null = await getPlaces();

    if (response) {
      let _bookmarks: number[] = [];
      response.forEach((bookmark: Place) => {
        _bookmarks.push(bookmark.id);
      });

      setBookmarks(_bookmarks);
    } else {
      Alert.alert('Error', 'Unable to load bookmarks. Please try again.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadBookmarks();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    let places: Place[] = [];
    destinations.forEach((destination: Place | Category, index: number) => {
      if (isPlace(destination)) {
        places.push(destination);
      } else {
        if (destination.options) {
          places.push(destination.options[selectionIndices[index]]);
        }
      }
    });

    setMarkers(getMarkerArray(places));
  }, [destinations, selectionIndices]);

  const handleSave = async () => {
    const placeIds: number[] = [];
    destinations.forEach((destination: Place | Category, index: number) => {
      if (isPlace(destination)) {
        placeIds.push(destination.id);
      } else {
        if (
          destination.options &&
          destination.options[selectionIndices[index]]
        ) {
          placeIds.push(destination.options[selectionIndices[index]]?.id);
        }
      }
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
        Alert.alert('Error', 'Unable to save. Please Try Again');
      }
    }
  };

  return (
    <View testID="selectDestinationsScreenView" style={styles.container}>
      <MapView
        style={styles.map}
        userInterfaceStyle={'light'}
        region={getRegionForCoordinates(markers)}>
        {markers.length > 0
          ? markers.map((marker: MarkerObject, index: number) => (
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
            onPress={() => navigation.navigate('SelectCategories')}
          />
          <View style={headerStyles.texts}>
            <TextInput
              onFocus={() =>
                Platform.OS === 'android'
                  ? bottomSheetRef.current?.close()
                  : null
              }
              onBlur={() =>
                Platform.OS === 'android'
                  ? bottomSheetRef.current?.snapToIndex(0)
                  : null
              }
              style={headerStyles.name}
              value={eventTitle}
              onChangeText={(text: string) => setEventTitle(text)}
            />
            <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
              <CustomText
                size="xs"
                weight="l"
                color={colors.accent}
                underline={true}>
                {date}
              </CustomText>
            </TouchableOpacity>
            <DatePicker
              modal
              mode="date"
              open={datePickerOpen}
              date={moment(date, 'M/D/YYYY').toDate()}
              onConfirm={newDate => {
                setDatePickerOpen(false);
                setDate(
                  moment(newDate, 'YYYY-MM-DD HH:mm:ssZ').format('M/D/YYYY'),
                );
              }}
              onCancel={() => {
                setDatePickerOpen(false);
              }}
            />
          </View>
          <Icon
            color={colors.accent}
            icon={icons.confirm}
            disabled={eventTitle.length === 0}
            onPress={() => setSaveConfirmationOpen(true)}
          />
        </View>
      </SafeAreaView>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onAnimate={handleSheetChange}
        animateOnMount={Platform.OS === 'ios'}
        enableContentPanningGesture={false}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.accent} />
        ) : (
          <EditEvent
            navigation={navigation}
            radius={radius}
            latitude={latitude}
            longitude={longitude}
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
            destinations={destinations}
            setDestinations={setDestinations}
            selectionIndices={selectionIndices}
            setSelectionIndices={setSelectionIndices}
            onAddPress={addRef.current?.onAddPress}
            bottomPad={bottomPad}
          />
        )}
      </BottomSheet>

      <AddEvent
        ref={addRef}
        destinations={destinations}
        setDestinations={setDestinations}
        selectionIndices={selectionIndices}
        setSelectionIndices={setSelectionIndices}
      />

      <Confirmation
        onPress={handleSave}
        open={saveConfirmationOpen}
        setOpen={setSaveConfirmationOpen}
        prompt={strings.library.saveConfirmation}
        leftText={strings.library.keepEditing}
        leftColor={colors.black}
        rightText={strings.library.save}
        rightColor={colors.accent}
        actionOnRight={true}
      />
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
  handle: {
    paddingTop: 0,
  },
  handleIndicator: {
    height: 0,
  },
  dim: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  addOptionsContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: s(240),
    paddingTop: s(20),
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
  name: {
    padding: 0,
    fontSize: s(17),
    fontWeight: '700',
    color: colors.black,
    textDecorationLine: 'underline',
  },
});

export default SelectDestinations;
