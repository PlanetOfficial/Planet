import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import EncryptedStorage from 'react-native-encrypted-storage';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING, {segControlTabStyling} from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import EventRow from '../../components/EventRow';

import {Event, UserInfo} from '../../../utils/types';
import {getFriend} from '../../../utils/api/friendsAPI';

import ProfileBody from '../../profileScreens/profile/ProfileBody';

import Profile from './Profile';

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
  const [self, setSelf] = useState<number>(0);
  const [mutuals, setMutuals] = useState<UserInfo[]>([]);
  const [mutualEvents, setMutualEvents] = useState<Event[]>([]);

  const initializeData = useCallback(async () => {
    const myUserId = await EncryptedStorage.getItem('user_id');
    if (myUserId) {
      setSelf(parseInt(myUserId, 10));
    }

    const userData = await getFriend(route.params.user.id);

    if (userData) {
      setMutuals(userData.mutuals);
      setMutualEvents(userData.shared_events);
    } else {
      Alert.alert(strings.error.error, strings.error.loadUserData);
    }
  }, [route.params.user.id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      initializeData();
    });

    return unsubscribe;
  }, [navigation, initializeData]);

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>
      {route.params.user.id === self ? (
        <ProfileBody navigation={navigation} />
      ) : (
        <>
          <Profile
            navigation={navigation}
            user={route.params.user}
            mutuals={mutuals}
          />

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
          <FlatList
            data={mutualEvents}
            renderItem={({item}: {item: Event}) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Event', {
                      event: item,
                    })
                  }>
                  <EventRow event={item} self={self} />
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={STYLES.center}>
                <Text>{strings.friends.noMutualEventsFound}</Text>
              </View>
            }
            keyExtractor={(item: Event) => item.id.toString()}
          />
        </>
      )}
    </View>
  );
};

export default User;
