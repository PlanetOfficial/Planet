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
import STYLING, {sctStyling} from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import EventRow from '../../components/EventRow';
import Separator from '../../components/Separator';

import {Event, UserInfo, UserStatus} from '../../../utils/types';
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
  const sctStyles = sctStyling(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [selectedIndex, setIndex] = useState<number>(0);
  const [self, setSelf] = useState<string>('');
  const [status, setStatus] = useState<UserStatus>('');
  const [mutuals, setMutuals] = useState<UserInfo[]>([]);
  const [mutualEvents, setMutualEvents] = useState<Event[]>([]);

  const initializeData = useCallback(async () => {
    const _self = await EncryptedStorage.getItem('username');
    if (_self) {
      setSelf(_self);
    }

    const userData = await getFriend(route.params.user.id);

    if (userData) {
      setStatus(userData.status);
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
      {status === 'SELF' ? (
        <ProfileBody navigation={navigation} />
      ) : (
        <>
          <Profile
            navigation={navigation}
            user={route.params.user}
            mutuals={mutuals}
            status={status}
            setStatus={setStatus}
          />

          <SegmentedControlTab
            tabsContainerStyle={sctStyles.container}
            tabStyle={sctStyles.tab}
            activeTabStyle={sctStyles.activeTab}
            tabTextStyle={sctStyles.text}
            firstTabStyle={sctStyles.firstTab}
            activeTabTextStyle={sctStyles.activeText}
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
            ItemSeparatorComponent={Separator}
          />
        </>
      )}
    </View>
  );
};

export default User;
