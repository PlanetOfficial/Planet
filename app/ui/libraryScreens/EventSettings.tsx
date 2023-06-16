import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

import icons from '../../constants/icons';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';
import {Event, UserInfo} from '../../utils/types';
import {
  editDatetime,
  editName,
  getEvent,
  leaveEvent,
} from '../../utils/api/eventAPI';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import colors from '../../constants/colors';
import {s} from 'react-native-size-matters';
import strings from '../../constants/strings';

const EventSettings = ({navigation, route}: {navigation: any; route: any}) => {
  const date = new Date();

  const [event] = useState<Event>(route.params.event);
  const [eventDetail, setEventDetail] = useState<any>(null);

  const [eventTitle, setEventTitle] = useState<string>(event.name);

  const [datetime, setDatetime] = useState<string>(
    moment(event.datetime)
      .add(date.getTimezoneOffset(), 'minutes')
      .format('MMM Do, h:mm a'),
  );
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    const _eventDetail = await getEvent(event.id);
    if (_eventDetail) {
      setEventDetail(_eventDetail);
    } else {
      Alert.alert('Error', 'Could not fetch event, please try again.');
    }
  }, [event.id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation, loadData]);

  const handleEditName = async () => {
    const response = await editName(event.id, eventTitle);

    if (response) {
      const _eventDetail = {...eventDetail};
      _eventDetail.name = eventTitle;
      setEventDetail(_eventDetail);
    } else {
      setEventTitle(event.name);
      Alert.alert('Error', 'Could not edit event name, please try again.');
    }
  };

  const handleEditDate = async (dt: string) => {
    const response = await editDatetime(event.id, dt);

    if (response) {
      const _eventDetail = {...eventDetail};
      _eventDetail.datetime = dt;
      setEventDetail(_eventDetail);
      setDatetime(dt);
    } else {
      setDatetime(event.datetime);
      Alert.alert('Error', 'Could not edit event date, please try again.');
    }
  };

  const handleLeave = async () => {
    const response = await leaveEvent(event.id);

    if (response) {
      navigation.navigate('Library');
    } else {
      Alert.alert('Error', 'Could not leave event, please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <TouchableOpacity
            onPress={() => {
              Alert.alert(strings.event.leaveEvent, strings.event.leaveInfo, [
                {
                  text: strings.main.cancel,
                  style: 'cancel',
                },
                {
                  text: strings.event.leave,
                  onPress: handleLeave,
                  style: 'destructive',
                },
              ]);
            }}>
            <Text size="m" color={colors.red}>
              {strings.event.leave}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View style={localStyles.texts}>
        <TextInput
          style={localStyles.title}
          value={eventTitle}
          autoCorrect={false}
          onChangeText={(text: string) => setEventTitle(text)}
          onEndEditing={async () => {
            if (eventTitle !== event.name) {
              handleEditName();
            }
          }}
        />
        <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
          <Text size="s" weight="l" color={colors.darkgrey}>
            {datetime}
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          open={datePickerOpen}
          minuteInterval={5}
          date={moment(datetime, 'MMM Do, h:mm a').toDate()}
          onConfirm={newDate => {
            setDatePickerOpen(false);
            handleEditDate(
              moment(newDate, 'YYYY-MM-DD HH:mm:ssZ').format('MMM Do, h:mm a'),
            );
          }}
          onCancel={() => {
            setDatePickerOpen(false);
          }}
        />
      </View>

      <View style={localStyles.memberContainer}>
        {eventDetail
          ? eventDetail.members.map((member: UserInfo) => (
              <View
                key={member.id}
                style={[userStyles.container, userStyles.border]}>
                <View style={userStyles.profilePic}>
                  <Image
                    style={userStyles.pic}
                    source={{uri: 'https://picsum.photos/200'}}
                  />
                </View>
                <View style={userStyles.texts}>
                  <Text
                    size="s"
                    numberOfLines={
                      1
                    }>{`${member.first_name} ${member.last_name}`}</Text>
                  <Text
                    size="xs"
                    weight="l"
                    color={colors.darkgrey}
                    numberOfLines={1}>
                    {'@' + member.username}
                  </Text>
                </View>
              </View>
            ))
          : null}
        <TouchableOpacity
          style={userStyles.container}
          onPress={() => {
            console.log('hi');
            // TODO: Navigate to friends tab
          }}>
          <View style={userStyles.profilePic}>
            <Image
              style={[userStyles.pic, userStyles.add]}
              source={icons.add}
            />
          </View>
          <View style={userStyles.texts}>
            <Text>{strings.event.inviteAFriend}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  texts: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: s(10),
  },
  title: {
    fontSize: s(19),
    fontWeight: '700',
    fontFamily: 'Lato',
    marginBottom: s(10),
  },
  memberContainer: {
    marginHorizontal: s(40),
    marginVertical: s(20),
    paddingHorizontal: s(15),
    paddingVertical: s(5),
    borderWidth: 1,
    borderRadius: s(20),
    borderColor: colors.grey,
  },
});

const userStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: s(10),
  },
  profilePic: {
    width: s(35),
    height: s(35),
    borderRadius: s(17.5),
    overflow: 'hidden',
  },
  pic: {
    width: '100%',
    height: '100%',
  },
  texts: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: s(10),
  },
  add: {
    tintColor: colors.accent,
  },
  border: {
    borderBottomWidth: 0.5,
    borderColor: colors.lightgrey,
  },
});

export default EventSettings;
