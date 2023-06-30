import React, {useState, useMemo, useEffect} from 'react';
import {Alert} from 'react-native';
import {s} from 'react-native-size-matters';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import colors from '../../constants/colors';
import strings from '../../constants/strings';

import FriendsContext from '../../context/FriendsContext';

import FriendsList from '../friendsScreens/friendsList/FriendsList';
import Requests from '../friendsScreens/requests/Requests';
import Suggestions from '../friendsScreens/suggestions/Suggestions';

import {FriendGroup, UserInfo} from '../../utils/types';
import {getFriends} from '../../utils/api/friendsAPI';

const Tab = createMaterialTopTabNavigator();
export const FriendsNavBar = () => {
  const [suggestions, setSuggestions] = useState<UserInfo[]>([]);
  const [friends, setFriends] = useState<UserInfo[]>([]);
  const [requests, setRequests] = useState<UserInfo[]>([]);
  const [requestsSent, setRequestsSent] = useState<UserInfo[]>([]);
  const [friendGroups, setFriendGroups] = useState<FriendGroup[]>([]);
  const friendsInfo = useMemo(
    () => ({
      suggestions,
      setSuggestions,
      friends,
      setFriends,
      requests,
      setRequests,
      requestsSent,
      setRequestsSent,
      friendGroups,
      setFriendGroups,
    }),
    [suggestions, friends, requests, requestsSent, friendGroups],
  );
  const initializeFriendsInfo = async () => {
    const result = await getFriends();
    if (result) {
      setSuggestions(result.suggestions);
      setFriends(result.friends);
      setRequests(result.requests);
      setRequestsSent(result.requests_sent);
      setFriendGroups(result.friend_groups);
    } else {
      Alert.alert(strings.error.error, strings.error.loadFriendsList);
    }
  };
  useEffect(() => {
    initializeFriendsInfo();
  }, []);

  return (
    <FriendsContext.Provider value={friendsInfo}>
      <Tab.Navigator
        initialRouteName="FriendsList"
        screenOptions={() => ({
          tabBarShowLabel: true,
          headerShown: false,
          tabBarIndicatorStyle: {
            backgroundColor: colors.primary,
          },
          tabBarLabelStyle: {
            textTransform: 'none',
            fontSize: s(12),
            fontWeight: '500',
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.black,
          tabBarItemStyle: {
            margin: -s(5),
          },
          tabBarStyle: {
            elevation: 0,
            backgroundColor: colors.white,
            marginHorizontal: s(10),
            borderBottomWidth: 1,
            borderBottomColor: colors.grey,
          },
        })}>
        <Tab.Screen name="Suggestions" component={Suggestions} />
        <Tab.Screen
          name="FriendsList"
          component={FriendsList}
          options={{
            tabBarLabel: 'Friends',
          }}
        />
        <Tab.Screen name={'Requests'} component={Requests} />
      </Tab.Navigator>
    </FriendsContext.Provider>
  );
};

export default FriendsNavBar;
