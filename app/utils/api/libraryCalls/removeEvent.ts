import {DBOpsURL} from '../APIConstants';

export const removeEvent = async (event_id: number) => {
  // TODO-SECURITY: filter inputs**

  const response = await fetch(
    DBOpsURL + `/event/removeEvent?event_id=${event_id}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
