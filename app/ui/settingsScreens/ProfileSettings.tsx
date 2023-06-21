import React, {useState, useEffect} from 'react';
import {View, SafeAreaView, StyleSheet, Alert} from 'react-native';
import {s} from 'react-native-size-matters';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import icons from '../../constants/icons';
import numbers from '../../constants/numbers';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';

import {saveImage} from '../../utils/api/authAPI';

const ProfileSettings = ({navigation}: {navigation: any}) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [pfpURL, setPfpURL] = useState<string>('');

  const initializeData = async () => {
    const _firstName = await AsyncStorage.getItem('first_name');
    const _lastName = await AsyncStorage.getItem('last_name');
    const _username = await AsyncStorage.getItem('username');
    const _pfpURL = await AsyncStorage.getItem('pfp_url');
    setFirstName(_firstName || '');
    setLastName(_lastName || '');
    setUsername(_username || '');
    setPfpURL(_pfpURL || '');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      initializeData();
    });

    return unsubscribe;
  }, [navigation]);

  const handleEditPfp = async () => {
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

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <View style={localStyles.title}>
            <Text size="l">{strings.settings.profile}</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  title: {
    flex: 1,
    marginLeft: s(10),
  },
});

export default ProfileSettings;
