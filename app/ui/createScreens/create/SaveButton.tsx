import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  StyleSheet,
  SafeAreaView,
  View,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';

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
  const styles = styling(theme);

  const [loading, withLoading] = useLoadingState();

  const disabled =
    eventTitle === '' || !destinations || destinations.length === 0;

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: disabled
                ? colors[theme].secondary
                : colors[theme].accent,
            },
          ]}
          disabled={loading || disabled}
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
            <Text color={colors[theme].primary}>{strings.main.save}</Text>
          )}
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

export default SaveButton;
