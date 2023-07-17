import React from 'react';
import {Animated} from 'react-native';
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
import SignUpVerify from '../authScreens/SignUpVerify';
import SignUpInfo from '../authScreens/SignUpInfo';
import ForgotPassword from '../authScreens/ForgotPwd';
import ForgotPwdVerify from '../authScreens/ForgotPwdVerify';
import ResetPwd from '../authScreens/ResetPwd';
import Create from '../createScreens/create/Create';
import SearchCategory from '../searchScreens/searchCategory/SearchCategory';
import SearchMap from '../searchScreens/searchMap/SearchMap';
import Poi from '../otherScreens/poi/Poi';
import Friends from '../friendsScreens/friends/Friends';
import AddFriend from '../friendsScreens/addFriend/AddFriend';
import User from '../friendsScreens/user/User';
import EventPage from '../libraryScreens/event/Event';
import Mutuals from '../friendsScreens/mutuals/Mutuals';
import ViewHistory from '../homeScreens/ViewHistory/ViewHistory';
import EventSettings from '../libraryScreens/eventSettings/EventSettings';
import Roulette from '../libraryScreens/roulette/Roulette';
import SpinHistory from '../libraryScreens/spinHistory/SpinHistory';
import Notifications from '../libraryScreens/notifications/Notifications';
import Settings from '../profileScreens/settingsScreens/Settings';
import AccountSettings from '../profileScreens/settingsScreens/AccountSettings';
import ContactUs from '../profileScreens/settingsScreens/ContactUs';
import LocationsSettings from '../profileScreens/settingsScreens/LocationsSettings';
import NotificationSettings from '../profileScreens/settingsScreens/NotificationSettings';
import PrivacySettings from '../profileScreens/settingsScreens/PrivacySettings';
import ProfileSettings from '../profileScreens/settingsScreens/ProfileSettings';
import Search from '../searchScreens/search/Search';
import CreateFG from '../friendsScreens/createFG/CreateFG';

import BookmarkStateProvider from '../../context/BookmarkState';
import FriendsStateProvider from '../../context/FriendsState';

import RootStackParamList from './RootStackParamList';

interface AppNavigationProps {
  isLoggedIn: boolean;
}

function TabStack() {
  return <NavBar />;
}

