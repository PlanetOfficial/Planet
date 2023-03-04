import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';

import images from '../../constants/icons';

const DestinationDetails = ({navigation, route}) => {
  const [destination, setDestination] = useState(route?.params?.destination);
  const [category, setCategory] = useState(route?.params?.category);

  console.log(JSON.stringify(destination));

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={images.BackArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{destination?.name}</Text>
      </View>
      <View>
        <Text style={styles.category}>{category}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text>{destination.address.formatted_address}</Text>
        <Text>Hours</Text>
        <Text>Rating</Text>
        <Text>{destination.rating}</Text>
      </View>
      <View style={styles.images} />
      <View style={styles.ratings} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    marginLeft: 15,
    fontSize: 20,
  },
  infoContainer: {
    marginTop: 10,
  },
  images: {
    marginTop: 10,
  },
  ratings: {
    marginTop: 10,
  },
});

export default DestinationDetails;
