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

const SelectGenres = ({navigation}) => {
  return (
    <SafeAreaView>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('MapSelection')}>
            <Image source={images.BackArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {strings.createTabStack.selectCategories}
          </Text>
          <View />
        </View>
      </View>
      <View>
        <Button
          title={strings.main.done}
          onPress={() => navigation.navigate('SelectDestinations')}
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

export default SelectGenres;
