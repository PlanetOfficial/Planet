import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Alert,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import EncryptedStorage from 'react-native-encrypted-storage';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import STYLING, {segControlTabStyling} from '../../../constants/styles';

import Text from '../../components/Text';
import EventRow from '../../components/EventRow';

import {Coordinate, Event, UserInfo} from '../../../utils/types';
import {getFriend} from '../../../utils/api/friendsAPI';
import {fetchUserLocation, useLoadingState} from '../../../utils/Misc';

import {useFriendsContext} from '../../../context/FriendsContext';

import ProfileBody from '../../profileScreens/profile/ProfileBody';
import ProfileHeader from './ProfileHeader';
import ProfileButtons from './ProfileButtons';

const User = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      user: UserInfo;
    };
  };
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  const segControlTabStyles = segControlTabStyling(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [selectedIndex, setIndex] = useState<number>(0);
  const [selfUserId, setSelfUserId] = useState<number>(0);
  const [mutualEvents, setMutualEvents] = useState<Event[]>([]);

  const [location, setLocation] = useState<Coordinate>();
  const [loading, withLoading] = useLoadingState();

  const {friends} = useFriendsContext();

  const initializeData = useCallback(async () => {
    setLocation(await fetchUserLocation());

    const myUserId = await EncryptedStorage.getItem('user_id');
    if (myUserId) {
      setSelfUserId(parseInt(myUserId, 10));
    }

    const userData = await getFriend(route.params.user.id);

    if (userData) {
      setMutualEvents(userData.shared_events);
    } else {
      Alert.alert(strings.error.error, strings.error.loadUserData);
    }
  }, [route.params.user.id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      withLoading(initializeData);
    });

    return unsubscribe;
  }, [navigation, withLoading, initializeData]);

  const isSelf = route.params.user.id === selfUserId;
  const isFriend = friends.some(friend => friend.id === route.params.user.id);

  return (
    <View style={STYLES.container}>
      <ProfileHeader
        navigation={navigation}
        user={route.params.user}
        isSelf={route.params.user.id === selfUserId}
        isOnTabScreen={false}
      />
      {isSelf ? (
        <ProfileBody navigation={navigation} location={location} />
      ) : isFriend ? (
        <>
          <SegmentedControlTab
            tabsContainerStyle={segControlTabStyles.container}
            tabStyle={segControlTabStyles.tab}
            activeTabStyle={segControlTabStyles.activeTab}
            tabTextStyle={segControlTabStyles.text}
            firstTabStyle={segControlTabStyles.firstTab}
            activeTabTextStyle={segControlTabStyles.activeText}
            borderRadius={0}
            values={[strings.friends.mutualEvents, strings.profile.albums]}
            selectedIndex={selectedIndex}
            onTabPress={(index: number) => {
              setIndex(index);
              if (index === 1) {
                Alert.alert('Albums', 'Coming soon!', [
                  {text: 'OK', onPress: () => setIndex(0)},
                ]);
              }
            }}
          />
          {loading ? (
            <View style={STYLES.center}>
              <ActivityIndicator size="small" color={colors[theme].accent} />
            </View>
          ) : (
            <FlatList
              data={mutualEvents}
              scrollIndicatorInsets={{right: 1}}
              renderItem={({item}: {item: Event}) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.push('Event', {
                        event: item,
                      })
                    }>
                    <EventRow event={item} selfUserId={selfUserId} />
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={STYLES.center}>
                  <Text weight="l">{strings.friends.noMutualEventsFound}</Text>
                </View>
              }
              keyExtractor={(item: Event) => item.id.toString()}
            />
          )}
        </>
      ) : (
        <ProfileButtons user={route.params.user} />
      )}
    </View>
  );
};

export default User;
