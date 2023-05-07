import {DBOpsURL} from '../APIConstants';

export const dislikeFGPlace = async (
  group_event_place_id: number,
  token: any,
) => {
  // TODO-SECURITY: filter inputs**

  const response = await fetch(
    DBOpsURL +
      `/friends/dislikePlace?group_event_place_id=${group_event_place_id}&authtoken=${token}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
