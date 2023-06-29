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

import Icon from '../components/Icon';
import Text from '../components/Text';

const SignUpName = ({navigation}: {navigation: any}) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

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
          {strings.signUp.namePrompt}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={strings.signUp.firstName}
          value={firstName}
          autoCorrect={false}
          onChangeText={text => setFirstName(text)}
          placeholderTextColor={colors.darkgrey}
        />
        <TextInput
          style={styles.input}
          placeholder={strings.signUp.lastName}
          value={lastName}
          autoCorrect={false}
          onChangeText={text => setLastName(text)}
          placeholderTextColor={colors.darkgrey}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor:
              firstName.length === 0 || lastName.length === 0
                ? colors.darkgrey
                : colors.primary,
          },
        ]}
        disabled={firstName.length === 0 || lastName.length === 0}
        onPress={() =>
          navigation.navigate('SignUpCreds', {
            firstName: firstName,
            lastName: lastName,
          })
        }>
        <Text weight="b" color={colors.white}>
          {strings.main.next}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  promptContainer: {
    margin: s(40),
  },
  inputContainer: {
    flexDirection: 'row',
    marginVertical: s(30),
    marginHorizontal: s(50),
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: colors.darkgrey,
    marginHorizontal: s(5),
    paddingHorizontal: s(10),
    paddingVertical: s(5),
    fontFamily: 'Lato',
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: s(50),
    width: s(150),
    height: s(50),
    borderRadius: s(25),
  },
});

export default SignUpName;
