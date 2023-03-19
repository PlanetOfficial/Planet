import React from 'react';
import {
  Image,
  StyleSheet,
  Animated,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {CurvedBottomBar} from 'react-native-curved-bottom-bar';
import { s, vs } from 'react-native-size-matters';

import {colors} from '../../constants/theme';
import {tabIcons} from '../../constants/images';

import Trending from '../tabs/Trending';
import Friends from '../tabs/Friends';
import Library from '../tabs/Library';
import Profile from '../tabs/Profile';

const W = Dimensions.get('window').width;

export const NavBar = ({navigation}: {navigation: any}) => {
  const renderIcon = (routeName: string, selectedTab: string) => {
    let source: number;
    let focused: boolean = routeName === selectedTab;

    switch (routeName) {
      case 'Trending':
        source = focused ? tabIcons.trendingActive : tabIcons.trendingInactive;
        break;
      case 'Friends':
        source = focused ? tabIcons.friendsActive : tabIcons.friendsInactive;
        break;
      case 'Library':
        source = focused ? tabIcons.libraryActive : tabIcons.libraryInactive;
        break;
      case 'Profile':
        source = focused ? tabIcons.profileActive : tabIcons.profileInactive;
        break;
      default:
        source = -1;
        break;
    }

    return (
      <Image
        style={{
          marginLeft:
            routeName == 'Trending' || routeName == 'Library' ? 10 : 0,
          marginRight:
            routeName == 'Trending' || routeName == 'Library' ? 0 : 10,
          width: 30,
          height: 30,
          tintColor: focused ? colors.accent : colors.black,
        }}
        source={source}
      />
    );
  };

  return (
    <View style={styles.mainView}>
      <CurvedBottomBar.Navigator
        screenOptions={{headerShown: false}}
        height={64}
        circleWidth={56}
        bgColor={colors.fill}
        initialRouteName="trending"
        borderTopLeftRight={true}
        renderCircle={() => (
          <Animated.View style={styles.circle}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Event')}>
              <Image style={styles.plus} source={tabIcons.create} />
            </TouchableOpacity>
          </Animated.View>
        )}
        tabBar={({routeName, selectedTab, navigate}) => {
          return (
            <TouchableOpacity
              onPress={() => navigate(routeName)}
              style={styles.icon}>
              {renderIcon(routeName, selectedTab)}
            </TouchableOpacity>
          );
        }}>
        <CurvedBottomBar.Screen
          name="Trending"
          position={'LEFT'}
          component={Trending}
        />
        <CurvedBottomBar.Screen
          name="Friends"
          position={'LEFT'}
          component={Friends}
        />
        <CurvedBottomBar.Screen
          name="Library"
          position={'RIGHT'}
          component={Library}
        />
        <CurvedBottomBar.Screen
          name="Profile"
          position={'RIGHT'}
          component={Profile}
        />
      </CurvedBottomBar.Navigator>
    </View>
  );
};

export const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  plus: {
    width: 62,
    height: 62,
    tintColor: colors.accent,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    marginHorizontal: 20,
  },
});

export default NavBar;
