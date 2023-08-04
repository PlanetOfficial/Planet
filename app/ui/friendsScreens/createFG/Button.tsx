import React from 'react';
import {useColorScheme, TouchableOpacity} from 'react-native';
import prompt from 'react-native-prompt-android';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';

import {FriendGroup} from '../../../utils/types';
import {createFG} from './functions';

interface Props {
  navigation: any;
  selectedId: number[];
}

const Button: React.FC<Props> = ({navigation, selectedId}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  return (
    <TouchableOpacity
      style={[
        STYLES.button,
        {
          backgroundColor:
            selectedId.length === 0
              ? colors[theme].secondary
              : colors[theme].accent,
        },
      ]}
      disabled={selectedId.length === 0}
      onPress={() =>
        prompt(
          strings.friends.friendGroupName,
          strings.friends.friendGroupNameInfo,
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Save',
              onPress: name => {
                createFG(name, selectedId, navigation);
              },
            },
          ],
          {},
        )
      }>
      <Text color={colors[theme].primary}>
        {strings.event.create +
          (selectedId.length > 0 ? ` (${selectedId.length})` : '')}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
