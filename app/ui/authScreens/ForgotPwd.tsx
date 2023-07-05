import React, {useState} from 'react';
import {
  View,
  Alert,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Icon from '../components/Icon';
import Text from '../components/Text';

import {sendCodeForgotPwd} from '../../utils/api/authAPI';

const ForgotPwd = ({navigation}: {navigation: any}) => {
  const theme = 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

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
            color={colors[theme].neutral}
          />
        </View>
      </SafeAreaView>

      <View style={STYLES.inputContainer}>
        <TextInput
          style={STYLES.input}
          placeholder={strings.signUp.username}
          value={username}
          onChangeText={text => setUsername(text.toLowerCase())}
          placeholderTextColor={colors[theme].neutral}
          autoCapitalize="none"
          autoCorrect={false}
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
              username.length === 0
                ? colors[theme].secondary
                : colors[theme].accent,
          },
        ]}
        disabled={username.length === 0}
        onPress={handleNext}>
        <Text weight="b" color={colors[theme].primary}>
          {strings.main.next}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPwd;
