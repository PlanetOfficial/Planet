import React from 'react';
import {
  Image,
  StyleSheet,
  Animated,
  View,
  TouchableOpacity,
} from 'react-native';
// TODO: index.js to clean up imports
import Trending from './Trending';
import Friends from './Friends';
import Library from './Library';
import Settings from './Settings';
import {tabIcons} from '../../constants/images';
import {colors} from '../../constants/colors';
import {CurvedBottomBar} from 'react-native-curved-bottom-bar';

export const NavBar = ({navigation}) => {
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
      case 'Settings':
        source = focused ? tabIcons.settingsActive : tabIcons.settingsInactive;
        break;
      default:
        source = -1;
        break;
    }

    return (
      <Image
        style={{
          width: 30,
          height: 30,
          tintColor: focused ? colors.accent : colors.black,
        }}
        source={source}
      />
    );
  };

  return (
    <View style={styles.tabView}>
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
              onPress={() => navigation.navigate('CreateStack')}>
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
          name="Settings"
          position={'RIGHT'}
          component={Settings}
        />
      </CurvedBottomBar.Navigator>
    </View>
  );
};

export const styles = StyleSheet.create({
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    bottom: 25,
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
  tabView: {
    flex: 1,
  },
});

export default NavBar;
