import React from 'react';
import {s} from 'react-native-size-matters';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import colors from '../../constants/colors';

import FriendsList from '../friendsScreens/friendsList/FriendsList';
import Requests from '../friendsScreens/requests/Requests';
import Suggestions from '../friendsScreens/suggestions/Suggestions';

const Tab = createMaterialTopTabNavigator();
export const FriendsNavBar = () => {
  return (
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
  );
};

export default FriendsNavBar;
