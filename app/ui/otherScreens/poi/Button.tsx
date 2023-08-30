import React from 'react';
import {TouchableOpacity, useColorScheme} from 'react-native';
import {CommonActions} from '@react-navigation/native';

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

  return (
    <TouchableOpacity
      style={[STYLES.button, STYLES.shadow]}
      onPress={() => {
        if (mode === 'create') {
          navigation.navigate('Create', {
            destination: destination,
            category: category,
          });
        } else if (mode === 'suggest') {
          navigation.navigate('Event', {
            destination: destination,
          });
        } else if (mode === 'add') {
          navigation.navigate('EventSettings', {
            destination: destination,
            category: category,
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
  );
};

export default Button;
