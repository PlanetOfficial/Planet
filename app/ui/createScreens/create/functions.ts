import {Alert, LayoutAnimation} from 'react-native';
import moment from 'moment';

import strings from '../../../constants/strings';

import {Poi, UserInfo} from '../../../utils/types';
import {postEvent} from '../../../utils/api/eventAPI';

export const handleMove = (
  idx: number,
  direction: number,
  destinations: Poi[],
  setDestinations: (destination: Poi[]) => void,
) => {
  if (!destinations) {
    return;
  }
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  const _destinations = [...destinations];
  const destination = _destinations[idx];
  _destinations.splice(idx, 1);
  if (direction !== 0) {
    _destinations.splice(idx + direction, 0, destination);
  }
  setDestinations(_destinations);
};

export const handleSave = async (
  navigation: any,
  eventTitle: string,
  date: string | undefined,
  members: UserInfo[],
  destinations: Poi[] | undefined,
  destinationNames: Map<number, string>,
) => {
  if (!destinations) {
    return;
  }

  const poi_ids = destinations.map(destination => destination.id);
  const names = destinations.map(
    destination => destinationNames.get(destination.id) || '',
  );

  const response = await postEvent(
    poi_ids,
    names,
    eventTitle,
    date ? moment(date, 'M/D, h:mma').toString() : undefined,
    members.map(member => member.id),
  );
  if (response) {
    navigation.navigate(strings.title.library, {event: response});
  } else {
    Alert.alert(strings.error.error, strings.error.saveEvent);
  }
};
