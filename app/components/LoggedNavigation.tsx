import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import NavBar from '../screens/components/NavBar';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUp from '../screens/auth/SignUp';
import ForgotPassword from '../screens/auth/ForgotPassword';
import MapSelection from '../screens/createScreens/MapSelection';
import SelectGenres from '../screens/createScreens/SelectGenres';
import SelectDestinations from '../screens/createScreens/SelectDestinations';
import FinalizePlan from '../screens/createScreens/FinalizePlan';
import DestinationDetails from '../screens/createScreens/DestinationDetails';
import Place from '../screens/components/Place';
import Settings from '../screens/components/Settings';

const PlanCreationStack = createStackNavigator();
function CreatePlanStack() {
  return (
    <PlanCreationStack.Navigator initialRouteName="Create">
      <PlanCreationStack.Screen
        name="MapSelection"
        component={MapSelection}
        options={{headerShown: false}}
      />
      <PlanCreationStack.Screen
        name="SelectGenres"
        component={SelectGenres}
        options={{headerShown: false}}
      />
      <PlanCreationStack.Screen
        name="SelectDestinations"
        component={SelectDestinations}
        options={{headerShown: false}}
      />
      <PlanCreationStack.Screen
        name="DestinationDetails"
        component={DestinationDetails}
        options={{headerShown: false}}
      />
      <PlanCreationStack.Screen
        name="FinalizePlan"
        component={FinalizePlan}
        options={{headerShown: false}}
      />
    </PlanCreationStack.Navigator>
  );
}

function TabStack({navigation}) {
  return <NavBar navigation={navigation} />;
}

const MainStack = createStackNavigator();
function LoggedNavigation() {
  return (
    <NavigationContainer>
      <MainStack.Navigator initialRouteName="Main">
        <MainStack.Screen
          name="TabStack"
          component={TabStack}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="CreateStack"
          component={CreatePlanStack}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="Place"
          component={Place}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="Settings"
          component={Settings}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <MainStack.Screen name="SignUp" component={SignUp} />
        <MainStack.Screen name="ForgotPassword" component={ForgotPassword} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

export default LoggedNavigation;
