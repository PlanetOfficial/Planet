import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Pressable,
  FlatList,
} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import {s, vs} from 'react-native-size-matters';

import EventCard from '../components/EventCard';
import FGSelector from './FGSelector';
import EncryptedStorage from 'react-native-encrypted-storage';
import {getFGsAndInvites} from '../../utils/api/friendsCalls/getFGsAndInvites';
import {FriendGroup} from '../../utils/interfaces/friendGroup';
import {Invitation} from '../../utils/interfaces/invitation';
import {getEvents} from '../../utils/api/libraryCalls/getEvents';
import {makeFGEvent} from '../../utils/api/friendsCalls/makeFGEvent';
import {getFGEvents} from '../../utils/api/friendsCalls/getFGEvents';

const Friends = ({navigation}: {navigation: any}) => {
  const insets = useSafeAreaInsets();

  const [friendGroup, setFriendGroup] = useState(-1);

  const [friendGroups, setFriendGroups] = useState<FriendGroup[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const [userEvents, setUserEvents] = useState<any[]>([]);

  const [curFGEvents, setCurFGEvents] = useState<any[]>([]);

  const [fgBottomSheetOpen, setFgBottomSheetOpen] = useState(false);
  const fgBottomSheetRef: any = useRef<BottomSheetModal>(null);
  const fgSnapPoints = useMemo(
    () => [
      Math.min(
        s(70) * (friendGroups.length + invitations.length) + s(120),
        vs(680) - s(60) - insets.top,
      ),
    ],
    [insets.top, friendGroups, invitations],
  );
  const handleFgSheetChange = useCallback(
    (fromIndex: number, toIndex: number) => {
      setFgBottomSheetOpen(toIndex === 0);
    },
    [],
  );

  const [addBottomSheetOpen, setAddBottomSheetOpen] = useState(false);
  const addBottomSheetRef: any = useRef<BottomSheetModal>(null);
  const addSnapPoints = useMemo(
    () => [vs(680) - s(60) - insets.top],
    [insets.top],
  );
  const handleAddSheetChange = useCallback(
    (fromIndex: number, toIndex: number) => {
      setAddBottomSheetOpen(toIndex === 0);
    },
    [],
  );

  const fetchCurGroupInfo = async (group_id: number) => {
    const token = await EncryptedStorage.getItem('auth_token');

    const response = await getFGEvents(group_id, token);
    setCurFGEvents(response);
  };

  useEffect(() => {
    if (friendGroup !== -1) {
      fetchCurGroupInfo(friendGroups[friendGroup].group.id);
    }
  }, [friendGroup, friendGroups]);

  const initializeData = async () => {
    const token = await EncryptedStorage.getItem('auth_token');

    const responseData = await getFGsAndInvites(token);

    if (responseData?.groups) {
      setFriendGroups(responseData.groups);

      if (responseData.groups.length > 0) {
        setFriendGroup(0);

        fetchCurGroupInfo(responseData.groups[0].group.id);
      }
    }

    if (responseData?.invites) {
      setInvitations(responseData.invites);
    }

    const eventsData = await getEvents(token);
    setUserEvents(eventsData);
  };

  useEffect(() => {
    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddEvent = async (user_event_id: number) => {
    const token = await EncryptedStorage.getItem('auth_token');
    const response = await makeFGEvent(
      user_event_id,
      friendGroups[friendGroup].group.id,
      token,
    );

    if (!response) {
      // TODO: display error
      console.log('Error adding event');
    }

    fetchCurGroupInfo(friendGroups[friendGroup].group.id);
  };

  return (
    <>
      <SafeAreaView testID="friendsScreenView" style={styles.container}>
        <View style={headerStyles.container}>
          <TouchableOpacity
            style={headerStyles.fgSelector}
            onPress={() => fgBottomSheetRef.current?.present()}>
            <Text numberOfLines={1} style={headerStyles.title}>
              {friendGroup === -1
                ? strings.title.friends
                : friendGroups[friendGroup]?.group?.name}
            </Text>
            <View style={headerStyles.drop}>
              <Image style={[headerStyles.icon]} source={icons.next} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={headerStyles.notification}>
            <Image style={headerStyles.bell} source={icons.notification} />
          </TouchableOpacity>
        </View>
        {friendGroup !== -1 ? (
          <TouchableOpacity
            style={styles.addEventContainer}
            onPress={() => addBottomSheetRef.current?.present()}>
            <Image style={styles.plus} source={icons.x} />
            <Text style={styles.text}>{strings.friends.addPrompt}</Text>
          </TouchableOpacity>
        ) : null}
        <FlatList
          data={curFGEvents}
          style={contentStyles.container}
          initialNumToRender={4}
          keyExtractor={(item: any) => item?.id}
          ItemSeparatorComponent={Spacer}
          contentContainerStyle={contentStyles.content}
          renderItem={({item}) => {
            // TODO: Display actual events + user's icons and, if authorized, ability to remove events (LATER)
            // const images = getImagesFromURLs(item?.places);
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('FGEvent', {
                    eventData: item,
                    // bookmarks: places?.map(place => place?.id),
                  });
                }}>
                <EventCard
                  name={item?.name}
                  info={item?.date}
                  image={
                    item?.places &&
                    item?.places?.length > 0 &&
                    item?.places[0]?.place?.image_url
                      ? {uri: item?.places[0]?.place?.image_url}
                      : icons.defaultIcon
                  }
                />
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>

      {fgBottomSheetOpen || addBottomSheetOpen ? (
        <Pressable
          onPress={() => {
            setFgBottomSheetOpen(false);
            setAddBottomSheetOpen(false);
            fgBottomSheetRef?.current.close();
            addBottomSheetRef?.current.close();
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
          keyExtractor={item => item?.id?.toString()}
          ItemSeparatorComponent={Spacer}
          contentContainerStyle={contentStyles.content}
          renderItem={({item}: {item: any}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setAddBottomSheetOpen(false);
                  addBottomSheetRef?.current.close();
                  handleAddEvent(item?.id);
                }}>
                <EventCard
                  name={item?.name}
                  info={item?.date}
                  image={
                    item?.places &&
                    item?.places?.length !== 0 &&
                    item?.places[0]?.place?.image_url
                      ? {uri: item?.places[0]?.place?.image_url}
                      : icons.defaultIcon
                  }
                />
              </TouchableOpacity>
            );
          }}
        />
      </BottomSheetModal>
    </>
  );
};

const Spacer = () => <View style={contentStyles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  dim: {
    position: 'absolute',
    width: '100%',
    height: '150%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  addEventContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: s(310),
    height: s(50),
    marginVertical: s(10),
    borderWidth: 3,
    borderColor: colors.accent,
    borderStyle: 'dashed',
    borderRadius: s(10),
  },
  plus: {
    width: s(16),
    height: s(16),
    marginRight: s(13),
    tintColor: colors.accent,
    transform: [{rotate: '45deg'}],
  },
  text: {
    fontSize: s(16),
    fontWeight: '700',
    color: colors.black,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingVertical: s(15),
    width: '100%',
  },
  title: {
    fontSize: s(24),
    fontWeight: '700',
    color: colors.black,
  },
  fgSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drop: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: s(10),
    width: s(15),
    height: s(10),
  },
  icon: {
    width: s(10),
    height: s(15),
    tintColor: colors.black,
    transform: [{rotate: '90deg'}],
  },
  notification: {
    width: s(25),
    height: s(25),
  },
  bell: {
    width: '100%',
    height: '100%',
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
