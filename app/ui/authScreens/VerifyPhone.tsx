import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import {s} from 'react-native-size-matters';

import Text from '../components/Text';
import Icon from '../components/Icon';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import {verifyCode} from '../../utils/api/authAPI';

/*
 * route params:
 * - authToken: string
 */
const VerifyPhone = ({navigation, route}: {navigation: any; route: any}) => {
  const [authToken] = useState<string>(route.params.authToken);

  const [code, setCode] = useState<string>('');

  const [error, setError] = useState<string>('');

  const handleVerifyCode = async () => {
    setError('');

    if (code.length === 0) {
      setError(strings.signUp.missingFields);
      return;
    }

    const response = await verifyCode(authToken, code);

    if (response) {
      navigation.reset({
        index: 0,
        routes: [{name: 'SignUpInfo', params: {authToken: authToken}}],
      });
    } else {
      setError(strings.signUp.codeVerifyFailed);
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
        </View>
      </SafeAreaView>

      <View style={localStyles.promptContainer}>
        <Text size="l" weight="l" center={true}>
          {strings.signUp.verifyPrompt}
        </Text>
      </View>

      <View style={localStyles.inputContainer}>
        <TextInput
          style={localStyles.input}
          value={code}
          onChangeText={text => 
            setCode(text.replace(/[^0-9]/g, '').substring(0, 6))}
          placeholderTextColor={colors.darkgrey}
          keyboardType="number-pad"
        />
      </View>
      {error.length !== 0 ? (
        <Text weight="l" center={true} color={colors.red}>
          {error}
        </Text>
      ) : null}
      <TouchableOpacity
        style={[
          localStyles.button,
          {
            backgroundColor:
              code.length === 0 ? colors.darkgrey : colors.accent,
          },
        ]}
        disabled={code.length === 0}
        onPress={() => handleVerifyCode()}>
        <Text weight="b" color={colors.white}>
          {strings.signUp.sendCode}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  promptContainer: {
    margin: s(40),
    paddingHorizontal: s(20),
  },
  prompt: {
    width: s(100),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: s(30),
    marginHorizontal: s(50),
  },
  input: {
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderColor: colors.darkgrey,
    marginHorizontal: s(5),
    paddingHorizontal: s(10),
    paddingVertical: s(5),
    fontFamily: 'Lato',
    letterSpacing: s(10),
    fontSize: s(20),
    width: s(150),
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: s(30),
    width: s(150),
    height: s(50),
    borderRadius: s(25),
  },
});

export default VerifyPhone;
