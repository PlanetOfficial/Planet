import {DBOpsURL} from '../APIConstants';

export const makeFGEvent = async (
  user_event_id: number,
  group_id: number,
  token: any,
) => {
  const response = await fetch(
    DBOpsURL +
      `/friends/createEvent?user_event_id=${user_event_id}&group_id=${group_id}&authtoken=${token}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
