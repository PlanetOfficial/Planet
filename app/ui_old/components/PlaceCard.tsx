import React from 'react';
import {
  Alert,
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';

import {s} from 'react-native-size-matters';

import Text from '../components/Text';
import Icon from './Icon';

import {colors} from '../../constants/colors';
import {icons} from '../../constants/icons';

import {postPlace, deletePlace} from '../../utils/api/placeAPI';
import {Place, User} from '../../utils/interfaces/types';
import {getPlaceCardString} from '../../utils/functions/Misc';
import {TouchableOpacity} from 'react-native';

interface Props {
  place: Place;
  bookmarked: boolean;
  setBookmarked: (bookmarked: boolean, place: Place) => void;
  image: ImageSourcePropType;
  small?: boolean;
  displayCategory?: boolean;
  displaySuggester?: boolean;
  voted?: boolean;
  onVote?: () => void;
  mySuggestion?: boolean;
  onRemoveSuggestion?: () => void;
  voters?: User[];
}

const PlaceCard: React.FC<Props> = ({
  place,
  bookmarked,
  setBookmarked,
  image,
  small = false,
  displayCategory = true,
  displaySuggester = false,
  voted,
  onVote,
  mySuggestion,
  onRemoveSuggestion,
  voters,
}) => {
  const handleBookmark = async () => {
    if (!bookmarked) {
      const response: boolean = await postPlace(place.id);

      if (response) {
        setBookmarked(!bookmarked, place);
      } else {
        Alert.alert('Error', 'Unable to bookmark place. Please try again.');
      }
    } else {
      const response: boolean = await deletePlace(place.id);

      if (response) {
        setBookmarked(!bookmarked, place);
      } else {
        Alert.alert('Error', 'Unable to unbookmark place. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={image} />
      <View style={styles.header}>
        <View style={styles.texts}>
          <Text size={small ? 's' : 'm'} weight="b" numberOfLines={1}>
            {place.name}
          </Text>
          <Text size="xs" weight="l" color={colors.accent} numberOfLines={1}>
            {(displaySuggester
              ? `${place.suggester?.name.split(' ')[0]} suggested | `
              : '') + getPlaceCardString(place, displayCategory)}
          </Text>
        </View>
        <Icon
          size="m"
          color={colors.accent}
          icon={bookmarked ? icons.hearted : icons.heart}
          onPress={handleBookmark}
        />
      </View>
      {voters && voters.length > 0 ? (
        <View style={styles.voters}>
          {voters.map((voter: User, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.userIcon,
                index !== voters.length - 1 ? {marginRight: s(5)} : null,
              ]}
              onPress={() => Alert.alert(voter.name)}>
              <Text size="xs" weight="b" color={colors.accent}>
                {voter.name
                  .split(' ')
                  .map((name: string) => name[0])
                  .join('')
                  .toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
      {voted !== undefined && onVote ? (
        <View style={[styles.button, {right: s(10)}]}>
          <Icon
            size="m"
            onPress={onVote}
            icon={voted ? icons.unvote : icons.vote}
            color={colors.accent}
          />
        </View>
      ) : null}
      {mySuggestion && onRemoveSuggestion ? (
        <View style={[styles.button, {left: s(10)}]}>
          <Icon
            size="m"
            onPress={onRemoveSuggestion}
            icon={icons.remove}
            color={colors.red}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 8 / 5,
    borderRadius: s(10),
    borderWidth: s(2),
    borderColor: colors.white,
    backgroundColor: colors.white,

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '25%',
    paddingHorizontal: s(10),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  texts: {
    flex: 1,
    justifyContent: 'space-between',
    height: '75%',
    marginRight: s(10),
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: s(8),
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: s(10),
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: colors.white,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  voters: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: s(5),
    left: s(5),
    padding: s(10),
    height: s(50),
    borderRadius: s(25),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  userIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(30),
    height: s(30),
    borderRadius: s(15),
    backgroundColor: colors.white,
  },
});

export default PlaceCard;