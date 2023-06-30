import React from 'react';
import {TouchableOpacity} from 'react-native';
import {CommonActions} from '@react-navigation/native';

import colors from '../../../constants/colors';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';

import {Poi} from '../../../utils/types';

import {getButtonString} from './functions';

interface Props {
  navigation: any;
  destination: Poi | undefined;
  mode: 'create' | 'suggest' | 'add' | 'none';
}

const Button: React.FC<Props> = ({navigation, destination, mode}) => {
  return (
    <TouchableOpacity
      style={STYLES.button}
      onPress={() => {
        if (mode === 'create') {
          navigation.navigate('Create', {
            destination: destination,
          });
        } else if (mode === 'suggest') {
          navigation.navigate('Event', {
            destination: destination,
          });
        } else if (mode === 'add') {
          navigation.navigate('EventSettings', {destination});
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
      <Text size="m" weight="b" color={colors.white}>
        {getButtonString(mode)}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
