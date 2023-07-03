import React from 'react';
import {useColorScheme} from 'react-native';
import {s} from 'react-native-size-matters';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import colors from '../../constants/colors';
import strings from '../../constants/strings';

import FriendsList from '../friendsScreens/friendsList/FriendsList';
import Requests from '../friendsScreens/requests/Requests';
import Suggestions from '../friendsScreens/suggestions/Suggestions';

const Tab = createMaterialTopTabNavigator();
export const FriendsNavBar = () => {
  const theme = useColorScheme() || 'light';

  return (
    <Tab.Navigator
      initialRouteName="FriendsList"
      screenOptions={() => ({
        tabBarShowLabel: true,
        headerShown: false,
        tabBarIndicatorStyle: {
          backgroundColor: colors[theme].accent,
        },
        tabBarLabelStyle: {
          textTransform: 'none',
          fontSize: s(12),
          fontWeight: '500',
        },
        tabBarActiveTintColor: colors[theme].accent,
        tabBarInactiveTintColor: colors[theme].neutral,
        tabBarItemStyle: {
          margin: -s(5),
        },
        tabBarStyle: {
          elevation: 0,
          backgroundColor: colors[theme].background,
          marginHorizontal: s(10),
          borderBottomWidth: 1,
          borderBottomColor: colors[theme].secondary,
        },
      })}>
      <Tab.Screen
        name="Suggestions"
        component={Suggestions}
        options={{
          tabBarLabel: strings.title.suggestions,
        }}
      />
      <Tab.Screen
        name="FriendsList"
        component={FriendsList}
        options={{
          tabBarLabel: strings.title.friends,
        }}
      />
      <Tab.Screen
        name="Requests"
        component={Requests}
        options={{
          tabBarLabel: strings.title.requests,
        }}
      />
    </Tab.Navigator>
  );
};

export default FriendsNavBar;
