import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  FlatList,
} from 'react-native';

import strings from '../../constants/strings';
import { fgIcons } from '../../constants/images';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import {s} from 'react-native-size-matters';

const CreateFG = ({navigation}: {navigation: any}) => {
  const [name, setName] = useState('');
  const [iconIdx, setIconIdx] = useState(0);
  const [invite, setInvite] = useState('');
  const [invitations, setInvitations]: [any, any] = useState([]);

  const inviteRef: any = React.useRef(null);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={headerStyles.container}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Friends')}
            style={headerStyles.back}>
            <Image style={headerStyles.icon} source={icons.back} />
          </TouchableOpacity>
          <Text style={headerStyles.title}>{strings.friends.createPrompt}</Text>
        </View>
      </SafeAreaView>
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder={strings.friends.editName}
      />
      <View style={styles.profilePicContainer}>
        <Image source={fgIcons[iconIdx]} style={styles.profilePic} />
      </View>

      <View style={styles.scrollView}>
        <FlatList
          data={fgIcons}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={styles.picOption}
              onPress={() => setIconIdx(index)}>
              <Image source={item} style={styles.picOptionImage} />
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={inviteStyles.header}>
        <TextInput
          ref={inviteRef}
          autoCapitalize={'none'}
          autoCorrect={false}
          style={inviteStyles.input}
          onChangeText={setInvite}
          value={invite}
          placeholder={strings.friends.promptInvite}
        />
        <TouchableOpacity
          style={[inviteStyles.button, invite === '' && {backgroundColor: colors.darkgrey}]}
          disabled={invite === ''}
          onPress={() => {
            // if(invite is valid){
            setInvitations([...invitations, invite]);
            setInvite('');
            // }
            inviteRef.current?.blur();
          }}>
          <Text style={inviteStyles.send}>{strings.friends.add}</Text>
        </TouchableOpacity>
      </View>

      <View style={inviteStyles.scrollView}>
        <FlatList
          data={invitations}
          ItemSeparatorComponent={Spacer}
          renderItem={({item, index}) => (
            <View key={index} style={inviteStyles.row}>
              <Text style={inviteStyles.name}>{item}</Text>
              <TouchableOpacity
                onPress={() => {
                  setInvitations(
                    invitations.filter((_: any, i: number) => i !== index),
                  );
                }}>
                <Image source={icons.x} style={inviteStyles.x} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.createButton,
          name === '' && {backgroundColor: colors.darkgrey},
        ]}
        disabled={name === ''}
        onPress={() => {
          // Create FG
        }}>
        <Text style={styles.create}>{strings.friends.create}</Text>
      </TouchableOpacity>
    </View>
  );
};

const Spacer = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  separator: {
    height: s(1),
    backgroundColor: colors.grey,
  },
  input: {
    width: s(350),
    height: s(30),
    fontSize: s(16),
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
  },
  profilePicContainer: {
    alignSelf: 'center',
    width: s(80),
    height: s(80),
    borderRadius: s(40),
    overflow: 'hidden',
    marginTop: s(10),
    marginBottom: s(10),
  },
  profilePic: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    width: s(350),
    marginBottom: s(20),
  },
  picOption: {
    width: s(50),
    height: s(50),
    borderRadius: s(25),
    margin: s(10),
    overflow: 'hidden',
  },
  picOptionImage: {
    width: '100%',
    height: '100%',
  },
  createButton: {
    position: 'absolute',
    bottom: s(50),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: s(100),
    height: s(40),
    borderRadius: s(10),
    backgroundColor: colors.accent,
  },
  create: {
    fontSize: s(15),
    fontWeight: '700',
    color: colors.white,
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
    borderTopWidth: s(1),
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
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: s(50),
    height: s(30),
    borderRadius: s(10),
    backgroundColor: colors.accent,
  },
  send: {
    fontSize: s(15),
    fontWeight: '700',
    color: colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    paddingVertical: s(10),
  },
  name: {
    fontSize: s(16),
    fontWeight: '700',
    color: colors.black,
  },
  x: {
    width: s(13),
    height: s(13),
    tintColor: colors.darkgrey,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(20),
    width: s(350),
    height: s(50),
  },
  back: {
    width: s(16),
    height: s(16),
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
  title: {
    width: s(278),
    fontSize: s(16),
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
  },
});

export default CreateFG;
