import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import {s} from 'react-native-size-matters';

const CreateFG = ({navigation}: {navigation: any}) => {
  return (
    <SafeAreaView testID="friendsScreenView" style={styles.container}>
      <View style={headerStyles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Friends')}
          style={headerStyles.back}>
          <Image style={headerStyles.icon} source={icons.back} />
        </TouchableOpacity>
        <Text style={headerStyles.title}>{strings.friends.createPrompt}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(20),
    paddingVertical: s(10),
    width: '100%',
  },
  back: {
    position: 'absolute',
    left: s(20),
    width: s(16),
    height: s(16),
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
  title: {
    fontSize: s(16),
    fontWeight: '700',
    color: colors.black,
  },
});

export default CreateFG;
