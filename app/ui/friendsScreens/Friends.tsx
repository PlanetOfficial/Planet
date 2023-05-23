import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  FlatList,
  Alert,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {s, vs} from 'react-native-size-matters';

import moment from 'moment';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';

import EventCard from '../components/EventCard';
import FGSelector from './FGSelector';
import Icon from '../components/Icon';
import Text from '../components/Text';
import AButton from '../components/ActionButton';

import {getFGsAndInvites} from '../../utils/api/friendsCalls/getFGsAndInvites';
import {makeFGEvent} from '../../utils/api/friendsCalls/makeFGEvent';
import {getFGEvents} from '../../utils/api/friendsCalls/getFGEvents';
import {removeEvent} from '../../utils/api/friendsCalls/removeEvent';
import {forkEvent} from '../../utils/api/friendsCalls/forkEvent';
import {
  FriendGroup,
  Invitation,
  Event,
  Place,
  FGsAndInvites,
} from '../../utils/interfaces/types';
import {getEvents} from '../../utils/api/eventAPI';
import {getPlaces} from '../../utils/api/placeAPI';

interface Props {
  navigation: any;
}

const Friends: React.FC<Props> = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const [friendGroup, setFriendGroup] = useState<number>(-1);

  const [friendGroups, setFriendGroups] = useState<FriendGroup[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [curFGEvents, setCurFGEvents] = useState<Event[]>([]);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const [fgBottomSheetOpen, setFgBottomSheetOpen] = useState<boolean>(false);
  const fgBottomSheetRef = useRef<BottomSheetModal>(null);
  const fgSnapPoints = useMemo(
    () => [
      Math.min(
        s(70) * (friendGroups.length + invitations.length) + s(120),
        vs(680) - s(60) - insets.top,
      ),
    ],
    [insets.top, friendGroups.length, invitations.length],
  );
  const handleFgSheetChange = useCallback((_: number, toIndex: number) => {
    setFgBottomSheetOpen(toIndex === 0);
  }, []);

  const [loading, setLoading] = useState<boolean>(true);

  const [addBottomSheetOpen, setAddBottomSheetOpen] = useState<boolean>(false);
  const addBottomSheetRef = useRef<BottomSheetModal>(null);
  const addSnapPoints = useMemo(
    () => [vs(680) - s(60) - insets.top],
    [insets.top],
  );
  const handleAddSheetChange = useCallback((_: number, toIndex: number) => {
    setAddBottomSheetOpen(toIndex === 0);
  }, []);

  const fetchCurGroupInfo = async (group_id: number) => {
    setLoading(true);
    const response = await getFGEvents(group_id);
    if (response) {
      setCurFGEvents(response);
    } else {
      Alert.alert('Error', 'Unable to load events. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (friendGroup !== -1) {
      fetchCurGroupInfo(friendGroups[friendGroup].group.id);
    }
  }, [friendGroup, friendGroups]);

  const initializeData = async () => {
    const responseData: FGsAndInvites | null = await getFGsAndInvites();

    if (responseData?.groups) {
      setFriendGroups(responseData.groups);

      if (responseData.groups.length > 0) {
        if (friendGroup === -1) {
          setFriendGroup(0);
          fetchCurGroupInfo(responseData.groups[0].group.id);
        } else {
          fetchCurGroupInfo(responseData.groups[friendGroup].group.id);
        }
      }
    } else {
      Alert.alert('Error', 'Unable to load groups. Please try again.');
    }

    if (responseData?.invites) {
      setInvitations(responseData.invites);
    } else {
      Alert.alert('Error', 'Unable to load invitations. Please try again.');
    }

    const eventsData: Event[] | null = await getEvents();
    if (eventsData) {
      setUserEvents(eventsData);
    } else {
      Alert.alert('Error', 'Unable to load events. Please try again.');
    }

    const _places: Place[] | null = await getPlaces();
    if (_places) {
      const bookmarksIds: number[] = _places.map(
        (bookmark: Place) => bookmark.id,
      );
      setBookmarks(bookmarksIds);
    } else {
      Alert.alert('Error', 'Unable to load bookmarks. Please try again.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      initializeData();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, friendGroup]);

  const handleAddEvent = async (user_event_id: number) => {
    const response = await makeFGEvent(
      user_event_id,
      friendGroups[friendGroup].group.id,
    );

    if (response) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      fetchCurGroupInfo(friendGroups[friendGroup].group.id);
    } else {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleFork = async (groupEventId: number) => {
    const response = await forkEvent(groupEventId);

    if (response) {
      navigation.navigate('Library');
    } else {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleRemoveEvent = async (group_event_id: number) => {
    const response = await removeEvent(group_event_id);

    if (response) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setCurFGEvents(
        curFGEvents.filter((event: Event) => event.id !== group_event_id),
      );
    } else {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={headerStyles.container}>
          <TouchableOpacity
            style={headerStyles.selector}
            onPress={() => fgBottomSheetRef.current?.present()}>
            <Text size="xl" weight="b">
              {friendGroup === -1
                ? strings.title.friends
                : friendGroups[friendGroup]?.group?.name}
            </Text>
            <View style={headerStyles.drop}>
              <Icon icon={icons.drop} />
            </View>
          </TouchableOpacity>
          <View style={headerStyles.notification}>
            <Icon
              size="m"
              icon={icons.notification}
              onPress={() => {
                // TODO: implement notifications
                Alert.alert(
                  'Notifications',
                  'Notifications are not implemented yet',
                );
              }}
            />
          </View>
        </View>
      </SafeAreaView>

      {friendGroup !== -1 ? (
        <View style={styles.addButton}>
          <AButton
            size="l"
            label={strings.friends.addPrompt}
            onPress={() => addBottomSheetRef.current?.present()}
          />
        </View>
      ) : null}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={curFGEvents}
          style={contentStyles.container}
          initialNumToRender={4}
          keyExtractor={(item: Event) => item.id.toString()}
          ItemSeparatorComponent={Spacer}
          contentContainerStyle={contentStyles.content}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text size="m" color={colors.darkgrey} center={true}>
                {strings.library.noEvents}
              </Text>
            </View>
          }
          renderItem={({item}: {item: Event}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (!fgBottomSheetOpen && !addBottomSheetOpen) {
                    navigation.navigate('FGEvent', {
                      eventData: item,
                      bookmarks: bookmarks,
                    });
                  }
                }}>
                <EventCard
                  name={item.name}
                  info={
                    moment(item.date, 'YYYY-MM-DD').format('M/D/YYYY') +
                    ' • ' +
                    item.suggester?.name
                  }
                  image={
                    item.places &&
                    item.places.length > 0 &&
                    item.places[0]?.photo
                      ? {uri: item.places[0]?.photo}
                      : icons.defaultIcon
                  }
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
                      onPress: () => handleFork(item.id),
                      color: colors.accent,
                    },
                    {
                      name: strings.main.remove,
                      onPress: () => handleRemoveEvent(item.id),
                      disabled: !item.suggester?.self,
                      color: colors.red,
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          }}
        />
      )}

      {fgBottomSheetOpen || addBottomSheetOpen ? (
        <Pressable
          onPress={() => {
            setFgBottomSheetOpen(false);
            setAddBottomSheetOpen(false);
            fgBottomSheetRef.current?.close();
            addBottomSheetRef.current?.close();
          }}
          style={styles.dim}
        />
      ) : null}

      <BottomSheetModal
        ref={fgBottomSheetRef}
        snapPoints={fgSnapPoints}
        onAnimate={handleFgSheetChange}>
        <FGSelector
          bottomSheetRef={fgBottomSheetRef}
          friendGroups={friendGroups}
          friendGroup={friendGroup}
          setFriendGroup={setFriendGroup}
          refreshOnInviteEvent={initializeData}
          invitations={invitations}
          navigation={navigation}
        />
      </BottomSheetModal>

      <BottomSheetModal
        ref={addBottomSheetRef}
        snapPoints={addSnapPoints}
        onAnimate={handleAddSheetChange}>
        <FlatList
          data={userEvents}
          style={contentStyles.container}
          initialNumToRender={4}
          keyExtractor={(item: Event) => item.id.toString()}
          ItemSeparatorComponent={Spacer}
          contentContainerStyle={contentStyles.content}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text size="m" color={colors.darkgrey} center={true}>
                {strings.library.noEventsAdd}
              </Text>
            </View>
          }
          renderItem={({item}: {item: Event}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setAddBottomSheetOpen(false);
                  addBottomSheetRef.current?.close();
                  handleAddEvent(item.id);
                }}>
                <EventCard
                  name={item.name}
                  info={item.date}
                  image={
                    item.places &&
                    item.places.length !== 0 &&
                    item.places[0]?.photo
                      ? {uri: item.places[0]?.photo}
                      : icons.defaultIcon
                  }
                />
              </TouchableOpacity>
            );
          }}
        />
      </BottomSheetModal>
    </View>
  );
};

const Spacer = () => <View style={contentStyles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  addButton: {
    alignItems: 'center',
    marginVertical: s(15),
  },
  dim: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  center: {
    height: s(400),
    justifyContent: 'center',
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: s(350),
    height: s(50),
    paddingHorizontal: s(20),
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drop: {
    marginLeft: s(4),
  },
  notification: {
    position: 'absolute',
    right: s(20),
  },
});

const contentStyles = StyleSheet.create({
  container: {
    width: s(350),
    paddingHorizontal: s(20),
  },
  content: {
    paddingVertical: s(10),
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginVertical: s(10),
  },
});

export default Friends;
