import {FriendsURL} from '../APIConstants';

export const getFGEventPlaces = async (
  group_event_id: number,
  authToken: any,
) => {
  const response = await fetch(
    FriendsURL +
      `/friends/fgEventPlaces?group_event_id=${group_event_id}&authtoken=${authToken}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson = await response.json();
    return myJson;
  } else {
    return [];
  }
};
