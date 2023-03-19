import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';

import strings from '../../constants/strings';

import {signup} from '../../utils/api/auth/signup';
import {colors} from '../../constants/theme';
import { miscIcons } from '../../constants/images';

const SignUp = ({navigation}: {navigation: any}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmed, setPasswordConfirmed] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSignUp = async () => {
    // Perform login logic, e.g. send login request to API

    const response = await signup(name, email, password);
    if (response?.authToken) {
      // successful login
      navigation.navigate('TabStack');
    } else {
      console.log('Failed login, error: ' + response?.message);
    }
  };

  return (
    <View style={styles.container}>
      {Header(navigation)}
      <View style={accountStyles.container}>
        <View style={accountStyles.input}>
          <Text style={accountStyles.prompt}>
            {strings.signUp.name}:
          </Text>
          <TextInput
            style={accountStyles.inputText}
            placeholder={strings.signUp.name}
            value={name}
            onChangeText={text => setName(text)}
          />
        </View>
        <View style={accountStyles.input}>
          <Text style={accountStyles.prompt}>
            {strings.login.email}:
          </Text>
          <TextInput
            style={accountStyles.inputText}
            placeholder={strings.login.email}
            value={email}
            onChangeText={text => setEmail(text)}
          />
        </View>
        <View style={accountStyles.input}>
          <Text style={accountStyles.prompt}>
            {strings.login.password}:
          </Text>
          <TextInput
            style={accountStyles.inputText}
            placeholder={strings.login.password}
            value={password}
            onChangeText={text => setPassword(text)}
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
          />
        </View>
        <TouchableOpacity onPress={() => handleSignUp()}>
          <Text style={accountStyles.signup}>{strings.signUp.signUp}</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>{strings.signUp.termsAgreement}</Text>
      </View>
    </View>
  );
};

const Header = (navigation: any) => (
  <View style={headerStyles.container}>
    <TouchableOpacity
      style={headerStyles.button}
      onPress={() => navigation.navigate('Login')}>
      <Image style={headerStyles.icon} source={miscIcons.back} />
    </TouchableOpacity>
    <Text style={headerStyles.title}>{strings.login.login}</Text>
  </View>
);

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
    color: colors.grey,
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
    borderBottomColor: colors.darkgrey
  },
  signup: {
    marginBottom: vs(25),
    fontSize: s(16),
    fontWeight: '800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: colors.white,
    backgroundColor: colors.accent,
  },
});

export default SignUp;
