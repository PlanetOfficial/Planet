import React from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {s} from 'react-native-size-matters';

import CustomText from '../components/Text';
import Icon from '../components/Icon';

import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import strings from '../../constants/strings';

import {clearCaches} from '../../utils/functions/CacheHelpers';

interface Props {
  navigation: any;
}

const Settings: React.FC<Props> = ({navigation}) => {
  const handleLogout = async () => {
    try {
      clearCaches();
    } catch (error) {
      Alert.alert('Error', 'Unable to logout. Please try again.');
    } finally {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => {
              navigation.navigate('Profile');
            }}
          />
          <View style={styles.headerText}>
            <CustomText size="xl" weight="b">
              {strings.title.settings}
            </CustomText>
          </View>
        </View>
      </SafeAreaView>

      <View testID="settingsScreenView" style={accountStyles.container}>
        <View style={accountStyles.input}>
          <Text style={accountStyles.prompt}>{strings.settings.name}:</Text>
          <TextInput
            placeholder={strings.settings.name}
            style={accountStyles.inputText}
            placeholderTextColor={colors.darkgrey}
          />
        </View>
        <View style={accountStyles.input}>
          <Text style={accountStyles.prompt}>{strings.login.email}:</Text>
          <TextInput
            placeholder={strings.login.email}
            style={accountStyles.inputText}
            placeholderTextColor={colors.darkgrey}
          />
        </View>
        <View style={accountStyles.input}>
          <Text style={accountStyles.prompt}>{strings.settings.username}:</Text>
          <TextInput
            placeholder={strings.settings.username}
            style={accountStyles.inputText}
            placeholderTextColor={colors.darkgrey}
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
          <Text testID="logoutButton" style={accountStyles.logoutButtonText}>
            {strings.settings.logout}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: s(350),
    height: s(50),
    paddingHorizontal: s(20),
  },
  headerText: {
    marginLeft: s(10),
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
