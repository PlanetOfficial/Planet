import React from 'react';
import {View, Image, Text, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';

import strings from '../../constants/strings';
import {colors} from '../../constants/colors';
import {miscIcons} from '../../constants/images';

const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;

const Profile = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.title.profile}</Text>
      <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate("Settings")}>
        <Image style={styles.settings} source={miscIcons.settings} />
      </TouchableOpacity>
      {Info()}
      <Text style={styles.description}>Upgrade to Premium for Feed??{'\n'}I'm not sure where we want to go with this feature</Text>
    </View>
  );
};

const Info = () => (
  <View style={infoStyles.container}>
    <Image style={infoStyles.profilePic} source={require("../../assets/amusement-park.png")}/>
    <View style={infoStyles.nameContainer}>
      <Text style={infoStyles.name}>Naoto Uemura</Text>
    </View>
    <View style={infoStyles.countContainer}>
      <View style={infoStyles.followers}>
        <Text style={infoStyles.number}>559</Text>
        <Text style={infoStyles.text}>{strings.profile.followers}</Text>
      </View>
      <View style={infoStyles.following}>
        <Text style={infoStyles.number}>620</Text>
        <Text style={infoStyles.text}>{strings.profile.following}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: W,
    height: H,
    backgroundColor: colors.white,
  },
  title: {
    position: 'absolute',
    top: 60,
    left: 30,
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.black,
  },
  settingsButton: {
    position: 'absolute',
    top: 68,
    right: 30,
    width: 24,
    height: 24,
  },
  settings: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
  description: {
    position: 'absolute',
    top: 400,
    color: colors.black,
  },
});

const infoStyles = StyleSheet.create({
  container: {
    width: W - 60,
    height: 100,
    top: 120,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nameContainer: {
    position: 'absolute',
    alignItems: 'center',
    top: 5,
    left: 100,
    width: W - 160,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
  },
  countContainer: {
    position: 'absolute',
    bottom: 0,
    right: 30,
    width: W - 220,
    height: 50,
  },
  followers: {
    position: 'absolute',
    alignItems: 'center',
    left: 0,
    width: "50%",
    height: '100%',
  },
  following: {
    position: 'absolute',
    alignItems: 'center',
    right: 0,
    width: "50%",
    height: '100%',
  },
  text: {
    fontSize: 12,
    color: colors.black,
  },
  number: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: 'bold',
    color: colors.accent,
  }
});

export default Profile;