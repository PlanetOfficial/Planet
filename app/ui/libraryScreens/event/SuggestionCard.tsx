import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  Alert,
  Animated,
  Easing,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import PoiCardXL from '../../components/PoiCardXL';

import {Destination, Suggestion} from '../../../utils/types';
import {makePrimary, removeSuggestion} from '../../../utils/api/suggestionAPI';

interface SuggestionCardProps {
  navigation: any;
  bookmarked: boolean;
  suggestion?: Suggestion;
  onSuggestionClose: () => void;
  loadData: () => void;
  x: number;
  y: number;
  resetFlag: boolean;
  animateFlag: boolean;
  eventId: number;
  destination?: Destination;
  voted: boolean;
  onVote: (suggestion: Suggestion) => Promise<void>;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  navigation,
  bookmarked,
  suggestion,
  onSuggestionClose,
  loadData,
  x,
  y,
  resetFlag,
  animateFlag,
  eventId,
  destination,
  voted,
  onVote,
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  const animation = useRef(new Animated.Value(0)).current;

  const [suggestionOpen, setSuggestionOpen] = useState<boolean>(false);

  const left = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [x, s(15)],
  });

  const top = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [y, y - s(212)],
  });

  const width = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [s(120), s(320)],
  });

  const onAnimation = useCallback(() => {
    setSuggestionOpen(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 120,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [animation]);

  useEffect(() => {
    onAnimation();
  }, [animateFlag, onAnimation]);

  const onShrinkAnimation = useCallback(() => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 150,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      setSuggestionOpen(false);
    }, 150);
  }, [animation]);

  useEffect(() => {
    onShrinkAnimation();
  }, [resetFlag, onShrinkAnimation]);

  const onMakePrimaryPress = async () => {
    if (!destination || !suggestion) {
      return;
    }

    const response = await makePrimary(eventId, destination.id, suggestion.id);

    if (response) {
      onShrinkAnimation();
      onSuggestionClose();
      loadData();
    } else {
      Alert.alert(strings.error.error, strings.error.markSuggestionAsSelected);
    }
  };

  const onRemoveSuggestionPress = async () => {
    if (!destination || !suggestion) {
      return;
    }

    const response = await removeSuggestion(
      eventId,
      destination.id,
      suggestion.poi.id,
    );

    if (response) {
      onShrinkAnimation();
      onSuggestionClose();
      loadData();
    } else {
      Alert.alert(strings.error.error, strings.error.removeSuggestion);
    }
  };

  return suggestionOpen ? (
    <Animated.View
      style={[
        STYLES.absolute,
        {
          left: left,
          top: top,
          opacity: animation,
        },
      ]}>
      {suggestion ? (
        <TouchableOpacity
          onPress={() => {
            setTimeout(() => {
              onShrinkAnimation();
            }, 1000);
            navigation.navigate('Poi', {
              poi: suggestion.poi,
              bookmarked: bookmarked,
              mode: 'none',
            });
          }}>
          <PoiCardXL
            place={suggestion.poi}
            width={width}
            noBookmark={true}
            options={[
              {
                name: 'See Votes',
                onPress: () => {
                  setTimeout(() => {
                    onShrinkAnimation();
                  }, 1000);
                  navigation.navigate('Roulette', {
                    eventId,
                    destination,
                  });
                },
                color: colors[theme].neutral,
                disabled: false,
              },
              {
                name: strings.event.markAsSelected,
                onPress: () => {
                  Alert.alert(
                    strings.event.markAsSelected,
                    strings.event.markAsSelectedInfo,
                    [
                      {
                        text: strings.main.cancel,
                        style: 'cancel',
                      },
                      {
                        text: strings.main.confirm,
                        onPress: onMakePrimaryPress,
                      },
                    ],
                  );
                },
                color: colors[theme].accent,
                disabled: false,
              },
              {
                name: strings.event.removeSuggestion,
                onPress: () => {
                  Alert.alert(
                    strings.event.removeSuggestion,
                    strings.event.removeSuggestionInfo,
                    [
                      {
                        text: strings.main.cancel,
                        style: 'cancel',
                      },
                      {
                        text: strings.main.remove,
                        onPress: onRemoveSuggestionPress,
                        style: 'destructive',
                      },
                    ],
                  );
                },
                color: colors[theme].red,
                disabled: false,
              },
            ]}
            voted={voted}
            onVote={async () => await onVote(suggestion)}
          />
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  ) : null;
};

export default SuggestionCard;
