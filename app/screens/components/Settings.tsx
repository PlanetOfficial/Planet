import React from 'react';
import {
  View,
  Image,
  Text,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

import strings from '../../constants/strings';
import {colors} from '../../constants/colors';
import {miscIcons} from '../../constants/images';

const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;

const Settings = ({navigation}: {navigation: any}) => {
  const handleLogout = async () => {
    try {
      await EncryptedStorage.removeItem('auth_token');
    } catch (error) {
      // TODO: display error
      console.log(error);
    } finally {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Profile')}>
        <Image style={styles.back} source={miscIcons.back} />
      </TouchableOpacity>
      <Text style={styles.title}>{strings.title.settings}</Text>
      {Account()}
    </View>
  );
};

const Account = () => (
  <View style={accountStyles.container}>
    <TextInput placeholder={strings.settings.name} style={styles.input} />
    <TextInput placeholder={strings.login.email} style={styles.input} />

    <TextInput placeholder={strings.settings.username} style={styles.input} />

    <TouchableOpacity style={styles.forgotButton}>
      <Text style={styles.forgotButtonText}>
        {strings.settings.resetPassword}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.upgradeButton}>
      <Text style={styles.upgradeButtonText}>{strings.settings.upgrade}</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.logoutButton}
      onPress={() => console.log('hi')}>
      <Text style={styles.logoutButtonText}>{strings.settings.logout}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: W,
    height: H,
    backgroundColor: colors.white,
  },
  backButton: {
    position: 'absolute',
    top: 65,
    left: 20,
    width: 20,
    height: 30,
  },
  back: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
  title: {
    position: 'absolute',
    top: 60,
    left: 60,
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.black,
  },
  input: {
    height: 40,
    width: '80%',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotButton: {
    marginTop: 20,
  },
  forgotButtonText: {
    color: colors.accent,
    fontSize: 14,
  },
  upgradeButton: {
    marginTop: 20,
  },
  upgradeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButton: {
    marginTop: 20,
  },
  logoutButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const accountStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    width: W - 60,
    height: H - 120,
    top: 120,
  },
});

export default Settings;
