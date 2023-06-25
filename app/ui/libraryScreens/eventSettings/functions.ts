import {Alert} from 'react-native';
import strings from '../../../constants/strings';
import {
  renameDestination,
  removeDestination,
  reorderDestinations,
} from '../../../utils/api/destinationAPI';
import {Destination} from '../../../utils/types';

export const handleRenameDestination = async (
  eventId: number,
  destinationId: number,
  newName: string,
  loadData: () => void,
) => {
  const response = await renameDestination(eventId, destinationId, newName);

  if (response) {
    loadData();
  } else {
    Alert.alert(strings.error.error, strings.error.renameDestination);
  }
};

export const handleRemoveDestination = async (
  eventId: number,
  destinationId: number,
  loadData: () => void,
) => {
  const response = await removeDestination(eventId, destinationId);

  if (response) {
    loadData();
  } else {
    Alert.alert(strings.error.error, strings.error.removeDestination);
  }
};

export const handleReorderDestinations = async (
  eventId: number,
  newOrder: Destination[],
  loadData: () => void,
) => {
  const response = await reorderDestinations(
    eventId,
    newOrder.map((destination: Destination) => destination.id),
  );

  if (response) {
    loadData();
  } else {
    Alert.alert(strings.error.error, strings.error.reorderDestination);
  }
};
