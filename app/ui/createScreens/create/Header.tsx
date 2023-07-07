import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {s} from 'react-native-size-matters';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {UserInfo} from '../../../utils/types';

interface Props {
  navigation: any;
  eventTitle: string;
  setEventTitle: (text: string) => void;
  date: string;
  setDate: (date: string) => void;
  members: UserInfo[];
}

const Header: React.FC<Props> = ({
  navigation,
  eventTitle,
  setEventTitle,
  date,
  setDate,
  members,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

  return (
    <SafeAreaView>
      <View style={STYLES.header}>
        <Icon
          icon={icons.close}
          onPress={() => {
            Alert.alert(strings.main.warning, strings.event.backConfirmation, [
              {
                text: strings.main.cancel,
                style: 'cancel',
              },
              {
                text: strings.main.discard,
                onPress: () => navigation.goBack(),
                style: 'destructive',
              },
            ]);
          }}
        />
        <View style={STYLES.texts}>
          <TextInput
            style={styles.title}
            value={eventTitle}
            onChangeText={text => setEventTitle(text)}
            placeholderTextColor={colors[theme].neutral}
            onEndEditing={e => {
              if (e.nativeEvent.text === '') {
                setEventTitle(strings.event.untitled);
              }
            }}
          />
          <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
            <Text
              size="xs"
              weight="l"
              color={colors[theme].accent}
              underline={true}>
              {date}
            </Text>
          </TouchableOpacity>
          <DatePicker
            modal
            open={datePickerOpen}
            minuteInterval={5}
            date={moment(date, 'MMM Do, h:mm a').toDate()}
            onConfirm={newDate => {
              setDatePickerOpen(false);
              setDate(
                moment(newDate, 'YYYY-MM-DD HH:mm:ssZ').format(
                  'MMM Do, h:mm a',
                ),
              );
            }}
            onCancel={() => {
              setDatePickerOpen(false);
            }}
          />
        </View>
        <Icon
          icon={icons.friends}
          button={true}
          padding={-2}
          onPress={() => {
            navigation.navigate('AddFriend', {
              members: members,
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    title: {
      fontSize: s(16),
      fontWeight: '700',
      fontFamily: 'Lato',
      textDecorationLine: 'underline',
      marginBottom: s(3),
      padding: 0,
      color: colors[theme].neutral,
    },
  });

export default Header;
