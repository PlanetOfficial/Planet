import {Alert} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

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
  ImagePicker.openPicker({
    width: 300,
    height: 300,
    cropping: true,
    cropperCircleOverlay: true,
    mediaType: 'photo',
    includeBase64: true,
  })
    .then(async image => {
      if (image.data) {
        if (image.size && image.size < numbers.maxPfpSize) {
          const image_url = await saveImage(image.data);

          if (image_url) {
            setPfpURL(image_url);
          } else {
            Alert.alert(strings.error.error, strings.profile.pfpUploadError);
          }
        } else {
          Alert.alert(strings.error.error, strings.profile.pfpSizeError);
        }
      } else {
        Alert.alert(strings.error.error, strings.profile.pfpSelectError);
      }
    })
    .catch(() => {
      // is triggered when user cancels image selection
      // console.warn(e);
    });
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
          if (
            displayName.length < numbers.minDisplayNameLength ||
            displayName.length > numbers.maxDisplayNameLength
          ) {
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
