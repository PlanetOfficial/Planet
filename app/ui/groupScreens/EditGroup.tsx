import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import {s} from 'react-native-size-matters';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';

import {editGroup, leaveGroup} from '../../utils/api/groups/groupAPI';
import {GroupMember} from '../../utils/interfaces/types';

import Icon from '../components/Icon';
import Text from '../components/Text';
import AButton from '../components/ActionButton';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Confirmation from '../editEventScreens/Confirmation';

interface Props {
  navigation: any;
  route: any;
}

const CreateGroup: React.FC<Props> = ({navigation, route}) => {
  const [name, setName] = useState<string>(route?.params?.group.name);
  const [members] = useState<GroupMember[]>(route?.params?.group.group_member);
  console.log(route.params);
  const [invite, setInvite] = useState<string>('');
  const [invites, setInvites] = useState<string[]>([]);

  const inviteRef = React.useRef<TextInput>(null);

  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const handleGroupEdit = async () => {
    const responseStatus = await editGroup(
      name,
      invites,
      route?.params?.group.group.id,
    );

    if (responseStatus) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Friends'}],
      });

      navigation.navigate('Friends');
    } else {
      Alert.alert('Error', 'Unable to save. Please Try Again');
    }
  };

  const handleGroupLeave = async () => {
    const responseStatus = await leaveGroup(route?.params?.group.id);

    if (responseStatus) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Friends'}],
      });

      navigation.navigate('Friends');
    } else {
      Alert.alert('Error', 'Unable to leave group. Please Try Again');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={styles.back}>
            <Icon icon={icons.back} onPress={() => navigation.goBack()} />
          </View>
          <Text>{strings.groups.editPrompt}</Text>
          <TouchableOpacity onPress={() => setShowConfirmation(true)}>
            <Text size="s" weight="b" color={colors.red}>
              {strings.groups.leave}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder={strings.groups.editName}
      />

      <View style={inviteStyles.header}>
        <TextInput
          ref={inviteRef}
          autoCapitalize={'none'}
          autoCorrect={false}
          style={inviteStyles.input}
          onChangeText={setInvite}
          value={invite}
          placeholder={strings.groups.promptInvite}
          placeholderTextColor={colors.darkgrey}
        />
        <AButton
          size="s"
          disabled={invite === ''}
          label={strings.groups.add}
          onPress={() => {
            setInvites([...invites, invite]);
            setInvite('');
            inviteRef.current?.blur();
          }}
        />
      </View>

      <ScrollView>
        {invites.map((item: string, index: number) => (
          <View key={index} style={inviteStyles.row}>
            <Text size="s" weight="l">
              {item}
            </Text>
            <Icon
              icon={icons.x}
              onPress={() => {
                setInvites(
                  invites.filter((_: string, i: number) => i !== index),
                );
              }}
            />
          </View>
        ))}
        {members.map((member: GroupMember, index: number) => (
          <View key={index} style={inviteStyles.row}>
            <View>
              <Text size="s" weight="l">
                {member.user.name}
              </Text>
              <Text size="xs" weight="l" color={colors.darkgrey}>
                {member.user.email}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.create}>
        <AButton
          size="m"
          disabled={name === ''}
          label={strings.library.save}
          onPress={handleGroupEdit}
        />
      </View>

      <Confirmation
        onPress={handleGroupLeave}
        open={showConfirmation}
        setOpen={setShowConfirmation}
        prompt={strings.groups.leavePrompt}
        leftText={strings.misc.cancel}
        rightText={strings.groups.leave}
        rightColor={colors.red}
        actionOnRight={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: s(40),
    paddingHorizontal: s(20),
    marginBottom: s(20),
  },
  back: {
    marginRight: s(20),
  },
  input: {
    width: s(350),
    height: s(30),
    fontSize: s(16),
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    marginBottom: s(30),
  },
  create: {
    position: 'absolute',
    bottom: s(50),
    alignSelf: 'center',
  },
  separator: {
    height: s(0.5),
    backgroundColor: colors.grey,
  },
});

const inviteStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    marginBottom: s(10),
  },
  scrollView: {
    alignSelf: 'center',
    width: s(310),
    marginBottom: s(20),
    borderTopWidth: s(0.5),
    borderColor: colors.grey,
  },
  input: {
    paddingLeft: s(20),
    width: s(250),
    height: s(30),
    fontSize: s(16),
    borderRadius: s(10),
    fontWeight: '700',
    color: colors.black,
    backgroundColor: colors.grey,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    paddingVertical: s(10),
    marginHorizontal: s(20),
    borderBottomWidth: s(0.5),
    borderColor: colors.grey,
  },
});

export default CreateGroup;
