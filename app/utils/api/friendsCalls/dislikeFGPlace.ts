import {FriendsURL} from '../APIConstants';

export const dislikeFGPlace = async (
  group_event_place_id: number,
  token: any,
) => {
  const response = await fetch(
    FriendsURL +
      `/friends/dislikePlace?group_event_place_id=${group_event_place_id}&authtoken=${token}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
