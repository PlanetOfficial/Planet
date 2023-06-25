import React, {useEffect, useState} from 'react';
import {View, SafeAreaView, Alert} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import styles from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {Destination, Poi, Suggestion} from '../../../utils/types';

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
  const [destination, setDestination] = useState<Destination>(
    route.params.destination,
  );

  const [bookmarks, setBookmarks] = useState<Poi[]>([]);
  const loadBookmarks = async () => {
    const _bookmarks = await AsyncStorage.getItem('bookmarks');
    if (_bookmarks) {
      setBookmarks(JSON.parse(_bookmarks));
    } else {
      Alert.alert(strings.error.error, strings.error.loadBookmarks);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadBookmarks();
    });

    return unsubscribe;
  }, [navigation]);

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
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
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
