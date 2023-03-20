import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {s, vs} from 'react-native-size-matters';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {miscIcons} from '../../constants/images';

const Settings = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      {Header(navigation)}
      {Account(navigation)}
    </View>
  );
};

const Header = (navigation: any) => (
  <View style={headerStyles.container}>
    <TouchableOpacity
      style={headerStyles.button}
      onPress={() => navigation.navigate('Profile')}>
      <Image style={headerStyles.icon} source={miscIcons.back} />
    </TouchableOpacity>
    <Text style={headerStyles.title}>{strings.title.settings}</Text>
  </View>
);

const Account = (navigation: any) => {
  const handleLogout = async () => {
    try {
      await EncryptedStorage.removeItem('auth_token');
    } catch (error) {
      // TODO: display error
      console.log(error);
    } finally {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  };

  return (
    <View style={accountStyles.container}>
      <View style={accountStyles.input}>
        <Text style={accountStyles.prompt}>{strings.settings.name}:</Text>
        <TextInput
          placeholder={strings.settings.name}
          style={accountStyles.inputText}
        />
      </View>
      <View style={accountStyles.input}>
        <Text style={accountStyles.prompt}>{strings.login.email}:</Text>
        <TextInput
          placeholder={strings.login.email}
          style={accountStyles.inputText}
        />
      </View>
      <View style={accountStyles.input}>
        <Text style={accountStyles.prompt}>{strings.settings.username}:</Text>
        <TextInput
          placeholder={strings.settings.username}
          style={accountStyles.inputText}
        />
      </View>

      <TouchableOpacity>
        <Text style={accountStyles.resetPwd}>
          {strings.settings.resetPassword}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={accountStyles.upgrade}>{strings.settings.upgrade}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={accountStyles.logoutButtonText}>
          {strings.settings.logout}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(50),
    width: s(300),
  },
  title: {
    marginLeft: s(10),
    fontSize: s(28),
    fontWeight: 'bold',
    color: colors.black,
  },
  button: {
    width: s(14),
    height: s(21),
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
});

const accountStyles = StyleSheet.create({
  container: {
    marginTop: vs(40),
    alignItems: 'center',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: s(40),
    paddingLeft: s(5),
    width: s(300),
    height: s(30),
  },
  prompt: {
    flex: 1,
    fontSize: s(12),
    fontWeight: '500',
    color: colors.black,
  },
  inputText: {
    flex: 3,
    marginLeft: s(10),
    paddingHorizontal: s(10),
    height: s(30),
    borderBottomWidth: 1,
    borderBottomColor: colors.darkgrey,
  },
  resetPwd: {
    marginBottom: vs(25),
    color: colors.accent,
    fontSize: s(12),
    fontWeight: '500',
  },
  upgrade: {
    marginBottom: vs(25),
    fontSize: s(16),
    fontWeight: '800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: colors.white,
    backgroundColor: colors.accent,
  },
  logoutButtonText: {
    fontSize: s(14),
    fontWeight: '500',
    color: colors.black,
  },
});

export default Settings;
