import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import misc from '../../constants/misc';
import {icons} from '../../constants/images';
import {colors} from '../../constants/theme';
import strings from '../../constants/strings';
import {floats} from '../../constants/numbers';
import {s} from 'react-native-size-matters';

const Place = ({navigation, route}: {navigation: any; route: any}) => {
  const [destination] = useState(route?.params?.destination);
  const [category] = useState(route?.params?.category);

  const getImageURL = (prefix: String, suffix: String) => {
    return prefix + misc.imageSize + suffix;
  };

  return (
    // TODO: add share button
    <SafeAreaView style={styles.container}>
      <View style={headerStyles.container}>
        <TouchableOpacity
          style={headerStyles.back}
          onPress={() => navigation.goBack()}>
          <Image style={headerStyles.icon} source={icons.back} />
        </TouchableOpacity>
        <View style={headerStyles.texts}>
          <Text style={headerStyles.title}>{destination?.name}</Text>
          <Text style={headerStyles.info}>
            {category}
            {destination?.price ? '・' + '$'.repeat(destination?.price) : null}
          </Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: destination?.latitude,
            longitude: destination?.longitude,
            latitudeDelta: floats.defaultLatitudeDelta,
            longitudeDelta: floats.defaultLongitudeDelta,
          }}>
          <Marker
            coordinate={{
              latitude: destination?.latitude,
              longitude: destination?.longitude,
            }}
          />
        </MapView>
        <View style={styles.separator} />
        <ScrollView
          style={styles.images}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imagesContainer}
          >
          {destination?.images?.length > 0
            ? destination?.images?.map((image: any) => (
                <View key={image?.id}>
                  <Image
                    source={{uri: getImageURL(image?.prefix, image?.suffix)}}
                    style={styles.image}
                  />
                </View>
              ))
            : null}
        </ScrollView>
        <View style={styles.separator} />
        <View>
          <Text style={rnrStyles.title}>
            {strings.createTabStack.rnr}
            {':'}
            {destination?.rating >= 0 ? (
              <>
                {' ('}
                <Text style={rnrStyles.rating}>{destination?.rating}</Text>
                {'/10)'}
              </>
            ) : null}
          </Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={rnrStyles.contentContainer}>
            {destination?.reviews
              ? destination?.reviews?.map((review: any, index: number) => (
                  <View key={index} style={rnrStyles.review}>
                    <Text style={rnrStyles.text}>{review?.text}</Text>
                  </View>
                ))
              : null}
          </ScrollView>
        </View>
        <View style={styles.separator} />
        <View style={detailStyles.container}>
          <Text style={detailStyles.title}>
            {strings.createTabStack.details}:
          </Text>
          {destination?.hours?.display ? (
            <View style={detailStyles.infoContainer}>
              <Text style={detailStyles.infoTitle}>
                {strings.createTabStack.hours}:
              </Text>
              <Text style={detailStyles.info}>
                {destination?.hours?.display}
              </Text>
            </View>
          ) : null}
          <View style={detailStyles.infoContainer}>
            <Text style={detailStyles.infoTitle}>
              {strings.createTabStack.address}:
            </Text>
            <Text style={detailStyles.info}>
              {destination?.address?.formatted_address}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '105%',
    backgroundColor: colors.white,
  },
  imagesContainer: {
    paddingLeft: s(20),
  },
  images: {
    marginTop: s(10),
    paddingVertical: s(10),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.grey,
  },
  image: {
    marginRight: s(10),
    width: s(160),
    height: s(200),
    borderRadius: s(15),
  },
  map: {
    height: s(200),
    marginHorizontal: s(20),
    marginTop: s(10),
    borderRadius: s(15),
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginVertical: s(10),
    marginHorizontal: s(20),
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: s(20),
    paddingTop: s(10),
    paddingBottom: s(5),
  },
  texts: {
    marginLeft: s(10),
  },
  title: {
    fontSize: s(18),
    fontWeight: '600',
    color: colors.black,
  },
  info: {
    marginTop: s(5),
    fontSize: s(14),
    fontWeight: '600',
    color: colors.accent,
  },
  back: {
    marginRight: s(20 / 3),
    width: s(40 / 3),
    height: s(20),
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
});

const rnrStyles = StyleSheet.create({
  container: {
    marginTop: s(10),
    paddingBottom: s(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  contentContainer: {
    marginLeft: s(20),
  },
  title: {
    marginLeft: s(20),
    fontSize: s(16),
    fontWeight: '600',
    color: colors.black,
  },
  rating: {
    fontSize: s(18),
    fontWeight: '800',
    color: colors.accent,
  },
  review: {
    width: s(160),
    padding: s(10),
    borderRadius: s(15),
    backgroundColor: colors.grey,
    marginRight: s(10),
    marginTop: s(5),
  },
  text: {
    fontSize: s(12),
    fontWeight: '500',
    color: colors.black,
  },
});

const detailStyles = StyleSheet.create({
  container: {
    marginBottom: s(50),
  },
  title: {
    marginLeft: s(20),
    fontSize: s(16),
    fontWeight: '600',
    color: colors.black,
  },
  infoContainer: {
    marginHorizontal: s(20),
    marginTop: s(5),
    marginBottom: s(10),
    padding: s(15),
    borderRadius: s(15),
    backgroundColor: colors.grey,
  },
  infoTitle: {
    fontSize: s(13),
    fontWeight: '600',
    color: colors.accent,
  },
  info: {
    marginTop: s(5),
    fontSize: s(13),
    fontWeight: '500',
    color: colors.black,
  },
});

export default Place;
