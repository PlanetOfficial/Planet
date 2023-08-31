import React from 'react';
import {StyleSheet, View, useColorScheme, ScrollView} from 'react-native';
import {s} from 'react-native-size-matters';
import {TouchableOpacity} from 'react-native-gesture-handler';

import colors from '../../../constants/colors';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import UserIcon from '../../components/UserIcon';
import ActionButtons from '../components/ActionButtons';

import {UserInfo} from '../../../utils/types';

import {useFriendsContext} from '../../../context/FriendsContext';

const Suggestions = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const {suggestions, requests, usersIBlock} = useFriendsContext();

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {suggestions
        .filter(
          (suggestion: UserInfo) =>
            !requests.some(
              (request: UserInfo) => request.id === suggestion.id,
            ) &&
            !usersIBlock.some((user: UserInfo) => user.id === suggestion.id),
        )
        .map((suggestion: UserInfo) => (
          <TouchableOpacity
            key={suggestion.id}
            style={[styles.card, STYLES.shadow]}
            onPress={() => navigation.push('User', {user: suggestion})}>
            <View style={styles.pfp}>
              <UserIcon user={suggestion} size={s(20)} />
            </View>
            <View style={styles.texts}>
              <Text size="s" numberOfLines={1}>
                {suggestion.display_name}
              </Text>
              <Text size="xs" weight="l" numberOfLines={1}>
                {'@' + suggestion.username}
              </Text>
            </View>
            <ActionButtons user={suggestion} />
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      paddingHorizontal: s(20),
      paddingVertical: s(5),
      marginBottom: s(10),
    },
    card: {
      alignItems: 'center',
      justifyContent: 'space-between',
      marginRight: s(15),
      paddingHorizontal: s(5),
      paddingVertical: s(10),
      width: s(110),
      height: s(145),
      borderRadius: s(5),
      backgroundColor: colors[theme].primary,
    },
    pfp: {
      width: s(50),
      height: s(50),
      borderRadius: s(25),
      backgroundColor: colors[theme].primary,
    },
    texts: {
      alignItems: 'center',
      marginVertical: s(2),
    },
  });

export default Suggestions;
