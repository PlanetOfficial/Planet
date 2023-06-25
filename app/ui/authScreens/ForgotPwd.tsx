import React, { useState } from 'react';
import { Alert, TextInput, TouchableOpacity } from 'react-native';
import {View, StyleSheet} from 'react-native';

import strings from '../../constants/strings';
import colors from '../../constants/colors';
import Text from '../components/Text';
import { s } from 'react-native-size-matters';
import { sendCodeUsername } from '../../utils/api/authAPI';

const ForgotPwd = ({navigation}: {navigation: any}) => {
  const [username, setUsername] = useState<string>('');

  const [error, setError] = useState<string>('');

  const handleNext = async () => {
    setError('');

    if (username.length === 0) {
      setError(strings.signUp.missingFields);
      return;
    }

    const response = await sendCodeUsername(username);

    if (response) {
      navigation.navigate('ForgotPasswordVerify', {username});
    } else {
      // made the error ambiguous so that the user can't guess if the username exists or not
      Alert.alert(strings.error.error, strings.error.ambiguousError);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={strings.signUp.username}
        value={username}
        onChangeText={text => setUsername(text.toLowerCase())}
        placeholderTextColor={colors.darkgrey}
        autoCapitalize="none"
        autoCorrect={false}
      />
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
              username.length === 0
                ? colors.darkgrey
                : colors.accent,
          },
        ]}
        disabled={username.length === 0}
        onPress={handleNext}>
        <Text weight="b" color={colors.white}>
          {strings.main.next}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    fontFamily: 'Lato',
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: s(150),
    height: s(50),
    borderRadius: s(25),
  },
});

export default ForgotPwd;
