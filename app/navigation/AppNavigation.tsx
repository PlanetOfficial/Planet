import React from 'react';
import {TouchableOpacity} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/LoginScreen';
import TrendingScreen from '../screens/TrendingScreen';
import FriendScreen from '../screens/FriendScreen'
import CreatePlan from '../screens/CreatePlan';
import Library from '../screens/Library'
import Settings from '../screens/Settings'
import MapSelection from '../screens/MapSelection';

const PlanCreationStack = createStackNavigator();
function CreatePlanStack() {
  return (
    <PlanCreationStack.Navigator initialRouteName="Create" >
        <PlanCreationStack.Screen name="CreatePlan" component={CreatePlan} options={ {headerShown: false} } />
        <PlanCreationStack.Screen name="MapSelection" component={MapSelection} options={ {headerShown: false} }/>
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
        <MainStack.Screen name="TabStack" component={TabStack} options={{ headerShown: false }}/>
        <MainStack.Screen name="CreateStack" component={CreatePlanStack} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
