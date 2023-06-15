import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  StackCardInterpolatedStyle,
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';
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
import CreateSearch from '../createScreens/CreateSearch';
import SearchCategory from '../searchScreens/SearchCategory';
import SearchMap from '../searchScreens/SearchMap';
import PoiDetail from '../otherScreens/PoiDetail';
import Friends from '../otherScreens/Friends';
import Explore from '../homeScreens/Explore';
import Event from '../libraryScreens/Event';
import Roulette from '../libraryScreens/Roulette';
import SuggestSearch from '../libraryScreens/SuggestSearch';
import Notifications from '../libraryScreens/Notifications';
import Settings from '../profileScreens/Settings';
import {Animated} from 'react-native';

interface AppNavigationProps {
  isLoggedIn: boolean;
}

function TabStack() {
  return <NavBar />;
}

const Stack = createStackNavigator();
const AppNavigation: React.FC<AppNavigationProps> = ({isLoggedIn}) => {
  return isLoggedIn ? (
    <NavigationContainer>
      <BottomSheetModalProvider>
        <Stack.Navigator initialRouteName="Main">
          {tabStack()}
          {searchCategoryScreen()}
          {searchMapScreen()}
          {poiDetailScreen()}
          {friendsScreen()}
          {exploreScreen()}
          {settingsScreen()}
          {createScreen()}
          {createSearchScreen()}
          {eventScreen()}
          {rouletteScreen()}
          {suggestSearchScreen()}
          {notificationsScreen()}
          {loginStackScreen()}
          {signUpNameStackScreen()}
          {signUpCredsStackScreen()}
          {signUpPhoneStackScreen()}
          {verifyPhoneStackScreen()}
          {signUpInfoStackScreen()}
          {forgetPassStackScreen()}
        </Stack.Navigator>
      </BottomSheetModalProvider>
    </NavigationContainer>
  ) : (
    <NavigationContainer>
      <BottomSheetModalProvider>
        <Stack.Navigator initialRouteName="Main">
          {loginStackScreen()}
          {signUpNameStackScreen()}
          {signUpCredsStackScreen()}
          {signUpPhoneStackScreen()}
          {verifyPhoneStackScreen()}
          {signUpInfoStackScreen()}
          {forgetPassStackScreen()}
          {tabStack()}
          {searchCategoryScreen()}
          {searchMapScreen()}
          {poiDetailScreen()}
          {friendsScreen()}
          {exploreScreen()}
          {settingsScreen()}
          {createScreen()}
          {createSearchScreen()}
          {eventScreen()}
          {rouletteScreen()}
          {suggestSearchScreen()}
          {notificationsScreen()}
        </Stack.Navigator>
      </BottomSheetModalProvider>
    </NavigationContainer>
  );
};

/* Below are stack screens so they don't have to be
   defined multiple times
*/

const loginStackScreen = () => {
  return (
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{headerShown: false}}
    />
  );
};

const signUpNameStackScreen = () => {
  return (
    <Stack.Screen
      name="SignUpName"
      component={SignUpName}
      options={{headerShown: false}}
    />
  );
};

const signUpCredsStackScreen = () => {
  return (
    <Stack.Screen
      name="SignUpCreds"
      component={SignUpCreds}
      options={{headerShown: false}}
    />
  );
};

const signUpPhoneStackScreen = () => {
  return (
    <Stack.Screen
      name="SignUpPhone"
      component={SignUpPhone}
      options={{headerShown: false}}
    />
  );
};

const verifyPhoneStackScreen = () => {
  return (
    <Stack.Screen
      name="VerifyPhone"
      component={VerifyPhone}
      options={{headerShown: false}}
    />
  );
};

const signUpInfoStackScreen = () => {
  return (
    <Stack.Screen
      name="SignUpInfo"
      component={SignUpInfo}
      options={{headerShown: false}}
    />
  );
};

const forgetPassStackScreen = () => {
  return (
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{headerShown: false}}
    />
  );
};

const tabStack = () => {
  return (
    <Stack.Screen
      name="TabStack"
      component={TabStack}
      options={{headerShown: false}}
    />
  );
};

const searchCategoryScreen = () => {
  return (
    <Stack.Screen
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
    <Stack.Screen
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
    <Stack.Screen
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
    <Stack.Screen
      name="Friends"
      component={Friends}
      options={{
        headerShown: false,
        presentation: 'modal',
      }}
    />
  );
};

const exploreScreen = () => {
  return (
    <Stack.Screen
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
    <Stack.Screen
      name="Settings"
      component={Settings}
      options={{
        headerShown: false,
      }}
    />
  );
};

const createScreen = () => {
  return (
    <Stack.Screen
      name="Create"
      component={Create}
      options={{
        headerShown: false,
        cardStyleInterpolator: verticalAnimation,
      }}
    />
  );
};

const createSearchScreen = () => {
  return (
    <Stack.Screen
      name="CreateSearch"
      component={CreateSearch}
      options={{
        headerShown: false,
        cardStyleInterpolator: verticalAnimation,
      }}
    />
  );
};

const eventScreen = () => {
  return (
    <Stack.Screen
      name="Event"
      component={Event}
      options={{
        headerShown: false,
      }}
    />
  );
};

const rouletteScreen = () => {
  return (
    <Stack.Screen
      name="Roulette"
      component={Roulette}
      options={{
        headerShown: false,
      }}
    />
  );
};

const suggestSearchScreen = () => {
  return (
    <Stack.Screen
      name="SuggestSearch"
      component={SuggestSearch}
      options={{
        headerShown: false,
        cardStyleInterpolator: verticalAnimation,
      }}
    />
  );
};

const notificationsScreen = () => {
  return (
    <Stack.Screen
      name="Notifications"
      component={Notifications}
      options={{
        headerShown: false,
      }}
    />
  );
};

const verticalAnimation = ({
  current,
  inverted,
  layouts: {screen},
}: StackCardInterpolationProps): StackCardInterpolatedStyle => {
  const translateFocused = Animated.multiply(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [screen.height, 0],
      extrapolate: 'clamp',
    }),
    inverted,
  );

  const overlayOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.07],
    extrapolate: 'clamp',
  });

  const shadowOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
    extrapolate: 'clamp',
  });

  return {
    cardStyle: {
      transform: [
        // Translation for the animation of the current card
        {translateY: translateFocused},
        // Translation for the animation of the card in back
        {translateY: 0},
      ],
    },
    overlayStyle: {opacity: overlayOpacity},
    shadowStyle: {shadowOpacity},
  };
};

export default AppNavigation;
