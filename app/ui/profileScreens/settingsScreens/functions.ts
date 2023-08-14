import {Alert} from 'react-native';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import prompt from 'react-native-prompt-android';

import numbers from '../../../constants/numbers';
import strings from '../../../constants/strings';

import {
  editDisplayName,
  editUsername,
  removeImage,
  saveImage,
} from '../../../utils/api/authAPI';

export const handleEditPfp = async (setPfpURL: (url: string) => void) => {
  const options: ImageLibraryOptions = {
    mediaType: 'photo',
    includeBase64: true,
  };

  const image = await launchImageLibrary(options);
  if (
    image.assets &&
    image.assets.length > 0 &&
    image.assets[0].base64 &&
    image.assets[0].type
  ) {
    if (
      image.assets[0].fileSize &&
      image.assets[0].fileSize < numbers.maxPfpSize
    ) {
      const image_url = await saveImage(image.assets[0].base64);

      if (image_url) {
        setPfpURL(image_url);
      } else {
        Alert.alert('Error', strings.profile.pfpUploadError);
      }
    } else {
      Alert.alert('Error', strings.profile.pfpSizeError);
    }
  } else {
    if (!image.didCancel) {
      Alert.alert('Error', strings.profile.pfpSelectError);
    }
  }
};

export const handleRemovePfp = async (setPfpURL: (url: string) => void) => {
  Alert.alert(
    strings.profile.removePfp,
    strings.profile.removePfpPrompt,
    [
      {
        text: strings.main.cancel,
        style: 'cancel',
      },
      {
        text: strings.main.remove,
        onPress: async () => {
          const response = await removeImage();

          if (response) {
            setPfpURL('');
          } else {
            Alert.alert(strings.error.error, strings.error.removePfp);
          }
        },
        style: 'destructive',
      },
    ],
    {cancelable: false},
  );
};

export const handleEditDisplayName = async (
  _displayName: string,
  setDisplayName: (displayName: string) => void,
) => {
  prompt(
    strings.settings.editDisplayName,
    strings.settings.editDisplayNamePrompt,
    [
      {
        text: strings.main.cancel,
        style: 'cancel',
      },
      {
        text: strings.main.save,
        onPress: async displayName => {
          if (displayName.length < 3 || displayName.length > 15) {
            Alert.alert(strings.error.error, strings.error.displayNameLength);
            return;
          }
          const response = await editDisplayName(displayName);

          if (response?.ok) {
            setDisplayName(displayName);
            await AsyncStorage.setItem('display_name', displayName);
          } else {
            Alert.alert(strings.error.error, strings.error.editDisplayName);
          }
        },
      },
    ],
    {
      cancelable: false,
      defaultValue: _displayName,
      placeholder: strings.settings.displayName,
    },
  );
};

export const handleEditUsername = async (
  _username: string,
  setUsername: (username: string) => void,
) => {
  prompt(
    strings.settings.editUsername,
    strings.settings.editUsernamePrompt,
    [
      {
        text: strings.main.cancel,
        style: 'cancel',
      },
      {
        text: strings.main.save,
        onPress: async username => {
          const response = await editUsername(username);

          if (response?.ok) {
            setUsername(username);
            await AsyncStorage.setItem('username', username);
          } else {
            Alert.alert(strings.error.error, strings.error.editUsername);
          }
        },
      },
    ],
    {
      cancelable: false,
      defaultValue: _username,
      placeholder: strings.settings.username,
    },
  );
};
