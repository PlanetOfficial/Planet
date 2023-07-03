import {Alert, LayoutAnimation} from 'react-native';

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
  date: string,
  members: UserInfo[],
  setLoading: (loading: boolean) => void,
  destinations: Poi[] | undefined,
) => {
  if (!destinations) {
    return;
  }

  setLoading(true);

  const poi_ids = destinations.map(destination => destination.id);
  const names = destinations.map(destination => destination.category_name);

  const response = await postEvent(
    poi_ids,
    names,
    eventTitle,
    date,
    members.map(member => member.id),
  );
  if (response) {
    navigation.navigate('Library', {event: response});
  } else {
    Alert.alert(strings.error.error, strings.error.saveEvent);
  }
  setTimeout(() => {
    setLoading(false);
  }, 1000);
};
