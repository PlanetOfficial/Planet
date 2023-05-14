import {Place} from '../../interfaces/types';
import {DBOpsURL} from '../APIConstants';

export const addCustomDestination = async (
  name: String,
  latitude: number,
  longitude: number,
  formatted_address?: string | undefined,
): Promise<Place | undefined> => {
  // TODO-SECURITY: filter inputs**

  let address = '';
  if (formatted_address !== undefined) {
    address = formatted_address;
  }

  const response = await fetch(
    DBOpsURL +
      `/addCustomDestination?name=${name}&latitude=${latitude}&longitude=${longitude}&formatted_address=${address}`,
    {
      method: 'POST',
    },
  );

  if (response?.ok) {
    const myJson: Place = await response.json(); //extract JSON from the http response
    return myJson;
  }
};
