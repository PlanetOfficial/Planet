import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {s} from 'react-native-size-matters';

import Header from '../components/MainHeader';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {miscIcons} from '../../constants/images';
import {clearCaches} from '../../utils/functions/CacheHelpers';

const Settings = ({navigation}: {navigation: any}) => {
  return (
    <SafeAreaView style={styles.container}>
      {Header(strings.title.settings, miscIcons.x, () =>
        navigation.navigate('Profile'),
      )}
      {Account(navigation)}
    </SafeAreaView>
  );
};

const Account = (navigation: any) => {
  const handleLogout = async () => {
    try {
      clearCaches();
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

const accountStyles = StyleSheet.create({
  container: {
    marginTop: s(15),
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
    marginBottom: s(25),
    color: colors.accent,
    fontSize: s(12),
    fontWeight: '500',
  },
  upgrade: {
    marginBottom: s(25),
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
