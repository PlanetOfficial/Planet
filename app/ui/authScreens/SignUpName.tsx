import React, { useState } from 'react';
import {View, StyleSheet, SafeAreaView, TouchableOpacity, Text, Image, TextInput} from 'react-native';
import colors from '../../constants/colors';
import styles from '../../constants/styles';
import icons from '../../constants/icons';
import strings from '../../constants/strings';

const SignUpName = ({navigation}: {navigation: any}) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  const [error, setError] = useState<string>('');

  const handleNext = () => {
    setError('');

    if (firstName.length === 0 || lastName.length === 0) {
      setError(strings.signUp.missingFields);
      return;
    }

    if (firstName.length + lastName.length > 100) {
      setError(strings.signUp.inputLong);
      return;
    }

    navigation.navigate('SignUpCreds', {
      firstName: firstName,
      lastName: lastName,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{strings.login.signUp}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Image style={styles.headerIcon} source={icons.x} />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Text>{strings.signUp.firstName}: </Text>
        <TextInput
          placeholder={strings.signUp.firstName}
          value={firstName}
          onChangeText={text => setFirstName(text)}
          placeholderTextColor={colors.darkgrey}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>{strings.signUp.lastName}: </Text>
        <TextInput
          placeholder={strings.signUp.lastName}
          value={lastName}
          onChangeText={text => setLastName(text)}
          placeholderTextColor={colors.darkgrey}
        />
      </View>
      <TouchableOpacity onPress={() => handleNext()}>
        <Text>{strings.main.next}</Text>
      </TouchableOpacity>
      <View>
        {error.length !== 0 ? (
          <Text>{error}</Text>
        ) : null}
      </View>
      <Text style={styles.footerText}>{strings.signUp.termsAgreement}</Text>
    </SafeAreaView>
  );
};

export default SignUpName;
