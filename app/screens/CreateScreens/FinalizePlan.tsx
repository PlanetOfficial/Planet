import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Button,
  ScrollView,
  TextInput,
} from 'react-native';
import images from '../../constants/Images';
import strings from '../../constants/strings';
import DatePicker from 'react-native-date-picker';
import MapView, {Marker} from 'react-native-maps';

import DestinationSimplified from '../../components/DestinationSimplified';
import EncryptedStorage from 'react-native-encrypted-storage';
import {sendEvent} from '../../utils/api/CreateCalls/sendEvent';
import {getRegionForCoordinates} from '../../utils/functions/Misc';
import {MarkerObject} from '../../utils/interfaces/MarkerObject';

const SelectDestinations = ({navigation, route}) => {
  const [selectedDestinations, setSelectedDestinations] = useState(
    route?.params?.selectedDestinations,
  );
  const [markers, setMarkers] = useState(route?.params?.markers);
  const [eventTitle, setEventTitle] = useState(
    strings.createTabStack.untitledEvent,
  );
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const getImage = (imagesData: Array<number>) => {
    // TODO: if there are images provided by API, then return one of those images instead

    return images.experience;
  };

  const handleSave = async () => {
    // send destinations to backend
    const placeIds = selectedDestinations.map(item => item.id);
    const authToken = await EncryptedStorage.getItem('auth_token');

    const responseStatus = await sendEvent(
      eventTitle,
      placeIds,
      authToken,
      date.toLocaleDateString(),
    );

    if (responseStatus === 200) {
      navigation.navigate('Library');
      // TODO: show successful save
    } else {
      // TODO: error, make sure connected to internet and logged in
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('SelectDestinations')}>
          <Image source={images.BackArrow} />
        </TouchableOpacity>
        <TextInput style={styles.headerTitle} onChangeText={setEventTitle}>
          {eventTitle}
        </TextInput>
        <View />
      </View>
      <View style={styles.container}>
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
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                      }}
                      title={marker.name}
                    />
                  ))
                : null}
            </MapView>
            <Text>Events</Text>
            {selectedDestinations
              ? selectedDestinations.map((destination: Object) => (
                  <View key={destination.id}>
                    <DestinationSimplified
                      name={destination.name}
                      image={getImage(destination.images)}
                    />
                  </View>
                ))
              : null}
          </ScrollView>
        </View>
        <View>
          <Button title={strings.main.save} onPress={() => handleSave()} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
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
  container: {
    padding: 10,
    flex: 1,
  },
  scrollView: {
    height: '86%',
  },
  map: {
    marginTop: 10,
    height: 450,
    flex: 1,
  },
});

export default SelectDestinations;
