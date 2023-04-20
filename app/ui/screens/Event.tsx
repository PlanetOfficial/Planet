import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {s} from 'react-native-size-matters';

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

  useEffect(() => {
    const getEventData = async () => {
      const data = await getEventPlaces(eventId);
      setFullEventData(data);

      const markerArray: any = getMarkerArray(data?.places);
      setMarkers(markerArray);
    };

    getEventData();
  }, [eventId]);

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
      <Blur height={s(50)} bottom={false} />
      <Blur height={s(206)} bottom={true} />

      <SafeAreaView style={headerStyles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Library')}>
          <Image style={headerStyles.back} source={icons.back} />
        </TouchableOpacity>
        <View style={headerStyles.texts}>
          <Text style={headerStyles.name}>{eventTitle}</Text>
          <Text style={headerStyles.date}>{date}</Text>
        </View>
      </SafeAreaView>

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
            setPlaceIdx(Math.round(event.nativeEvent.contentOffset.x / s(276)))
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
  texts: {
    justifyContent: 'space-between',
    marginLeft: s(20),
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
  back: {
    width: s(12),
    height: s(18),
    tintColor: colors.black,
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
