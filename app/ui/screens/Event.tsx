import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
} from 'react-native';
import {icons} from '../../constants/images';
import MapView, {Marker} from 'react-native-maps';
import {s} from 'react-native-size-matters';
import {colors} from '../../constants/theme';

import {
  getMarkerArray,
  getRegionForCoordinates,
} from '../../utils/functions/Misc';
import {MarkerObject} from '../../utils/interfaces/MarkerObject';
import PlaceCard from '../components/PlaceCard';
import {getEventPlaces} from '../../utils/api/libraryCalls/getEventPlaces';

const Event = ({navigation, route}: {navigation: any; route: any}) => {
  const [eventId] = useState(route?.params?.eventData?.id);
  const [eventTitle] = useState(route?.params?.eventData?.name);
  const [date] = useState(route?.params?.eventData?.date);
  const [bookmarks] = useState(route?.params?.bookmarks);

  const [fullEventData, setFullEventData]: [any, any] = useState({});
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
      <SafeAreaView style={headerStyles.container}>
        <TouchableOpacity
          style={headerStyles.back}
          onPress={() => navigation.navigate('Library')}>
          <Image style={headerStyles.icon} source={icons.next} />
        </TouchableOpacity>
        <View style={headerStyles.texts}>
          <Text style={headerStyles.title}>{eventTitle}</Text>
          <View>
            <Text style={headerStyles.date}>{date}</Text>
          </View>
        </View>
      </SafeAreaView>
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
      <FlatList
        style={styles.flatlist}
        data={fullEventData?.places}
        keyExtractor={item => item?.id}
        ItemSeparatorComponent={Spacer}
        contentContainerStyle={styles.contentContainer}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
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
          );
        }}
      />
    </View>
  );
};

const Spacer = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  flatlist: {
    paddingHorizontal: s(20),
    marginTop: s(10),
  },
  map: {
    marginTop: s(5),
    height: s(200),
    borderRadius: s(10),
    marginHorizontal: s(20),
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginVertical: s(10),
  },
  contentContainer: {
    paddingVertical: s(10),
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginHorizontal: s(20),
    paddingVertical: s(10),
  },
  texts: {
    marginLeft: s(10),
  },
  title: {
    fontSize: s(18),
    fontWeight: '600',
    color: colors.black,
  },
  date: {
    marginTop: s(5),
    fontSize: s(14),
    fontWeight: '700',
    color: colors.accent,
  },
  back: {
    marginRight: s(20 / 3),
    width: s(40 / 3),
    height: s(20),
  },
  confirm: {
    position: 'absolute',
    right: s(20),
    width: s(20),
    height: s(20),
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
    transform: [{rotate: '180deg'}],
  },
});

export default Event;
