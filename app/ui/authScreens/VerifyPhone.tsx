import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLES from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';

import {verifyCode} from '../../utils/api/authAPI';

const VerifyPhone = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      authToken: string;
    };
  };
}) => {
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
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>

      <View style={styles.promptContainer}>
        <Text size="l" weight="l" center={true}>
          {strings.signUp.verifyPrompt}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={text =>
            setCode(text.replace(/[^0-9]/g, '').substring(0, 6))
          }
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
          styles.button,
          {
            backgroundColor:
              code.length !== 6 ? colors.darkgrey : colors.primary,
          },
        ]}
        disabled={code.length !== 6}
        onPress={() => handleVerifyCode()}>
        <Text weight="b" color={colors.white}>
          {strings.signUp.sendCode}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
