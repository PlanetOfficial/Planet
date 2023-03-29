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
import misc from '../../constants/misc';
import MapView, {Marker} from 'react-native-maps';
import {s} from 'react-native-size-matters';
import {colors} from '../../constants/theme';

import {
  getMarkerArray,
  getRegionForCoordinates,
} from '../../utils/functions/Misc';
import {MarkerObject} from '../../utils/interfaces/MarkerObject';
import Place from '../components/PlaceCard';
import {getEventPlaces} from '../../utils/api/libraryCalls/getEventPlaces';

const Event = ({navigation, route}: {navigation: any; route: any}) => {
  const [eventId] = useState(route?.params?.eventData?.id);
  const [eventTitle] = useState(route?.params?.eventData?.name);
  const [date] = useState(route?.params?.eventData?.date);
  const [bookmarks] = useState(route?.params?.bookmarks);

  const [fullEventData, setFullEventData] = useState({});
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const getEventData = async () => {
      const data = await getEventPlaces(eventId);
      setFullEventData(data);

      const markerArray = getMarkerArray(data?.places);
      setMarkers(markerArray);
    };

    getEventData();
  }, [eventId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={headerStyles.container}>
        <TouchableOpacity
          style={headerStyles.back}
          onPress={() => navigation.navigate('Library')}>
          <Image style={headerStyles.icon} source={icons.back} />
        </TouchableOpacity>
        <View style={headerStyles.texts}>
          <Text style={headerStyles.title}>{eventTitle}</Text>
          <View>
            <Text style={headerStyles.date}>{date}</Text>
          </View>
        </View>
      </View>
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
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Place', {
                  destination: item,
                  category: item?.category?.name,
                });
              }}>
              <Place
                id={item?.id}
                name={item?.name}
                info={item?.category?.name}
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
                selected={false}
              />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
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
  },
  map: {
    height: s(200),
    borderRadius: s(20),
    margin: s(20),
    marginTop: 0,
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginVertical: s(10),
    marginHorizontal: s(20),
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: s(20),
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
  },
});

export default Event;
