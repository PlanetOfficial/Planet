import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Icon from '../components/Icon';
import Text from '../components/Text';

import {verifyCode} from '../../utils/api/authAPI';

const SignUpVerify = ({
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
  const theme = 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

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
            color={colors[theme].neutral}
          />
        </View>
      </SafeAreaView>

      <View style={STYLES.promptContainer}>
        <Text size="l" weight="l" center={true} color={colors[theme].neutral}>
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
          placeholderTextColor={colors[theme].neutral}
          keyboardType="number-pad"
        />
      </View>
      {error.length !== 0 ? (
        <Text weight="l" center={true} color={colors[theme].red}>
          {error}
        </Text>
      ) : null}
      <TouchableOpacity
        style={[
          STYLES.buttonBig,
          {
            backgroundColor:
              code.length !== 6
                ? colors[theme].secondary
                : colors[theme].accent,
          },
        ]}
        disabled={code.length !== 6}
        onPress={() => handleVerifyCode()}>
        <Text weight="b" color={colors[theme].primary}>
          {strings.signUp.verifyCode}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
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
      borderColor: colors[theme].neutral,
      marginHorizontal: s(5),
      paddingHorizontal: s(10),
      paddingVertical: s(5),
      fontFamily: 'Lato',
      letterSpacing: s(10),
      fontSize: s(20),
      width: s(150),
      color: colors[theme].neutral,
    },
  });

export default SignUpVerify;
