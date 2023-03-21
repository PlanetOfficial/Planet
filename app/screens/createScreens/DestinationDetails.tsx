import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';

import {ScrollView} from 'react-native';
import misc from '../../constants/misc';
import {icons} from '../../constants/images';
import strings from '../../constants/strings';

const DestinationDetails = ({navigation, route}) => {
  const [destination, setDestination] = useState(route?.params?.destination);
  const [category, setCategory] = useState(route?.params?.category);

  const getImageURL = (prefix: String, suffix: String) => {
    return prefix + misc.imageSize + suffix;
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={icons.BackArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{destination?.name}</Text>
      </View>
      <ScrollView>
        <View>
          <Text style={styles.category}>{category}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text>{destination?.address?.formatted_address}</Text>
          {destination?.hours?.display ? <Text>{strings.createTabStack.hours}</Text> : null}
          <Text>{destination?.hours?.display}</Text>
          {destination?.price && destination?.price !== 0 ? (
            <Text>{strings.createTabStack.price}: {destination?.price}</Text>
          ) : null}
          {destination?.rating ? <Text>{strings.createTabStack.rating}</Text> : null}
          <Text>{destination?.rating}</Text>
          {destination?.amenities?.wheelchair_accessible ? (
            <Text>{strings.createTabStack.wheelchair}</Text>
          ) : null}
          {destination?.details?.payment?.credit_cards?.accepts_credit_cards ? (
            <Text>{strings.createTabStack.creditCard}</Text>
          ) : null}
          {destination?.parking?.street_parking ? (
            <Text>{strings.createTabStack.streetParking}</Text>
          ) : null}
        </View>
        <View>
          <Text>{strings.main.images}</Text>
          <ScrollView horizontal={true}>
            {destination?.images?.length > 0
              ? destination?.images?.map((image: any) => (
                  <View key={image?.id}>
                    <Image
                      source={{uri: getImageURL(image?.prefix, image?.suffix)}}
                      style={styles.destinationImages}
                    />
                  </View>
                ))
              : null}
          </ScrollView>
        </View>
        <View>
          {destination?.reviews?.length > 0 ? <Text>{strings.createTabStack.reviews}</Text> : null}
          <View>
            <ScrollView horizontal={true}>
              {destination?.reviews
                ? destination?.reviews?.map((review: any, index: number) => (
                    <View key={index}>
                      <Text>{review?.text}</Text>
                    </View>
                  ))
                : null}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
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
  destinationImages: {
    marginLeft: 10,
    width: 300,
    height: 200,
  },
  ratings: {
    marginTop: 10,
  },
});

export default DestinationDetails;
