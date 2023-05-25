import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
  LayoutAnimation,
  RefreshControl,
} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {s, vs} from 'react-native-size-matters';

import moment from 'moment';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';

import EventCard from '../components/EventCard';
import GroupSelector from './GroupSelector';
import Icon from '../components/Icon';
import Text from '../components/Text';
import AButton from '../components/ActionButton';

import {
  getGroupEvents,
  postGroupEvent,
  deleteGroupEvent,
} from '../../utils/api/groups/eventAPI';
import {getGroups} from '../../utils/api/groups/groupAPI';
import {getInvites} from '../../utils/api/groups/inviteAPI';
import {
  Group,
  Invite,
  Event,
  GroupEvent,
  Place,
} from '../../utils/interfaces/types';
import {getEvents} from '../../utils/api/eventAPI';
import {getPlaces} from '../../utils/api/placeAPI';

interface Props {
  navigation: any;
}

const Groups: React.FC<Props> = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const [group, setGroup] = useState<number>(-1);

  const [groups, setGroups] = useState<Group[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);

  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [curGroupEvents, setCurGroupEvents] = useState<GroupEvent[]>([]);
  const [bookmarks, setBookmarks] = useState<Place[]>([]);

  const [groupBottomSheetOpen, setGroupBottomSheetOpen] =
    useState<boolean>(false);
  const groupBottomSheetRef = useRef<BottomSheetModal>(null);
  const groupSnapPoints = useMemo(
    () => [
      Math.min(
        s(70) * (groups.length + invites.length) + s(120),
        vs(680) - s(60) - insets.top,
      ),
    ],
    [insets.top, groups.length, invites.length],
  );
  const handleGroupSheetChange = useCallback((_: number, toIndex: number) => {
    setGroupBottomSheetOpen(toIndex === 0);
  }, []);

  const [addBottomSheetOpen, setAddBottomSheetOpen] = useState<boolean>(false);
  const addBottomSheetRef = useRef<BottomSheetModal>(null);
  const addSnapPoints = useMemo(
    () => [vs(680) - s(60) - insets.top],
    [insets.top],
  );
  const handleAddSheetChange = useCallback((_: number, toIndex: number) => {
    setAddBottomSheetOpen(toIndex === 0);
  }, []);

  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurGroupInfo = async (group_id: number) => {
    setLoading(true);
    const response: GroupEvent[] | null = await getGroupEvents(group_id);
    if (response) {
      setCurGroupEvents(response);
    } else {
      Alert.alert('Error', 'Unable to load events. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (group !== -1) {
      fetchCurGroupInfo(groups[group].id);
    }
  }, [group, groups]);

  const initializeData = async () => {
    const _groups: Group[] | null = await getGroups();

    if (_groups) {
      setGroups(_groups);

      if (_groups.length > 0) {
        if (group === -1) {
          setGroup(0);
          fetchCurGroupInfo(_groups[0].id);
        } else {
          fetchCurGroupInfo(_groups[group].id);
        }
      }
    } else {
      Alert.alert('Error', 'Unable to load groups. Please try again.');
    }

    const _invites: Invite[] | null = await getInvites();

    if (_invites) {
      setInvites(_invites);
    } else {
      Alert.alert('Error', 'Unable to load invites. Please try again.');
    }

    const eventsData: Event[] | null = await getEvents();
    if (eventsData) {
      setUserEvents(eventsData);
    } else {
      Alert.alert('Error', 'Unable to load events. Please try again.');
    }

    const _places: Place[] | null = await getPlaces();
    if (_places) {
      setBookmarks(_places);
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
  }, [navigation, group]);

  const handleAddEvent = async (user_event_id: number) => {
    const response = await postGroupEvent(user_event_id, groups[group].id);

    if (response) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      fetchCurGroupInfo(groups[group].id);
    } else {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleRemoveEvent = async (group_event_id: number) => {
    const response = await deleteGroupEvent(group_event_id);

    if (response) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setCurGroupEvents(
        curGroupEvents.filter(
          (event: GroupEvent) => event.id !== group_event_id,
        ),
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
            onPress={() => groupBottomSheetRef.current?.present()}>
            <Text size="xl" weight="b">
              {group === -1 ? strings.title.groups : groups[group]?.name}
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

      {group !== -1 ? (
        <View style={styles.addButton}>
          <AButton
            size="l"
            label={strings.groups.addPrompt}
            onPress={() => addBottomSheetRef.current?.present()}
          />
        </View>
      ) : null}

      <FlatList
        data={curGroupEvents}
        style={contentStyles.container}
        initialNumToRender={4}
        keyExtractor={(item: GroupEvent) => item.id.toString()}
        ItemSeparatorComponent={Spacer}
        contentContainerStyle={contentStyles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => initializeData()}
            tintColor={colors.accent}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text size="m" color={colors.darkgrey} center={true}>
              {strings.library.noEvents}
            </Text>
          </View>
        }
        renderItem={({item}: {item: GroupEvent}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                if (!groupBottomSheetOpen && !addBottomSheetOpen) {
                  navigation.navigate('GroupEvent', {
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
                  item.destinations &&
                  item.destinations.length > 0 &&
                  item.destinations[0].places &&
                  item.destinations[0].places.length > 0 &&
                  item.destinations[0].places[0]?.photo
                    ? {uri: item.destinations[0].places[0]?.photo}
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

      {groupBottomSheetOpen || addBottomSheetOpen ? (
        <View
          style={styles.dim}
          onTouchStart={() => {
            if (groupBottomSheetOpen) {
              groupBottomSheetRef.current?.dismiss();
            }
            if (addBottomSheetOpen) {
              addBottomSheetRef.current?.dismiss();
            }
          }}
        />
      ) : null}

      <BottomSheetModal
        ref={groupBottomSheetRef}
        snapPoints={groupSnapPoints}
        onAnimate={handleGroupSheetChange}>
        <GroupSelector
          bottomSheetRef={groupBottomSheetRef}
          groups={groups}
          group={group}
          setGroup={setGroup}
          refreshOnInviteEvent={initializeData}
          invites={invites}
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

export default Groups;