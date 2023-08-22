import {Linking} from 'react-native';
import {showLocation} from 'react-native-map-link';

import {
  Poi,
  PoiDetail,
  PlaceOpeningHoursPeriod,
  Coordinate,
  CreateModes,
} from '../../../utils/types';
import strings from '../../../constants/strings';

export const getButtonString = (mode: CreateModes) => {
  if (mode === 'create' || mode === 'add') {
    return strings.main.add;
  } else if (mode === 'suggest') {
    return strings.event.suggest;
  } else {
    return strings.event.create;
  }
};

const convertStringTimeToDate = (timeString: string) => {
  const currentDate = new Date();

  const hours = timeString.substring(0, 2);
  const minutes = timeString.substring(2, 4);

  if (hours && minutes) {
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      parseInt(hours, 10),
      parseInt(minutes, 10),
    );
  }
};

export const isOpen = (periods: PlaceOpeningHoursPeriod[]) => {
  const currentDate = new Date();

  return periods.some(period => {
    const startTime = convertStringTimeToDate(period.open.time);
    const endTime = convertStringTimeToDate(period.close.time);

    if (!startTime || !endTime) {
      return false;
    }

    if (
      currentDate >= startTime &&
      currentDate <= endTime &&
      period.open.day === currentDate.getDay() &&
      period.close.day === currentDate.getDay()
    ) {
      return true;
    }

    if (
      currentDate >= startTime &&
      period.open.day === currentDate.getDay() &&
      period.close.day === currentDate.getDay() + 1
    ) {
      return true;
    }

    if (
      currentDate <= endTime &&
      period.open.day === currentDate.getDay() - 1 &&
      period.close.day === currentDate.getDay()
    ) {
      return true;
    }
    if (
      period.open.day > period.close.day &&
      period.open.day - period.close.day !== 6
    ) {
      return true;
    }

    return false;
  });
};

export const handleMapPress = async (
  destination: Poi,
  location: Coordinate,
) => {
  if (!destination) {
    return;
  }
  showLocation({
    latitude: destination.latitude,
    longitude: destination.longitude,
    sourceLatitude: location.latitude,
    sourceLongitude: location.longitude,
    title: destination.name,
  });
};

export const handleCallPress = async (destinationDetails: PoiDetail) => {
  if (destinationDetails?.url) {
    await Linking.openURL(
      `tel:${
        destinationDetails.phone
          ? destinationDetails.phone.replace(/\D/g, '')
          : ''
      }`,
    );
  }
};

export const handleWebsitePress = async (destinationDetails: PoiDetail) => {
  if (destinationDetails?.website) {
    await Linking.openURL(destinationDetails.website);
  }
};
