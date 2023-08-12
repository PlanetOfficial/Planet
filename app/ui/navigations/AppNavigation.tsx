import React from 'react';
import {useColorScheme} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import NavBar from './NavBar';
import Welcome from '../authScreens/Welcome';
import LoginScreen from '../authScreens/Login';
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
import {verticalAnimation} from '../../utils/Misc';

interface AppNavigationProps {
  isLoggedInStack: boolean;
}

function TabStack() {
  return <NavBar />;
}

const Stack = createStackNavigator<RootStackParamList>();
const AppNavigation: React.FC<AppNavigationProps> = ({isLoggedInStack}) => {
  const theme = useColorScheme() || 'light';
  return (
    <FriendsStateProvider isLoggedInStack={isLoggedInStack}>
      <BookmarkStateProvider isLoggedInStack={isLoggedInStack}>
        <LocationStateProvider isLoggedInStack={isLoggedInStack}>
          <NavigationContainer
            theme={{
              ...DefaultTheme,
              colors: {
                ...DefaultTheme.colors,
                background: colors[theme].background,
              },
            }}>
            <BottomSheetModalProvider>
              {isLoggedInStack ? (
                <Stack.Navigator
                  initialRouteName="TabStack"
                  screenOptions={{
                    headerShown: false,
                  }}>
                  {mainStackScreens()}
                  {authStackScreens()}
                </Stack.Navigator>
              ) : (
                <Stack.Navigator
                  initialRouteName="Welcome"
                  screenOptions={{
                    headerShown: false,
                  }}>
                  {authStackScreens()}
                  {mainStackScreens()}
                </Stack.Navigator>
              )}
            </BottomSheetModalProvider>
          </NavigationContainer>
        </LocationStateProvider>
      </BookmarkStateProvider>
    </FriendsStateProvider>
  );
};

const authStackScreens = () => (
  <>
    <Stack.Screen name="Welcome" component={Welcome} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUpName" component={SignUpName} />
    <Stack.Screen name="SignUpCreds" component={SignUpCreds} />
    <Stack.Screen name="SignUpPhone" component={SignUpPhone} />
    <Stack.Screen name="SignUpVerify" component={SignUpVerify} />
    <Stack.Screen name="SignUpInfo" component={SignUpInfo} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    <Stack.Screen name="ForgotPasswordVerify" component={ForgotPwdVerify} />
    <Stack.Screen name="ResetPassword" component={ResetPwd} />
  </>
);

const mainStackScreens = () => (
  <>
    <Stack.Screen name="TabStack" component={TabStack} />
    <Stack.Screen name="SearchCategory" component={SearchCategory} />
    <Stack.Screen
      name="SearchMap"
      component={SearchMap}
      options={{
        presentation: 'modal',
        gestureEnabled: false,
      }}
    />
    <Stack.Screen name="Poi" component={Poi} />
    <Stack.Screen name="Friends" component={Friends} />
    <Stack.Screen
      name="CreateFG"
      component={CreateFG}
      options={{
        presentation: 'modal',
      }}
    />
    <Stack.Screen
      name="AddFriend"
      component={AddFriend}
      options={{
        presentation: 'modal',
      }}
    />
    <Stack.Screen
      name="Mutuals"
      component={Mutuals}
      options={{
        presentation: 'modal',
      }}
    />
    <Stack.Screen name="User" component={User} />
    <Stack.Screen name="ViewHistory" component={ViewHistory} />
    <Stack.Screen name="Settings" component={Settings} />
    <Stack.Screen name="AccountSettings" component={AccountSettings} />
    <Stack.Screen name="ContactUs" component={ContactUs} />
    <Stack.Screen name="LocationsSettings" component={LocationsSettings} />
    <Stack.Screen
      name="NotificationSettings"
      component={NotificationSettings}
    />
    <Stack.Screen name="PrivacySettings" component={PrivacySettings} />
    <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
    <Stack.Screen
      name="Create"
      component={Create}
      options={{
        cardStyleInterpolator: verticalAnimation,
      }}
    />
    <Stack.Screen
      name="ModeSearch"
      component={Search}
      options={{
        cardStyleInterpolator: verticalAnimation,
      }}
    />
    <Stack.Screen name="Event" component={EventPage} />
    <Stack.Screen name="EventSettings" component={EventSettings} />
    <Stack.Screen name="Roulette" component={Roulette} />
    <Stack.Screen
      name="SpinHistory"
      component={SpinHistory}
      options={{
        presentation: 'modal',
      }}
    />
    <Stack.Screen name="Notifications" component={Notifications} />
    <Stack.Screen name="BlockedUsers" component={BlockedUsers} />
  </>
);

export default AppNavigation;
