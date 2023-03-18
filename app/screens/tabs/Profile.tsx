import React from 'react';
import {
  View,
  Image,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { s } from 'react-native-size-matters';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {miscIcons} from '../../constants/images';

const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;

const Profile = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{strings.title.profile}</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}>
          <Image style={styles.settings} source={miscIcons.settings} />
        </TouchableOpacity>
      </View>
      {Info()}
    </View>
  );
};

const Info = () => (
  <View style={infoStyles.container}>
    <Image
      style={infoStyles.profilePic}
      source={require('../../assets/amusement-park.png')}
    />
    {/* <View style={infoStyles.nameContainer}> */}
      <Text style={infoStyles.name}>Naoto Uemura</Text>
    {/* </View> */}
    <View style={infoStyles.countContainer}>
      <View style={infoStyles.count}>
        <Text style={infoStyles.number}>559</Text>
        <Text style={infoStyles.text}>{strings.profile.followers}</Text>
      </View>
      <View style={infoStyles.count}>
        <Text style={infoStyles.number}>620</Text>
        <Text style={infoStyles.text}>{strings.profile.following}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: s(50),
    width: s(300),
  },
  title: {
    fontSize: s(28),
    fontWeight: 'bold',
    color: colors.black,
  },
  settingsButton: {
    position: 'absolute',
    right: 0,
    width: s(20),
    height: s(20),
  },
  settings: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
});

const infoStyles = StyleSheet.create({
  container: {
    width: s(300),
    height: s(100),
    top: s(100),
  },
  profilePic: {
    width: s(100),
    height: s(100),
    borderRadius: s(50),
  },
  name: {
    position: 'absolute',
    top: s(10),
    right: 0,
    width: s(200),
    textAlign: 'center',
    fontSize: s(20),
    fontWeight: 'bold',
    color: colors.black,
  },
  countContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    right: 0,
    width: s(200),
    height: s(50),
    paddingHorizontal: s(25),
  },
  count: {
    alignItems: 'center',
    width: '50%',
    height: '100%',
  },
  text: {
    fontSize: s(10),
    color: colors.black,
  },
  number: {
    fontSize: s(15),
    fontWeight: 'bold',
    color: colors.accent,
  },
});

export default Profile;
