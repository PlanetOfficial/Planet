import {DBOpsURL} from '../APIConstants';

export const likeFGPlace = async (group_event_place_id: number, token: any) => {
  // TODO-SECURITY: filter inputs**

  const response = await fetch(
    DBOpsURL +
      `/friends/likePlace?group_event_place_id=${group_event_place_id}&authtoken=${token}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
