import React, {useState} from 'react';
import {View, SafeAreaView, useColorScheme, StatusBar} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {Destination, Suggestion} from '../../../utils/types';

import {getCurrentSuggestion} from './functions';
import Spinner from './Spinner';
import Info from './Info';

import {useBookmarkContext} from '../../../context/BookmarkContext';

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
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [eventId] = useState<number>(route.params.eventId);
  const [destination, setDestination] = useState<Destination>(
    route.params.destination,
  );

  const {bookmarks, setBookmarks} = useBookmarkContext();

  const rotation = useSharedValue(0);
  const [currentAngle, setCurrentAngle] = useState<number>(rotation.value);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

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
                destination,
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
        setDestination={setDestination}
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
