import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import {s} from 'react-native-size-matters';

import strings from '../../constants/strings';
import {colors} from '../../constants/colors';
import {icons} from '../../constants/icons';

import {postGroup} from '../../utils/api/groups/groupAPI';

import Icon from '../components/Icon';
import Text from '../components/Text';
import AButton from '../components/ActionButton';

interface Props {
  navigation: any;
}

const CreateGroup: React.FC<Props> = ({navigation}) => {
  const [name, setName] = useState<string>('');
  const [invite, setInvite] = useState<string>('');
  const [invites, setInvites] = useState<string[]>([]);

  const inviteRef = React.useRef<TextInput>(null);

  const handleGroupCreation = async () => {
    const responseStatus = await postGroup(name, invites);

    if (responseStatus) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Groups'}],
      });

      navigation.navigate('Groups');
    } else {
      Alert.alert('Error', 'Invalid Request. Please Try Again');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={styles.back}>
            <Icon icon={icons.back} onPress={() => navigation.goBack()} />
          </View>
          <Text>{strings.groups.createPrompt}</Text>
        </View>
      </SafeAreaView>

      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder={strings.groups.editName}
        placeholderTextColor={colors.darkgrey}
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

      <View style={inviteStyles.scrollView}>
        <FlatList
          data={invites}
          ItemSeparatorComponent={Spacer}
          renderItem={({item, index}: {item: string; index: number}) => (
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
          )}
        />
      </View>

      <View style={styles.create}>
        <AButton
          size="m"
          disabled={name === ''}
          label={strings.groups.create}
          onPress={() => handleGroupCreation()}
        />
      </View>
    </View>
  );
};

const Spacer = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: s(40),
    paddingHorizontal: s(20),
    marginBottom: s(20),
  },
  back: {
    position: 'absolute',
    left: s(20),
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
    borderBottomWidth: s(1),
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
  },
});

export default CreateGroup;
