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
import Event from '../screens/components/Event';
import Settings from '../screens/components/Settings';

interface AppNavigationProps {
  isLoggedIn: boolean;
}

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

function TabStack({navigation}: {navigation: any}) {
  return <NavBar navigation={navigation} />;
}

const MainStack = createStackNavigator();
const AppNavigation: React.FC<AppNavigationProps> = ({isLoggedIn}) => {
  return isLoggedIn ? (
    <NavigationContainer>
      <MainStack.Navigator initialRouteName="Main">
        {tabStack()}
        {createStack()}
        {placeStackScreen()}
        {eventStackScreen()}
        {settingsStackScreen()}
        {loginStackScreen()}
        {signUpStackScreen()}
        {forgetPassStackScreen()}
      </MainStack.Navigator>
    </NavigationContainer>
  ) : (
    <NavigationContainer>
      <MainStack.Navigator initialRouteName="Main">
        {loginStackScreen()}
        {signUpStackScreen()}
        {forgetPassStackScreen()}
        {tabStack()}
        {createStack()}
        {placeStackScreen()}
        {eventStackScreen()}
        {settingsStackScreen()}
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

/* Below are stack screens so they don't have to be
   defined multiple times
*/

const loginStackScreen = () => {
  return (
    <MainStack.Screen
      name="Login"
      component={LoginScreen}
      options={{headerShown: false}}
    />
  );
};

const signUpStackScreen = () => {
  return (
    <MainStack.Screen
      name="SignUp"
      component={SignUp}
      options={{headerShown: false}}
    />
  );
};

const forgetPassStackScreen = () => {
  return <MainStack.Screen name="ForgotPassword" component={ForgotPassword} />;
};

const tabStack = () => {
  return (
    <MainStack.Screen
      name="TabStack"
      component={TabStack}
      options={{headerShown: false}}
    />
  );
};

const createStack = () => {
  return (
    <MainStack.Screen
      name="CreateStack"
      component={CreatePlanStack}
      options={{headerShown: false}}
    />
  );
};

const placeStackScreen = () => {
  return (
    <MainStack.Screen
      name="Place"
      component={Place}
      options={{headerShown: false}}
    />
  );
};

const eventStackScreen = () => {
  return (
    <MainStack.Screen
      name="Event"
      component={Event}
      options={{headerShown: false}}
    />
  );
};

const settingsStackScreen = () => {
  return (
    <MainStack.Screen
      name="Settings"
      component={Settings}
      options={{headerShown: false}}
    />
  );
};

export default AppNavigation;
