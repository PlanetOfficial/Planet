import React from 'react';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';

import Friends from '../friendsScreens/Friends';
import Requests from '../friendsScreens/Requests';
import Suggestions from '../friendsScreens/Suggestions';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();
export const NavBar = () => {
  return (
    <Tab.Navigator
      initialRouteName="Suggestions"
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
      <Tab.Screen name="Friends" component={Friends} />
      <Tab.Screen name="Requests" component={Requests} />
    </Tab.Navigator>
  );
};

export default NavBar;
