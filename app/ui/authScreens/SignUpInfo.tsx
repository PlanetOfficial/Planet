import React, { useState } from 'react';
import {View, StyleSheet, SafeAreaView, Text, TextInput, TouchableOpacity} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

import colors from '../../constants/colors';
import styles from '../../constants/styles';
import strings from '../../constants/strings';

const SignUpInfo = ({navigation}: {navigation: any}) => {
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');

  const handleNext = () => {
    // navigation.navigate('');
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
