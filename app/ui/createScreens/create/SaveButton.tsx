import React, {useState} from 'react';
import {TouchableOpacity, ActivityIndicator} from 'react-native';

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
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <TouchableOpacity
      style={[
        STYLES.button,
        STYLES.shadow,
        {
          backgroundColor:
            destinations && destinations.length > 0
              ? colors.accent
              : colors.grey,
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
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text size="l" weight="b" color={colors.white}>
          {strings.main.save}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default SaveButton;
