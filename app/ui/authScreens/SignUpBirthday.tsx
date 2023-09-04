import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DatePicker from 'react-native-date-picker';

import moment from 'moment';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import numbers from '../../constants/numbers';
import strings from '../../constants/strings';
import STYLING from '../../constants/styles';

import Text from '../components/Text';

const SignUpBirthday = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      displayName: string;
    };
  };
}) => {
  const theme = 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [birthday, setBirthday] = useState<string>('');

  const disabled = birthday === '';

  return (
    <View style={STYLES.container}>
      <LinearGradient
        colors={[colors[theme].accent, colors[theme].primary]}
        style={STYLES.signUpContainer}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        locations={[0, 0.2]}>
        <SafeAreaView>
          <Image source={icons.logo} style={STYLES.logo} />
        </SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={STYLES.titleContainer}>
            <Text size="l" center={true} color={colors[theme].neutral}>
              {strings.signUp.hi + ', ' + route.params.displayName + '!'}
            </Text>
          </View>
          <Text size="s" weight="l" center={true} color={colors[theme].neutral}>
            {strings.signUp.promptBirthday}
          </Text>
          <TouchableOpacity
            style={STYLES.inputContainer}
            onPress={() => setDatePickerOpen(true)}>
            <Text
              size="xxxl"
              color={
                birthday ? colors[theme].neutral : colors[theme].secondary
              }>
              {birthday ? moment(birthday, '').format('LL') : 'MM DD YYYY'}
            </Text>
          </TouchableOpacity>
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
              navigation.navigate('SignUpCreds', {
                displayName: route.params.displayName,
                birthday: birthday,
              })
            }>
            <Text weight="b" color={colors[theme].primary}>
              {strings.main.continue}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
        <DatePicker
          modal={true}
          open={datePickerOpen}
          mode="date"
          maximumDate={
            new Date(
              new Date().setFullYear(
                new Date().getFullYear() - numbers.minimumAge,
              ),
            )
          }
          date={
            birthday
              ? moment(birthday, '').toDate()
              : new Date(
                  new Date().setFullYear(
                    new Date().getFullYear() - numbers.minimumAge,
                  ),
                )
          }
          onConfirm={async newDate => {
            setDatePickerOpen(false);
            setBirthday(moment(newDate).format('YYYY-MM-DD'));
          }}
          onCancel={() => {
            setDatePickerOpen(false);
          }}
        />
      </LinearGradient>
    </View>
  );
};

export default SignUpBirthday;
