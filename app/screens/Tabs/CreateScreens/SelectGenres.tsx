import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Button } from 'react-native';
import images from '../../../constants/Images';

const SelectGenres = ({navigation}) => {
  return (
    <SafeAreaView>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('MapSelection')}>
            <Image
              source={images.BackArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Categories</Text>
          <View />
        </View>
      </View>
      <View>
        <Button
          title="Done"
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
    fontSize: 20
  }
});

export default SelectGenres;
