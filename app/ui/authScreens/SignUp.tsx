import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import {s} from 'react-native-size-matters';
import messaging from '@react-native-firebase/messaging';

import strings from '../../constants/strings';

import {saveTokenToDatabase, signup} from '../../utils/api/authAPI';
import colors from '../../constants/colors';
import icons from '../../constants/icons';
import {cacheUserInfo} from '../../utils/functions/CacheHelpers';

const SignUp = ({navigation}: {navigation: any}) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmed, setPasswordConfirmed] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [error, setError] = useState<string>('');

  const handleSignUp = async () => {
    // TODO: set limits on email, passwords, etc. phone number?

    setError('');

    if (
      name.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      passwordConfirmed.length === 0
    ) {
      setError(strings.signUp.missingFields);
      return;
    }

    if (password !== passwordConfirmed) {
      setError(strings.signUp.passwordsMatch);
      return;
    }

    const response = await signup(name, email, password);
    if (response?.authToken) {
      // successful login
      await cacheUserInfo(response?.authToken);

      // save to firebase
      const fcm_token = await messaging().getToken();
      await saveTokenToDatabase(fcm_token);

      navigation.reset({
        index: 0,
        routes: [{name: 'TabStack'}],
      });
    } else {
      setError(response?.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={headerStyles.container}>
        <Text style={headerStyles.title}>{strings.login.signUp}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Image style={headerStyles.icon} source={icons.x} />
        </TouchableOpacity>
      </View>

      <View style={accountStyles.container}>
        <View style={accountStyles.input}>
          <Text style={accountStyles.prompt}>{strings.signUp.name}:</Text>
          <TextInput
            style={accountStyles.inputText}
            placeholder={strings.signUp.name}
            value={name}
            onChangeText={text => setName(text)}
            placeholderTextColor={colors.darkgrey}
          />
        </View>
        <View style={accountStyles.input}>
          <Text style={accountStyles.prompt}>{strings.login.email}:</Text>
          <TextInput
            style={accountStyles.inputText}
            placeholder={strings.login.email}
            value={email}
            onChangeText={text => setEmail(text)}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            placeholderTextColor={colors.darkgrey}
          />
        </View>
        <View style={accountStyles.input}>
          <Text style={accountStyles.prompt}>{strings.login.password}:</Text>
          <TextInput
            style={accountStyles.inputText}
            placeholder={strings.login.password}
            value={password}
            onChangeText={text => setPassword(text)}
            placeholderTextColor={colors.darkgrey}
          />
        </View>
        <View style={accountStyles.input}>
          <Text style={accountStyles.prompt}>
            {strings.signUp.confirmPassword}:
          </Text>
          <TextInput
            style={accountStyles.inputText}
            placeholder={strings.signUp.confirmPassword}
            value={passwordConfirmed}
            onChangeText={text => setPasswordConfirmed(text)}
            placeholderTextColor={colors.darkgrey}
          />
        </View>
        <View style={accountStyles.input}>
          <Text style={accountStyles.prompt}>
            {strings.signUp.phoneNumber}:
          </Text>
          <TextInput
            style={accountStyles.inputText}
            placeholder={strings.signUp.phoneNumber}
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
            placeholderTextColor={colors.darkgrey}
          />
        </View>
        <View>
          {error.length !== 0 ? (
            <Text style={styles.error}>{error}</Text>
          ) : null}
        </View>
        <TouchableOpacity onPress={() => handleSignUp()}>
          <Text style={accountStyles.signup}>{strings.signUp.signUp}</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>{strings.signUp.termsAgreement}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.black,
  },
  error: {
    color: colors.black,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingVertical: s(15),
    width: '100%',
  },
  title: {
    fontSize: s(24),
    fontWeight: '700',
    color: colors.black,
  },
  icon: {
    width: s(20),
    height: s(20),
    tintColor: colors.black,
  },
});

const accountStyles = StyleSheet.create({
  container: {
    marginTop: s(20),
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
    color: colors.black,
  },
  signup: {
    marginBottom: s(25),
    fontSize: s(16),
    fontWeight: '800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: colors.white,
    backgroundColor: colors.accent,
  },
});

export default SignUp;
