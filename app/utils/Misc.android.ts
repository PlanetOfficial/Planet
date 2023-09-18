import { Alert, PermissionsAndroid } from "react-native";
import strings from "../constants/strings";

export const requestAndroidNotificationPermissions = async () => {
  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
};

export const requestAndroidLocationPermissions = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert(
        strings.error.locationPermission,
        strings.error.locationPermissionInfo,
      );
    }
  } catch (err) {
    console.warn(err);
  }
};
