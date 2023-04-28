import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {s} from 'react-native-size-matters';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet, {BottomSheetModal} from '@gorhom/bottom-sheet';

import {
  getMarkerArray,
  getRegionForCoordinates,
} from '../../../utils/functions/Misc';
import {MarkerObject} from '../../../utils/interfaces/MarkerObject';
import {getEventPlaces} from '../../../utils/api/libraryCalls/getEventPlaces';

import PlaceCard from '../../components/PlaceCard';
import Blur from '../../components/Blur';
import ScrollIndicator from '../../components/ScrollIndicator';

import {icons} from '../../../constants/images';
import strings from '../../../constants/strings';
import {colors} from '../../../constants/theme';

const Event = ({navigation, route}: {navigation: any; route: any}) => {
  const [eventId] = useState(route?.params?.eventData?.id);
  const [eventTitle] = useState(route?.params?.eventData?.name);
  const [date] = useState(new Date(route?.params?.eventData?.date)); // this probably doesn't work but whatever
  const [bookmarks] = useState(route?.params?.bookmarks);

  const [fullEventData, setFullEventData]: [any, any] = useState({});
  const [placeIdx, setPlaceIdx] = useState(0);
  const [markers, setMarkers] = useState([]);

  const insets = useSafeAreaInsets();
  const bottomSheetRef: any = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [s(265) + insets.bottom], [insets.bottom]);

  const [feedbackBottomSheetOpen, setFeedbackBottomSheetOpen] = useState(false);
  const feedbackBottomSheetRef: any = useRef<BottomSheetModal>(null);
  const feedbackSnapPoints = useMemo(() => ['40%'], []);
  const handleFeedbackSheetChange = useCallback(
    (fromIndex: number, toIndex: number) => {
      setFeedbackBottomSheetOpen(toIndex === 0);
    },
    [],
  );

  const [commentBottomSheetOpen, setCommentBottomSheetOpen] = useState(false);
  const commentBottomSheetRef: any = useRef<BottomSheetModal>(null);
  const commentSnapPoints = useMemo(() => ['75%'], []);
  const handleCommentSheetChange = useCallback(
    (fromIndex: number, toIndex: number) => {
      setCommentBottomSheetOpen(toIndex === 0);
    },
    [],
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
        <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
          <Image style={headerStyles.back} source={icons.back} />
        </TouchableOpacity>
        <View style={headerStyles.texts}>
          <Text style={headerStyles.name}>{eventTitle}</Text>
          <Text style={headerStyles.date}>{date.toLocaleDateString()}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            // TODO: FOrk functionality
          }}>
          <Text style={headerStyles.fork}>Fork</Text>
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
                <View style={feedbackStyles.container}>
                  <TouchableOpacity
                    style={[
                      feedbackStyles.iconContainer,
                      feedbackStyles.likeContainer,
                    ]}
                    onPress={() => {
                      // TODO: Add user to the list of likes
                    }}>
                    <Image
                      style={[
                        feedbackStyles.icon,
                        {
                          // TODO: change the tint color based on like status
                          tintColor: true ? colors.accent : colors.black,
                        },
                      ]}
                      source={icons.like}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      feedbackStyles.iconContainer,
                      feedbackStyles.countContainer,
                    ]}
                    onPress={() => feedbackBottomSheetRef.current?.present()}>
                    <Text style={feedbackStyles.count}>+3</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      feedbackStyles.iconContainer,
                      feedbackStyles.dislikeContainer,
                    ]}
                    onPress={() => {
                      // TODO: Add user to the list of dislikes
                    }}>
                    <Image
                      style={[
                        feedbackStyles.icon,
                        {
                          // TODO: change the tint color based on dislike status
                          tintColor: false ? colors.accent : colors.black,
                        },
                      ]}
                      source={icons.dislike}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      feedbackStyles.iconContainer,
                      feedbackStyles.commentContainer,
                    ]}
                    onPress={() => commentBottomSheetRef.current?.present()}>
                    <Image
                      style={[
                        feedbackStyles.icon,
                        {
                          tintColor: colors.black,
                        },
                      ]}
                      source={icons.comment}
                    />
                    <Text style={feedbackStyles.commentCount}> 2</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          <ScrollIndicator num={fullEventData?.places?.length} idx={placeIdx} />
        </SafeAreaView>
      </BottomSheet>

      {(feedbackBottomSheetOpen || commentBottomSheetOpen) && (
        <Pressable
          style={styles.dark}
          onPress={() => {
            feedbackBottomSheetRef?.current.close();
            commentBottomSheetRef?.current.close();
          }}
        />
      )}

      <BottomSheetModal
        ref={feedbackBottomSheetRef}
        snapPoints={feedbackSnapPoints}
        onAnimate={handleFeedbackSheetChange}>
        <View style={feedbackModalStyles.container}>
          <View style={feedbackModalStyles.halfContainer}>
            <Text style={feedbackModalStyles.title}>
              {strings.friends.likes}
            </Text>
            <View style={feedbackModalStyles.horizontalLine} />
            {/* TODO: Display all the likes */}
          </View>
          <View style={feedbackModalStyles.verticalLine} />
          <View style={feedbackModalStyles.halfContainer}>
            <Text style={feedbackModalStyles.title}>
              {strings.friends.dislikes}
            </Text>
            <View style={feedbackModalStyles.horizontalLine} />
            {/* TODO: Display all the dislikes */}
          </View>
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        ref={commentBottomSheetRef}
        snapPoints={commentSnapPoints}
        onAnimate={handleCommentSheetChange}>
        <View style={commentModalStyles.container}>
          {/* TODO: Comment section goes here */}
        </View>
      </BottomSheetModal>
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
  dark: {
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
    fontSize: s(18),
    fontWeight: '700',
    color: colors.black,
  },
  date: {
    fontSize: s(11),
    fontWeight: '600',
    color: colors.accent,
  },
  fork: {
    width: s(40),
    fontSize: s(14),
    fontWeight: '600',
    textAlign: 'right',
    color: colors.accent,
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

const feedbackStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: s(10),
    marginBottom: -s(5),
    paddingHorizontal: s(10),
    height: s(40),
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
    width: s(50),
    borderTopLeftRadius: s(10),
    borderTopRightRadius: s(5),
    borderBottomLeftRadius: s(10),
    borderBottomRightRadius: s(5),
  },
  countContainer: {
    marginHorizontal: -s(5),
    width: s(50),
    borderRadius: s(5),
  },
  dislikeContainer: {
    width: s(50),
    borderTopLeftRadius: s(5),
    borderTopRightRadius: s(10),
    borderBottomLeftRadius: s(5),
    borderBottomRightRadius: s(10),
  },
  commentContainer: {
    width: s(65),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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

const feedbackModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    paddingVertical: s(10),
  },
  halfContainer: {
    alignItems: 'center',
    flex: 1,
  },
  verticalLine: {
    width: 1,
    marginHorizontal: s(10),
    backgroundColor: colors.darkgrey,
  },
  horizontalLine: {
    height: 1,
    width: s(100),
    backgroundColor: colors.darkgrey,
  },
  title: {
    fontSize: s(15),
    marginBottom: s(5),
    fontWeight: '700',
    color: colors.black,
  },
});

const commentModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: s(20),
    paddingVertical: s(10),
  },
});

export default Event;
