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

import {Poi, UserInfo} from '../../../utils/types';
import numbers from '../../../constants/numbers';

interface Props {
  navigation: any;
  eventTitle: string;
  setEventTitle: (text: string) => void;
  date: string | undefined;
  setDate: (date: string) => void;
  members: UserInfo[];
  destinations: Poi[];
}

const Header: React.FC<Props> = ({
  navigation,
  eventTitle,
  setEventTitle,
  date,
  setDate,
  members,
  destinations,
}) => {
  const currentDate = new Date();

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
            if (destinations.length > 0) {
              Alert.alert(
                strings.main.warning,
                strings.event.backConfirmation,
                [
                  {
                    text: strings.main.cancel,
                    style: 'cancel',
                  },
                  {
                    text: strings.main.discard,
                    onPress: () => navigation.goBack(),
                    style: 'destructive',
                  },
                ],
              );
            } else {
              navigation.goBack();
            }
          }}
        />
        <View style={[styles.container, STYLES.shadow]}>
          <TextInput
            style={styles.title}
            autoFocus={true}
            value={eventTitle}
            selectTextOnFocus={true}
            onChangeText={text => setEventTitle(text)}
            placeholder={strings.event.eventName}
            placeholderTextColor={colors[theme].secondary}
            onEndEditing={e => {
              if (e.nativeEvent.text === '') {
                setEventTitle(strings.event.untitled);
              }
            }}
          />
          <TouchableOpacity
            style={styles.date}
            onPress={() => setDatePickerOpen(true)}>
            {date ? (
              <Text size="xs" color={colors[theme].accent}>
                {date}
              </Text>
            ) : (
              <Icon
                icon={icons.calendar}
                size="m"
                padding={1}
                color={colors[theme].accent}
              />
            )}
          </TouchableOpacity>
          <DatePicker
            modal
            open={datePickerOpen}
            minuteInterval={5}
            date={
              date
                ? moment(date, 'M/D, h:mma').toDate()
                : moment(
                    new Date(
                      Math.ceil(currentDate.getTime() / numbers.fiveMinutes) *
                        numbers.fiveMinutes,
                    ),
                  ).toDate()
            }
            onConfirm={newDate => {
              setDatePickerOpen(false);
              setDate(
                moment(newDate, 'YYYY-MM-DD HH:mm:ssZ').format('M/D, h:mma'),
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
          color={colors[theme].neutral}
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
      flex: 1,
      fontSize: s(15),
      fontWeight: '700',
      fontFamily: 'Lato',
      padding: 0,
      color: colors[theme].neutral,
    },
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      height: s(32),
      marginHorizontal: s(15),
      paddingLeft: s(10),
      borderRadius: s(8),
      backgroundColor: colors[theme].primary,
    },
    date: {
      alignItems: 'center',
      justifyContent: 'center',
      height: s(32),
      paddingHorizontal: s(10),
      borderLeftWidth: 1,
      borderColor: colors[theme].secondary,
    },
  });

export default Header;
