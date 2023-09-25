import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';

import {ExploreModes, Poi} from '../../../utils/types';

import {getButtonString} from './functions';

interface Props {
  navigation: any;
  destination: Poi | undefined;
  mode: ExploreModes;
  category: string | undefined;
}

const Button: React.FC<Props> = ({navigation, destination, mode, category}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  const styles = styling(theme);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <TouchableOpacity
          style={[styles.button, STYLES.shadow]}
          onPress={() => {
            if (mode === 'create') {
              navigation.navigate('Create', {
                destination,
                category,
              });
            } else if (mode === 'suggest') {
              navigation.navigate('Event', {
                destination,
              });
            } else if (mode === 'add') {
              navigation.navigate('EventSettings', {
                destination,
                category,
              });
            } else {
              // mode is none, create a fresh event with this destination
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    {
                      name: 'TabStack',
                    },
                    {
                      name: 'Create',
                      params: {destination: destination},
                    },
                  ],
                }),
              );
            }
          }}>
          <Text color={colors[theme].primary}>{getButtonString(mode)}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      alignSelf: 'center',
      position: 'absolute',
      bottom: 0,
    },
    button: {
      marginBottom: s(20),
      paddingHorizontal: s(15),
      paddingVertical: s(7.5),
      borderRadius: s(5),
      backgroundColor: colors[theme].accent,
      minWidth: s(80),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default Button;
