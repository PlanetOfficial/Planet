import React, {useCallback, useRef, useState} from 'react';
import {Alert, Animated, Easing, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';

import PoiCardXL from '../components/PoiCardXL';

import styles from '../../constants/styles';
import {Suggestion} from '../../utils/types';
import colors from '../../constants/colors';
import strings from '../../constants/strings';
import {makePrimary, removeSuggestion} from '../../utils/api/suggestionAPI';

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
  event_id: number;
  destination_id?: number;
  voted: boolean;
  onVote: (suggestion: Suggestion) => void;
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
  event_id,
  destination_id,
  voted,
  onVote,
}) => {
  const animation = useRef(new Animated.Value(0)).current;

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
    Animated.timing(animation, {
      toValue: 1,
      duration: 120,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [animation]);

  React.useEffect(() => {
    onAnimation();
  }, [animateFlag, onAnimation]);

  const onShrinkAnimation = useCallback(() => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 150,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [animation]);

  React.useEffect(() => {
    onShrinkAnimation();
  }, [resetFlag, onShrinkAnimation]);

  const [animValue, setAnimValue] = useState<number>(0);

  animation.addListener(({value}) => setAnimValue(value));

  const onMakePrimaryPress = async () => {
    if (!destination_id || !suggestion) {
      return;
    }

    const response = await makePrimary(event_id, destination_id, suggestion.id);

    if (response) {
      onShrinkAnimation();
      onSuggestionClose();
      loadData();
    } else {
      Alert.alert(
        'Error',
        'Unable to mark suggestion as selected, please try again later.',
      );
    }
  };

  const onRemoveSuggestionPress = async () => {
    if (!destination_id || !suggestion) {
      return;
    }

    const response = await removeSuggestion(
      event_id,
      destination_id,
      suggestion.poi.id,
    );

    if (response) {
      onShrinkAnimation();
      onSuggestionClose();
      loadData();
    } else {
      Alert.alert(
        'Error',
        'Unable to remove suggestion, please try again later.',
      );
    }
  };

  return animValue > 0 ? (
    <Animated.View
      style={[
        styles.absolute,
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
            navigation.navigate('PoiDetail', {
              poi: suggestion.poi,
              bookmarked: bookmarked,
              mode: 'none',
            });
          }}>
          <PoiCardXL
            poi={suggestion.poi}
            width={width}
            options={[
              {
                name: 'See Votes',
                onPress: () => {
                  console.log('TODO: Navigate to roulette page');
                },
                color: colors.black,
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
                color: colors.accent,
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
                color: colors.red,
                disabled: false,
              },
            ]}
            voted={voted}
            onVote={() => onVote(suggestion)}
          />
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  ) : null;
};

export default SuggestionCard;
