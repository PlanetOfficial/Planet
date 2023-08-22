import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import numbers from '../../constants/numbers';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Text from '../components/Text';

const SignUpName = ({navigation}: {navigation: any}) => {
  const theme = 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [displayName, setDisplayName] = useState<string>('');

  const disabled =
    displayName.length < numbers.minDisplayNameLength ||
    displayName.length > numbers.maxDisplayNameLength;

  return (
    <View style={STYLES.container} onTouchStart={Keyboard.dismiss}>
      <LinearGradient
        colors={[colors[theme].accent, colors[theme].primary]}
        style={STYLES.signUpContainer}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        locations={[0, 0.2]}>
        <KeyboardAvoidingView
          {...(Platform.OS === 'ios' ? {behavior: 'padding'} : {})}
          style={STYLES.signUpContainer}
          onTouchStart={Keyboard.dismiss}>
          <SafeAreaView>
            <Image source={icons.logo} style={STYLES.logo} />
          </SafeAreaView>
          <ScrollView>
            <View style={STYLES.titleContainer}>
              <Text size="l" center={true} color={colors[theme].neutral}>
                {strings.signUp.letsGetStarted}
              </Text>
            </View>
            <Text weight="l" center={true} color={colors[theme].neutral}>
              {strings.signUp.promptName}
            </Text>
            <View style={STYLES.inputContainer}>
              <TextInput
                style={STYLES.input}
                placeholder={strings.signUp.displayName}
                value={displayName}
                autoCorrect={false}
                autoFocus={true}
                onChangeText={text => setDisplayName(text)}
                placeholderTextColor={colors[theme].secondary}
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
                navigation.navigate('SignUpBirthday', {
                  displayName: displayName,
                })
              }>
              <Text weight="b" color={colors[theme].primary}>
                {strings.main.continue}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default SignUpName;
