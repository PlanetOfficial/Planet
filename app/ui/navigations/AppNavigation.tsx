import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import NavBar from './NavBar';
import RootStackParamList from './RootStackParamList';
import {verticalAnimation} from '../../utils/Misc';

import Welcome from '../authScreens/Welcome';
import Login from '../authScreens/Login';
import SignUpName from '../authScreens/SignUpName';
import SignUpBirthday from '../authScreens/SignUpBirthday';
import SignUpCreds from '../authScreens/SignUpCreds';
import SignUpPhone from '../authScreens/SignUpPhone';
import SignUpVerify from '../authScreens/SignUpVerify';
import SignUpInvite from '../authScreens/SignUpInvite';
import ResetPwd from '../authScreens/ResetPwd';
import ForgotPwd from '../authScreens/ForgotPwd';
import ForgotPwdVerify from '../authScreens/ForgotPwdVerify';

import Create from '../createScreens/create/Create';

import AddFriend from '../friendsScreens/addFriend/AddFriend';
import CreateFG from '../friendsScreens/createFG/CreateFG';
import Friends from '../friendsScreens/friends/Friends';
import Requests from '../friendsScreens/requests/Requests';
import User from '../friendsScreens/user/User';

import Event from '../libraryScreens/event/Event';
import EventChat from '../libraryScreens/eventChat/EventChat';
import EventSettings from '../libraryScreens/eventSettings/EventSettings';
import Notifications from '../libraryScreens/notifications/Notifications';
import Roulette from '../libraryScreens/roulette/Roulette';
import SpinHistory from '../libraryScreens/spinHistory/SpinHistory';

import Poi from '../otherScreens/poi/Poi';

import BlockedUsers from '../profileScreens/settingsScreens/BlockedUsers/BlockedUsers';
import AccountSettings from '../profileScreens/settingsScreens/AccountSettings';
import LocationsSettings from '../profileScreens/settingsScreens/LocationsSettings';
import NotificationSettings from '../profileScreens/settingsScreens/NotificationSettings';
import PrivacySettings from '../profileScreens/settingsScreens/PrivacySettings';
import ProfileSettings from '../profileScreens/settingsScreens/ProfileSettings';
import Settings from '../profileScreens/settingsScreens/Settings';

import Explore from '../exploreScreens/explore/Explore';
import AllCategories from '../exploreScreens/allCategories/AllCategories';
import SearchCategory from '../exploreScreens/searchCategory/SearchCategory';
import SetSearchLocation from '../exploreScreens/setSearchLocation/SetSearchLocation';

interface AppNavigationProps {
  isLoggedInStack: boolean;
}

function TabStack() {
  return <NavBar />;
}

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigation: React.FC<AppNavigationProps> = ({isLoggedInStack}) => {
  return isLoggedInStack ? (
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
  );
};

const authStackScreens = () => (
  <>
    <Stack.Screen name="Welcome" component={Welcome} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="SignUpName" component={SignUpName} />
    <Stack.Screen name="SignUpBirthday" component={SignUpBirthday} />
    <Stack.Screen name="SignUpCreds" component={SignUpCreds} />
    <Stack.Screen name="SignUpPhone" component={SignUpPhone} />
    <Stack.Screen name="SignUpVerify" component={SignUpVerify} />
    <Stack.Screen name="SignUpInvite" component={SignUpInvite} />
    <Stack.Screen name="ResetPwd" component={ResetPwd} />
    <Stack.Screen name="ForgotPwd" component={ForgotPwd} />
    <Stack.Screen name="ForgotPwdVerify" component={ForgotPwdVerify} />
  </>
);

const mainStackScreens = () => (
  <>
    <Stack.Screen name="TabStack" component={TabStack} />

    <Stack.Screen name="SearchCategory" component={SearchCategory} />
    <Stack.Screen
      name="SetSearchLocation"
      component={SetSearchLocation}
      options={{
        presentation: 'modal',
        gestureEnabled: false,
      }}
    />
    <Stack.Screen
      name="ModeExplore"
      component={Explore}
      options={{
        cardStyleInterpolator: verticalAnimation,
      }}
    />
    <Stack.Screen name="AllCategories" component={AllCategories} />

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
    <Stack.Screen name="Requests" component={Requests} />
    <Stack.Screen name="User" component={User} />

    <Stack.Screen name="BlockedUsers" component={BlockedUsers} />
    <Stack.Screen name="AccountSettings" component={AccountSettings} />
    <Stack.Screen name="LocationsSettings" component={LocationsSettings} />
    <Stack.Screen
      name="NotificationSettings"
      component={NotificationSettings}
    />
    <Stack.Screen name="PrivacySettings" component={PrivacySettings} />
    <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
    <Stack.Screen name="Settings" component={Settings} />

    <Stack.Screen
      name="Create"
      component={Create}
      options={{
        cardStyleInterpolator: verticalAnimation,
      }}
    />

    <Stack.Screen name="Event" component={Event} />
    <Stack.Screen
      name="EventChat"
      component={EventChat}
      options={{
        gestureEnabled: false,
      }}
    />
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
  </>
);

export default AppNavigation;
