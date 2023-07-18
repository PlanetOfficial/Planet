import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Icon from '../components/Icon';
import Text from '../components/Text';

const SignUpName = ({navigation}: {navigation: any}) => {
  const theme = 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            color={colors[theme].neutral}
            onPress={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>

      <View style={STYLES.promptContainer}>
        <Text size="l" weight="l" center={true} color={colors[theme].neutral}>
          {strings.signUp.namePrompt}
        </Text>
      </View>

      <View style={STYLES.inputContainer}>
        <TextInput
          style={STYLES.input}
          placeholder={strings.signUp.firstName}
          value={firstName}
          autoCorrect={false}
          onChangeText={text => setFirstName(text)}
          placeholderTextColor={colors[theme].neutral}
        />
        <TextInput
          style={STYLES.input}
          placeholder={strings.signUp.lastName}
          value={lastName}
          autoCorrect={false}
          onChangeText={text => setLastName(text)}
          placeholderTextColor={colors[theme].neutral}
        />
      </View>
      <TouchableOpacity
        style={[
          STYLES.buttonBig,
          {
            backgroundColor:
              firstName.length === 0 || lastName.length === 0
                ? colors[theme].secondary
                : colors[theme].accent,
          },
        ]}
        disabled={firstName.length === 0 || lastName.length === 0}
        onPress={() =>
          navigation.navigate('SignUpCreds', {
            firstName: firstName,
            lastName: lastName,
          })
        }>
        <Text weight="b" color={colors[theme].primary}>
          {strings.main.next}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpName;
