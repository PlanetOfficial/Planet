import React, {useState} from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';

import {Poi, UserInfo} from '../../../utils/types';

import {handleSave} from './functions';

interface Props {
  navigation: any;
  eventTitle: string;
  date: string;
  members: UserInfo[];
  destinations: Poi[] | undefined;
}

const SaveButton: React.FC<Props> = ({
  navigation,
  eventTitle,
  date,
  members,
  destinations,
}) => {
  const theme = useColorScheme() || 'light';

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <TouchableOpacity
      style={[
        STYLES.button,
        {
          backgroundColor:
            destinations && destinations.length > 0
              ? colors[theme].accent
              : colors[theme].secondary,
        },
      ]}
      disabled={loading || !destinations || destinations.length === 0}
      onPress={() =>
        handleSave(
          navigation,
          eventTitle,
          date,
          members,
          setLoading,
          destinations,
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

export default SaveButton;
