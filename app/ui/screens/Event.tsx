import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {s, vs} from 'react-native-size-matters';
import { Svg, Line, Circle } from 'react-native-svg';

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
import misc from '../../constants/misc';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';

const Event = ({navigation, route}: {navigation: any; route: any}) => {
  const [eventId] = useState(route?.params?.eventData?.id);
  const [eventTitle] = useState(route?.params?.eventData?.name);
  const [date] = useState(route?.params?.eventData?.date);
  const [bookmarks] = useState(route?.params?.bookmarks);

  const [fullEventData, setFullEventData]: [any, any] = useState({});
  const [placeIdx, setPlaceIdx] = useState(0);
  const [markers, setMarkers] = useState([]);

  const [editing, setEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState();
  const [tempPlaces, setTempPlaces] = useState([]);

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
    setEditing(true);
    setTempTitle(eventTitle);
    setTempPlaces(fullEventData?.places);
  };

  const saveEdits = () => {
    setEditing(false);
    // save edits to database
  };

  const AddEventSeparator = () => (
    <TouchableOpacity onPress={() => console.log("bitch")}>
      <Svg width={s(350)} height={s(50)}>
        <Line x1={s(20)} y1={s(25)} x2={s(160)} y2={s(25)} stroke={colors.accent} strokeWidth="1.5"/>
        <Circle cx={s(175)} cy={s(25)} r={s(15)} stroke={colors.accent}  strokeWidth="1.5" fill='none'/>
        <Line x1={s(175)} y1={s(17)} x2={s(175)} y2={s(33)} stroke={colors.accent}  strokeWidth="2.5" strokeLinecap='round'/>
        <Line x1={s(167)} y1={s(25)} x2={s(183)} y2={s(25)} stroke={colors.accent}  strokeWidth="2.5" strokeLinecap='round'/>
        <Line x1={s(190)} y1={s(25)} x2={s(330)} y2={s(25)} stroke={colors.accent} strokeWidth="1.5"/>
      </Svg>
    </TouchableOpacity>
  );

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

      {/* TODO: how to do optional parameter */}
      {editing ? (
        <Blur height={vs(680)} bottom={false} useInsets={false} />
      ) : (
        <>
          <Blur height={s(50)} bottom={false} useInsets={true} />
          <Blur height={s(216)} bottom={true} useInsets={true} />
        </>
      )}

      <SafeAreaView style={headerStyles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Library')}>
          <Image style={headerStyles.back} source={icons.back} />
        </TouchableOpacity>
        <View style={headerStyles.texts}>
          {editing ? (
            <TextInput
              style={headerStyles.name}
              value={tempTitle}
              onChangeText={(text: any) => setTempTitle(text)}
            />
          ) : (
            <Text style={headerStyles.name}>{eventTitle}</Text>
          )}
          <Text style={headerStyles.date}>{date}</Text>
        </View>
        <TouchableOpacity
          onPress={() => (editing ? saveEdits() : beginEdits())}>
          <Text style={headerStyles.edit}>
            {editing ? strings.library.save : strings.library.edit}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>

      {editing ? (
        <View style={placesEditStyles.container}>
          <FlatList
            data={tempPlaces}
            keyExtractor={(item: any) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={placesEditStyles.contentContainer}
            ItemSeparatorComponent={AddEventSeparator}
            renderItem={({item, index}) => (
              <View style={placesEditStyles.place} key={item.id}>
                <View style={placesEditStyles.card}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Place', {
                        destination: item,
                      })
                    }>
                    {/* TODO: turn off shadow & make it smaller if not focused */}
                    <PlaceCard
                      id={item?.id}
                      name={item?.name}
                      info={`${strings.createTabStack.rating}: ${item?.rating}/10  ${strings.createTabStack.price}: ${item?.price}/5`}
                      marked={bookmarks?.includes(item?.id)}
                      image={
                        item?.images && item?.images?.length !== 0
                          ? {
                              uri:
                                item?.images[0]?.prefix +
                                misc.imageSize +
                                item?.images[0]?.suffix,
                            }
                          : icons.defaultIcon
                      }
                    />
                  </TouchableOpacity>
                </View>
                <View style={placesEditStyles.buttons}>
                  <TouchableOpacity
                    style={[placesEditStyles.button, placesEditStyles.up]}
                    disabled={index === 0}
                    onPress={() => {
                      const temp = [...tempPlaces];
                      const temp2 = temp[index];
                      temp[index] = temp[index - 1];
                      temp[index - 1] = temp2;
                      setTempPlaces(temp);
                    }}>
                    <Image
                      style={[
                        placesEditStyles.icon,
                        {
                          tintColor:
                            index === 0 ? colors.darkgrey : colors.black,
                        },
                      ]}
                      source={icons.up}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[placesEditStyles.button, placesEditStyles.down]}
                    disabled={index === tempPlaces?.length - 1}
                    onPress={() => {
                      const temp = [...tempPlaces];
                      const temp2 = temp[index];
                      temp[index] = temp[index + 1];
                      temp[index + 1] = temp2;
                      setTempPlaces(temp);
                    }}>
                    <Image
                      style={[
                        placesEditStyles.icon,
                        {
                          tintColor:
                            index === tempPlaces?.length - 1
                              ? colors.darkgrey
                              : colors.black,
                        },
                      ]}
                      source={icons.down}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      placesEditStyles.button,
                      placesEditStyles.remove,
                    ]}
                    disabled={tempPlaces?.length === 1}
                    onPress={() => {
                      const temp = [...tempPlaces];
                      temp.splice(index, 1);
                      setTempPlaces(temp);
                    }}>
                    <Image
                      style={[
                        placesEditStyles.icon,
                        {
                          tintColor:
                            tempPlaces?.length === 1
                              ? colors.darkgrey
                              : colors.red,
                        },
                      ]}
                      source={icons.remove}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      ) : (
        <SafeAreaView style={placesDisplayStyles.container}>
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
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Place', {
                      destination: dest,
                    })
                  }>
                  {/* TODO: turn off shadow & make it smaller if not focused */}
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
            ))}
          </ScrollView>
          <ScrollIndicator num={fullEventData?.places?.length} idx={placeIdx} />
        </SafeAreaView>
      )}
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
});

const placesEditStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: s(10),
  },
  contentContainer: {
    paddingTop: s(10),
    paddingBottom: s(20),
  },
  place: {
    flexDirection: 'row',
    marginHorizontal: s(20),
  },
  card: {
    width: s(256), // height: 256 * 5/8 = 160
    marginRight: s(10),
  },
  buttons: {
    paddingVertical: s(10),
    justifyContent: 'space-between',
  },
  button: {
    width: s(44),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  up: {
    marginBottom: -s(7),
    height: s(40),
    borderRadius: s(10),
    borderTopLeftRadius: s(10),
    borderTopRightRadius: s(10),
    borderBottomLeftRadius: s(5),
    borderBottomRightRadius: s(5),
  },
  down: {
    height: s(40),
    borderRadius: s(10),
    borderTopLeftRadius: s(5),
    borderTopRightRadius: s(5),
    borderBottomLeftRadius: s(10),
    borderBottomRightRadius: s(10),
  },
  remove: {
    height: s(44),
    borderRadius: s(10),
  },
  icon: {
    width: s(18),
    height: s(18),
  },
});

const placesDisplayStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
  },
  scrollView: {
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

export default Event;
