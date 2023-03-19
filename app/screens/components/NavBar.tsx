import React from 'react';
import {Image, View, TouchableOpacity} from 'react-native';
import {Svg, Circle, Line} from 'react-native-svg';
import {s} from 'react-native-size-matters';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {colors} from '../../constants/theme';
import {tabIcons} from '../../constants/images';

import Trending from '../tabs/Trending';
import Friends from '../tabs/Friends';
import Library from '../tabs/Library';
import Profile from '../tabs/Profile';

const Tab = createBottomTabNavigator();

export const NavBar = () => {
  const getIcon = (route: any, focused: boolean) => {
    let source: number;
    switch (route.name) {
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

    if (source !== -1) {
      return (
        <Image
          style={{
            width: s(24),
            height: s(24),
            tintColor: focused ? colors.accent : colors.darkgrey,
          }}
          source={source}
        />
      );
    }

    return (
      <Svg
        style={{
          position: 'absolute',
          width: s(49),
          height: s(49),
          top: -s(12),
        }}>
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
    <View style={{flex: 1}}>
      <Tab.Navigator
        initialRouteName="Trending"
        screenOptions={({route}: {route: any}) => ({
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: colors.grey,
          },
          tabBarIcon: ({focused}): any => {
            return getIcon(route, focused);
          },
        })}>
        <Tab.Screen name="Trending" component={Trending} />
        <Tab.Screen name="Friends" component={Friends} />
        <Tab.Screen
          name="Create"
          component={ButtonScreen}
          options={({navigation}) => ({
            tabBarButton: props => (
              <TouchableOpacity
                {...props}
                onPress={() => navigation.navigate('CreateStack')}
              />
            ),
          })}
        />
        <Tab.Screen name="Library" component={Library} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </View>
  );
};

export default NavBar;