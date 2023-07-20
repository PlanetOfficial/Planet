import {Alert} from 'react-native';
import strings from '../../../constants/strings';
import {
  renameDestination,
  removeDestination,
  reorderDestinations,
} from '../../../utils/api/destinationAPI';
import {reportEvent} from '../../../utils/api/eventAPI';
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

export const handleReportEvent = async (eventId: number) => {
  const response = await reportEvent(eventId);

  if (response) {
    Alert.alert(strings.main.success, strings.event.reportEventInfo);
  } else {
    Alert.alert(strings.error.error, strings.error.reportEvent);
  }
};
