import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useColorScheme,
} from 'react-native';
import {s} from 'react-native-size-matters';

import strings from '../../../constants/strings';
import colors from '../../../constants/colors';

import Text from '../../components/Text';
import PoiCard from '../../components/PoiCard';
import UserIcon from '../../components/UserIcon';

import {Suggestion, UserInfo} from '../../../utils/types';

interface Props {
  navigation: any;
  isSpinning: boolean;
  currentSuggestion: Suggestion;
  totalVotes: number;
}

const Info: React.FC<Props> = ({
  navigation,
  isSpinning,
  currentSuggestion,
  totalVotes,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);

  return (
    <View style={styles.top}>
      <TouchableOpacity
        disabled={isSpinning}
        onPress={() => {
          navigation.navigate('Poi', {
            poi: currentSuggestion.poi,
            mode: 'none',
          });
        }}>
        <PoiCard place={currentSuggestion.poi} disabled={isSpinning} />
      </TouchableOpacity>
      <View style={styles.votes}>
        <Text size="s">{`${strings.roulette.votes} (${
          currentSuggestion.votes.length +
          currentSuggestion.browser_votes.length
        }/${totalVotes}):`}</Text>
        <FlatList
          style={styles.votesList}
          scrollIndicatorInsets={{right: 1}}
          data={
            [
              ...currentSuggestion.votes,
              ...currentSuggestion.browser_votes,
            ] as UserInfo[]
          }
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.user}
              onPress={() =>
                navigation.push('User', {
                  user: item,
                })
              }>
              <View style={styles.profilePic}>
                <UserIcon user={item} />
              </View>
              <View style={styles.texts}>
                <Text size="s" numberOfLines={1}>{`${item.display_name}`}</Text>
                <Text size="xs" weight="l" numberOfLines={1}>
                  {'@' + item.username}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          // keyExtractor={(item: UserInfo) => item.id.toString()}
        />
      </View>
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    top: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: s(20),
      marginVertical: s(20),
    },
    votes: {
      flex: 1,
      marginLeft: s(20),
      height: s(180),
      paddingTop: s(5),
    },
    votesList: {
      marginTop: s(5),
    },
    user: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: s(8),
      borderColor: colors[theme].secondary,
    },
    profilePic: {
      width: s(35),
      height: s(35),
      borderRadius: s(17.5),
      overflow: 'hidden',
    },
    pic: {
      width: '100%',
      height: '100%',
    },
    texts: {
      flex: 1,
      justifyContent: 'center',
      marginLeft: s(5),
    },
  });

export default Info;
