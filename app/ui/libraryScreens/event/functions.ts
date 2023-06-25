import {
  Destination,
  Suggestion,
  Event,
  EventDetail,
} from '../../../utils/types';
import {postSuggestion, vote} from '../../../utils/api/suggestionAPI';
import {Alert} from 'react-native';
import strings from '../../../constants/strings';
import { getEvent } from '../../../utils/api/eventAPI';

export const onVote = async (
  event: Event,
  setEventDetail: (eventDetail: EventDetail) => void,
  myVotes: Map<number, number>,
  setMyVotes: (myVotes: Map<number, number>) => void,
  destination: Destination,
  suggestion: Suggestion,
) => {
  const response = await vote(event.id, destination.id, suggestion.id);

  if (response) { // WARN: there used to be a eventDetail null check here
    const _myVotes = new Map<number, number>(myVotes);
    if (_myVotes.get(destination.id) === suggestion.id) {
      _myVotes.set(destination.id, -1);
    } else {
      _myVotes.set(destination.id, suggestion.id);
    }
    setMyVotes(_myVotes);
  } else {
    Alert.alert(strings.error.error, strings.error.changeVote);
  }

  const _eventDetail = await getEvent(event.id);
  if (_eventDetail) {
    setEventDetail(_eventDetail);
  } else {
    Alert.alert(strings.error.error, strings.error.refreshEvent);
  }
};
