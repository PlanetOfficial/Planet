import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Button,
  ScrollView,
} from 'react-native';
import images from '../../constants/Images';
import strings from '../../constants/strings';

import DestinationSimplified from '../../components/DestinationSimplified';

const SelectDestinations = ({navigation, route}) => {
  const [selectedDestinations, setSelectedDestinations] = useState(route?.params?.selectedDestinations);

  const eventTitle = 'Untitled Event';

  const getImage = (imagesData: Array<number>) => {
    // TODO: if there are images provided by API, then return one of those images instead

    return images.experience;
  }

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
        <ScrollView style={styles.scrollView}>
          {selectedDestinations && selectedDestinations.map((destination: Object) => (
            <View key={destination.id}>
              <DestinationSimplified
                name={destination.name}
                image={getImage(destination.images)}
              />
            </View>
          ))}
        </ScrollView>
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
  scrollView: {
    height: '88%',
  },
});

export default SelectDestinations;
