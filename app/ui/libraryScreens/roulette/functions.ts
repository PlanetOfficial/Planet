import {
  withTiming,
  Easing,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';

import {Destination, Suggestion} from '../../../utils/types';

const SPIN_VELOCITY = 1400;
const SPIN_DURATION = 4000;
const EASING = Easing.bezier(0.23, 0.8, 0.32, 1);

export const getCurrentSuggestion = (
  ang: number,
  destination: Destination,
  totalVotes: number,
): Suggestion => {
  const angle = ang < 0 ? 360 + ang : ang;
  const votes = destination.suggestions.map(
    (place: Suggestion) =>
      (place.votes.length ? place.votes.length : 0) +
      (place.browser_votes.length ? place.browser_votes.length : 0),
  );

  let voteIndex = Math.floor(angle / (360 / totalVotes));
  for (let i = votes.length - 1; i >= 0; i--) {
    if (voteIndex < votes[i]) {
      return destination.suggestions[i];
    }
    voteIndex -= votes[i];
  }
  return destination.suggestions[0];
};

export const onSpinPress = (
  rotation: SharedValue<number>,
  setIsSpinning: (isSpinning: boolean) => void,
  setCurrentAngle: (angle: number) => void,
  handleSpinEnd: (angle: number) => void,
) => {
  runOnJS(setIsSpinning)(true);
  rotation.value = withTiming(
    (Math.random() + 1) * SPIN_VELOCITY + rotation.value,
    {
      duration: SPIN_DURATION,
      easing: EASING,
    },
    () => {
      const angle = parseInt((rotation.value % 360).toFixed(), 10);
      runOnJS(setCurrentAngle)(angle);
      runOnJS(setIsSpinning)(false);
      runOnJS(handleSpinEnd)(angle);
    },
  );
};
