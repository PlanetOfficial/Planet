import {FriendsURL} from '../APIConstants';

export const getGroupEventPlaces = async (group_event_id: number) => {
  const response = await fetch(
    FriendsURL + `/friends/event?group_event_id=${group_event_id}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson = await response.json();
    return myJson;
  } else {
    return {};
  }
};
