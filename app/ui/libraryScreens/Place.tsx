import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {icons} from '../../constants/images';
import {colors} from '../../constants/theme';
import {s, vs} from 'react-native-size-matters';
import strings from '../../constants/strings';
import {floats} from '../../constants/numbers';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getPlaceDetails} from '../../utils/api/shared/getPlaceDetails';
import {
  capitalizeFirstLetter,
  convertDateToMMDDYYYY,
  convertTimeTo12Hour,
  displayAddress,
  displayHours,
} from '../../utils/functions/Misc';
import { ScrollView } from 'react-native-gesture-handler';

import Icon from '../components/Icon';
import CustomText from '../components/Text';
import Blur from '../components/Blur';

import {Place as PlaceT, PlaceDetail} from '../../utils/interfaces/types';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';

interface Props {
  navigation: any;
  route: any;
}

const Place: React.FC<Props> = ({navigation, route}) => {
  const [destination] = useState<PlaceT>(route?.params?.destination);
  const [destinationDetails, setDestinationDetails] = useState<PlaceDetail>({
    additionalInfo: '',
    address: '',
    dates: {},
    description: '',
    hours: [],
    name: '', // used
    phone: '',
    photos: [],
    place_name: '',
    price: '', // used
    rating: -1,
    review_count: -1,
    url: '',
  });
  const [category] = useState<string>(route?.params?.category);

  const insets = useSafeAreaInsets();

  const [bottomPad, setBottomPad] = useState<number>(0);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(
    () => [vs(330) - (insets.top + s(50)), vs(680) - (insets.top + s(50))],
    [insets.top],
  );
  const handleSheetChange = useCallback(
    (_: number, toIndex: number) => {
      if(toIndex == 1) {
        setBottomPad(0)
      } else {
        setBottomPad(vs(350));
      }
    },
    [],
  );

  useEffect(() => {
    const initializeDestinationData = async () => {
      const id = destination?.id;
      if (id) {
        const details = await getPlaceDetails(id);
        setDestinationDetails(details);
        console.log(details);
      }
    };

    initializeDestinationData();
  }, [destination?.id]);

  const handleLinkPress = async () => {
    if (destinationDetails?.url) {
      await Linking.openURL(destinationDetails?.url);
    }
  };

  return (
    <View style={styles.container}>
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

      <Blur height={s(50)} />

      <SafeAreaView>
        <View style={headerStyles.container}>
          <Icon size="s" icon={icons.back} onPress={navigation.goBack} />
          <View style={headerStyles.texts}>
            <CustomText weight="b">{destination?.name}</CustomText>
            <CustomText size="xs" weight="l" color={colors.accent}>
              {category}
              {destinationDetails?.price
                ? '・' + destinationDetails?.price
                : null}
            </CustomText>
          </View>
        </View>
      </SafeAreaView>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onAnimate={handleSheetChange}
        animateOnMount={Platform.OS === 'ios'}
        enableContentPanningGesture={false}>
          <ScrollView contentContainerStyle={{paddingBottom: bottomPad}} showsVerticalScrollIndicator={false}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imagesContainer}>
              {destinationDetails?.photos?.map(
                (image: any, index: number) => (
                  <View key={index}>
                    <Image source={{uri: image}} style={styles.image} />
                  </View>
                ),
              )}
            </ScrollView>
            {destinationDetails?.hours?.length > 0 ? (
              <View style={detailStyles.infoContainer}>
                <Text style={detailStyles.infoTitle}>
                  {strings.createTabStack.hours}:
                </Text>
                <Text style={detailStyles.info}>
                  {displayHours(destinationDetails?.hours)}
                </Text>
              </View>
            ) : null}
            {destinationDetails?.place_name ? (
              <View style={detailStyles.infoContainer}>
                <Text style={detailStyles.infoTitle}>
                  {strings.createTabStack.venue}:
                </Text>
                <Text style={detailStyles.info}>
                  {destinationDetails?.place_name}
                </Text>
              </View>
            ) : null}
            {destinationDetails?.address ? (
              <View style={detailStyles.infoContainer}>
                <Text style={detailStyles.infoTitle}>
                  {strings.createTabStack.address}:
                </Text>
                <Text style={detailStyles.info}>
                  {destinationDetails?.address}
                </Text>
              </View>
            ) : null}
            {destinationDetails?.address ? (
              <View style={detailStyles.infoContainer}>
                <Text style={detailStyles.infoTitle}>
                  {strings.createTabStack.address}:
                </Text>
                <Text style={detailStyles.info}>
                  {destinationDetails?.address}
                </Text>
              </View>
            ) : null}
            {destinationDetails?.address ? (
              <View style={detailStyles.infoContainer}>
                <Text style={detailStyles.infoTitle}>
                  {strings.createTabStack.address}:
                </Text>
                <Text style={detailStyles.info}>
                  {destinationDetails?.address}
                </Text>
              </View>
            ) : null}
            {destinationDetails?.url ? (
              <View style={detailStyles.infoContainer}>
                <TouchableOpacity onPress={() => handleLinkPress()}>
                  <Text style={detailStyles.infoTitle}>
                    {strings.createTabStack.eventUrl}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </ScrollView>
        </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  map: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  imagesContainer: {
    paddingLeft: s(20),
  },
  image: {
    marginRight: s(10),
    width: s(160),
    height: s(200),
    borderRadius: s(10),
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
    flex: 1,
    marginHorizontal: s(10),
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
    borderRadius: s(10),
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
