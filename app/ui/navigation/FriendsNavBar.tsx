import React from 'react';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';

import FriendsList from '../friendsScreens/FriendsList';
import Requests from '../friendsScreens/Requests';
import Suggestions from '../friendsScreens/Suggestions';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();
export const NavBar = () => {
  return (
    <Tab.Navigator
      initialRouteName="FriendsList"
      screenOptions={() => ({
        tabBarShowLabel: true,
        headerShown: false,
        tabBarIndicatorStyle: {
          backgroundColor: colors.accent,
        },
        tabBarLabelStyle: {
          textTransform: 'none',
          fontSize: s(12),
          fontWeight: '500',
        },
        tabBarItemStyle: {
          margin: -s(5),
        },
        tabBarStyle: {
          backgroundColor: colors.white,
          marginHorizontal: s(20),
        },
      })}>
      <Tab.Screen name="Suggestions" component={Suggestions} />
      <Tab.Screen name="FriendsList" component={FriendsList} />
      <Tab.Screen name="Requests" component={Requests} />
    </Tab.Navigator>
  );
};

export default NavBar;
