import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {s} from 'react-native-size-matters';
import prompt from 'react-native-prompt-android';

import moment from 'moment';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import styles from '../../constants/styles';
import strings from '../../constants/strings';

import Text from '../components/Text';
import Icon from '../components/Icon';

import {
  editDatetime,
  editName,
  getEvent,
  leaveEvent,
} from '../../utils/api/eventAPI';
import {Destination, Event, EventDetail, UserInfo} from '../../utils/types';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Separator from '../components/Separator';
import {
  postDestination,
  removeDestination,
  renameDestination,
  reorderDestinations,
} from '../../utils/api/destinationAPI';

const EventSettings = ({navigation, route}: {navigation: any; route: any}) => {
  const date = new Date();

  const [event] = useState<Event>(route.params?.event);
  const [eventDetail, setEventDetail] = useState<EventDetail>();

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
      Alert.alert(strings.error.error, strings.error.fetchEvent);
    }
  }, [event.id]);

  const addDestination = useCallback(async () => {
    const destination = route.params?.destination;

    if (destination) {
      const response = await postDestination(event.id, destination.id);

      if (response) {
        loadData();
      } else {
        Alert.alert(strings.error.error, strings.error.addSuggestion);
      }

      navigation.setParams({destination: undefined});
    }
  }, [event.id, loadData, navigation, route.params?.destination]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
      addDestination();
    });

    return unsubscribe;
  }, [navigation, loadData, addDestination]);

  const handleEditName = async (name: string) => {
    const response = await editName(event.id, name);

    if (response && eventDetail) {
      const _eventDetail = {...eventDetail};
      _eventDetail.name = name;
      setEventDetail(_eventDetail);
      setEventTitle(name);
    } else {
      setEventTitle(event.name);
      Alert.alert(strings.error.error, strings.error.editEventName);
    }
  };

  const handleEditDate = async (dt: string) => {
    const response = await editDatetime(event.id, dt);

    if (response && eventDetail) {
      const _eventDetail = {...eventDetail};
      _eventDetail.datetime = dt;
      setEventDetail(_eventDetail);
      setDatetime(dt);
    } else {
      setDatetime(event.datetime);
      Alert.alert(strings.error.error, strings.error.editEventDate);
    }
  };

  const handleLeave = async () => {
    const response = await leaveEvent(event.id);

    if (response) {
      navigation.navigate('Library');
    } else {
      Alert.alert(strings.error.error, strings.error.leaveEvent);
    }
  };

  const handleRenameDestination = async (
    newName: string,
    destinationId: number,
  ) => {
    const response = await renameDestination(event.id, destinationId, newName);

    if (response) {
      loadData();
    } else {
      Alert.alert(strings.error.error, strings.error.renameDestination);
    }
  };

  const handleRemoveDestination = async (destinationId: number) => {
    const response = await removeDestination(event.id, destinationId);

    if (response) {
      loadData();
    } else {
      Alert.alert(strings.error.error, strings.error.removeDestination);
    }
  };

  const handleReorderDestinations = async (newOrder: Destination[]) => {
    const response = await reorderDestinations(
      event.id,
      newOrder.map((destination: Destination) => destination.id),
    );

    if (response) {
      loadData();
    } else {
      Alert.alert(strings.error.error, strings.error.reorderDestination);
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
      <ScrollView>
        <View style={localStyles.texts}>
          <TouchableOpacity
            style={localStyles.titleContainer}
            onPress={() =>
              prompt(
                strings.main.rename,
                strings.event.renameEvent,
                [
                  {text: 'Cancel', style: 'cancel'},
                  {
                    text: 'Save',
                    onPress: (name: string) => handleEditName(name),
                  },
                ],
                {
                  type: 'plain-text',
                  cancelable: false,
                  defaultValue: eventTitle,
                },
              )
            }>
            <Text size="l">{eventTitle}</Text>
            <View style={localStyles.pencil}>
              <Icon size="s" icon={icons.edit} color={colors.black} />
            </View>
          </TouchableOpacity>
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
        <View style={localStyles.destinationsContainer}>
          <View style={destinationStyles.header}>
            <Text>{strings.event.destinations}:</Text>
          </View>
          {eventDetail ? (
            <DraggableFlatList
              style={destinationStyles.flatlist}
              contentContainerStyle={destinationStyles.contentContainer}
              data={eventDetail.destinations}
              scrollEnabled={false}
              keyExtractor={(item: Destination) => item.id.toString()}
              onDragEnd={({data}) => {
                setEventDetail({...eventDetail, destinations: data});
                handleReorderDestinations(data);
              }}
              renderItem={({
                item,
                drag,
                isActive,
              }: {
                item: Destination;
                drag: () => void;
                isActive: boolean;
              }) => (
                <>
                  <View
                    style={[
                      destinationStyles.container,
                      isActive ? styles.shadow : null,
                    ]}>
                    <TouchableOpacity
                      delayLongPress={1}
                      onLongPress={drag}
                      disabled={isActive}>
                      <Icon
                        size="m"
                        icon={icons.drag}
                        color={colors.darkgrey}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={destinationStyles.title}
                      onPress={() =>
                        prompt(
                          strings.main.rename,
                          strings.event.renamePrompt,
                          [
                            {text: 'Cancel', style: 'cancel'},
                            {
                              text: 'Save',
                              onPress: (name: string) =>
                                handleRenameDestination(name, item.id),
                            },
                          ],
                          {
                            type: 'plain-text',
                            cancelable: false,
                            defaultValue: item.name,
                          },
                        )
                      }>
                      <Text size="s">{item.name}</Text>
                      <View style={destinationStyles.pencil}>
                        <Icon
                          size="xs"
                          icon={icons.edit}
                          color={colors.black}
                        />
                      </View>
                    </TouchableOpacity>
                    <Icon
                      icon={icons.minus}
                      color={colors.red}
                      onPress={() =>
                        Alert.alert(
                          strings.event.deleteDestination,
                          strings.event.deleteDestinationInfo,
                          [
                            {
                              text: strings.main.cancel,
                              style: 'cancel',
                            },
                            {
                              text: strings.main.remove,
                              onPress: () => {
                                handleRemoveDestination(item.id);
                              },
                              style: 'destructive',
                            },
                          ],
                        )
                      }
                    />
                  </View>
                  <Separator />
                </>
              )}
            />
          ) : null}
          <TouchableOpacity
            style={destinationStyles.addContainer}
            onPress={() => navigation.navigate('AddSearch')}>
            <Icon size="l" icon={icons.add} color={colors.accent} />
            <View style={userStyles.texts}>
              <Text size="s">{strings.event.addDestination}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  texts: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: s(10),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: s(10),
  },
  pencil: {
    marginLeft: s(5),
  },
  title: {
    fontSize: s(19),
    fontWeight: '700',
    fontFamily: 'Lato',
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
  destinationsContainer: {
    marginHorizontal: s(30),
    paddingHorizontal: s(10),
    marginVertical: s(20),
    paddingBottom: s(10),
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
    alignItems: 'center',
    justifyContent: 'center',
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
    width: '70%',
    height: '70%',
    tintColor: colors.accent,
  },
  border: {
    borderBottomWidth: 0.5,
    borderColor: colors.lightgrey,
  },
});

const destinationStyles = StyleSheet.create({
  header: {
    position: 'absolute',
    left: s(20),
    top: s(-10),
    paddingHorizontal: s(5),
    backgroundColor: colors.white,
  },
  flatlist: {
    marginTop: s(10),
  },
  contentContainer: {
    paddingBottom: s(10),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: s(10),
    paddingHorizontal: s(10),
    backgroundColor: colors.white,
    overflow: 'visible',
  },
  addContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: s(5),
    paddingHorizontal: s(10),
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: s(10),
  },
  pencil: {
    marginLeft: s(5),
  },
});

export default EventSettings;
