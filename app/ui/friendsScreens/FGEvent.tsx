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
  Alert,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {s} from 'react-native-size-matters';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import EncryptedStorage from 'react-native-encrypted-storage';
import BottomSheet, {BottomSheetModal} from '@gorhom/bottom-sheet';

import moment from 'moment';

import {
  getMarkerArray,
  getRegionForCoordinates,
} from '../../utils/functions/Misc';
import {getGroupEventPlaces} from '../../utils/api/friendsCalls/getGroupEventPlaces';
import {likeFGPlace} from '../../utils/api/friendsCalls/likeFGPlace';
import {dislikeFGPlace} from '../../utils/api/friendsCalls/dislikeFGPlace';
import {forkEvent} from '../../utils/api/friendsCalls/forkEvent';
import {MarkerObject, FGReaction, FGPlace} from '../../utils/interfaces/types';
import {removeEvent} from '../../utils/api/friendsCalls/removeEvent';

import PlaceCard from '../components/PlaceCard';
import Blur from '../components/Blur';
import ScrollIndicator from '../components/ScrollIndicator';
import OptionMenu from '../components/OptionMenu';
import Icon from '../components/Icon';
import CustomText from '../components/Text';

import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {getBookmarks} from '../../utils/api/shared/getBookmarks';

interface Props {
  navigation: any;
  route: any;
}

