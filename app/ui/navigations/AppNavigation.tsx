import React from 'react';
import {Animated, useColorScheme} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
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
import BlockedUsers from '../profileScreens/settingsScreens/BlockedUsers/BlockedUsers';
import Search from '../searchScreens/search/Search';
import CreateFG from '../friendsScreens/createFG/CreateFG';

import {BookmarkStateProvider} from '../../context/BookmarkContext';
import {FriendsStateProvider} from '../../context/FriendsContext';
import {LocationStateProvider} from '../../context/LocationContext';

import RootStackParamList from './RootStackParamList';
import colors from '../../constants/colors';

interface AppNavigationProps {
  isLoggedIn: boolean;
}

function TabStack() {
  return <NavBar />;
}

const Stack = createStackNavigator<RootStackParamList>();
const AppNavigation: React.FC<AppNavigationProps> = ({isLoggedIn}) => {
  const theme = useColorScheme() || 'light';
  return (
    <FriendsStateProvider isLoggedIn={isLoggedIn}>
      <BookmarkStateProvider isLoggedIn={isLoggedIn}>
        <LocationStateProvider isLoggedIn={isLoggedIn}>
          <NavigationContainer
            theme={{
              ...DefaultTheme,
              colors: {
                ...DefaultTheme.colors,
                background: colors[theme].background,
              },
            }}>
            <BottomSheetModalProvider>
              {isLoggedIn ? (
                <Stack.Navigator
                  initialRouteName="TabStack"
                  screenOptions={{
                    headerShown: false,
                  }}>
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
                  {blockedUsersScreen()}
                </Stack.Navigator>
              ) : (
                <Stack.Navigator
                  initialRouteName="Login"
                  screenOptions={{
                    headerShown: false,
                  }}>
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
                  {blockedUsersScreen()}
                </Stack.Navigator>
              )}
            </BottomSheetModalProvider>
          </NavigationContainer>
        </LocationStateProvider>
      </BookmarkStateProvider>
    </FriendsStateProvider>
  );
};

/* Below are stack screens so they don't have to be
   defined multiple times
*/

const loginStackScreen = () => {
  return <Stack.Screen name="Login" component={LoginScreen} />;
};

const signUpNameStackScreen = () => {
  return <Stack.Screen name="SignUpName" component={SignUpName} />;
};

const signUpCredsStackScreen = () => {
  return <Stack.Screen name="SignUpCreds" component={SignUpCreds} />;
};

const signUpPhoneStackScreen = () => {
  return <Stack.Screen name="SignUpPhone" component={SignUpPhone} />;
};

const signUpVerifyStackScreen = () => {
  return <Stack.Screen name="SignUpVerify" component={SignUpVerify} />;
};

const signUpInfoStackScreen = () => {
  return <Stack.Screen name="SignUpInfo" component={SignUpInfo} />;
};

const forgotPassStackScreen = () => {
  return <Stack.Screen name="ForgotPassword" component={ForgotPassword} />;
};

const forgotPassVerifyStackScreen = () => {
  return (
    <Stack.Screen name="ForgotPasswordVerify" component={ForgotPwdVerify} />
  );
};

const resetPasswordStackScreen = () => {
  return <Stack.Screen name="ResetPassword" component={ResetPwd} />;
};

const tabStack = () => {
  return <Stack.Screen name="TabStack" component={TabStack} />;
};

const searchCategoryScreen = () => {
  return <Stack.Screen name="SearchCategory" component={SearchCategory} />;
};

const searchMapScreen = () => {
  return (
    <Stack.Screen
      name="SearchMap"
      component={SearchMap}
      options={{
        presentation: 'modal',
        gestureEnabled: false,
      }}
    />
  );
};

const poiScreen = () => {
  return <Stack.Screen name="Poi" component={Poi} />;
};

const friendsScreen = () => {
  return <Stack.Screen name="Friends" component={Friends} />;
};

const createFGScreen = () => {
  return (
    <Stack.Screen
      name="CreateFG"
      component={CreateFG}
      options={{
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
        presentation: 'modal',
      }}
    />
  );
};

const userScreen = () => {
  return <Stack.Screen name="User" component={User} />;
};

const viewHistoryScreen = () => {
  return <Stack.Screen name="ViewHistory" component={ViewHistory} />;
};

const settingsScreen = () => {
  return <Stack.Screen name="Settings" component={Settings} />;
};

const accountSettingsScreen = () => {
  return <Stack.Screen name="AccountSettings" component={AccountSettings} />;
};

const contactUsScreen = () => {
  return <Stack.Screen name="ContactUs" component={ContactUs} />;
};

const locationsSettingsScreen = () => {
  return (
    <Stack.Screen name="LocationsSettings" component={LocationsSettings} />
  );
};

const notificationSettingsScreen = () => {
  return (
    <Stack.Screen
      name="NotificationSettings"
      component={NotificationSettings}
    />
  );
};

const privacySettingsScreen = () => {
  return <Stack.Screen name="PrivacySettings" component={PrivacySettings} />;
};

const profileSettingsScreen = () => {
  return <Stack.Screen name="ProfileSettings" component={ProfileSettings} />;
};

const createScreen = () => {
  return (
    <Stack.Screen
      name="Create"
      component={Create}
      options={{
        cardStyleInterpolator: verticalAnimation,
      }}
    />
  );
};

const eventScreen = () => {
  return <Stack.Screen name="Event" component={EventPage} />;
};

const eventSettingsScreen = () => {
  return <Stack.Screen name="EventSettings" component={EventSettings} />;
};

const rouletteScreen = () => {
  return <Stack.Screen name="Roulette" component={Roulette} />;
};

const spinHistoryScreen = () => {
  return (
    <Stack.Screen
      name="SpinHistory"
      component={SpinHistory}
      options={{
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
        cardStyleInterpolator: verticalAnimation,
      }}
    />
  );
};

const notificationsScreen = () => {
  return <Stack.Screen name="Notifications" component={Notifications} />;
};

const blockedUsersScreen = () => {
  return <Stack.Screen name="BlockedUsers" component={BlockedUsers} />;
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
