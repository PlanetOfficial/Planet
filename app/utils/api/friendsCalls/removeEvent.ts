import {DBOpsURL} from '../APIConstants';

export const removeEvent = async (group_event_id: number, authToken: any) => {
  const response = await fetch(
    DBOpsURL +
      `/friends/removeEvent?group_event_id=${group_event_id}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
