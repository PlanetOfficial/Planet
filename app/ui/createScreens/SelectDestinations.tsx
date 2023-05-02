import 'react-native-gesture-handler';
import React, {useRef, useEffect, useState, useMemo} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import DatePicker from 'react-native-date-picker';
import EncryptedStorage from 'react-native-encrypted-storage';
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

import {requestLocations} from '../../utils/api/CreateCalls/requestLocations';
import {getBookmarks} from '../../utils/api/shared/getBookmarks';
import {sendEvent} from '../../utils/api/CreateCalls/sendEvent';
import {
  getMarkerArray,
  getRegionForCoordinates,
} from '../../utils/functions/Misc';
import {MarkerObject} from '../../utils/interfaces/MarkerObject';

import {colors} from '../../constants/theme';
import {integers} from '../../constants/numbers';
import {icons} from '../../constants/images';
import strings from '../../constants/strings';

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

  const [bookmarks, setBookmarks]: [any, any] = useState([]);
  const [eventTitle, setEventTitle] = useState(
    strings.createTabStack.untitledEvent,
  );
  const [date, setDate] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [saveConfirmationOpen, setSaveConfirmationOpen] = useState(false);

  const [destinations, setDestinations]: [any, any] = useState([]);
  const [selectionIndices, setSelectionIndices]: [number[], any] = useState([]);

  const [markers, setMarkers]: [Array<MarkerObject>, any] = useState([]);

  const insets = useSafeAreaInsets();

  const bottomSheetRef: any = useRef<BottomSheet>(null);
  const snapPoints = useMemo(
    () => [vs(350) - (insets.top + s(35)), vs(680) - (insets.top + s(60))],
    [insets.top],
  );

  const addRef: any = useRef(null);

  useEffect(() => {
    const loadDestinations = async (categories: any[]) => {
      let _destinations: any[] = [];
      let _selectionIndices: number[] = [];
      categories?.forEach((item: any) => {
        _destinations.push({
          id: -item.id,
          name: item.name,
          icon: item.icon,
        });
        _selectionIndices.push(0);
      });
      setDestinations(_destinations);
      setSelectionIndices(_selectionIndices);

      // setMarkers(getMarkerArray(places));
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

    loadDestinations(categories);
    loadBookmarks();
  }, [latitude, longitude, radius, categories]);

  const handleSave = async () => {
    // send destinations to backend
    const placeIds: number[] = [];
    // for (let i = 0; i < indices.length; i++) {
    //   if (indices[i] !== -1) {
    //     placeIds.push(locations[categories[i]?.id][indices[i]]?.id);
    //   }
    // }

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

      <Blur height={s(50)} />

      <SafeAreaView>
        <View style={headerStyles.container}>
          <Icon
            size="s"
            icon={icons.back}
            onPress={() => navigation.navigate('SelectCategories')}
          />
          <View style={headerStyles.texts}>
            <TextInput
              style={headerStyles.name}
              value={eventTitle}
              onChangeText={(text: any) => setEventTitle(text)}
            />
            <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
              <CustomText
                size="xs"
                weight="l"
                color={colors.accent}
                underline={true}>
                {date.toLocaleDateString()}
              </CustomText>
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
          <Icon
            size="s"
            color={colors.accent}
            icon={icons.confirm}
            onPress={() => setSaveConfirmationOpen(true)}
          />
        </View>
      </SafeAreaView>

      <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
        <EditEvent
          navigation={navigation}
          bookmarks={bookmarks}
          tempPlaces={destinations}
          setTempPlaces={setDestinations}
          selectionIndices={selectionIndices}
          setSelectionIndices={setSelectionIndices}
          onAddPress={addRef?.current?.onAddPress}
        />
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
        leftText={strings.library.save}
        rightText={strings.library.keepEditing}
        rightColor={colors.accent}
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
