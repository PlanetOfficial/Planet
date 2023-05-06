import {DBOpsURL} from '../APIConstants';

export const dislikeFGPlace = async (
  group_event_place_id: number,
  token: any,
) => {
  // TODO: filter inputs**

  const response = await fetch(
    DBOpsURL +
      `/dislikeFGPlace?group_event_place_id=${group_event_place_id}&authtoken=${token}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
