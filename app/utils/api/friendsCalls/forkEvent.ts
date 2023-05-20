import {FriendsURL} from '../APIConstants';

export const forkEvent = async (group_event_id: number, authToken: any) => {
  const response = await fetch(
    FriendsURL +
      `/friends/forkEvent?group_event_id=${group_event_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
