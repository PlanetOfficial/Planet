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
  const eventTitle = 'Untitled Event';

  console.log(route.params.selectedDestinations)

  return (
    <SafeAreaView>
      <View>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SelectDestinations')}>
            <Image source={images.BackArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{eventTitle}</Text>
          <View />
        </View>
      </View>
      <View>
        <Button
          title={strings.main.save}
          onPress={() => navigation.navigate('Library')}
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
