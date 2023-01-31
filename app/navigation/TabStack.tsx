import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TrendingScreen from '../screens/TrendingScreen';
import FriendScreen from '../screens/FriendScreen'
import CreatePlan from '../screens/CreatePlan'
import Library from '../screens/Library'
import Settings from '../screens/Settings'

const Tab = createBottomTabNavigator();

function TabStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Trending" component={TrendingScreen} />
      <Tab.Screen name="Friend Groups" component={FriendScreen} />
      <Tab.Screen name="Create" component={CreatePlan} />
      <Tab.Screen name="Library" component={Library} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

export default TabStack;