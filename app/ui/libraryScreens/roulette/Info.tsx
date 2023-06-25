import React from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {s} from 'react-native-size-matters';

import strings from '../../../constants/strings';
import colors from '../../../constants/colors';

import Text from '../../components/Text';
import PoiCard from '../../components/PoiCard';
import UserIcon from '../../components/UserIcon';

import {handleBookmark} from '../../../utils/Misc';
import {Poi, Suggestion, UserInfo} from '../../../utils/types';

interface Props {
  navigation: any;
  isSpinning: boolean;
  currentSuggestion: Suggestion;
  bookmarks: Poi[];
  setBookmarks: (bookmarks: Poi[]) => void;
  totalVotes: number;
}

const Info: React.FC<Props> = ({
  navigation,
  isSpinning,
  currentSuggestion,
  bookmarks,
  setBookmarks,
  totalVotes,
}) => {
  return (
    <View style={styles.top}>
      <TouchableOpacity
        disabled={isSpinning}
        onPress={() => {
          navigation.navigate('Poi', {
            poi: currentSuggestion.poi,
            bookmarked: bookmarks.some(
              bookmark => bookmark.id === currentSuggestion.poi.id,
            ),
            mode: 'none',
          });
        }}>
        <PoiCard
          poi={currentSuggestion.poi}
          disabled={isSpinning}
          bookmarked={bookmarks.some(
            bookmark => bookmark.id === currentSuggestion.poi.id,
          )}
          handleBookmark={(poi: Poi) =>
            handleBookmark(poi, bookmarks, setBookmarks)
          }
        />
      </TouchableOpacity>
      <View style={styles.votes}>
        <Text size="s">{`${strings.roulette.votes} (${currentSuggestion.votes.length}/${totalVotes}):`}</Text>
        <FlatList
          style={styles.votesList}
          data={currentSuggestion.votes}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.user}
              onPress={() =>
                navigation.navigate('User', {
                  user: item,
                })
              }>
              <View style={styles.profilePic}>
                <UserIcon user={item} />
              </View>
              <View style={styles.texts}>
                <Text
                  size="s"
                  numberOfLines={
                    1
                  }>{`${item.first_name} ${item.last_name}`}</Text>
                <Text
                  size="xs"
                  weight="l"
                  color={colors.darkgrey}
                  numberOfLines={1}>
                  {'@' + item.username}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item: UserInfo) => item.id.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    borderBottomWidth: 0.5,
    borderColor: colors.lightgrey,
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
