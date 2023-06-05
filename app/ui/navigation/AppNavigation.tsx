import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import NavBar from './NavBar';
import LoginScreen from '../authScreens/LogIn';
import SignUp from '../authScreens/SignUp';
import ForgotPassword from '../authScreens/!ForgotPwd';
import Create from '../createScreens/Create';
import SearchByCategory from '../searchScreens/SearchByCategory';
import PoiDetail from '../otherScreens/PoiDetail';

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
          {signUpStackScreen()}
          {forgetPassStackScreen()}
          {createScreen()}
          {searchByCategoryScreen()}
          {poiDetailScreen()}
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
          {createScreen()}
          {searchByCategoryScreen()}
          {poiDetailScreen()}
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

const searchByCategoryScreen = () => {
  return (
    <MainStack.Screen
      name="SearchByCategory"
      component={SearchByCategory}
      options={{
        headerShown: false,
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

export default AppNavigation;
