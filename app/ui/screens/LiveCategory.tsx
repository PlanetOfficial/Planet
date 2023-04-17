import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {s} from 'react-native-size-matters';
import {genres} from '../../constants/genres';
import PlaceCard from '../components/PlaceCard';

const LiveCategory = ({navigation}: {navigation: any}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={headerStyles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Trending')}>
          <Image style={headerStyles.back} source={icons.next} />
        </TouchableOpacity>
        <Text style={headerStyles.title}>Music</Text>
        <TouchableOpacity onPress={() => console.log('Customize Screen')}>
          <Image style={headerStyles.settings} source={icons.settings} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: s(20),
    marginVertical: s(15),
  },
  title: {
    fontSize: s(20),
    fontWeight: '700',
    color: colors.black,
  },
  back: {
    width: s(12),
    height: s(18),
    tintColor: colors.black,
    transform: [{rotate: '180deg'}],
  },
  settings: {
    width: s(20),
    height: s(20),
    tintColor: colors.black,
  },
});

export default LiveCategory;
