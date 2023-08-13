import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import UserIcon from '../../components/UserIcon';

import {UserInfo} from '../../../utils/types';

import {useFriendsContext} from '../../../context/FriendsContext';
import {handleFriendRequest} from '../user/functions';

const Suggestions = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const {suggestions, requestsSent, setRequestsSent, requests} =
    useFriendsContext();

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {suggestions
        .filter(
          (suggestion: UserInfo) =>
            !requests.some((request: UserInfo) => request.id === suggestion.id),
        )
        .map((suggestion: UserInfo) => (
          <TouchableOpacity
            key={suggestion.id}
            style={[styles.card, STYLES.shadow]}
            onPress={() => navigation.push('User', {user: suggestion})}>
            <View style={styles.pfp}>
              <UserIcon user={suggestion} size={s(20)} />
            </View>
            <Text size="s" numberOfLines={1}>
              {suggestion.first_name + ' ' + suggestion.last_name}
            </Text>
            <Text size="xs" weight="l" numberOfLines={1}>
              {'@' + suggestion.username}
            </Text>
            {requestsSent.some(
              (request: UserInfo) => request.id === suggestion.id,
            ) ? (
              <View style={[styles.add, styles.added]}>
                <Text size="s" color={colors[theme].primary}>
                  {strings.friends.added}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.add}
                onPress={() =>
                  handleFriendRequest(
                    suggestion.id,
                    requestsSent,
                    setRequestsSent,
                    suggestion,
                  )
                }>
                <Text size="s" color={colors[theme].primary}>
                  {strings.main.add}
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      paddingHorizontal: s(20),
      paddingVertical: s(10),
    },
    card: {
      alignItems: 'center',
      justifyContent: 'space-between',
      marginRight: s(15),
      paddingHorizontal: s(5),
      paddingVertical: s(10),
      width: s(110),
      height: s(140),
      borderRadius: s(10),
      backgroundColor: colors[theme].primary,
    },
    pfp: {
      width: s(50),
      height: s(50),
      borderRadius: s(25),
      backgroundColor: colors[theme].primary,
    },
    add: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: s(5),
      width: s(80),
      height: s(25),
      borderRadius: s(10),
      backgroundColor: colors[theme].accent,
    },
    added: {
      backgroundColor: colors[theme].secondary,
    },
  });

export default Suggestions;
