import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import NavBar from './NavBar';
import LoginScreen from '../authScreens/LogIn';
import SignUpName from '../authScreens/SignUpName';
import SignUpCreds from '../authScreens/SignUpCreds';
import SignUpPhone from '../authScreens/SignUpPhone';
import VerifyPhone from '../authScreens/VerifyPhone';
import SignUpInfo from '../authScreens/SignUpInfo';
import ForgotPassword from '../authScreens/!ForgotPwd';
import Create from '../createScreens/Create';
import SearchCategory from '../searchScreens/SearchCategory';
import SearchMap from '../searchScreens/SearchMap';
import PoiDetail from '../otherScreens/PoiDetail';
import Friends from '../otherScreens/Friends';
import Explore from '../homeScreens/Explore';
import Settings from '../profileScreens/Settings';

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
          {loginStackScreen()}
          {signUpNameStackScreen()}
          {signUpCredsStackScreen()}
          {signUpPhoneStackScreen()}
          {verifyPhoneStackScreen()}
          {signUpInfoStackScreen()}
          {forgetPassStackScreen()}
          {createScreen()}
          {searchCategoryScreen()}
          {searchMapScreen()}
          {poiDetailScreen()}
          {friendsScreen()}
          {exploreScreen()}
          {settingsScreen()}
        </MainStack.Navigator>
      </BottomSheetModalProvider>
    </NavigationContainer>
  ) : (
    <NavigationContainer>
      <BottomSheetModalProvider>
        <MainStack.Navigator initialRouteName="Main">
          {loginStackScreen()}
          {signUpNameStackScreen()}
          {signUpCredsStackScreen()}
          {signUpPhoneStackScreen()}
          {verifyPhoneStackScreen()}
          {signUpInfoStackScreen()}
          {forgetPassStackScreen()}
          {tabStack()}
          {createScreen()}
          {searchCategoryScreen()}
          {searchMapScreen()}
          {poiDetailScreen()}
          {friendsScreen()}
          {exploreScreen()}
          {settingsScreen()}
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

const signUpNameStackScreen = () => {
  return (
    <MainStack.Screen
      name="SignUpName"
      component={SignUpName}
      options={{headerShown: false}}
    />
  );
};

const signUpCredsStackScreen = () => {
  return (
    <MainStack.Screen
      name="SignUpCreds"
      component={SignUpCreds}
      options={{headerShown: false}}
    />
  );
};

const signUpPhoneStackScreen = () => {
  return (
    <MainStack.Screen
      name="SignUpPhone"
      component={SignUpPhone}
      options={{headerShown: false}}
    />
  );
};

const verifyPhoneStackScreen = () => {
  return (
    <MainStack.Screen
      name="VerifyPhone"
      component={VerifyPhone}
      options={{headerShown: false}}
    />
  );
};

const signUpInfoStackScreen = () => {
  return (
    <MainStack.Screen
      name="SignUpInfo"
      component={SignUpInfo}
      options={{headerShown: false}}
    />
  );
};

const forgetPassStackScreen = () => {
  return (
    <MainStack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{headerShown: false}}
    />
  );
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

const createScreen = () => {
  return (
    <MainStack.Screen
      name="Create"
      component={Create}
      options={{
        headerShown: false,
        presentation: 'modal',
      }}
    />
  );
};

const searchCategoryScreen = () => {
  return (
    <MainStack.Screen
      name="SearchCategory"
      component={SearchCategory}
      options={{
        headerShown: false,
      }}
    />
  );
};

const searchMapScreen = () => {
  return (
    <MainStack.Screen
      name="SearchMap"
      component={SearchMap}
      options={{
        headerShown: false,
        presentation: 'modal',
        gestureEnabled: false,
      }}
    />
  );
};

const poiDetailScreen = () => {
  return (
    <MainStack.Screen
      name="PoiDetail"
      component={PoiDetail}
      options={{
        headerShown: false,
      }}
    />
  );
};

const friendsScreen = () => {
  return (
    <MainStack.Screen
      name="Friends"
      component={Friends}
      options={{
        headerShown: false,
      }}
    />
  );
};

const exploreScreen = () => {
  return (
    <MainStack.Screen
      name="Explore"
      component={Explore}
      options={{
        headerShown: false,
      }}
    />
  );
};

const settingsScreen = () => {
  return (
    <MainStack.Screen
      name="Settings"
      component={Settings}
      options={{
        headerShown: false,
      }}
    />
  );
};

export default AppNavigation;
