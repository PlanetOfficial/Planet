import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import messaging from '@react-native-firebase/messaging';
import DropDownPicker from 'react-native-dropdown-picker';

import colors from '../../constants/colors';
import strings from '../../constants/strings';
import STYLES from '../../constants/styles';

import Text from '../components/Text';

import {saveTokenToDatabase, sendMoreInfo} from '../../utils/api/authAPI';
import {cacheUserInfo} from '../../utils/CacheHelpers';

const SignUpInfo = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      authToken: string;
    };
  };
}) => {
  const [authToken] = useState<string>(route.params.authToken);

  const [ageDPOpen, setAgeDPOpen] = useState(false);
  const [age, setAge] = useState<string | null>(null);
  const [ageEnum, setAgeEnum] = useState(strings.ageEnum);

  const [genderDPOpen, setGenderDPOpen] = useState(false);
  const [gender, setGender] = useState<string | null>(null);
  const [genderEnum, setGenderEnum] = useState(strings.genderEnum);

  const handleNext = async () => {
    if (!age || !gender) {
      return;
    }

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
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={styles.messageContainer}>
          <Text size="l" center={true}>
            {strings.signUp.verifySuccess}
          </Text>
        </View>
      </SafeAreaView>

      <View style={styles.promptContainer}>
        <Text size="m" weight="l" center={true}>
          {strings.signUp.improveExperience}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <View>
          <DropDownPicker
            style={styles.dropDown}
            open={ageDPOpen}
            value={age}
            items={ageEnum}
            setOpen={setAgeDPOpen}
            setValue={setAge}
            setItems={setAgeEnum}
            maxHeight={300}
            placeholder="Age"
          />
        </View>
        <View>
          <DropDownPicker
            style={styles.dropDown}
            open={genderDPOpen}
            value={gender}
            items={genderEnum}
            setOpen={setGenderDPOpen}
            setValue={setGender}
            setItems={setGenderEnum}
            maxHeight={300}
            placeholder="Gender"
          />
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: age && gender ? colors.accent : colors.neutral,
          },
        ]}
        disabled={!age || !gender}
        onPress={handleNext}>
        <Text weight="b" color={colors.primary}>
          {strings.signUp.enjoy}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    margin: s(20),
  },
  promptContainer: {
    marginTop: s(40),
    marginHorizontal: s(40),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: s(30),
    justifyContent: 'space-between',
    marginHorizontal: s(40),
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(300),
    width: s(150),
    height: s(50),
    borderRadius: s(25),
  },
  dropDown: {
    width: s(120),
    height: s(40),
    paddingLeft: s(20),
    borderRadius: s(25),
  },
});

export default SignUpInfo;
