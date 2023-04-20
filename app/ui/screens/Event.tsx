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
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {s, vs} from 'react-native-size-matters';

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

  useEffect(() => {
    const getEventData = async () => {
      const data = await getEventPlaces(eventId);
      setFullEventData(data);

      const markerArray: any = getMarkerArray(data?.places);
      setMarkers(markerArray);
    };

    getEventData();
  }, [eventId]);

  const [tempTitle, setTempTitle] = useState(eventTitle);

  const saveEdits = () => {
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
          onPress={() => (editing ? saveEdits() : setEditing(true))}>
          <Text style={headerStyles.edit}>
            {editing ? strings.library.save : strings.library.edit}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>

      {editing ? (
        <SafeAreaView style={placesEditStyles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={placesEditStyles.contentContainer}>
            {fullEventData?.places?.map((dest: any, idx: number) => (
              <View style={placesEditStyles.place} key={dest.id}>
                <View style={placesEditStyles.card}>
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
                <View style={placesEditStyles.buttons}>
                  <TouchableOpacity
                    disabled={idx === 0}
                    style={[placesEditStyles.button, placesEditStyles.up]}
                    onPress={() => console.log('up')}>
                    <Image
                      style={[
                        placesEditStyles.upDownicon,
                        {tintColor: idx === 0 ? colors.darkgrey : colors.black},
                      ]}
                      source={icons.up}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={idx === fullEventData?.places?.length - 1}
                    style={[placesEditStyles.button, placesEditStyles.down]}
                    onPress={() => console.log('down')}>
                    <Image
                      style={[
                        placesEditStyles.upDownicon,
                        {
                          tintColor:
                            idx === fullEventData?.places?.length - 1
                              ? colors.darkgrey
                              : colors.black,
                        },
                      ]}
                      source={icons.down}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[placesEditStyles.button, placesEditStyles.replace]}
                    onPress={() => console.log('replace')}>
                    <Image
                      style={placesEditStyles.replaceicon}
                      source={icons.replace}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[placesEditStyles.button, placesEditStyles.remove]}
                    onPress={() => console.log('remove')}>
                    <Image
                      style={placesEditStyles.removeIcon}
                      source={icons.remove}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
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
    marginTop: s(10),
  },
  contentContainer: {
    paddingVertical: s(10),
  },
  place: {
    flexDirection: 'row',
    marginHorizontal: s(20),
    paddingVertical: s(10),
    borderBottomWidth: 0.5,
    borderColor: colors.darkgrey,
  },
  card: {
    width: s(256), // height: 256 * 5/8 = 160
    marginRight: s(10),
  },
  buttons: {
    justifyContent: 'space-between',
  },
  button: {
    width: s(44),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  up: {
    marginBottom: -s(4),
    height: s(33),
    borderTopLeftRadius: s(10),
    borderTopRightRadius: s(10),
    borderBottomLeftRadius: s(5),
    borderBottomRightRadius: s(5),
  },
  down: {
    height: s(33),
    borderTopLeftRadius: s(5),
    borderTopRightRadius: s(5),
    borderBottomLeftRadius: s(10),
    borderBottomRightRadius: s(10),
  },
  replace: {
    height: s(36),
    borderRadius: s(10),
  },
  remove: {
    height: s(36),
    borderRadius: s(10),
  },
  upDownicon: {
    width: s(18),
    height: s(18),
  },
  replaceicon: {
    width: s(16),
    height: s(16),
    tintColor: colors.accent,
  },
  removeIcon: {
    width: s(20),
    height: s(20),
    tintColor: colors.red,
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
