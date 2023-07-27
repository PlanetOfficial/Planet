import React, {useState, useEffect} from 'react';
import {
  View,
  Text as RNText,
  SafeAreaView,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  useColorScheme,
  StatusBar,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import numbers from '../../../constants/numbers';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {editInfo, removeImage, saveImage} from '../../../utils/api/authAPI';
import {ScrollView} from 'react-native';

const ProfileSettings = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [pfpURL, setPfpURL] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [ageDPOpen, setAgeDPOpen] = useState(false);
  const [gender, setGender] = useState<string>('');
  const [genderDPOpen, setGenderDPOpen] = useState(false);

  const initializeData = async () => {
    const _firstName = await AsyncStorage.getItem('first_name');
    const _lastName = await AsyncStorage.getItem('last_name');
    const _username = await AsyncStorage.getItem('username');
    const _pfpURL = await AsyncStorage.getItem('pfp_url');
    const _phoneNumber = await AsyncStorage.getItem('phone_number');
    const _age = await AsyncStorage.getItem('age');
    const _gender = await AsyncStorage.getItem('gender');
    setFirstName(_firstName || '');
    setLastName(_lastName || '');
    setUsername(_username || '');
    setPhoneNumber(_phoneNumber || '');
    setAge(_age || '');
    setGender(_gender || '');
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

  const handleRemovePfp = async () => {
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

  const handleEditInfo = async (
    _firstName: string,
    _lastName: string,
    _username: string,
    _age: string,
    _gender: string,
  ) => {
    if (_firstName.length === 0) {
      const fn = await AsyncStorage.getItem('first_name');
      setFirstName(fn || '');
      return;
    }
    if (_lastName.length === 0) {
      const ln = await AsyncStorage.getItem('last_name');
      setLastName(ln || '');
      return;
    }
    if (_username.length === 0) {
      const un = await AsyncStorage.getItem('username');
      setUsername(un || '');
      return;
    }

    const response = await editInfo(
      _firstName,
      _lastName,
      _username,
      _age,
      _gender,
    );

    if (response?.ok) {
      setAge(_age);
      setGender(_gender);

      await AsyncStorage.setItem('first_name', _firstName);
      await AsyncStorage.setItem('last_name', _lastName);
      await AsyncStorage.setItem('username', _username);
      await AsyncStorage.setItem('age', _age);
      await AsyncStorage.setItem('gender', _gender);
    } else {
      Alert.alert(strings.error.error, strings.error.editInfo);
    }
  };

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <View style={styles.title}>
            <Text size="l">{strings.settings.profile}</Text>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView
        style={styles.container}
        scrollIndicatorInsets={{right: 1}}
        automaticallyAdjustKeyboardInsets={true}>
        <TouchableOpacity style={styles.profile} onPress={handleEditPfp}>
          <View style={styles.profilePic}>
            {pfpURL.length > 0 ? (
              <Image style={styles.profileImage} source={{uri: pfpURL}} />
            ) : (
              <View
                style={{
                  ...styles.profileImage,
                  backgroundColor:
                    colors[theme].profileShades[username.length % 5],
                }}>
                <RNText style={styles.name}>
                  {firstName?.charAt(0).toUpperCase() +
                    lastName?.charAt(0).toUpperCase()}
                </RNText>
              </View>
            )}
          </View>
          <View style={[styles.profilePic, styles.overlay]}>
            <Icon icon={icons.gallery} size="xl" color={colors.light.primary} />
          </View>
        </TouchableOpacity>
        {pfpURL.length > 0 ? (
          <TouchableOpacity style={styles.remove} onPress={handleRemovePfp}>
            <Text size="s" color={colors[theme].red}>
              {strings.main.remove}
            </Text>
          </TouchableOpacity>
        ) : null}
        <View style={[styles.inputContainer, styles.spacing]}>
          <View style={styles.prompt}>
            <Text weight="l">{strings.signUp.firstName}: </Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder={strings.signUp.firstName}
            value={firstName}
            autoCorrect={false}
            onChangeText={text => setFirstName(text)}
            onEndEditing={e => {
              handleEditInfo(
                e.nativeEvent.text,
                lastName,
                username,
                age,
                gender,
              );
            }}
            placeholderTextColor={colors[theme].neutral}
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.prompt}>
            <Text weight="l">{strings.signUp.lastName}: </Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder={strings.signUp.lastName}
            value={lastName}
            autoCorrect={false}
            onChangeText={text => setLastName(text)}
            onEndEditing={e => {
              handleEditInfo(
                firstName,
                e.nativeEvent.text,
                username,
                age,
                gender,
              );
            }}
            placeholderTextColor={colors[theme].neutral}
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.prompt}>
            <Text weight="l">{strings.signUp.username}: </Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder={strings.signUp.username}
            value={username}
            onChangeText={text => setUsername(text.toLowerCase())}
            onEndEditing={e => {
              handleEditInfo(
                firstName,
                lastName,
                e.nativeEvent.text,
                age,
                gender,
              );
            }}
            placeholderTextColor={colors[theme].neutral}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.prompt}>
            <Text weight="l">{strings.signUp.phoneNumber}: </Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder={phoneNumber}
            placeholderTextColor={colors[theme].secondary}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <View>
            <Text weight="l">{strings.signUp.age}: </Text>
          </View>
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              setAgeDPOpen(true);
            }}>
            <TextInput
              style={styles.textInput}
              pointerEvents="none"
              placeholder={
                strings.ageEnum.find(ageEnum => ageEnum.value === age)?.label
              }
              placeholderTextColor={colors[theme].neutral}
              editable={false}
            />
          </TouchableOpacity>
          <View>
            <Text weight="l">{strings.signUp.gender}: </Text>
          </View>
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              setGenderDPOpen(true);
            }}>
            <TextInput
              style={styles.textInput}
              pointerEvents="none"
              placeholder={
                strings.genderEnum.find(
                  genderEnum => genderEnum.value === gender,
                )?.label
              }
              placeholderTextColor={colors[theme].neutral}
              editable={false}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        visible={ageDPOpen}
        animationType={'fade'}
        transparent={true}
        onRequestClose={() => setAgeDPOpen(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Picker
              style={styles.picker}
              selectedValue={age}
              onValueChange={itemValue => {
                handleEditInfo(
                  firstName,
                  lastName,
                  username,
                  itemValue,
                  gender,
                );
                setAgeDPOpen(false);
              }}>
              {strings.ageEnum.map((ageEnum, index) => {
                return (
                  <Picker.Item
                    key={index}
                    label={ageEnum.label}
                    value={ageEnum.value}
                    style={{fontSize: s(20)}}
                    color={colors[theme].neutral}
                  />
                );
              })}
            </Picker>
          </View>
        </View>
      </Modal>
      <Modal
        visible={genderDPOpen}
        animationType={'fade'}
        transparent={true}
        onRequestClose={() => setGenderDPOpen(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Picker
              style={styles.picker}
              selectedValue={gender}
              onValueChange={itemValue => {
                handleEditInfo(firstName, lastName, username, age, itemValue);
                setGenderDPOpen(false);
              }}>
              {strings.genderEnum.map((genderEnum, index) => {
                return (
                  <Picker.Item
                    key={index + 10}
                    label={genderEnum.label}
                    value={genderEnum.value}
                    style={{fontSize: s(20)}}
                    color={colors[theme].neutral}
                  />
                );
              })}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    title: {
      flex: 1,
      marginLeft: s(10),
    },
    profile: {
      paddingHorizontal: s(20),
      marginTop: s(30),
      justifyContent: 'space-evenly',
    },
    profilePic: {
      alignSelf: 'center',
      width: s(100),
      height: s(100),
      borderRadius: s(50),
      overflow: 'hidden',
    },
    pic: {
      width: '100%',
      height: '100%',
    },
    info: {
      marginLeft: s(20),
      paddingTop: s(15),
      paddingBottom: s(10),
      justifyContent: 'space-between',
    },
    profileImage: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      marginTop: s(20),
    },
    name: {
      fontSize: s(40),
      color: colors[theme].primary,
      fontFamily: 'VarelaRound-Regular',
      marginTop: s(1),
    },
    overlay: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors[theme].dim,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: s(50),
      marginBottom: s(40),
    },
    input: {
      flex: 5,
      borderBottomWidth: 1,
      borderColor: colors[theme].neutral,
      marginHorizontal: s(2),
      paddingHorizontal: s(10),
      paddingVertical: s(5),
      fontSize: s(14),
      fontFamily: 'Lato',
      color: colors[theme].neutral,
    },
    prompt: {
      flex: 4,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors[theme].dim,
    },
    modal: {
      backgroundColor: colors[theme].primary,
      width: s(300),
      borderRadius: s(10),
      alignItems: 'center',
      justifyContent: 'center',
    },
    picker: {
      width: s(300),
    },
    textInput: {
      padding: 0,
      color: colors[theme].neutral,
    },
    remove: {
      alignSelf: 'center',
      marginTop: s(10),
    },
    spacing: {
      marginTop: s(30),
    },
  });

export default ProfileSettings;
