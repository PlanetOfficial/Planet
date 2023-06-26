import React, {useState} from 'react';
import {Alert, SafeAreaView, TextInput, TouchableOpacity} from 'react-native';
import {View} from 'react-native';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLES from '../../constants/styles';

import Icon from '../components/Icon';
import Text from '../components/Text';

import {sendCodeForgotPwd} from '../../utils/api/authAPI';

const ForgotPwd = ({navigation}: {navigation: any}) => {
  const [username, setUsername] = useState<string>('');

  const [error, setError] = useState<string>('');

  const handleNext = async () => {
    setError('');

    if (username.length === 0) {
      setError(strings.signUp.missingFields);
      return;
    }

    const response = await sendCodeForgotPwd(username);

    if (response) {
      navigation.navigate('ForgotPasswordVerify', {username});
    } else {
      // made the error ambiguous so the user can't guess if the username exists or not
      Alert.alert(strings.error.error, strings.error.ambiguousError);
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

      <View style={STYLES.inputContainer}>
        <TextInput
          style={STYLES.input}
          placeholder={strings.signUp.username}
          value={username}
          onChangeText={text => setUsername(text.toLowerCase())}
          placeholderTextColor={colors.darkgrey}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      {error.length !== 0 ? (
        <Text weight="l" center={true} color={colors.red}>
          {error}
        </Text>
      ) : null}
      <TouchableOpacity
        style={[
          STYLES.buttonBig,
          {
            backgroundColor:
              username.length === 0 ? colors.darkgrey : colors.accent,
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

export default ForgotPwd;
