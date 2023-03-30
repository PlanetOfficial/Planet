import React, {useEffect, useState} from 'react';
import {View, Image, Text, StyleSheet, SafeAreaView} from 'react-native';
import {s, vs} from 'react-native-size-matters';

import Header from '../components/Header';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({navigation}: {navigation: any}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    const initializeData = async () => {
      // TODO: make sure name updates if info gets updated
      const _name = await AsyncStorage.getItem('name');
      if (_name) {
        setName(_name);
      }
    };

    initializeData();
  }, []);

  return (
    <SafeAreaView testID='profileScreenView' style={styles.container}>
      {Header(strings.title.profile, icons.settings, () =>
        navigation.navigate('Settings'),
      )}
      <View style={infoStyles.container}>
        <Image style={infoStyles.profilePic} source={icons.user} />
        <Text style={infoStyles.name}>{name}</Text>
        <View style={infoStyles.countContainer}>
          <View style={infoStyles.count}>
            <Text style={infoStyles.number}>{strings.main.dash}</Text>
            <Text style={infoStyles.text}>{strings.profile.followers}</Text>
          </View>
          <View style={infoStyles.count}>
            <Text style={infoStyles.number}>{strings.main.dash}</Text>
            <Text style={infoStyles.text}>{strings.profile.following}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
});

const infoStyles = StyleSheet.create({
  container: {
    marginTop: vs(20),
    width: s(300),
    height: s(100),
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
    fontWeight: '700',
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
    fontWeight: '700',
    color: colors.accent,
  },
});

export default Profile;
