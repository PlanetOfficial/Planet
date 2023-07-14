import {Alert} from 'react-native';
import strings from '../../../constants/strings';
import {vote} from '../../../utils/api/suggestionAPI';
import {changeEventStatus, getEvent} from '../../../utils/api/eventAPI';
import {
  Destination,
  Suggestion,
  Event,
  EventDetail,
} from '../../../utils/types';

export const onVote = async (
  event: Event,
  setEventDetail: (eventDetail: EventDetail) => void,
  myVotes: Map<number, number>,
  setMyVotes: (myVotes: Map<number, number>) => void,
  destination: Destination,
  suggestion: Suggestion,
) => {
  const response = await vote(event.id, destination.id, suggestion.id);

  if (response) {
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

export const onStatusChange = async (
  event: Event,
  setEvent: (event: Event) => void,
) => {
  const response = await changeEventStatus(event.id);

  if (response) {
    const _event = {...event};
    _event.completed = !_event.completed;
    setEvent(_event);
  } else {
    Alert.alert(strings.error.error, strings.error.changeCompletionStatus);
  }
};
