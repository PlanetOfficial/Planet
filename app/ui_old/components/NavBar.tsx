import React from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';

import {Svg, Circle, Line} from 'react-native-svg';
import {s} from 'react-native-size-matters';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {colors} from '../../constants/colors';
import {tabIcons} from '../../constants/icons';

import Trending from '../trendingScreens/Trending';
import Groups from '../groupScreens/Groups';
import Library from '../libraryScreens/Library';
import Profile from '../profileScreens/Profile';

const Tab = createBottomTabNavigator();

export const NavBar = () => {
  const getIcon = (route: any, focused: boolean) => {
    let source: number;
    switch (route.name) {
      case 'Trending':
        source = focused ? tabIcons.trendingActive : tabIcons.trendingInactive;
        break;
      case 'Groups':
        source = focused ? tabIcons.groupsActive : tabIcons.groupsInactive;
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

    if (source !== -1) {
      return (
        <Image
          style={[
            styles.icon,
            {tintColor: focused ? colors.accent : colors.darkgrey},
          ]}
          source={source}
        />
      );
    }

    return (
      <Svg style={styles.button}>
        <Circle cx={s(24)} cy={s(24)} r={s(24)} fill={colors.accent} />
        <Line
          x1={s(24)}
          y1={s(16)}
          x2={s(24)}
          y2={s(32)}
          stroke={colors.white}
          strokeWidth={3}
          strokeLinecap={'round'}
        />
        <Line
          x1={s(16)}
          y1={s(24)}
          x2={s(32)}
          y2={s(24)}
          stroke={colors.white}
          strokeWidth={3}
          strokeLinecap={'round'}
        />
      </Svg>
    );
  };

  const ButtonScreen = () => null;

  return (
    <View style={styles.tabView}>
      <Tab.Navigator
        initialRouteName="Trending"
        screenOptions={({route}: {route: any}) => ({
          tabBarShowLabel: false,
          headerShown: false,
          tabBarTestID: route.name,
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: colors.grey,
            backgroundColor: colors.white,
          },
          tabBarIcon: ({focused}) => {
            return getIcon(route, focused);
          },
        })}>
        <Tab.Screen name="Trending" component={Trending} />
        <Tab.Screen name="Groups" component={Groups} />
        <Tab.Screen
          name="Create"
          component={ButtonScreen}
          options={({navigation}) => ({
            tabBarButton: props => Button(props, navigation),
          })}
        />
        <Tab.Screen name="Library" component={Library} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </View>
  );
};

const Button = (props: any, navigation: any) => (
  <Pressable
    {...props}
    onPress={() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'MapSelection'}],
      });
    }}
  />
);

const styles = StyleSheet.create({
  tabView: {
    flex: 1,
  },
  icon: {
    width: s(24),
    height: s(24),
  },
  button: {
    position: 'absolute',
    width: s(49),
    height: s(49),
    top: -s(12),
  },
});

export default NavBar;
