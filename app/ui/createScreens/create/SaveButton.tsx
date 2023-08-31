import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  StyleSheet,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';

import {Poi, UserInfo} from '../../../utils/types';
import {useLoadingState} from '../../../utils/Misc';

import {handleSave} from './functions';

interface Props {
  navigation: any;
  eventTitle: string;
  date: string | undefined;
  members: UserInfo[];
  destinations: Poi[] | undefined;
  destinationNames: Map<number, string>;
}

const SaveButton: React.FC<Props> = ({
  navigation,
  eventTitle,
  date,
  members,
  destinations,
  destinationNames,
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  const [loading, withLoading] = useLoadingState();

  return (
    <TouchableOpacity
      style={[
        STYLES.button,
        styles.button,
        {
          backgroundColor:
            destinations && destinations.length > 0
              ? colors[theme].accent
              : colors[theme].secondary,
        },
      ]}
      disabled={loading || !destinations || destinations.length === 0}
      onPress={() =>
        withLoading(() =>
          handleSave(
            navigation,
            eventTitle,
            date,
            members,
            destinations,
            destinationNames,
          ),
        )
      }>
      {loading ? (
        <ActivityIndicator color={colors[theme].primary} />
      ) : (
        <Text size="l" weight="b" color={colors[theme].primary}>
          {strings.main.save}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: s(100),
    minHeight: s(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SaveButton;
