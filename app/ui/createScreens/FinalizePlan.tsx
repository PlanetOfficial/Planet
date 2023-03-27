import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import {icons} from '../../constants/images';
import misc from '../../constants/misc';
import strings from '../../constants/strings';
import DatePicker from 'react-native-date-picker';
import MapView, {Marker} from 'react-native-maps';
import {s} from 'react-native-size-matters';
import {colors} from '../../constants/theme';

import EncryptedStorage from 'react-native-encrypted-storage';
import {sendEvent} from '../../utils/api/CreateCalls/sendEvent';
import {getRegionForCoordinates} from '../../utils/functions/Misc';
import {MarkerObject} from '../../utils/interfaces/MarkerObject';
import Place from '../components/Place';

const SelectDestinations = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [selectedDestinations] = useState(route?.params?.selectedDestinations);
  const [markers] = useState(route?.params?.markers);
  const [eventTitle, setEventTitle] = useState(
    strings.createTabStack.untitledEvent,
  );
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  // const getImage = (imagesData: Array<number>) => {
  //   // TODO: if there are images provided by API, then return one of those images instead

  //   return icons.x;
  // };

  const handleSave = async () => {
    // send destinations to backend
    const placeIds = selectedDestinations?.map((item: any) => item?.id);
    const authToken = await EncryptedStorage.getItem('auth_token');

    const responseStatus = await sendEvent(
      eventTitle,
      placeIds,
      authToken,
      date.toLocaleDateString(),
    );

    if (responseStatus === 200) {
      navigation.navigate('TabStack', {screen: 'Library'});
      // TODO: show successful save
    } else {
      // TODO: error, make sure connected to internet and logged in, if error persists, log out and log back in
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={headerStyles.container}>
        <TouchableOpacity
          style={headerStyles.back}
          onPress={() => navigation.navigate('SelectDestinations')}>
          <Image style={headerStyles.icon} source={icons.back} />
        </TouchableOpacity>
        <TextInput style={headerStyles.title} onChangeText={setEventTitle}>
          {eventTitle}
        </TextInput>
        <TouchableOpacity
          style={headerStyles.confirm}
          onPress={() => {
            handleSave()
          }}>
          <Image
            style={
              headerStyles.icon
            }
            source={icons.confirm}
          />
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => setOpen(true)}>
          <Text>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <DatePicker
          modal
          open={open}
          date={date}
          onConfirm={newDate => {
            setOpen(false);
            setDate(newDate);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </View>
      <View>
        <ScrollView style={styles.scrollView}>
          <MapView
            style={styles.map}
            initialRegion={getRegionForCoordinates(markers)}>
            {markers?.length > 0
              ? markers?.map((marker: MarkerObject, index: number) => (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: marker?.latitude,
                      longitude: marker?.longitude,
                    }}
                    title={marker?.name}
                  />
                ))
              : null}
          </MapView>
          {selectedDestinations
            ? selectedDestinations?.map((dest: Object) => (
                <View key={dest?.id}>
                  <Place
                    id={dest?.id}
                    name={dest?.name}
                    info={dest?.category?.name}
                    marked={false}
                    image={
                      dest?.images && dest?.images?.length !== 0
                        ? {
                            uri:
                              dest?.images[0]?.prefix +
                              misc.imageSize +
                              dest?.images[0]?.suffix,
                          }
                        : (null as any)
                    }
                    selected={false}
                  />
                </View>
              ))
            : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const Spacer = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  map: {
    marginTop: 10,
    height: s(200),
    borderRadius: s(20),
    margin: s(20),
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
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: s(20),
    paddingVertical: s(10),
  },
  title: {
    fontSize: s(18),
    fontWeight: '600',
    color: colors.black,
  },
  back: {
    marginRight: s(20 / 3),
    width: s(40 / 3),
    height: s(20),
  },
  confirm: {
    width: s(20),
    height: s(20),
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
});


export default SelectDestinations;