const Stack = createStackNavigator<RootStackParamList>();
const AppNavigation: React.FC<AppNavigationProps> = ({isLoggedIn}) => {
  return isLoggedIn ? (
    <FriendsStateProvider isLoggedIn={isLoggedIn}>
      <BookmarkStateProvider isLoggedIn={isLoggedIn}>
        <NavigationContainer>
          <BottomSheetModalProvider>
            <Stack.Navigator initialRouteName="TabStack">
              {tabStack()}
              {searchCategoryScreen()}
              {searchMapScreen()}
              {poiScreen()}
              {friendsScreen()}
              {createFGScreen()}
              {addFriendScreen()}
              {mutualsScreen()}
              {userScreen()}
              {viewHistoryScreen()}
              {settingsScreen()}
              {accountSettingsScreen()}
              {contactUsScreen()}
              {locationsSettingsScreen()}
              {notificationSettingsScreen()}
              {privacySettingsScreen()}
              {profileSettingsScreen()}
              {createScreen()}
              {modeSearchScreen()}
              {eventScreen()}
              {eventSettingsScreen()}
              {rouletteScreen()}
              {spinHistoryScreen()}
              {notificationsScreen()}
              {loginStackScreen()}
              {signUpNameStackScreen()}
              {signUpCredsStackScreen()}
              {signUpPhoneStackScreen()}
              {signUpVerifyStackScreen()}
              {signUpInfoStackScreen()}
              {forgotPassStackScreen()}
              {forgotPassVerifyStackScreen()}
              {resetPasswordStackScreen()}
            </Stack.Navigator>
          </BottomSheetModalProvider>
        </NavigationContainer>
      </BookmarkStateProvider>
    </FriendsStateProvider>
  ) : (
    <FriendsStateProvider isLoggedIn={isLoggedIn}>
      <BookmarkStateProvider isLoggedIn={isLoggedIn}>
        <NavigationContainer>
          <BottomSheetModalProvider>
            <Stack.Navigator initialRouteName="Login">
              {loginStackScreen()}
              {signUpNameStackScreen()}
              {signUpCredsStackScreen()}
              {signUpPhoneStackScreen()}
              {signUpVerifyStackScreen()}
              {signUpInfoStackScreen()}
              {forgotPassStackScreen()}
              {forgotPassVerifyStackScreen()}
              {resetPasswordStackScreen()}
              {tabStack()}
              {searchCategoryScreen()}
              {searchMapScreen()}
              {poiScreen()}
              {friendsScreen()}
              {createFGScreen()}
              {addFriendScreen()}
              {mutualsScreen()}
              {userScreen()}
              {viewHistoryScreen()}
              {settingsScreen()}
              {accountSettingsScreen()}
              {contactUsScreen()}
              {locationsSettingsScreen()}
              {notificationSettingsScreen()}
              {privacySettingsScreen()}
              {profileSettingsScreen()}
              {createScreen()}
              {modeSearchScreen()}
              {eventScreen()}
              {eventSettingsScreen()}
              {rouletteScreen()}
              {spinHistoryScreen()}
              {notificationsScreen()}
            </Stack.Navigator>
          </BottomSheetModalProvider>
        </NavigationContainer>
      </BookmarkStateProvider>
    </FriendsStateProvider>
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

const signUpVerifyStackScreen = () => {
  return (
    <Stack.Screen
      name="SignUpVerify"
      component={SignUpVerify}
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

const forgotPassStackScreen = () => {
  return (
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{headerShown: false}}
    />
  );
};

const forgotPassVerifyStackScreen = () => {
  return (
    <Stack.Screen
      name="ForgotPasswordVerify"
      component={ForgotPwdVerify}
      options={{headerShown: false}}
    />
  );
};

const resetPasswordStackScreen = () => {
  return (
    <Stack.Screen
      name="ResetPassword"
      component={ResetPwd}
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

const poiScreen = () => {
  return (
    <Stack.Screen
      name="Poi"
      component={Poi}
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
      }}
    />
  );
};

const createFGScreen = () => {
  return (
    <Stack.Screen
      name="CreateFG"
      component={CreateFG}
      options={{
        headerShown: false,
        presentation: 'modal',
      }}
    />
  );
};

const addFriendScreen = () => {
  return (
    <Stack.Screen
      name="AddFriend"
      component={AddFriend}
      options={{
        headerShown: false,
        presentation: 'modal',
      }}
    />
  );
};

const mutualsScreen = () => {
  return (
    <Stack.Screen
      name="Mutuals"
      component={Mutuals}
      options={{
        headerShown: false,
        presentation: 'modal',
      }}
    />
  );
};

const userScreen = () => {
  return (
    <Stack.Screen
      name="User"
      component={User}
      options={{
        headerShown: false,
      }}
    />
  );
};

const viewHistoryScreen = () => {
  return (
    <Stack.Screen
      name="ViewHistory"
      component={ViewHistory}
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

const accountSettingsScreen = () => {
  return (
    <Stack.Screen
      name="AccountSettings"
      component={AccountSettings}
      options={{
        headerShown: false,
      }}
    />
  );
};

const contactUsScreen = () => {
  return (
    <Stack.Screen
      name="ContactUs"
      component={ContactUs}
      options={{
        headerShown: false,
      }}
    />
  );
};

const locationsSettingsScreen = () => {
  return (
    <Stack.Screen
      name="LocationsSettings"
      component={LocationsSettings}
      options={{
        headerShown: false,
      }}
    />
  );
};

const notificationSettingsScreen = () => {
  return (
    <Stack.Screen
      name="NotificationSettings"
      component={NotificationSettings}
      options={{
        headerShown: false,
      }}
    />
  );
};

const privacySettingsScreen = () => {
  return (
    <Stack.Screen
      name="PrivacySettings"
      component={PrivacySettings}
      options={{
        headerShown: false,
      }}
    />
  );
};

const profileSettingsScreen = () => {
  return (
    <Stack.Screen
      name="ProfileSettings"
      component={ProfileSettings}
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

const eventScreen = () => {
  return (
    <Stack.Screen
      name="Event"
      component={EventPage}
      options={{
        headerShown: false,
      }}
    />
  );
};

const eventSettingsScreen = () => {
  return (
    <Stack.Screen
      name="EventSettings"
      component={EventSettings}
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

const spinHistoryScreen = () => {
  return (
    <Stack.Screen
      name="SpinHistory"
      component={SpinHistory}
      options={{
        headerShown: false,
        presentation: 'modal',
      }}
    />
  );
};

const modeSearchScreen = () => {
  return (
    <Stack.Screen
      name="ModeSearch"
      component={Search}
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
