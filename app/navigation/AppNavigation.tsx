import React from 'react';
import {Image, TouchableOpacity} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/auth/LoginScreen';
import SignUp from '../screens/auth/SignUp';
import TrendingScreen from '../screens/Tabs/TrendingScreen';
import FriendScreen from '../screens/Tabs/FriendScreen'
import Library from '../screens/Tabs/Library'
import Settings from '../screens/Tabs/Settings'
import MapSelection from '../screens/Tabs/CreateScreens/MapSelection';
import SelectGenres from '../screens/Tabs/CreateScreens/SelectGenres';
import SelectDestinations from '../screens/Tabs/CreateScreens/SelectDestinations';
import SelectCategories from '../screens/Tabs/CreateScreens/SelectCategories';
import FinalizePlan from '../screens/Tabs/CreateScreens/FinalizePlan';
import DestinationDetails from '../screens/Tabs/CreateScreens/DestinationDetails'

const PlanCreationStack = createStackNavigator();
function CreatePlanStack() {
  return (
    <PlanCreationStack.Navigator initialRouteName="Create" >
      <PlanCreationStack.Screen name="MapSelection" component={MapSelection} options={{ headerShown: false }} />
      <PlanCreationStack.Screen name="SelectGenres" component={SelectGenres} options={ {headerShown: false} }/>
      <PlanCreationStack.Screen name="SelectCategories" component={SelectCategories} options={ {headerShown: false} }/>
      <PlanCreationStack.Screen name="SelectDestinations" component={SelectDestinations} options={ {headerShown: false} }/>
      <PlanCreationStack.Screen name="DestinationDetails" component={DestinationDetails} options={ {headerShown: false} }/>
      <PlanCreationStack.Screen name="FinalizePlan" component={FinalizePlan} options={ {headerShown: false} }/>
    </PlanCreationStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
function TabStack({navigation}) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Trending" component={TrendingScreen} />
      <Tab.Screen name="Friend Groups" component={FriendScreen} />
      <Tab.Screen name="Create" component={CreatePlanStack} options={{
        tabBarButton: props => (
          <TouchableOpacity {...props} onPress={() => navigation.navigate("CreateStack")} />
        )
      }}/>
      <Tab.Screen name="Library" component={Library} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

const MainStack = createStackNavigator();
function AppNavigation() {
  return (
    <NavigationContainer>
      <MainStack.Navigator initialRouteName="Main">
        <MainStack.Screen name="Login" component={LoginScreen} />
        <MainStack.Screen name="SignUp" component={SignUp} />
        <MainStack.Screen name="TabStack" component={TabStack} options={{ headerShown: false }}/>
        <MainStack.Screen name="CreateStack" component={CreatePlanStack} options={ { headerShown: false} }/>
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
