import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Button,
} from 'react-native';
import images from '../../constants/Images';
import strings from '../../constants/strings';

const SelectDestinations = ({navigation, route}) => {
  console.log(route?.params)

  return (
    <SafeAreaView>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('SelectGenres')}>
            <Image source={images.BackArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {strings.createTabStack.selectDestinations}
          </Text>
          <View />
        </View>
      </View>
      <View>
        <Button
          title={strings.main.done}
          onPress={() => navigation.navigate('FinalizePlan')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
  },
});

export default SelectDestinations;
