import React from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';

import Text from './Text';

interface NotificationProps {
  message: string;
  onPress: () => void;
}

const Notification = (props: NotificationProps) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);

  return (
    <TouchableOpacity onPress={props.onPress} style={styles.container}>
      <SafeAreaView>
        <Text size="s" weight="l">
          {props.message}
        </Text>
      </SafeAreaView>
    </TouchableOpacity>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      alignSelf: 'center',
      width: s(352),
      backgroundColor: colors[theme].primary,
      padding: s(15),
      alignItems: 'center',
      borderBottomRightRadius: s(10),
      borderBottomLeftRadius: s(10),
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors[theme].secondary,
    },
  });

export default Notification;
