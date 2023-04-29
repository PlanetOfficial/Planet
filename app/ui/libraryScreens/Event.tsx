import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
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
  Pressable,
  LayoutAnimation,
  Platform,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {s, vs} from 'react-native-size-matters';
import {Svg, Line, Circle} from 'react-native-svg';
import DatePicker from 'react-native-date-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet, {BottomSheetModal} from '@gorhom/bottom-sheet';
import DraggableFlatList from 'react-native-draggable-flatlist';
import SwipeableItem from 'react-native-swipeable-item';

import {
  getMarkerArray,
  getRegionForCoordinates,
} from '../../utils/functions/Misc';
import {MarkerObject} from '../../utils/interfaces/MarkerObject';
import {getEventPlaces} from '../../utils/api/libraryCalls/getEventPlaces';

import PlaceCard from '../components/PlaceCard';
import Blur from '../components/Blur';
import ScrollIndicator from '../components/ScrollIndicator';
import AddByCategory from '../editEventScreens/AddByCategory';
import AddFromLibrary from '../editEventScreens/AddFromLibrary';
import AddCustomDest from '../editEventScreens/AddCustomDest';
import Category from '../editEventScreens/Category';

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

  const [addOptionsBottomSheetOpen, setAddOptionsBottomSheetOpen] =
    useState(false);
  const addOptionsBottomSheetRef: any = useRef<BottomSheetModal>(null);
  const addOptionsSnapPoints = useMemo(
    () => [s(260) + insets.bottom],
    [insets.bottom],
  );
  const handleAddOptionsSheetChange = useCallback(
    (fromIndex: number, toIndex: number) => {
      setAddOptionsBottomSheetOpen(toIndex === 0);
    },
    [],
  );

  const [insertionIndex, setInsertionIndex] = useState<number | undefined>(0);
  const [addBottomSheetStatus, setAddBottomSheetStatus] = useState(0);
  const addBottomSheetRef: any = useRef<BottomSheet>(null);
  const addBottomSheetSnapPoints = useMemo(
    () => [vs(680) - s(60) - insets.top],
    [insets.top],
  );

  const childRefs = useRef(new Map());
  const itemRefs = useRef(new Map());

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

  const onAddPress = (idx: number | undefined) => {
    itemRefs.current.forEach(value => {
      value?.close();
    });
    childRefs.current.forEach(value => {
      value?.closeDropdown();
    });
    setInsertionIndex(idx);
    addOptionsBottomSheetRef.current?.present();
  };

  const onClose = () => {
    addBottomSheetRef.current?.close();
    setAddBottomSheetStatus(0);
  };

  const onCategoryMove = (idx: number, direction: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const temp = [...tempPlaces];
    const tempItem = temp[idx];
    temp.splice(idx, 1);
    if (direction !== 0) {
      temp.splice(idx + direction, 0, tempItem);
    } else {
      // if direction is 0, then the item is being deleted
      childRefs.current.forEach(value => {
        value?.closeDropdown();
      });
      childRefs.current.delete(tempItem.id);
    }
    setTempPlaces(temp);
  };

  const onCategorySelect = async (category: any) => {
    if (insertionIndex !== undefined) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const temp = [...tempPlaces];
      temp.splice(insertionIndex + 1, 0, {
        id: category.id,
        name: category.name,
        icon: category.icon,
        filters: [
          {
            name: 'Price',
            options: ['$', '$$', '$$$', '$$$$'],
            text: 'Price',
          },
        ],
        subcategories: [
          {
            id: 1,
            name: 'Japanese',
          },
          {
            id: 2,
            name: 'Chinese',
          },
          {
            id: 3,
            name: 'Korean',
          },
        ],
        // places: await requestLocations(
        //   [category.id],
        //   10,
        //   floats.defaultLatitude,
        //   floats.defaultLongitude,
        //   5,
        // ),
      });
      setTempPlaces(temp);
    }
  };

  const onLibrarySelect = (dest: any) => {
    console.log(dest);
    // if(insertionIndex !== undefined) {
    //   LayoutAnimation.configureNext(
    //     LayoutAnimation.Presets.easeInEaseOut,
    //   );
    //   const temp = [...tempPlaces];
    //   temp.splice(insertionIndex + 1, 0, {
    //     place
    //   });
    //   setTempPlaces(temp);
    // }
  };

  const onCustomSelect = (dest: any) => {
    console.log(dest);
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
              onFocus={() =>
                Platform.OS === 'android' && bottomSheetRef.current?.close()
              }
              onBlur={() =>
                Platform.OS === 'android' && bottomSheetRef.current?.expand()
              }
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
        keyboardBehavior="extend"
        android_keyboardInputMode="adjustPan"
        snapPoints={snapPoints}
        handleStyle={placesDisplayStyles.handle}
        handleIndicatorStyle={placesDisplayStyles.handleIndicator}
        backgroundStyle={placesDisplayStyles.container}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}>
        {editing ? (
          <DraggableFlatList
            data={tempPlaces}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={placesEditStyles.contentContainer}
            activationDistance={20}
            onScrollBeginDrag={() => {
              itemRefs.current.forEach(value => {
                value?.close();
              });
              childRefs.current.forEach(value => {
                value?.closeDropdown();
              });
            }}
            renderItem={({
              item,
              getIndex,
              drag,
              isActive,
            }: {
              item: any;
              getIndex: any;
              drag: any;
              isActive: boolean;
            }) => (
              <>
                {item?.id < 0 ? (
                  <View
                    onTouchStart={() => {
                      itemRefs.current.forEach(value => {
                        value?.close();
                      });
                      childRefs.current.forEach((value, key) => {
                        if (key !== item.id) {
                          value?.closeDropdown();
                        }
                      });
                    }}
                    style={
                      dragging && !isActive && placesEditStyles.transparentCard
                    }>
                    <Category
                      ref={ref => childRefs.current.set(item.id, ref)}
                      navigation={navigation}
                      category={item}
                      fullEventData={fullEventData}
                      bookmarks={bookmarks}
                      categoryIndex={getIndex()}
                      tempPlaces={tempPlaces}
                      onCategoryMove={onCategoryMove}
                    />
                  </View>
                ) : (
                  <View style={placesEditStyles.container} key={item.id}>
                    <SwipeableItem
                      ref={ref => itemRefs.current.set(item.id, ref)}
                      overSwipe={s(20)}
                      key={item.id}
                      item={item}
                      renderUnderlayLeft={() => (
                        <View style={placesEditStyles.buttonsContainer}>
                          <TouchableOpacity
                            disabled={tempPlaces.length === 1}
                            onPress={() => {
                              LayoutAnimation.configureNext(
                                LayoutAnimation.Presets.easeInEaseOut,
                              );
                              setTempPlaces((prev: any) => {
                                return prev.filter(
                                  (temp: any) => temp !== item,
                                );
                              });
                              itemRefs.current.delete(item.id);
                            }}
                            style={[
                              placesEditStyles.button,
                              tempPlaces.length === 1 && {
                                backgroundColor: colors.darkgrey,
                              },
                            ]}>
                            <Image
                              style={placesEditStyles.icon}
                              source={icons.remove}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                      snapPointsLeft={[s(60)]}>
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          placesEditStyles.card,
                          dragging &&
                            !isActive &&
                            placesEditStyles.transparentCard,
                        ]}
                        onLongPress={drag}
                        delayLongPress={400}
                        disabled={dragging && !isActive}
                        onPressIn={() => {
                          itemRefs.current.forEach((value, key) => {
                            if (key !== item.id) {
                              value?.close();
                            }
                          });
                          childRefs.current.forEach(value => {
                            value?.closeDropdown();
                          });
                        }}
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
                    </SwipeableItem>
                  </View>
                )}
                {dragging ? (
                  <Separator />
                ) : (
                  <TouchableOpacity onPress={() => onAddPress(getIndex())}>
                    <AddEventSeparator />
                  </TouchableOpacity>
                )}
              </>
            )}
            onDragBegin={() => {
              setDragging(true);
              itemRefs.current.forEach(value => {
                value?.close();
              });
              childRefs.current.forEach(value => {
                value?.closeDropdown();
              });
            }}
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
              snapToInterval={s(300)} // 280 + 20
              snapToAlignment={'start'}
              decelerationRate={'fast'}
              onScroll={event =>
                setPlaceIdx(
                  Math.round(event.nativeEvent.contentOffset.x / s(300)),
                )
              }>
              {fullEventData?.places?.map((dest: any, index: number) => (
                <View
                  style={[
                    placesDisplayStyles.card,
                    index !== fullEventData?.places.length - 1 && {
                      marginRight: s(20),
                    },
                  ]}
                  key={dest.id}>
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

      {(addOptionsBottomSheetOpen || addBottomSheetStatus !== 0) && (
        <Pressable
          style={styles.dim}
          onPress={() => {
            addOptionsBottomSheetRef?.current.close();
            onClose();
          }}
        />
      )}

      <BottomSheetModal
        ref={addOptionsBottomSheetRef}
        snapPoints={addOptionsSnapPoints}
        onAnimate={handleAddOptionsSheetChange}>
        <View style={addOptionsStyles.container}>
          <TouchableOpacity
            style={addOptionsStyles.button}
            onPress={() => {
              addOptionsBottomSheetRef?.current.close();
              setAddBottomSheetStatus(1);
              addBottomSheetRef.current?.snapToIndex(0);
            }}>
            <Text style={addOptionsStyles.text}>
              {strings.library.addByCategory}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={addOptionsStyles.button}
            onPress={() => {
              addOptionsBottomSheetRef?.current.close();
              setAddBottomSheetStatus(2);
              addBottomSheetRef.current?.snapToIndex(0);
            }}>
            <Text style={addOptionsStyles.text}>
              {strings.library.addFromLibrary}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={addOptionsStyles.button}
            onPress={() => {
              addOptionsBottomSheetRef?.current.close();
              setAddBottomSheetStatus(3);
              addBottomSheetRef.current?.snapToIndex(0);
            }}>
            <Text style={addOptionsStyles.text}>
              {strings.library.addCustom}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={addOptionsStyles.cancelButton}
            onPress={() => {
              addOptionsBottomSheetRef?.current.close();
            }}>
            <Text style={addOptionsStyles.cancel}>
              {strings.createTabStack.cancel}
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>

      <BottomSheet
        ref={addBottomSheetRef}
        index={-1}
        snapPoints={addBottomSheetSnapPoints}
        handleStyle={placesDisplayStyles.handle}
        handleIndicatorStyle={placesDisplayStyles.handleIndicator}
        backgroundStyle={placesDisplayStyles.container}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}>
        {addBottomSheetStatus === 1 && (
          <AddByCategory onClose={onClose} onSelect={onCategorySelect} />
        )}
        {addBottomSheetStatus === 2 && (
          <AddFromLibrary onClose={onClose} onSelect={onLibrarySelect} />
        )}
        {addBottomSheetStatus === 3 && (
          <AddCustomDest onClose={onClose} onSelect={onCustomSelect} />
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
  <Svg width={s(350)} height={s(40)}>
    <Line
      x1={s(20)}
      y1={s(20)}
      x2={s(162.5)}
      y2={s(20)}
      stroke={colors.accent}
      strokeWidth={s(1)}
    />
    <Circle
      cx={s(175)}
      cy={s(20)}
      r={s(12.5)}
      stroke={colors.accent}
      strokeWidth={s(1)}
      fill="none"
    />
    <Line
      x1={s(175)}
      y1={s(14)}
      x2={s(175)}
      y2={s(26)}
      stroke={colors.accent}
      strokeWidth={s(2)}
      strokeLinecap="round"
    />
    <Line
      x1={s(169)}
      y1={s(20)}
      x2={s(181)}
      y2={s(20)}
      stroke={colors.accent}
      strokeWidth={s(2)}
      strokeLinecap="round"
    />
    <Line
      x1={s(187.5)}
      y1={s(20)}
      x2={s(330)}
      y2={s(20)}
      stroke={colors.accent}
      strokeWidth={s(1)}
    />
  </Svg>
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
    height: s(39.4),
  },
  dim: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    padding: 0,
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
  container: {
    width: s(310),
    marginHorizontal: s(20),
  },
  contentContainer: {
    paddingTop: s(10),
    paddingBottom: s(20),
  },
  card: {
    alignSelf: 'center',
    width: s(280),
  },
  transparentCard: {
    opacity: 0.6,
  },
  buttonsContainer: {
    justifyContent: 'center',
    marginLeft: s(245),
    width: '100%',
    height: '100%',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.red,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  icon: {
    width: '70%',
    height: '70%',
    tintColor: colors.white,
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
    paddingHorizontal: s(35), // (350 - 280) / 2
  },
  card: {
    width: s(280), // height: 280 * 5/8 = 175
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
    backgroundColor: colors.white,
    borderBottomLeftRadius: s(10),
    borderTopWidth: 1,
    borderRightWidth: 0.5,
    borderColor: colors.grey,
  },
  keepEditing: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '100%',
    backgroundColor: colors.white,
    borderBottomRightRadius: s(10),
    borderTopWidth: 1,
    borderLeftWidth: 0.5,
    borderColor: colors.grey,
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

const addOptionsStyles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: s(240),
    paddingTop: s(20),
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(290),
    height: s(45),
    borderRadius: s(10),
    backgroundColor: colors.accent,
  },
  text: {
    fontSize: s(15),
    fontWeight: '700',
    color: colors.white,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(100),
    height: s(40),
    borderRadius: s(10),
    backgroundColor: colors.grey,
  },
  cancel: {
    fontSize: s(15),
    fontWeight: '600',
    color: colors.black,
  },
});

export default Event;
