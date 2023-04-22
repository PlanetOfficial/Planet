import React, {useEffect, useState, useRef, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {s, vs} from 'react-native-size-matters';
import {Svg, Line, Circle} from 'react-native-svg';
import DatePicker from 'react-native-date-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import DraggableFlatList from 'react-native-draggable-flatlist';

import {
  getMarkerArray,
  getRegionForCoordinates,
} from '../../utils/functions/Misc';
import {MarkerObject} from '../../utils/interfaces/MarkerObject';
import {getEventPlaces} from '../../utils/api/libraryCalls/getEventPlaces';

import PlaceCard from '../components/PlaceCard';
import Blur from '../components/Blur';
import ScrollIndicator from '../components/ScrollIndicator';

import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';

const Event = ({navigation, route}: {navigation: any; route: any}) => {
  const [eventId] = useState(route?.params?.eventData?.id);
  const [eventTitle] = useState(route?.params?.eventData?.name);
  const [date] = useState(new Date(route?.params?.eventData?.date)); // this probably doesn't work but whatever
  const [bookmarks] = useState(route?.params?.bookmarks);

  const [fullEventData, setFullEventData]: [any, any] = useState({});
  const [placeIdx, setPlaceIdx] = useState(0);
  const [markers, setMarkers] = useState([]);

  const [editing, setEditing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tempTitle, setTempTitle] = useState();
  const [tempDate, setTempDate] = useState(new Date());
  const [tempPlaces, setTempPlaces]: [any, any] = useState([]);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [backConfirmationOpen, setBackConfirmationOpen] = useState(false);

  const insets = useSafeAreaInsets();
  const bottomSheetRef: any = useRef<BottomSheet>(null);
  const snapPoints = useMemo(
    () => [s(220) + insets.bottom, vs(680) - s(60) - insets.top],
    [insets.top, insets.bottom],
  );

  useEffect(() => {
    const getEventData = async () => {
      const data = await getEventPlaces(eventId);
      setFullEventData(data);

      const markerArray: any = getMarkerArray(data?.places);
      setMarkers(markerArray);
    };

    getEventData();
  }, [eventId]);

  const beginEdits = () => {
    bottomSheetRef.current?.expand();
    setEditing(true);
    setTempTitle(eventTitle);
    setTempDate(date);
    setTempPlaces(fullEventData?.places);
  };

  const saveEdits = () => {
    bottomSheetRef.current?.collapse();
    setEditing(false);
    // save edits to database
  };

  return (
    <View style={styles.container}>
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

      <SafeAreaView style={headerStyles.container}>
        <TouchableOpacity
          onPress={() =>
            editing
              ? setBackConfirmationOpen(true)
              : navigation.navigate('Library')
          }>
          <Image style={headerStyles.back} source={icons.back} />
        </TouchableOpacity>
        {editing ? (
          <View style={headerStyles.texts}>
            <TextInput
              style={[headerStyles.name, headerStyles.underline]}
              value={tempTitle}
              onChangeText={(text: any) => setTempTitle(text)}
            />
            <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
              <Text style={[headerStyles.date, headerStyles.underline]}>
                {tempDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={datePickerOpen}
              date={date}
              onConfirm={newDate => {
                setDatePickerOpen(false);
                setTempDate(newDate);
              }}
              onCancel={() => {
                setDatePickerOpen(false);
              }}
            />
          </View>
        ) : (
          <View style={headerStyles.texts}>
            <Text style={headerStyles.name}>{eventTitle}</Text>
            <Text style={headerStyles.date}>{date.toLocaleDateString()}</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => (editing ? saveEdits() : beginEdits())}>
          <Text style={headerStyles.edit}>
            {editing ? strings.library.save : strings.library.edit}
          </Text>
        </TouchableOpacity>
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
        {editing ? (
          <DraggableFlatList
            data={tempPlaces}
            keyExtractor={(item: any) => item.id}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={dragging ? Separator : AddEventSeparator}
            contentContainerStyle={placesEditStyles.contentContainer}
            renderItem={({item, drag, isActive}) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={[
                    placesEditStyles.card,
                    dragging && !isActive && placesEditStyles.transparentCard,
                  ]}
                  onLongPress={drag}
                  delayLongPress={400}
                  disabled={dragging && !isActive}
                  onPress={() => {
                    navigation.navigate('Place', {
                      destination: item,
                      category: item?.category?.name,
                    });
                  }}>
                  <PlaceCard
                    id={item?.id}
                    name={item?.name}
                    info={item?.category?.name}
                    marked={bookmarks?.includes(item?.id)}
                    image={
                      item?.image_url
                        ? {
                            uri: item?.image_url,
                          }
                        : icons.defaultIcon
                    }
                  />
                </TouchableOpacity>
                {item.id === tempPlaces[tempPlaces.length - 1]?.id && (
                  <Separator />
                )}
              </View>
            )}
            onDragBegin={() => setDragging(true)}
            onDragEnd={({data}) => {
              setDragging(false);
              setTempPlaces(data);
            }}
          />
        ) : (
          <SafeAreaView>
            {/* TODO: Display estimated time and cost for this event */}
            <ScrollView
              style={placesDisplayStyles.scrollView}
              contentContainerStyle={placesDisplayStyles.contentContainer}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              pagingEnabled={true}
              scrollEventThrottle={16}
              snapToInterval={s(276)} // 256 + 20
              snapToAlignment={'start'}
              decelerationRate={'fast'}
              onScroll={event =>
                setPlaceIdx(
                  Math.round(event.nativeEvent.contentOffset.x / s(276)),
                )
              }>
              {fullEventData?.places?.map((dest: any) => (
                <View style={placesDisplayStyles.card} key={dest.id}>
                  {/* TODO: Display estimated time and cost for this place */}
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Place', {
                        destination: dest,
                        category: dest?.category?.name,
                      });
                    }}>
                    <PlaceCard
                      id={dest?.id}
                      name={dest?.name}
                      info={dest?.category?.name}
                      marked={bookmarks?.includes(dest?.id)}
                      image={
                        dest?.image_url
                          ? {
                              uri: dest?.image_url,
                            }
                          : icons.defaultIcon
                      }
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <ScrollIndicator
              num={fullEventData?.places?.length}
              idx={placeIdx}
            />
          </SafeAreaView>
        )}
      </BottomSheet>

      <Modal
        animationType="fade"
        transparent={true}
        visible={backConfirmationOpen}>
        <View style={modalStyles.container}>
          <View style={modalStyles.modal}>
            <Text style={modalStyles.title}>
              {strings.library.backConfirmation}
            </Text>
            <View style={modalStyles.buttons}>
              <TouchableOpacity
                style={modalStyles.discard}
                onPress={() => {
                  setBackConfirmationOpen(false);
                  navigation.goBack();
                }}>
                <Text style={modalStyles.discardText}>
                  {strings.library.discard}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={modalStyles.keepEditing}
                onPress={() => setBackConfirmationOpen(false)}>
                <Text style={modalStyles.keepEditingText}>
                  {strings.library.keepEditing}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Separator = () => <View style={styles.separator} />;

const AddEventSeparator = () => (
  <TouchableOpacity
    onPress={() => {
      // TODO_NEXT: Add an event
    }}>
    <Svg width={s(350)} height={s(50)}>
      <Line
        x1={s(20)}
        y1={s(25)}
        x2={s(160)}
        y2={s(25)}
        stroke={colors.accent}
        strokeWidth="1.5"
      />
      <Circle
        cx={s(175)}
        cy={s(25)}
        r={s(15)}
        stroke={colors.accent}
        strokeWidth="1.5"
        fill="none"
      />
      <Line
        x1={s(175)}
        y1={s(17)}
        x2={s(175)}
        y2={s(33)}
        stroke={colors.accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Line
        x1={s(167)}
        y1={s(25)}
        x2={s(183)}
        y2={s(25)}
        stroke={colors.accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Line
        x1={s(190)}
        y1={s(25)}
        x2={s(330)}
        y2={s(25)}
        stroke={colors.accent}
        strokeWidth="1.5"
      />
    </Svg>
  </TouchableOpacity>
);

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
  separator: {
    width: s(350),
    height: s(49),
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: s(20),
  },
  back: {
    width: s(12),
    height: s(18),
    marginRight: s(20),
    tintColor: colors.black,
  },
  texts: {
    justifyContent: 'space-between',
    width: s(238),
    height: s(40),
  },
  name: {
    fontSize: s(18),
    fontWeight: '700',
    color: colors.black,
  },
  date: {
    fontSize: s(11),
    fontWeight: '600',
    color: colors.accent,
  },
  edit: {
    width: s(40),
    fontSize: s(14),
    fontWeight: '600',
    textAlign: 'right',
    color: colors.accent,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});

const placesEditStyles = StyleSheet.create({
  contentContainer: {
    paddingTop: s(10),
    paddingBottom: s(20),
  },
  card: {
    alignSelf: 'center',
    width: s(280), // height: 256 * 5/8 = 160
    marginRight: s(10),
  },
  transparentCard: {
    opacity: 0.5,
  },
  deleteContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: s(25),
    width: s(50),
    height: s(50),
    backgroundColor: colors.red,
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
    paddingHorizontal: s(47), // (350 - 256) / 2
  },
  card: {
    width: s(256), // height: 256 * 5/8 = 160
    marginRight: s(20),
  },
});

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(250),
    height: s(120),
    borderRadius: s(10),
    backgroundColor: colors.white,
  },
  title: {
    margin: s(20),
    paddingHorizontal: s(20),
    fontSize: s(15),
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: s(40),
  },
  discard: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '100%',
    backgroundColor: colors.grey,
    borderBottomLeftRadius: s(10),
    borderTopWidth: 1,
    borderRightWidth: 0.5,
    borderColor: colors.darkgrey,
  },
  keepEditing: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '100%',
    backgroundColor: colors.grey,
    borderBottomRightRadius: s(10),
    borderTopWidth: 1,
    borderLeftWidth: 0.5,
    borderColor: colors.darkgrey,
  },
  discardText: {
    fontSize: s(14),
    fontWeight: '700',
    color: colors.red,
  },
  keepEditingText: {
    fontSize: s(14),
    fontWeight: '700',
    color: colors.accent,
  },
});

export default Event;
