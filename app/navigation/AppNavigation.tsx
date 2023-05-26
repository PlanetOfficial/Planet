import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import NavBar from '../ui/components/NavBar';
import LoginScreen from '../ui/authScreens/LogIn';
import SignUp from '../ui/authScreens/SignUp';
import ForgotPassword from '../ui/authScreens/!ForgotPwd';
import MapSelection from '../ui/createScreens/MapSelection';
import SelectCategories from '../ui/createScreens/SelectCategories';
import SelectDestinations from '../ui/createScreens/SelectDestinations';
import Place from '../ui/libraryScreens/Place';
import Event from '../ui/libraryScreens/Event';
import GroupEvent from '../ui/friendsScreens/FGEvent';
import Settings from '../ui/profileScreens/Settings';
import CreateGroup from '../ui/friendsScreens/CreateFG';
import EditGroup from '../ui/friendsScreens/EditFG';
import LiveCategory from '../ui/trendingScreens/LiveCategory';
import LiveCategorySettings from '../ui/trendingScreens/LiveCategorySettings';

interface AppNavigationProps {
  isLoggedIn: boolean;
}

function TabStack() {
  return <NavBar />;
}

const MainStack = createStackNavigator();
const AppNavigation: React.FC<AppNavigationProps> = ({isLoggedIn}) => {
  return isLoggedIn ? (
    <NavigationContainer>
      <BottomSheetModalProvider>
        <MainStack.Navigator initialRouteName="Main">
          {tabStack()}
          {placeStackScreen()}
          {eventStackScreen()}
          {groupEventStackScreen()}
          {settingsStackScreen()}
          {createGroupStackScreen()}
          {editGroupStackScreen()}
          {mapSelectionScreen()}
          {selectCategoriesScreen()}
          {selectDestinationsScreen()}
          {liveCategoryStackScreen()}
          {liveCategorySettingsStackScreen()}
          {loginStackScreen()}
          {signUpStackScreen()}
          {forgetPassStackScreen()}
        </MainStack.Navigator>
      </BottomSheetModalProvider>
    </NavigationContainer>
  ) : (
    <NavigationContainer>
      <BottomSheetModalProvider>
        <MainStack.Navigator initialRouteName="Main">
          {loginStackScreen()}
          {signUpStackScreen()}
          {forgetPassStackScreen()}
          {tabStack()}
          {placeStackScreen()}
          {eventStackScreen()}
          {groupEventStackScreen()}
          {settingsStackScreen()}
          {createGroupStackScreen()}
          {editGroupStackScreen()}
          {mapSelectionScreen()}
          {selectCategoriesScreen()}
          {selectDestinationsScreen()}
          {liveCategoryStackScreen()}
          {liveCategorySettingsStackScreen()}
        </MainStack.Navigator>
      </BottomSheetModalProvider>
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

const mapSelectionScreen = () => {
  return (
    <MainStack.Screen
      name="MapSelection"
      component={MapSelection}
      options={{headerShown: false}}
    />
  );
};

const selectCategoriesScreen = () => {
  return (
    <MainStack.Screen
      name="SelectCategories"
      component={SelectCategories}
      options={{headerShown: false}}
    />
  );
};

const selectDestinationsScreen = () => {
  return (
    <MainStack.Screen
      name="SelectDestinations"
      component={SelectDestinations}
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

const groupEventStackScreen = () => {
  return (
    <MainStack.Screen
      name="GroupEvent"
      component={GroupEvent}
      options={{headerShown: false}}
    />
  );
};

const liveCategoryStackScreen = () => {
  return (
    <MainStack.Screen
      name="LiveCategory"
      component={LiveCategory}
      options={{headerShown: false}}
    />
  );
};

const liveCategorySettingsStackScreen = () => {
  return (
    <MainStack.Screen
      name="LiveCategorySettings"
      component={LiveCategorySettings}
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

const createGroupStackScreen = () => {
  return (
    <MainStack.Screen
      name="CreateGroup"
      component={CreateGroup}
      options={{headerShown: false}}
    />
  );
};

const editGroupStackScreen = () => {
  return (
    <MainStack.Screen
      name="EditGroup"
      component={EditGroup}
      options={{headerShown: false}}
    />
  );
};

export default AppNavigation;
