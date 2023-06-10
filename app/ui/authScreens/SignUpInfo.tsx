import React, { useState } from 'react';
import {View, StyleSheet, SafeAreaView, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import messaging from '@react-native-firebase/messaging';

import colors from '../../constants/colors';
import styles from '../../constants/styles';
import strings from '../../constants/strings';
import { saveTokenToDatabase, sendMoreInfo } from '../../utils/api/authAPI';
import { cacheUserInfo } from '../../utils/CacheHelpers';

/*
 * route params:
 * - authToken: string
 */
const SignUpInfo = ({navigation, route}: {navigation: any; route: any}) => {
  const [authToken] = useState<string>(route.params.authToken);

  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');

  const handleNext = async () => {
    const response = await sendMoreInfo(authToken, age, gender);

    if (response) {
      // cache
      const cacheSuccess = await cacheUserInfo(authToken);

      if (!cacheSuccess) {
        Alert.alert('Something went wrong. Please try again.');
        return;
      }

      // save to firebase
      const fcm_token = await messaging().getToken();
      await saveTokenToDatabase(fcm_token);

      navigation.reset({
        index: 0,
        routes: [{name: 'TabStack'}],
      });
    } else {
      Alert.alert('Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{strings.login.signUp}</Text>
      </View>
      <Text>{strings.signUp.improveExperience}</Text>
      <View style={styles.inputContainer}>
        <Text>{strings.signUp.age}: </Text>
        <TextInput
          placeholder={strings.signUp.age}
          value={age}
          onChangeText={text => {
            if (!isNaN(Number(text))) {
              setAge(text)
            }
          }}
          placeholderTextColor={colors.darkgrey}
        />
      </View>
      <View style={styles.inputContainer}>
        <SelectDropdown
          data={strings.optionArrays.genders}
          onSelect={(selectedItem, index) => {
            setGender(selectedItem)
          }}
        />
      </View>
      <TouchableOpacity onPress={() => handleNext()}>
        <Text>{strings.main.next}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignUpInfo;
