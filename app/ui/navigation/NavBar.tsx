import React from 'react';
import {
  Image,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {Svg, Circle, Line} from 'react-native-svg';
import {s} from 'react-native-size-matters';
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import colors from '../../constants/colors';

import Home from '../homeScreens/Home';
import Search from '../searchScreens/Search';
import Library from '../libraryScreens/Library';
import Profile from '../profileScreens/Profile';

const Tab = createBottomTabNavigator();

export const NavBar = () => {
  const getIcon = (name: string, focused: boolean) => {
    let source: number;
    switch (name) {
      case 'Home':
        source = focused
          ? require('../../assets/tabIcons/home-2.png')
          : require('../../assets/tabIcons/home.png');
        break;
      case 'Search':
        source = focused
          ? require('../../assets/tabIcons/search-2.png')
          : require('../../assets/tabIcons/search.png');
        break;
      case 'Library':
        source = focused
          ? require('../../assets/tabIcons/library-2.png')
          : require('../../assets/tabIcons/library.png');
        break;
      case 'Profile':
        source = focused
          ? require('../../assets/tabIcons/profile-2.png')
          : require('../../assets/tabIcons/profile.png');
        break;
      default:
        source = -1;
        break;
    }

    if (source !== -1) {
      return (
        <View style={styles.tabIcon}>
          <Image
            style={[
              styles.icon,
              {tintColor: focused ? colors.accent : colors.darkgrey},
            ]}
            source={source}
          />
          <Text style={[styles.name, focused ? styles.bold : undefined]}>
            {name}
          </Text>
        </View>
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
          strokeWidth={s(2)}
          strokeLinecap={'round'}
        />
        <Line
          x1={s(16)}
          y1={s(24)}
          x2={s(32)}
          y2={s(24)}
          stroke={colors.white}
          strokeWidth={s(2)}
          strokeLinecap={'round'}
        />
      </Svg>
    );
  };

  const ButtonScreen = () => null;

  return (
    <View style={styles.tabView}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({route}: {route: {name: string}}) => ({
          tabBarShowLabel: false,
          headerShown: false,
          tabBarTestID: route.name,
          tabBarStyle: {
            borderTopWidth: 0.5,
            borderTopColor: colors.lightgrey,
            backgroundColor: colors.white,
          },
          tabBarIcon: ({focused}) => {
            return getIcon(route.name, focused);
          },
        })}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen
          name="Plus"
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

const Button = (
  props:
    | BottomTabBarButtonProps
    | (JSX.IntrinsicAttributes & PressableProps & React.RefAttributes<View>),
  navigation: {navigate: (arg0: string) => void},
) => (
  <Pressable
    {...props}
    onPress={() => {
      navigation.navigate('Create');
    }}
  />
);

const styles = StyleSheet.create({
  tabView: {
    flex: 1,
  },
  tabIcon: {
    alignItems: 'center',
    paddingTop: s(5),
  },
  icon: {
    width: s(21),
    height: s(21),
  },
  name: {
    marginTop: s(5),
    fontSize: s(9),
    fontWeight: '400',
    fontFamily: 'Lato',
    color: colors.darkgrey,
  },
  bold: {
    fontWeight: '700',
  },
  button: {
    position: 'absolute',
    width: s(50),
    height: s(50),
    top: -s(10),
  },
});

export default NavBar;
