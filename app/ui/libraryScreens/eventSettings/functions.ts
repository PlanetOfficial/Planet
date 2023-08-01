import {Alert} from 'react-native';
import strings from '../../../constants/strings';
import {
  renameDestination,
  removeDestination,
  reorderDestinations,
} from '../../../utils/api/destinationAPI';
import {kickFromEvent, reportEvent} from '../../../utils/api/eventAPI';
import {Destination} from '../../../utils/types';

export const handleRenameDestination = async (
  eventId: number,
  destinationId: number,
  newName: string,
  loadEventDetail: () => void,
) => {
  const response = await renameDestination(eventId, destinationId, newName);

  if (response) {
    loadEventDetail();
  } else {
    Alert.alert(strings.error.error, strings.error.renameDestination);
  }
};

export const handleRemoveDestination = async (
  eventId: number,
  destinationId: number,
  loadEventDetail: () => void,
) => {
  const response = await removeDestination(eventId, destinationId);

  if (response) {
    loadEventDetail();
  } else {
    Alert.alert(strings.error.error, strings.error.removeDestination);
  }
};

export const handleKickMember = async (
  eventId: number,
  userId: number,
  loadEventDetail: () => void,
) => {
  const response = await kickFromEvent(eventId, userId);

  if (response) {
    loadEventDetail();
  } else {
    Alert.alert(strings.error.error, strings.error.kickMember);
  }
};

export const handleReorderDestinations = async (
  eventId: number,
  newOrder: Destination[],
  loadEventDetail: () => void,
) => {
  const response = await reorderDestinations(
    eventId,
    newOrder.map((destination: Destination) => destination.id),
  );

  if (response) {
    loadEventDetail();
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
