import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import {s} from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';

import moment from 'moment';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import UserIconXL from '../../components/UserIconXL';

import {
  handleEditDisplayName,
  handleEditPfp,
  handleEditUsername,
  handleRemovePfp,
} from './functions';
import {editBirthday} from '../../../utils/api/authAPI';
import numbers from '../../../constants/numbers';

const ProfileSettings = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [pfpURL, setPfpURL] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

  const initializeData = async () => {
    const _pfpURL = await AsyncStorage.getItem('pfp_url');
    const _displayName = await AsyncStorage.getItem('display_name');
    const _username = await AsyncStorage.getItem('username');
    const _birthday = await AsyncStorage.getItem('birthday');
    const _phoneNumber = await AsyncStorage.getItem('phone_number');
    setPfpURL(_pfpURL || '');
    setDisplayName(_displayName || '');
    setUsername(_username || '');
    setBirthday(_birthday || '');
    setPhoneNumber(_phoneNumber || '');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      initializeData();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <Text size="l">{strings.settings.profile}</Text>
          <Icon size="m" icon={icons.back} color="transparent" />
        </View>
      </SafeAreaView>
      <ScrollView
        style={styles.container}
        scrollIndicatorInsets={{right: 1}}
        automaticallyAdjustKeyboardInsets={true}>
        <TouchableOpacity
          style={styles.profile}
          onPress={() => handleEditPfp(setPfpURL)}>
          <View style={styles.profilePic}>
            <UserIconXL
              user={{
                id: 0,
                username: username,
                display_name: displayName,
                icon: {url: pfpURL},
              }}
            />
          </View>
          <View style={[styles.profilePic, styles.overlay]}>
            <Icon icon={icons.gallery} size="xl" color={colors.light.primary} />
          </View>
        </TouchableOpacity>
        {pfpURL.length > 0 ? (
          <TouchableOpacity
            style={styles.remove}
            onPress={() => handleRemovePfp(setPfpURL)}>
            <Text size="s" weight="l" color={colors[theme].red}>
              {strings.main.remove}
            </Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles.row}
          onPress={() => handleEditDisplayName(displayName, setDisplayName)}>
          <View style={styles.texts}>
            <Text size="xs" weight="l">
              {strings.settings.displayName}
            </Text>
            <Text size="s">{displayName}</Text>
          </View>
          <Icon size="xs" icon={icons.next} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => handleEditUsername(username, setUsername)}>
          <View style={styles.texts}>
            <Text size="xs" weight="l">
              {strings.settings.username}
            </Text>
            <Text size="s">{'@' + username}</Text>
          </View>
          <Icon size="xs" icon={icons.next} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => setDatePickerOpen(true)}>
          <View style={styles.texts}>
            <Text size="xs" weight="l">
              {strings.settings.birthday}
            </Text>
            <Text size="s">
              {birthday
                ? moment(birthday).format('LL')
                : strings.settings.notSet}
            </Text>
          </View>
          <Icon size="xs" icon={icons.next} />
        </TouchableOpacity>
        <View style={styles.row}>
          <View style={styles.texts}>
            <Text size="xs" weight="l">
              {strings.settings.phoneNumber}
            </Text>
            <Text size="s" color={colors[theme].secondary}>
              {phoneNumber}
            </Text>
          </View>
          <Icon size="xs" icon={icons.next} color={colors[theme].secondary} />
        </View>
      </ScrollView>
      <DatePicker
        modal={true}
        open={datePickerOpen}
        mode="date"
        maximumDate={
          new Date(
            new Date().setFullYear(
              new Date().getFullYear() - numbers.minimumAge,
            ),
          )
        }
        date={birthday ? moment(birthday, '').toDate() : new Date()}
        onConfirm={async newDate => {
          setDatePickerOpen(false);

          const newBirthday = moment(newDate).format('YYYY-MM-DD');
          const response = await editBirthday(newBirthday);

          if (response) {
            setBirthday(newBirthday);
            AsyncStorage.setItem('birthday', newBirthday);
          } else {
            Alert.alert(strings.error.error, strings.error.editBirthday);
          }
        }}
        onCancel={() => {
          setDatePickerOpen(false);
        }}
      />
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      margin: s(20),
    },
    profile: {
      paddingHorizontal: s(20),
    },
    profilePic: {
      alignSelf: 'center',
      width: s(100),
      height: s(100),
      borderRadius: s(50),
      overflow: 'hidden',
    },
    overlay: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors[theme].dim,
    },
    remove: {
      alignSelf: 'center',
      marginVertical: s(10),
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: s(10),
    },
    texts: {
      height: s(50),
      justifyContent: 'space-evenly',
    },
  });

export default ProfileSettings;
