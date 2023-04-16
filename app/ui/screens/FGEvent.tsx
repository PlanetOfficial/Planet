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
import PlaceCard from '../components/PlaceCard';
import {getEventPlaces} from '../../utils/api/libraryCalls/getEventPlaces';

const FGEvent = ({navigation, route}: {navigation: any; route: any}) => {
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
            <View style={styles.cardContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Place', {
                    destination: item,
                    category: item?.category?.name,
                  });
                }}
                style={styles.card}>
                <PlaceCard
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
                />
              </TouchableOpacity>
              <View style={feedbackStyles.container}>
                <TouchableOpacity
                  style={[
                    feedbackStyles.iconContainer,
                    feedbackStyles.likeContainer,
                  ]}>
                  <Image style={feedbackStyles.icon} source={icons.like} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    feedbackStyles.iconContainer,
                    feedbackStyles.countContainer,
                  ]}>
                  <Text style={feedbackStyles.count}>+3</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    feedbackStyles.iconContainer,
                    feedbackStyles.dislikeContainer,
                  ]}>
                  <Image style={feedbackStyles.icon} source={icons.dislike} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    feedbackStyles.iconContainer,
                    feedbackStyles.commentContainer,
                  ]}>
                  <Image style={feedbackStyles.icon} source={icons.comment} />
                  <Text style={feedbackStyles.commentCount}> 2</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    width: s(258),
  },
});

const feedbackStyles = StyleSheet.create({
  container: {
    width: s(45),
    justifyContent: 'space-between',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    backgroundColor: colors.grey,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  likeContainer: {
    borderTopLeftRadius: s(10),
    borderTopRightRadius: s(10),
    borderBottomLeftRadius: s(3),
    borderBottomRightRadius: s(3),
    marginBottom: s(3),
  },
  countContainer: {
    borderRadius: s(3),
  },
  dislikeContainer: {
    borderTopLeftRadius: s(3),
    borderTopRightRadius: s(3),
    borderBottomLeftRadius: s(10),
    borderBottomRightRadius: s(10),
    marginTop: s(3),
  },
  commentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: s(5),
    borderRadius: s(10),
  },
  icon: {
    width: s(14),
    height: s(14),
  },
  count: {
    fontSize: s(14),
    fontWeight: '700',
    color: colors.accent,
  },
  commentCount: {
    fontSize: s(12),
    fontWeight: '500',
    color: colors.black,
    marginTop: -s(1),
    marginBottom: s(1),
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

export default FGEvent;
