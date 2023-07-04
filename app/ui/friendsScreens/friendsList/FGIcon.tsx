import React from 'react';
import {View, StyleSheet, useColorScheme} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';

import {UserInfo} from '../../../utils/types';
import UserIcon from '../../components/UserIcon';

interface Props {
  users: UserInfo[];
  selected?: boolean;
}

const FGIcon: React.FC<Props> = ({users, selected=false}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);

  const usersSorted = [];
  for (const user of users) {
    if (usersSorted.length >= 4) {
      break;
    }
    if (user.icon?.url) {
      usersSorted.unshift(user);
    } else {
      usersSorted.push(user);
    }
  }

  const sizes = [s(50), s(40), s(35), s(33)];
  const textSizes = [s(19), s(15), s(13), s(12)];
  const left = [
    [s(12.5)],
    [s(8), s(27)],
    [s(10), s(35), s(14)],
    [s(12), s(35), s(7), s(30)],
  ];
  const top = [
    [s(12.5)],
    [s(8), s(27)],
    [s(6), s(17), s(35)],
    [s(6), s(10), s(28), s(35)],
  ];

  return (
    <View style={[styles.container, 
    {
      borderWidth: selected ? 2 : 0,
      borderColor: colors[theme].accent,

    }]}>
      {usersSorted.reverse().map((user, index) => (
        <View
          key={index}
          style={[
            styles.icon,
            {
              width: sizes[usersSorted.length - 1],
              height: sizes[usersSorted.length - 1],
              borderRadius: sizes[usersSorted.length - 1] / 2,
              left: left[usersSorted.length - 1][index] - (selected ? 2 : 0),
              top: top[usersSorted.length - 1][index] - (selected ? 2 : 0),
            },
          ]}>
          <UserIcon
            key={index}
            user={user}
            size={textSizes[usersSorted.length - 1]}
          />
        </View>
      ))}
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      width: s(75),
      height: s(75),
      borderRadius: s(37.5),
      backgroundColor: colors[theme].secondary,
    },
    icon: {
      position: 'absolute',
    },
  });

export default FGIcon;
