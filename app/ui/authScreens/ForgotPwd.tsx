import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Icon from '../components/Icon';
import Text from '../components/Text';

import {useLoadingState} from '../../utils/Misc';
import {handleResetPassword} from './functions';

const ForgotPwd = ({navigation}: {navigation: any}) => {
  const theme = 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [username, setUsername] = useState<string>('');
  const [loading, withLoading] = useLoadingState();
  const disabled = username === '' || loading;

  return (
    <KeyboardAvoidingView
      {...(Platform.OS === 'ios' ? {behavior: 'padding'} : {})}
      style={STYLES.container}
      onTouchStart={Keyboard.dismiss}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
            color={colors[theme].neutral}
          />
          <Text color={colors[theme].neutral}>
            {strings.login.forgotPassword}
          </Text>
          <Icon size="m" icon={icons.back} color="transparent" />
        </View>
      </SafeAreaView>
      <ScrollView>
        <View style={styles.description}>
          <Text weight="l" center={true}>
            {strings.login.forgotPasswordDescription}
          </Text>
        </View>

        <View style={STYLES.inputContainer}>
          <TextInput
            style={STYLES.input}
            placeholder={strings.signUp.username}
            autoFocus={true}
            value={username}
            onChangeText={text => setUsername(text.toLowerCase())}
            placeholderTextColor={colors[theme].secondary}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </ScrollView>
      <SafeAreaView>
        <TouchableOpacity
          style={[
            STYLES.buttonBig,
            {
              backgroundColor: disabled
                ? colors[theme].secondary
                : colors[theme].accent,
            },
          ]}
          disabled={disabled}
          onPress={() =>
            withLoading(() => handleResetPassword(navigation, username))
          }>
          {loading ? (
            <ActivityIndicator size="small" color={colors[theme].primary} />
          ) : (
            <Text weight="b" color={colors[theme].primary}>
              {strings.main.next}
            </Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  description: {
    marginVertical: s(40),
    marginHorizontal: s(50),
  },
  error: {
    position: 'absolute',
    alignSelf: 'center',
  },
});

export default ForgotPwd;