const FGEvent: React.FC<Props> = ({navigation, route}) => {
  const [groupEventId] = useState<number>(route?.params?.eventData?.id);
  const [eventTitle] = useState<string>(route?.params?.eventData?.name);
  const [suggester] = useState<{name: string; self: boolean}>(
    route?.params?.eventData?.suggester_info,
  );
  const [date] = useState<string>(
    moment(route?.params?.eventData?.date, 'YYYY-MM-DD').format('M/D/YYYY'),
  );
  const [bookmarks, setBookmarks] = useState<number[]>(
    route?.params?.bookmarks,
  );
  const [userId, setUserId] = useState<number>(-1);

  const [fullEventData, setFullEventData] = useState<{places: FGPlace[]}>({
    places: [],
  });

  const [curPlaceLikes, setCurPlaceLikes] = useState<FGReaction[]>([]);
  const [curPlaceDislikes, setCurPlaceDislikes] = useState<FGReaction[]>([]);

  const [placeIdx, setPlaceIdx] = useState<number>(0);
  const [markers, setMarkers] = useState<MarkerObject[]>([]);

  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [s(290) + insets.bottom], [insets.bottom]);

  const [feedbackBottomSheetOpen, setFeedbackBottomSheetOpen] =
    useState<boolean>(false);
  const feedbackBottomSheetRef = useRef<BottomSheetModal>(null);
  const feedbackSnapPoints = useMemo(() => ['40%'], []);
  const handleFeedbackSheetChange = useCallback(
    (fromIndex: number, toIndex: number) => {
      setFeedbackBottomSheetOpen(toIndex === 0);
    },
    [],
  );

  useEffect(() => {
    const initializeUserId = async () => {
      const idString: string | null = await EncryptedStorage.getItem('user_id');
      if (!idString) {
        return;
      }

      const id: number = parseInt(idString, 10);
      if (Number.isNaN(id)) {
        return;
      }

      setUserId(id);
    };

    const initializeData = async () => {
      const authToken = await EncryptedStorage.getItem('auth_token');
      if (!authToken) {
        return;
      }

      const _bookmarks = await getBookmarks(authToken);
      const bookmarksIds: number[] = _bookmarks.map(
        (bookmark: {id: any}) => bookmark.id,
      );
      setBookmarks(bookmarksIds);

      const data = await getGroupEventPlaces(groupEventId);
      setFullEventData(data);

      const markerArray: MarkerObject[] = getMarkerArray(data?.places);
      setMarkers(markerArray);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      initializeData();
      initializeUserId();
    });
    return unsubscribe;
  }, [navigation, groupEventId]);

  const getEventData = async () => {
    const data = await getGroupEventPlaces(groupEventId);
    setFullEventData(data);

    const markerArray: MarkerObject[] = getMarkerArray(data?.places);
    setMarkers(markerArray);
  };

  const handlePlaceLike = async (group_event_place_id: number) => {
    const token = await EncryptedStorage.getItem('auth_token');

    const response = await likeFGPlace(group_event_place_id, token);

    if (response) {
      getEventData();
    } else {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handlePlaceDislike = async (group_event_place_id: number) => {
    const token = await EncryptedStorage.getItem('auth_token');

    const response = await dislikeFGPlace(group_event_place_id, token);

    if (response) {
      getEventData();
    } else {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const didIReact = (reactionArray: FGReaction[]): boolean => {
    let result = false;
    reactionArray.forEach((reaction: FGReaction) => {
      if (reaction.user.id === userId) {
        result = true;
      }
    });

    return result;
  };

  const handleFork = async () => {
    const token = await EncryptedStorage.getItem('auth_token');

    const response = await forkEvent(groupEventId, token);

    if (response) {
      navigation.navigate('Library');
    } else {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleRemoveEvent = async (group_event_id: number) => {
    const token = await EncryptedStorage.getItem('auth_token');
    const response = await removeEvent(group_event_id, token);

    if (response) {
      navigation.navigate('Friends');
    } else {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleReactionInfo = (likes: FGReaction[], dislikes: FGReaction[]) => {
    feedbackBottomSheetRef.current?.present();

    setCurPlaceLikes(likes);
    setCurPlaceDislikes(dislikes);
  };

  const getSign = (num: number): string => {
    if (num > 0) {
      return '+';
    } else {
      return '';
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={getRegionForCoordinates(markers)}>
        {markers?.length > 0
          ? markers?.map((marker: MarkerObject, index: number) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.name}
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
            onPress={() => navigation.navigate('Friends')}
          />

          <View style={headerStyles.texts}>
            <CustomText size="m" weight="b">
              {eventTitle}
            </CustomText>
            <CustomText size="xs" weight="l" color={colors.accent}>
              {date + ' • ' + suggester?.name}
            </CustomText>
          </View>
          <OptionMenu
            options={[
              {
                name: strings.main.share,
                onPress: () => {
                  // TODO: share event
                  Alert.alert('Share', 'Share is not implemented yet');
                },
                color: colors.black,
              },
              {
                name: strings.friends.fork,
                onPress: handleFork,
                color: colors.accent,
              },
              {
                name: strings.main.remove,
                onPress: () => handleRemoveEvent(groupEventId),
                disabled: !suggester?.self,
                color: colors.red,
              },
            ]}
          />
        </View>
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
          <ScrollView
            style={placesDisplayStyles.scrollView}
            contentContainerStyle={placesDisplayStyles.contentContainer}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            scrollEventThrottle={16}
            snapToInterval={s(310)} // 290 + 20
            snapToAlignment={'start'}
            decelerationRate={'fast'}
            onScroll={event =>
              setPlaceIdx(
                Math.round(event.nativeEvent.contentOffset.x / s(310)),
              )
            }>
            {fullEventData?.places?.map((dest: FGPlace, idx: number) => (
              <View
                style={[
                  placesDisplayStyles.card,
                  idx !== fullEventData?.places?.length - 1
                    ? {
                        marginRight: s(20),
                      }
                    : null,
                ]}
                key={idx}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Place', {
                      destination: dest,
                      category: dest.category_name,
                      bookmarked: bookmarks.includes(dest.id),
                    });
                  }}>
                  <PlaceCard
                    id={dest.id}
                    name={dest.name}
                    info={dest.category_name}
                    bookmarked={bookmarks.includes(dest.id)}
                    setBookmarked={(bookmarked: boolean, id: number) => {
                      if (bookmarked) {
                        setBookmarks([...bookmarks, id]);
                      } else {
                        setBookmarks(
                          bookmarks.filter(
                            (bookmark: number) => bookmark !== id,
                          ),
                        );
                      }
                    }}
                    image={
                      dest.image_url
                        ? {
                            uri: dest.image_url,
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
                    onPress={() => handlePlaceLike(dest.group_event_place_id)}>
                    <Image
                      style={[
                        feedbackStyles.icon,
                        {
                          tintColor: didIReact(dest.likes)
                            ? colors.accent
                            : colors.black,
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
                    onPress={() =>
                      handleReactionInfo(dest.likes, dest.dislikes)
                    }>
                    <CustomText size="s" color={colors.accent}>
                      {getSign(dest.likes.length - dest.dislikes.length) +
                        (dest.likes.length - dest.dislikes.length)}
                    </CustomText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      feedbackStyles.iconContainer,
                      feedbackStyles.dislikeContainer,
                    ]}
                    onPress={() =>
                      handlePlaceDislike(dest.group_event_place_id)
                    }>
                    <Image
                      style={[
                        feedbackStyles.icon,
                        {
                          tintColor: didIReact(dest.dislikes)
                            ? colors.accent
                            : colors.black,
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
                    onPress={() => {
                      // TODO: comment on place
                      Alert.alert('Comment', 'Comment is not implemented yet');
                    }}>
                    <Image
                      style={[
                        feedbackStyles.icon,
                        {
                          tintColor: colors.black,
                        },
                      ]}
                      source={icons.comment}
                    />
                    <CustomText size="s"> 0</CustomText>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          <ScrollIndicator num={fullEventData?.places?.length} idx={placeIdx} />
        </SafeAreaView>
      </BottomSheet>

      {feedbackBottomSheetOpen ? (
        <Pressable
          style={styles.dim}
          onPress={() => {
            feedbackBottomSheetRef.current?.close();
            setCurPlaceLikes([]);
            setCurPlaceDislikes([]);
          }}
        />
      ) : null}

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
            <View>
              {curPlaceLikes?.map((like: FGReaction, index: number) => (
                <View key={index}>
                  <Text>{like.user.name}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={feedbackModalStyles.verticalLine} />
          <View style={feedbackModalStyles.halfContainer}>
            <Text style={feedbackModalStyles.title}>
              {strings.friends.dislikes}
            </Text>
            <View style={feedbackModalStyles.horizontalLine} />
            <View>
              {curPlaceDislikes?.map((dislike: FGReaction, index: number) => (
                <View key={index}>
                  <Text>{dislike.user.name}</Text>
                </View>
              ))}
            </View>
          </View>
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
    justifyContent: 'space-between',
    width: s(350),
    height: s(50),
    paddingHorizontal: s(20),
  },
  texts: {
    flex: 1,
    marginHorizontal: s(10),
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
    paddingHorizontal: s(30), // (350 - 290) / 2
  },
  card: {
    width: s(290), // height: 290 * 5/8 = 181.25
  },
});

const feedbackStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: s(10),
    marginBottom: -s(5),
    paddingHorizontal: s(20),
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

export default FGEvent;
