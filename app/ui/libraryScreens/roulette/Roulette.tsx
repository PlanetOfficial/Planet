import React, {useContext, useState} from 'react';
import {View, SafeAreaView} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';

import icons from '../../../constants/icons';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import BookmarkContext from '../../../context/BookmarkContext';

import {Destination, Suggestion} from '../../../utils/types';

import {getCurrentSuggestion} from './functions';
import Spinner from './Spinner';
import Info from './Info';

const Roulette = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      destination: Destination;
      eventId: number;
    };
  };
}) => {
  const [eventId] = useState(route.params.eventId);
  const [destination] = useState<Destination>(route.params.destination);

  const bookmarkContext = useContext(BookmarkContext);
  if (!bookmarkContext) {
    throw new Error('BookmarkContext is not set!');
  }
  const {bookmarks, setBookmarks} = bookmarkContext;

  const rotation = useSharedValue(0);
  const [currentAngle, setCurrentAngle] = useState(rotation.value);
  const [isSpinning, setIsSpinning] = useState(false);

  const totalVotes = destination.suggestions
    .map((suggestion: Suggestion) =>
      suggestion.votes.length ? suggestion.votes.length : 0,
    )
    .reduce((a: number, b: number) => a + b, 0);

  const currentSuggestion = getCurrentSuggestion(
    currentAngle,
    destination,
    totalVotes,
  );

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            disabled={isSpinning}
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <Text>{destination.name}</Text>
          <Icon
            size="m"
            disabled={isSpinning}
            icon={icons.history}
            onPress={() =>
              navigation.navigate('SpinHistory', {
                destination: destination,
              })
            }
          />
        </View>
      </SafeAreaView>

      <Info
        navigation={navigation}
        isSpinning={isSpinning}
        currentSuggestion={currentSuggestion}
        bookmarks={bookmarks}
        setBookmarks={setBookmarks}
        totalVotes={totalVotes}
      />

      <Spinner
        eventId={eventId}
        destination={destination}
        rotation={rotation}
        isSpinning={isSpinning}
        setIsSpinning={setIsSpinning}
        currentAngle={currentAngle}
        setCurrentAngle={setCurrentAngle}
      />
    </View>
  );
};

export default Roulette;
