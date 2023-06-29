import React from 'react';
import {View, Alert, TouchableOpacity, StyleSheet} from 'react-native';
import {s} from 'react-native-size-matters';
import prompt from 'react-native-prompt-android';
import DraggableFlatList from 'react-native-draggable-flatlist';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Separator from '../../components/Separator';

import {Destination, Event, EventDetail} from '../../../utils/types';
import {
  handleRemoveDestination,
  handleRenameDestination,
  handleReorderDestinations,
} from './functions';

interface Props {
  navigation: any;
  event: Event;
  eventDetail: EventDetail;
  setEventDetail: (eventDetail: EventDetail) => void;
  loadData: () => void;
}

const Destinations: React.FC<Props> = ({
  navigation,
  event,
  eventDetail,
  setEventDetail,
  loadData,
}) => {
  return (
    <View style={destinationStyles.container}>
      <View style={destinationStyles.header}>
        <Text>{strings.event.destinations}:</Text>
      </View>
      <DraggableFlatList
        style={destinationStyles.flatlist}
        contentContainerStyle={destinationStyles.contentContainer}
        data={eventDetail.destinations}
        scrollEnabled={false}
        keyExtractor={(item: Destination) => item.id.toString()}
        onDragEnd={({data}) => {
          setEventDetail({...eventDetail, destinations: data});
          handleReorderDestinations(event.id, data, loadData);
        }}
        renderItem={({
          item,
          drag,
          isActive,
        }: {
          item: Destination;
          drag: () => void;
          isActive: boolean;
        }) => (
          <>
            <View
              style={[destinationStyles.row, isActive ? STYLES.shadow : null]}>
              <TouchableOpacity
                delayLongPress={1}
                onLongPress={drag}
                disabled={isActive}>
                <Icon size="m" icon={icons.drag} color={colors.darkgrey} />
              </TouchableOpacity>
              <TouchableOpacity
                style={destinationStyles.title}
                onPress={() =>
                  prompt(
                    strings.main.rename,
                    strings.event.renamePrompt,
                    [
                      {text: 'Cancel', style: 'cancel'},
                      {
                        text: 'Save',
                        onPress: (name: string) =>
                          handleRenameDestination(
                            event.id,
                            item.id,
                            name,
                            loadData,
                          ),
                      },
                    ],
                    {
                      type: 'plain-text',
                      cancelable: false,
                      defaultValue: item.name,
                    },
                  )
                }>
                <Text size="s">{item.name}</Text>
                <View style={destinationStyles.pencil}>
                  <Icon size="xs" icon={icons.edit} color={colors.black} />
                </View>
              </TouchableOpacity>
              <Icon
                icon={icons.minus}
                color={colors.red}
                onPress={() =>
                  Alert.alert(
                    strings.event.deleteDestination,
                    strings.event.deleteDestinationInfo,
                    [
                      {
                        text: strings.main.cancel,
                        style: 'cancel',
                      },
                      {
                        text: strings.main.remove,
                        onPress: () => {
                          handleRemoveDestination(event.id, item.id, loadData);
                        },
                        style: 'destructive',
                      },
                    ],
                  )
                }
              />
            </View>
            <Separator />
          </>
        )}
      />
      <TouchableOpacity
        style={destinationStyles.addContainer}
        onPress={() => navigation.navigate('AddSearch')}>
        <Icon size="l" icon={icons.add} color={colors.primary} />
        <View style={STYLES.texts}>
          <Text size="s">{strings.event.addDestination}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const destinationStyles = StyleSheet.create({
  container: {
    marginHorizontal: s(30),
    paddingHorizontal: s(10),
    marginVertical: s(20),
    paddingBottom: s(10),
    borderWidth: 1,
    borderRadius: s(20),
    borderColor: colors.grey,
  },
  header: {
    position: 'absolute',
    left: s(20),
    top: s(-10),
    paddingHorizontal: s(5),
    backgroundColor: colors.white,
  },
  flatlist: {
    marginTop: s(10),
  },
  contentContainer: {
    paddingBottom: s(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: s(10),
    paddingHorizontal: s(10),
    backgroundColor: colors.white,
    overflow: 'visible',
  },
  addContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: s(5),
    paddingHorizontal: s(10),
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: s(10),
  },
  pencil: {
    marginLeft: s(5),
  },
});

export default Destinations;
